/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
// import { toUtf8Bytes } from '@ethersproject/strings/lib/utf8'
import { User, createAccounts } from '../../accounts'
import { Contracts } from '../../contracts'

// import { formatsByCoinType, formatsByName } from '@ensdomains/address-encoder'
// import { PublicResolver } from '@ensdomains/ensjs/generated/PublicResolver'
// import { encodeContenthash } from '@ensdomains/ensjs/utils/contentHash'
// import { namehash } from '@ensdomains/ensjs/utils/normalise'
import { RecordOptions } from '@ensdomains/ensjs/utils'

// import { emptyAddress } from '@app/utils/constants'
import { setRecords } from '@ensdomains/ensjs/wallet'
import { publicClient, waitForTransaction, walletClient } from '../../contracts/utils/addTestContracts.js'
import { getResolver } from '@ensdomains/ensjs/public'

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
    // }) as PublicResolver

    // const node = namehash(name)
    const { texts = [], coins = [], contentHash, abi } = records

    const dummyABI = [
      {
        type: 'function',
        name: 'supportsInterface',
        constant: true,
        stateMutability: 'view',
        payable: false,
        inputs: [
          {
            type: 'bytes4',
          },
        ],
        outputs: [
          {
            type: 'bool',
          },
        ],
      },
    ]

    const tx = await setRecords(walletClient, {
      name: name,
      resolverAddress: resolver,
      coins: coins,
      texts: texts,
      abi: await encodeAbi({ encodeAs: 'json', data: dummyABI }),
      contentHash: contentHash,
      account: createAccounts().getAddress(owner) as `0x${string}`,

    })
    expect(tx).toBeTruthy()
    const receipt = await waitForTransaction(tx)
    expect(receipt.status).toBe('success')

    // Text records
    // for (const { key, value } of texts) {
    //   console.log('- txt:', key, '->', value)
    //   // const tx = await publicResolver.setText(node, key, value)
    //   // await tx.wait()
    //   const tx = await setTextRecord(walletClient, {
    //     name: name,
    //     key: key,
    //     value: value,
    //     resolverAddress: (await getResolver(publicClient, {
    //       name: name,
    //     }))!,
    //     account: owner,
    //   })
    //   expect(tx).toBeTruthy()
    //   const receipt = await waitForTransaction(tx)
    //   expect(receipt.status).toBe('success')
    // }

    // Coin records
    // for (const { key, value } of coinTypes) {
    //   if (value === '' || value === '0x' || value === emptyAddress)
    //     throw new Error('Cannot create record with empty address')
    //   // let coinTypeInstance
    //   // if (!Number.isNaN(parseInt(key))) {
    //   //   coinTypeInstance = formatsByCoinType[parseInt(key)]
    //   // } else {
    //   //   coinTypeInstance = formatsByName[key.toUpperCase()]
    //   // }
    //   // const inputCoinType = coinTypeInstance.coinType
    //   // const encodedAddress = coinTypeInstance.decoder(value)
    //   // console.log('- addr:', inputCoinType, '->', value)
    //   // const tx = await publicResolver['setAddr(bytes32,uint256,bytes)'](
    //   //   node,
    //   //   inputCoinType,
    //   //   encodedAddress,
    //   // )
    //   // await tx.wait()
    //   const tx = await setRecords(walletClient, {
    //     name: name,
    //     resolverAddress: (await getResolver(publicClient, {
    //       name: name,
    //     }))!,
    //     coins: [
    //       {
    //         coin: key,
    //         value: value,
    //       },
    //     ],
    //     texts: [{ key: 'foo', value: 'bar' }],
    //     abi: await encodeAbi({ encodeAs: 'json', data: dummyABI }),
    //     account: accounts[1],
    //   })
    //   expect(tx).toBeTruthy()
    //   const receipt = await waitForTransaction(tx)
    //   expect(receipt.status).toBe('success')
    // }

    // Contenthash record
    // if (contentHash) {
    //   const _contentHash = encodeContenthash(contentHash)
    //   if (_contentHash.error) throw new Error(_contentHash.error)
    //   if (typeof _contentHash.encoded !== 'string')
    //     throw new Error('Error occured while encoding contenthash')
    //   console.log('- contenthash:', _contentHash.encoded)
    //   const tx = await publicResolver.setContenthash(node, _contentHash.encoded as string)
    //   await tx.wait()
    // }

    // ABI record
    // if (abi) {
    //   console.log('- abi:', abi)
    //   const tx = await publicResolver.setABI(
    //     node,
    //     abi.contentType || 1,
    //     toUtf8Bytes(JSON.stringify(abi.data)),
    //   )
    //   await tx.wait()
    // }
  }
