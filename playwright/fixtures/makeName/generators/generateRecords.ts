/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
// import { toUtf8Bytes } from '@ethersproject/strings/lib/utf8'
import { RecordOptions } from '@ensdomains/ensjs/utils'
import { setRecords } from '@ensdomains/ensjs/wallet'

import { createAccounts, User } from '../../accounts'
import { waitForTransaction, walletClient } from '../../contracts/utils/addTestContracts.js'

type Input = {
  name: string
  owner: User
  resolver?: `0x${string}`
  records?: RecordOptions
}

export const generateRecords =
  () =>
  async ({ name, owner, resolver, records }: Input) => {
    if (!resolver || !records || !owner) return

    console.log('generating records for:', name, records)

    const { texts = [], coins = [], contentHash, abi } = records

    const tx = await setRecords(walletClient, {
      name,
      resolverAddress: resolver,
      coins,
      texts,
      contentHash,
      account: createAccounts().getAddress(owner) as `0x${string}`,
      abi,
    })
    await waitForTransaction(tx)
  }
