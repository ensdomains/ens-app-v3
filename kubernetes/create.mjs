#!/usr/bin/env node
import { exec as _exec, spawn } from 'child_process'
import 'dotenv/config'
import httpProxy from 'http-proxy'
import { promisify } from 'util'
import waitOn from 'wait-on'

const exec = promisify(_exec)

const build = process.argv.slice(2).includes('--build')
const withSynpress = process.argv.slice(2).includes('--synpress')
const deployContracts = process.argv.slice(2).includes('--deploy-contracts')
const isCI = process.env.CI === 'true'

let cleaning = false

const log = (message) =>
  console.log(message.trim().replace(/^/gm, '\x1b[97m[info]\x1b[0m '))

const spawns = []

const clean = async (eventType = '', ...args) => {
  try {
    if (cleaning) return
    log('Cleaning up... (this might take a while)')
    args && console.log(args[0])
    cleaning = true
    try {
      const deleteRun = await exec('yarn kube:delete')
      log(deleteRun.stdout)
    } catch {}
    spawns.forEach((sp) => {
      try {
        sp.kill()
      } catch {}
    })
    if (args[0] && args[0].stderr && args[0].stderr.includes('AlreadyExists')) {
      log('Object still exists, attempting to force cleanup...')
      try {
        await exec(
          'kubectl delete -k ./ --wait=false --force --grace-period=0 && yarn kube:remove:commit',
        )
      } catch {}
    }
    process.exit(eventType === 'exit' || eventType === '' ? 0 : 1)
  } catch {
    process.exit(1)
  }
}

const main = async () => {
  if (!isCI) {
    log('Creating test environment...')
    const createRun = await exec('yarn kube:create')
    log(createRun.stdout)
  } else {
    log('Skipping create since CI is enabled')
  }
  log('Waiting for ready...')
  for (let iw = 0; iw < 10; iw++) {
    try {
      await exec(
        'kubectl wait --for=condition=ContainersReady pod --timeout=120s -l commit=$(git rev-parse HEAD)',
      )
      break
    } catch {
      await new Promise((r) => setTimeout(r, 1000))
    }
  }
  log('Attaching...')
  spawns.push(
    spawn('yarn', ['kube:attach'], {
      stdio: ['ignore', process.stdout, process.stderr],
    }),
  )
  let ip
  let i = 0
  while (!ip && i < 10) {
    await new Promise((resolve) => setTimeout(resolve, 10000))
    log(`Checking for IP... (attempt ${i + 1}/10)`)
    try {
      const attempt = await exec('yarn kube:get:ip')
      ip = attempt.stdout.trim()
    } catch {}
    i += 1
  }
  if (!ip) {
    await clean()
    throw new Error('FAILED TO GET EXTERNAL IP ADDRESS!')
  }
  log('Using IP Address: ' + ip)

  log('Creating local proxies...')
  const proxyGraph = httpProxy
    .createProxyServer({
      target: `http://${ip}:8000`,
    })
    .listen(8000)
  const proxyRpc = httpProxy
    .createProxyServer({
      target: `http://${ip}:8545`,
    })
    .listen(8545)

  if (build) {
    log('Building app...')
    spawns.push(
      spawn('yarn', ['buildandstart'], {
        stdio: [process.stdin, process.stdout, process.stderr],
        env: {
          ...process.env,
          NEXT_PUBLIC_GRAPH_URI: `http://localhost:8000/subgraphs/name/graphprotocol/ens`,
          NEXT_PROVIDER: `http://localhost:8545`,
        },
      }),
    )
    await waitOn({
      resources: ['http://localhost:3000'],
    })
  }
  if (deployContracts) {
    log('Deploying contracts...')
    const contractsRun = spawn('yarn', ['hardhat', 'deploy'], {
      stdio: 'inherit',
      env: process.env,
    })
    contractsRun.on('error', clean.bind(null, 'error'))
    await new Promise((resolve) =>
      contractsRun.on('exit', (code, signal) =>
        code === 0 ? resolve() : clean('error', code, signal),
      ),
    )
  }
  let synpressRun
  if (withSynpress && isCI) {
    log('Running synpress in CI mode...')
    synpressRun = spawn('yarn', ['synpress:ci'], {
      stdio: [process.stdin, process.stdout, process.stderr],
      env: {
        ...process.env,
        RPC_URL: 'http://127.0.0.1:8545',
      },
    })
  } else if (withSynpress) {
    log('Running synpress...')
    synpressRun = spawn('yarn', ['synpress:start'], {
      stdio: [process.stdin, process.stdout, process.stderr],
      env: {
        ...process.env,
        RPC_URL: 'http://127.0.0.1:8545',
      },
    })
  }
  if (synpressRun) {
    synpressRun.on('error', clean.bind(null, 'error'))
    synpressRun.on('exit', clean.bind(null, 'exit'))
    spawns.push(synpressRun)
  }
}

process.stdin.resume()
;[
  `exit`,
  `SIGINT`,
  `SIGUSR1`,
  `SIGUSR2`,
  `uncaughtException`,
  `SIGTERM`,
].forEach((eventType) => {
  process.on(eventType, clean.bind(null, eventType))
})

main()
