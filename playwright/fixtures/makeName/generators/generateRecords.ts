/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
// import { toUtf8Bytes } from '@ethersproject/strings/lib/utf8'
import { RecordOptions } from '@ensdomains/ensjs/utils'
import { setRecords } from '@ensdomains/ensjs/wallet'

import { Accounts, User } from '../../accounts'
import { waitForTransaction, walletClient } from '../../contracts/utils/addTestContracts.js'

type Input = {
  name: string
  owner: User
  resolver?: `0x${string}`
  records?: RecordOptions
}

type Dependencies = {
  accounts: Accounts
}

export const generateRecords =
  ({ accounts }: Dependencies) =>
  async ({ name, owner, resolver, records }: Input) => {
    if (!resolver || !records || !owner) return

    console.log('generating records for:', name)

    const { texts = [], coins = [], contentHash, abi } = records

    const tx = await setRecords(walletClient, {
      name,
      resolverAddress: resolver,
      coins,
      texts,
      contentHash,
      account: accounts.getAccount(owner),
      abi,
    })
    await waitForTransaction(tx)
  }
