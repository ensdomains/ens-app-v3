import { execSync, spawn } from 'child_process'
import concurrently from 'concurrently'
import path from 'path'
import { Transform } from 'stream'
import { URL as URLClass } from 'url'
import { deleteFork, generateFork } from './tenderly.js'

const __dirname = new URLClass('.', import.meta.url).pathname

let sudopref = ''
let cleanupRunning = false
let dockerComposeDir
let dockerEnv

const killChildren = (cmdName, pid = 0, error) => {
  if (cmdName.includes('&&')) {
    cmdName.split('&&').forEach((cmd) => killChildren(cmd, pid, error))
  } else {
    if (cmdName.startsWith('yarn ')) {
      cmdName = cmdName.replace('yarn ', 'yarn.*')
    }
    let children = wrapTry(execSync, `pgrep -f "${cmdName} || exit 0"`, {
      stdio: 'ignore',
    })
    while (children) {
      const child = children
        .toString()
        .split('\n')
        .find((x) => parseInt(x))

      if (child) {
        const res = wrapTry(execSync, `pgrep -P ${child.trim()}`, {
          stdio: 'ignore',
        })
        wrapTry(execSync, `${sudopref}kill -9 ${child.trim()} || exit 0`, {
          stdio: 'ignore',
        })
        if (res && !res.toString().includes('No such process')) {
          children = res
        } else {
          children = null
        }
      } else {
        children = null
      }
    }
    if (pid) {
      wrapTry(execSync, `${sudopref}kill -2 ${pid} || exit 0`, {
        stdio: 'ignore',
      })
    } else {
      process.exit(error ? 1 : 0)
    }
  }
}

async function cleanup(error = false, commands, config, useTenderly) {
  console.log('RECEIEVED CLEANUP')
  if (cleanupRunning) return
  cleanupRunning = true
  if (useTenderly) {
    await deleteFork(config)
  }
  execSync(
    `${sudopref}docker-compose -f ${dockerComposeDir} -p ens-test-env down`,
    {
      cwd: process.env.INIT_CWD,
      env: { ...process.env, ...dockerEnv },
    },
  )
  commands.forEach((cmd) => killChildren(cmd.command, cmd.pid, error))
  killChildren('ens-test-env', 0, error)
  process.exit(error ? 1 : 0)
}

function wrapTry(fn, ...args) {
  try {
    return fn(...args)
  } catch {
    return
  }
}

const prefix = Buffer.from('\x1b[1;34m[deploy]\x1b[0m ')

const prepender = new Transform({
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

export const main = async (config, options) => {
  let graphRpcUrl = 'http://host.docker.internal:8545'
  const cmdsToRun = []
  const inxsToFinishOnExit = []

  if (config.docker?.sudo) {
    sudopref = 'sudo '
  }

  if (config.graph?.bypassLocal) {
    graphRpcUrl = config.ethereum.fork.url
  }

  if (options.tenderly) {
    console.log('USING TENDERLY!')
    graphRpcUrl = await generateFork(config)
  }

  inxsToFinishOnExit.push(0)
  dockerComposeDir = config.docker?.file
    ? path.resolve(process.env.INIT_CWD, config.docker.file)
    : path.resolve(__dirname, './docker-compose.yml')
  dockerEnv = {
    NETWORK: config.archive.network,
    DOCKER_RPC_URL: graphRpcUrl,
    DATA_FOLDER: path.resolve(process.env.INIT_CWD, config.paths.data),
  }
  cmdsToRun.push({
    command: `${sudopref}docker-compose -f ${dockerComposeDir} -p ens-test-env up`,
    name: 'graph-docker',
    prefixColor: 'green.bold',
    cwd: process.env.INIT_CWD,
    env: { ...process.env, ...dockerEnv },
  })

  config.scripts &&
    config.scripts.forEach((script, i) => {
      if (script.waitForGraph) {
        script.command = `yarn wait-on http://localhost:8040 && ${script.command}`
      }
      cmdsToRun.push(script)
      if (script.finishOnExit) {
        inxsToFinishOnExit.push(i + 1)
      }
    })

  if (config.deployCommand) {
    if (!options.tenderly)
      config.deployCommand = 'yarn wait-on tcp:8545 && ' + config.deployCommand
    const allArgs = config.deployCommand.split(' ')
    const deploy = spawn(allArgs.shift(), allArgs, {
      cwd: process.env.INIT_CWD,
      env: {
        ...process.env,
        TENDERLY_RPC_URL: options.tenderly ? graphRpcUrl : undefined,
      },
      stdio: 'pipe',
      shell: true,
    })
    deploy.stdout.pipe(prepender).pipe(process.stdout)
    await new Promise((resolve) => deploy.on('exit', () => resolve()))
  }

  if (cmdsToRun.length > 0) {
    const { commands } = concurrently(cmdsToRun, {
      prefix: 'name',
    })

    commands.forEach((cmd) => {
      if (inxsToFinishOnExit.includes(cmd.index)) {
        cmd.close.subscribe(() =>
          cleanup(
            false,
            commands,
            config,
            options.tenderly && options.tenderlyDelete,
          ),
        )
      }
      cmd.error.subscribe(() =>
        cleanup(
          true,
          commands,
          config,
          options.tenderly && options.tenderlyDelete,
        ),
      )
    })
  }
}
