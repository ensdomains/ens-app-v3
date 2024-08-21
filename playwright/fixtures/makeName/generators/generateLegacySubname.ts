/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import {
  getChainContractAddress,
  registrySetApprovalForAllSnippet,
} from '@ensdomains/ensjs/contracts'
import { RecordOptions } from '@ensdomains/ensjs/utils'
import { createSubname, wrapName } from '@ensdomains/ensjs/wallet'

import { Accounts, User } from '../../accounts'
import {
  testClient,
  waitForTransaction,
  walletClient,
} from '../../contracts/utils/addTestContracts'
import { generateRecords } from './generateRecords'

export type LegacySubname = {
  name: string
  nameOwner: User
  label: string
  owner?: User
  resolver?: `0x${string}`
  records?: RecordOptions
  duration?: number
  type?: 'wrapped' | 'legacy'
  subnames?: Omit<LegacySubname, 'name' | 'nameOwner'>[]
}

type Dependencies = {
  accounts: Accounts
}
// const DEFAULT_RESOLVER = RESOLVER_ADDRESSES['1337'][2] as `0x${string}`
const DEFAULT_RESOLVER = testClient.chain.contracts.legacyPublicResolver.address
export const generateLegacySubname =
  ({ accounts }: Dependencies) =>
  async ({
    name,
    nameOwner,
    label,
    owner = nameOwner,
    resolver,
    records,
    type,
    subnames,
  }: LegacySubname) => {
    const subname = `${label}.${name}`
    console.log('generating legacy subname:', subname)

    const tx = await createSubname(walletClient, {
      name: `${label}.${name}`,
      contract: 'registry',
      owner: accounts.getAddress(owner) as `0x${string}`,
      account: accounts.getAccountForUser(nameOwner),
      resolverAddress: resolver ?? DEFAULT_RESOLVER,
    })
    await waitForTransaction(tx)

    // Make records
    if (records && resolver) {
      await generateRecords({ accounts })({
        name: subname,
        owner,
        resolver,
        records,
      })
    }

    if (type === 'wrapped') {
      const approveTx = await walletClient.writeContract({
        abi: registrySetApprovalForAllSnippet,
        address: getChainContractAddress({
          client: walletClient,
          contract: 'ensRegistry',
        }),
        functionName: 'setApprovalForAll',
        args: [
          getChainContractAddress({
            client: walletClient,
            contract: 'ensNameWrapper',
          }),
          true,
        ],
        account: accounts.getAddress(owner) as `0x${string}`,
      })
      const approve = await waitForTransaction(approveTx)
      if (approve.status === 'success') console.log('approved name wrapper')
      else throw new Error(`failed to approve name wrapper`)

      const wrapTx = await wrapName(walletClient, {
        name: subname,
        newOwnerAddress: accounts.getAddress(owner) as `0x${string}`,
        resolverAddress: getChainContractAddress({
          client: walletClient,
          contract: 'ensPublicResolver',
        }),
        account: accounts.getAddress(owner) as `0x${string}`,
      })
      const wrap = await waitForTransaction(wrapTx)
      if (wrap.status === 'success') console.log('wrapped subname:', subname)
      else throw new Error(`failed to wrap subname: ${subname}`)
    }
    // Create subnames
    const _subnames = (subnames || []).map((_subname) => ({
      ..._subname,
      name: `${label}.${name}`,
      nameOwner: owner,
      resolver: _subname.resolver ?? DEFAULT_RESOLVER,
    }))
    for (const eachSubname of _subnames) {
      await generateLegacySubname({ accounts })(eachSubname)
    }
  }
