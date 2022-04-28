import { execSync } from 'child_process'
import concurrently from 'concurrently'
import path from 'path'
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

export const main = async (config, useTenderly, allowTenderlyDelete) => {
  let graphRpcUrl = 'http://host.docker.internal:8545'
  const cmdsToRun = []
  const inxsToFinishOnExit = []

  if (config.docker?.sudo) {
    sudopref = 'sudo '
  }

  if (config.graph?.bypassLocal) {
    graphRpcUrl = config.ethereum.fork.url
  }

  if (useTenderly) {
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

  config.deployCommand &&
    cmdsToRun.push({
      command: `${useTenderly ? '' : 'yarn wait-on tcp:8545 && '}${
        config.deployCommand
      }`,
      name: 'deploy',
      prefixColor: 'blue.bold',
      cwd: process.env.INIT_CWD,
      env: {
        TENDERLY_RPC_URL: useTenderly ? graphRpcUrl : undefined,
      },
    })

  if (cmdsToRun.length > 0) {
    const { commands } = concurrently(cmdsToRun, {
      prefix: 'name',
    })

    commands.forEach((cmd) => {
      if (inxsToFinishOnExit.includes(cmd.index)) {
        cmd.close.subscribe(() =>
          cleanup(false, commands, config, useTenderly && allowTenderlyDelete),
        )
      }
      cmd.error.subscribe(() =>
        cleanup(true, commands, config, useTenderly && allowTenderlyDelete),
      )
    })
  }
}
