/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
// import { toUtf8Bytes } from '@ethersproject/strings/lib/utf8'

import { Address } from 'viem'

import { RecordOptions } from '@ensdomains/ensjs/utils'
import { deleteSubname } from '@ensdomains/ensjs/wallet'

import { Accounts, User } from '../../accounts'
import { waitForTransaction, walletClient } from '../../contracts/utils/addTestContracts.js'

type Dependencies = {
  accounts: Accounts
}

type Input = {
  name: string
  owner: User
  resolver?: `0x${string}`
  records?: RecordOptions
}

export const deleteSubnameFixture = async (name: string) => {
  let accounts: Address[]
  accounts = await walletClient.getAddresses()
  console.log(accounts[2])
  const tx = await deleteSubname(walletClient, {
    name,
    contract: 'registry',
    account: accounts[2],
  })
  const receipt = await waitForTransaction(tx)
  console.log(receipt)
  return receipt
}
