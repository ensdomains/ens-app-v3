import { execSync } from 'child_process'
import concurrently from 'concurrently'
import path from 'path'
import { URL as URLClass } from 'url'
import waitOn from 'wait-on'

const __dirname = new URLClass('.', import.meta.url).pathname

let sudopref = ''
let cleanupRunning = false
let dockerComposeDir
let dockerEnv

const killChildren = (cmdName, pid = 0, error) => {
  let children = wrapTry(execSync, `pgrep -f "${cmdName}"`)
  while (children) {
    const child = children
      .toString()
      .split('\n')
      .find((x) => parseInt(x))

    if (child) {
      const res = wrapTry(execSync, `pgrep -P ${child.trim()}`)
      wrapTry(execSync, `${sudopref}kill -9 ${child.trim()}`)
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
    wrapTry(execSync, `${sudopref}kill -2 ${pid}`)
  } else {
    process.exit(error ? 1 : 0)
  }
}

function cleanup(error = false, deployGraph, commands) {
  console.log('RECEIEVED CLEANUP')
  if (cleanupRunning) return
  cleanupRunning = true
  if (deployGraph) {
    execSync(
      `${sudopref}docker-compose -f ${dockerComposeDir} -p ens-test-env down`,
      {
        cwd: process.env.INIT_CWD,
        env: { ...process.env, ...dockerEnv },
      },
    )
  }
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

export const main = async (deployGraph, config) => {
  const cmdsToRun = []
  const inxsToFinishOnExit = []

  if (deployGraph) {
    if (config.graph.useSudo) {
      sudopref = 'sudo '
    }
    inxsToFinishOnExit.push(0)
    dockerComposeDir = config.graph.composeFile
      ? path.resolve(process.env.INIT_CWD, config.graph.composeFile)
      : path.resolve(__dirname, './docker-compose.yml')
    dockerEnv = {
      NETWORK: config.ganache.network,
      DOCKER_RPC_URL: !!config.graph.bypassLocalRpc
        ? config.ganache.rpcUrl
        : `http://host.docker.internal:${config.ganache.port}`,
      DATA_FOLDER: path.resolve(process.env.INIT_CWD, config.paths.data),
    }
    cmdsToRun.push({
      command: `${sudopref}docker-compose -f ${dockerComposeDir} -p ens-test-env up`,
      name: 'graph-docker',
      prefixColor: 'green.bold',
      cwd: process.env.INIT_CWD,
      env: { ...process.env, ...dockerEnv },
    })
  }

  config.scripts &&
    config.scripts.forEach((script, i) => {
      if (script.waitForGraph) {
        script.command = `yarn wait-on http://localhost:8040 && ${script.command}`
      }
      cmdsToRun.push(script)
      if (script.finishOnExit) {
        inxsToFinishOnExit.push(deployGraph ? i + 1 : i)
      }
    })

  if (!config.graph.bypassLocalRpc) {
    await waitOn({
      resources: ['tcp:' + config.ganache.port],
    })
  }
  if (cmdsToRun.length > 0) {
    const { commands } = concurrently(cmdsToRun, { prefix: 'name' })

    commands.forEach((cmd) => {
      if (inxsToFinishOnExit.includes(cmd.index)) {
        cmd.close.subscribe(() => cleanup(false, deployGraph, commands))
      }
      cmd.error.subscribe(() => cleanup(true, deployGraph, commands))
    })
  }
}
