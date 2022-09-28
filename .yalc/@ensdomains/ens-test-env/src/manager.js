/* eslint-disable */
import { spawn } from 'child_process'
import concurrently from 'concurrently'
import compose from 'docker-compose'
import fetch from 'node-fetch'
import { Transform } from 'stream'
import waitOn from 'wait-on'
import { main as fetchData } from './fetch-data.js'

let outputsToIgnore = [
  Buffer.from('eth_getBlockByNumber'),
  Buffer.from('eth_getBlockByHash'),
  Buffer.from('eth_getTransactionReceipt'),
]

const exitedBuffer = Buffer.from('exited with code 1')

let initialFinished = false
let cleanupRunning = false
const opts = {
  log: true,
  composeOptions: ['-p', 'ens-test-env'],
}

/**
 * @type {import('concurrently').Command[]}
 * */
let commands
let options
let config

const batchRpcFetch = (items) =>
  fetch('http://localhost:8545', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(
      items.map((item, i) => ({ jsonrpc: '2.0', id: i + 1, ...item })),
    ),
  }).then((res) => res.json())

const rpcFetch = (method, params) =>
  batchRpcFetch([{ method, params }]).then((res) => res[0])

async function cleanup(_, exitCode) {
  let force = false
  if (cleanupRunning) {
    if (exitCode === 'SIGINT') {
      force = true
    } else {
      return
    }
  }
  cleanupRunning = true
  if (!force) console.log('Cleaning up...')
  else console.log('Forcing cleanup...')
  if (!(options && options.killGracefully) || force || !initialFinished) {
    await compose
      .kill({
        ...opts,
        log: false,
      })
      .catch(() => console.error('kill failed'))
    if (force) return process.exit(exitCode ? 1 : 0)
    await compose
      .rm({
        ...opts,
        log: false,
      })
      .catch(() => console.error('rm failed'))
  } else {
    await compose
      .down({
        ...opts,
        log: false,
      })
      .then(() =>
        compose.rm({
          ...opts,
          log: false,
        }),
      )
      .catch(() => {})
    if (options.save) {
      await fetchData('compress', config)
    }
  }

  commands &&
    commands.forEach((command) => {
      try {
        process.kill(command.pid, 'SIGKILL')
      } catch {}
    })

  process.exit(exitCode ? 1 : 0)
}

const makePrepender = (prefix) =>
  new Transform({
    transform(chunk, _, done) {
      this._rest =
        this._rest && this._rest.length
          ? Buffer.concat([this._rest, chunk])
          : chunk

      let index

      // As long as we keep finding newlines, keep making slices of the buffer and push them to the
      // readable side of the transform stream
      while ((index = this._rest.indexOf('\n')) !== -1) {
        // The `end` parameter is non-inclusive, so increase it to include the newline we found
        const line = this._rest.slice(0, ++index)
        // `start` is inclusive, but we are already one char ahead of the newline -> all good
        this._rest = this._rest.slice(index)
        // We have a single line here! Prepend the string we want
        this.push(Buffer.concat([prefix, line]))
      }

      return void done()
    },

    // Called before the end of the input so we can handle any remaining
    // data that we have saved
    flush(done) {
      // If we have any remaining data in the cache, send it out
      if (this._rest && this._rest.length) {
        return void done(null, Buffer.concat([prefix, this._rest]))
      }
    },
  })

const awaitCommand = async (name, command) => {
  const allArgs = command.split(' ')
  const deploy = spawn(allArgs.shift(), allArgs, {
    cwd: process.cwd(),
    env: process.env,
    stdio: 'pipe',
    shell: true,
  })
  const outPrepender = makePrepender(Buffer.from(`\x1b[1;34m[${name}]\x1b[0m `))
  const errPrepender = makePrepender(Buffer.from(`\x1b[1;34m[${name}]\x1b[0m `))
  deploy.stdout.pipe(outPrepender).pipe(process.stdout)
  deploy.stderr.pipe(errPrepender).pipe(process.stderr)
  return new Promise((resolve) => deploy.on('exit', () => resolve()))
}

