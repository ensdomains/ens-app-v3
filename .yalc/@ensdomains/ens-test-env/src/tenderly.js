import { Wallet } from '@ethersproject/wallet'
import fs from 'fs/promises'
import fetch from 'node-fetch'
import path from 'path'

const baseUrl = 'https://api.tenderly.co/api/v1'
const forkUrl = (user, project, forkId = undefined) =>
  `${baseUrl}/account/${user}/project/${project}/fork${
    forkId ? `/${forkId}` : ''
  }`
const fetchWithAuth =
  (key) =>
  async (url, options, noRes = false) =>
    fetch(url, {
      ...options,
      body: JSON.stringify(options.body),
      headers: {
        ...options.headers,
        'X-Access-Key': key,
        'Content-Type': 'application/json',
      },
    }).then((res) => (noRes ? res : res.json()))

export const generateFork = async (config) => {
  const {
    tenderlyKey: key,
    tenderlyUser: user,
    tenderlyProject: project,
    docker: { chainId, secretWords: mnemonic },
    archive: { block },
  } = config

  if (!key) {
    throw new Error('Missing Tenderly access key')
  }
  if (!user) {
    throw new Error('Missing Tenderly user')
  }
  if (!project) {
    throw new Error('Missing Tenderly project')
  }

  const fetchAuthed = fetchWithAuth(key)
  const forkUrlWithInfo = forkUrl(user, project)

  const resp = await fetchAuthed(forkUrlWithInfo, {
    method: 'POST',
    body: {
      network_id: `${chainId}`,
      block_number: block,
    },
  })

  if (resp.error && resp.error.slug === 'unauthorized') {
    throw new Error('Tenderly not authorised!')
  } else if (resp.error) {
    throw new Error(resp.error.message)
  }

  console.info('Forked with fork id:', resp.root_transaction.fork_id)

  await fs.writeFile(
    path.resolve(process.env.INIT_CWD, '.tenderly.json'),
    JSON.stringify(resp),
  )

  const wallets = Array.from({ length: 10 }).map(
    (_, i) => Wallet.fromMnemonic(mnemonic, "m/44'/60'/0'/0/" + i).address,
  )

  await fetch(`https://rpc.tenderly.co/fork/${resp.root_transaction.fork_id}`, {
    method: 'POST',
    body: JSON.stringify({
      jsonrpc: '2.0',
      id: 1,
      method: 'tenderly_addBalance',
      // add 1000 eth to each wallet
      params: [wallets, '0x3635C9ADC5DEA00000'],
    }),
  })

  return `https://rpc.tenderly.co/fork/${resp.root_transaction.fork_id}`
}

export const deleteFork = async (config) => {
  const {
    tenderlyKey: key,
    tenderlyUser: user,
    tenderlyProject: project,
  } = config

  if (!key) {
    throw new Error('Missing Tenderly access key')
  }
  if (!user) {
    throw new Error('Missing Tenderly user')
  }
  if (!project) {
    throw new Error('Missing Tenderly project')
  }

  let tenderlyData

  try {
    tenderlyData = JSON.parse(
      await fs.readFile(path.resolve(process.env.INIT_CWD, '.tenderly.json'), {
        encoding: 'utf8',
      }),
    )
  } catch {
    return
  }

  const fetchAuthed = fetchWithAuth(key)
  const forkUrlWithInfo = forkUrl(
    user,
    project,
    tenderlyData.simulation_fork.id,
  )

  const resp = await fetchAuthed(
    forkUrlWithInfo,
    {
      method: 'DELETE',
    },
    true,
  )

  if (resp.error && resp.error.slug === 'unauthorized') {
    throw new Error('Tenderly not authorised!')
  } else if (resp.error) {
    throw new Error(resp.error.message)
  }

  await fs.rm(path.resolve(process.env.INIT_CWD, '.tenderly.json'), {
    force: true,
  })

  console.info('Deleted fork')
  return
}
