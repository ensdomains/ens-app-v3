/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { toUtf8Bytes } from '@ethersproject/strings/lib/utf8'
import { Accounts } from 'playwright/fixtures/accounts'
import { Provider } from 'playwright/fixtures/provider'

import { namehash } from '@ensdomains/ensjs/utils/normalise'
import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { getContract } from '../utils/getContract'

export type Records = {
  texts?: { key: string; value: string }[]
  coins?: { key: number; value: string }[]
  contenthash?: string
  abi?: {
    contentType: number
    data: any
  }
}

type Input = {
  name: string
  owner: `0x${string}`
  resolver?: string
  records?: RecordOptions
}

type Dependencies = {
  accounts: Accounts
  provider: Provider
}

export const generateRecords = async (
  { name, owner, resolver, records }: Input,
  { accounts, provider }: Dependencies,
) => {
  if (!resolver || !records || !owner) return

  // Connect contract
  const signer = provider.getSigner(accounts.getIndex(owner))
  const publicResolver = await getContract('PublicResolver', { address: resolver, signer })

  // Make records
  const node = namehash(name)

  const { texts = [], coinTypes = [], contentHash, abi } = records
  for (const { key, value } of texts) {
    await publicResolver.setText(node, key, value)
  }

  for (const { key, value } of coinTypes) {
    await publicResolver['setAddr(bytes32,uint256,bytes)'](node, key, value)
  }

  if (contentHash) {
    const tx = await publicResolver.setContenthash(node, contentHash)
    await tx.wait()
  }

  if (abi) {
    await publicResolver.setABI(node, abi.contentType, toUtf8Bytes(JSON.stringify(abi.data)))
  }
}