export const main = async (_config, _options, justKill) => {
  config = _config
  options = _options

  opts.cwd = config.paths.composeFile.split('/docker-compose.yml')[0]

  opts.env = {
    ...process.env,
    DATA_FOLDER: config.paths.data,
  }

  if (justKill) {
    return cleanup(undefined, 'SIGINT')
  }

  try {
    await compose.upOne('anvil', opts)
  } catch {}

  if (options.verbose) outputsToIgnore = []

  compose
    .logs(['anvil', 'graph-node', 'postgres', 'ipfs', 'metadata'], {
      ...opts,
      log: false,
      follow: true,
      callback: (chunk, source) => {
        if (source === 'stderr') {
          process.stderr.write(chunk)
        } else {
          for (let i = 0; i < outputsToIgnore.length; i++) {
            if (chunk.includes(outputsToIgnore[i])) return
          }
          if (chunk.includes(exitedBuffer)) {
            cleanup(
              undefined,
              parseInt(chunk.toString().split('exited with code ')[1]),
            )
            return
          }
          process.stdout.write(chunk)
        }
      },
    })
    .catch(() => {})

  const inxsToFinishOnExit = []
  const cmdsToRun = (config.scripts || []).map(
    ({ finishOnExit, ...script }, i) => {
      finishOnExit && inxsToFinishOnExit.push(i)
      return script
    },
  )

  if (cleanupRunning) return

  await waitOn({ resources: ['tcp:localhost:8545'] })

  // wait 100 ms to make sure the server is up
  await new Promise((resolve) => setTimeout(resolve, 100))

  if (!options.save) {
    if (!options.extraTime) {
      // set next block timestamp to ensure consistent hashes
      await rpcFetch('anvil_setNextBlockTimestamp', [1659500635])
    } else {
      const timestamp =
        Math.floor(Date.now() / 1000) - parseInt(options.extraTime)
      console.log(
        '\x1b[1;34m[config]\x1b[0m ',
        'setting timestamp to',
        timestamp,
      )
      // set next block timestamp relative to current time
      await rpcFetch('anvil_setNextBlockTimestamp', [timestamp])
    }
    await rpcFetch('anvil_setBlockTimestampInterval', [1])

    await awaitCommand('deploy', config.deployCommand)

    // remove block timestamp interval after deploy
    await rpcFetch('anvil_removeBlockTimestampInterval', [])

    if (options.extraTime) {
      // set to current time
      await rpcFetch('anvil_setNextBlockTimestamp', [
        Math.floor(Date.now() / 1000),
      ])
      // mine block for graph node to update
      await rpcFetch('evm_mine', [])
    }

    if (config.buildCommand && options.build) {
      await awaitCommand('build', config.buildCommand)
    }
  }

  initialFinished = true

  if (cleanupRunning) return

  if (options.graph) {
    try {
      await compose.upAll(opts)
    } catch {}

    await waitOn({ resources: ['http://localhost:8040'] })

    if (options.save) {
      const internalHashes = [
        {
          hash: '0x9dd2c369a187b4e6b9c402f030e50743e619301ea62aa4c0737d4ef7e10a3d49',
          label: 'xyz',
        },
        {
          hash: '0x4f5b812789fc606be1b3b16908db13fc7a9adf7ca72641f84d75b47069d3d7f0',
          label: 'eth',
        },
        {
          hash: '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
          label: 'test',
        },
        {
          hash: '0xb7ccb6878fbded310d2d05350bca9c84568ecb568d4b626c83e0508c3193ce89',
          label: 'legacy',
        },
        {
          hash: '0xe5e14487b78f85faa6e1808e89246cf57dd34831548ff2e6097380d98db2504a',
          label: 'addr',
        },
        {
          hash: '0xdec08c9dbbdd0890e300eb5062089b2d4b1c40e3673bbccb5423f7b37dcf9a9c',
          label: 'reverse',
        },
      ]

      const allHashes = [...internalHashes, ...(config.labelHashes || [])]

      await compose.exec(
        'postgres',
        [
          'psql',
          '-U',
          'graph-node',
          'graph-node',
          '-c',
          `INSERT INTO public.ens_names (hash, name) VALUES ${allHashes
            .map(({ hash, label }) => `('${hash}', '${label}')`)
            .join(', ')};`,
        ],
        {
          ...opts,
        },
      )
    } else {
      await waitOn({
        resources: [
          'http-get://localhost:8000/subgraphs/name/graphprotocol/ens',
        ],
      })
      await new Promise((resolve) => setTimeout(resolve, 100))
    }
  }

  if (!options.save && cmdsToRun.length > 0 && options.scripts) {
    if (options.graph) {
      const blocks = parseInt(
        (await rpcFetch('eth_blockNumber', [])).result,
        16,
      )
      const getCurrentGraphBlock = async () =>
        fetch('http://localhost:8000/subgraphs/name/graphprotocol/ens', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            query: `
            {
              _meta {
                block {
                  number
                }
              }
            }
          `,
            variables: {},
          }),
        })
          .then((res) => res.json())
          .then((res) => res._meta.block.number)
      while (getCurrentGraphBlock() < blocks + 1) {
        await new Promise((resolve) => setTimeout(resolve, 1000))
      }
    }
    /**
     * @type {import('concurrently').ConcurrentlyResult['result']}
     **/
    let result
    ;({ commands, result } = concurrently(cmdsToRun, {
      prefix: 'name',
    }))

    commands.forEach((cmd) => {
      if (inxsToFinishOnExit.includes(cmd.index)) {
        cmd.close.subscribe(({ exitCode }) => cleanup(undefined, exitCode))
      } else {
        cmd.close.subscribe(
          ({ exitCode }) => exitCode === 0 || cleanup(undefined, exitCode),
        )
      }
    })

    result.catch(cleanup.bind(null, { exit: true }))
  }
}

//do something when app is closing
process.on('exit', cleanup.bind(null, { cleanup: true }))

//catches ctrl+c event
process.on('SIGINT', cleanup.bind(null, { exit: true }))
