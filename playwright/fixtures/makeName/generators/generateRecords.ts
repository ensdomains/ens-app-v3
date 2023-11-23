/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
// import { toUtf8Bytes } from '@ethersproject/strings/lib/utf8'
import { User, createAccounts } from '../../accounts'
import { Contracts } from '../../contracts'
import { RecordOptions } from '@ensdomains/ensjs/utils'

// import { emptyAddress } from '@app/utils/constants'
import { setRecords } from '@ensdomains/ensjs/wallet'
import { publicClient, waitForTransaction, walletClient } from '../../contracts/utils/addTestContracts.js'

type Input = {
  name: string
  owner: User
  resolver?: `0x${string}`
  records?: RecordOptions
}

type Dependencies = {
  contracts: Contracts
}

export const generateRecords =
  ({ contracts }: Dependencies) =>
  async ({ name, owner, resolver, records }: Input) => {
    if (!resolver || !records || !owner) return

    console.log('generating records for:', name)
    // const publicResolver = contracts.get('PublicResolver', {
    //   address: resolver,
    //   signer: owner,
    // }) as PublicResolver //TODO (SG) - Ask about this

    const { texts = [], coins = [], contentHash, abi } = records

    const tx = await setRecords(walletClient, {
      name: name,
      resolverAddress: resolver,
      coins: coins,
      texts: texts,
      contentHash: contentHash,
      account: createAccounts().getAddress(owner) as `0x${string}`,

    })
    const receipt = await waitForTransaction(tx)
  }
