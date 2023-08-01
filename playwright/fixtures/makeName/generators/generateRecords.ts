/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { toUtf8Bytes } from '@ethersproject/strings/lib/utf8'
import { User } from 'playwright/fixtures/accounts'
import { Contracts } from 'playwright/fixtures/contracts'

import { formatsByCoinType, formatsByName } from '@ensdomains/address-encoder'
import { PublicResolver } from '@ensdomains/ensjs/generated/PublicResolver'
import { encodeContenthash } from '@ensdomains/ensjs/utils/contentHash'
import { namehash } from '@ensdomains/ensjs/utils/normalise'
import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { emptyAddress } from '@app/utils/constants'

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
    const publicResolver = contracts.get('PublicResolver', {
      address: resolver,
      signer: owner,
    }) as PublicResolver
    const node = namehash(name)
    const { texts = [], coinTypes = [], contentHash, abi } = records

    // Text records
    for (const { key, value } of texts) {
      console.log('- txt:', key, '->', value)
      const tx = await publicResolver.setText(node, key, value)
      await tx.wait()
    }

    // Coin records
    for (const { key, value } of coinTypes) {
      if (value === '' || value === '0x' || value === emptyAddress)
        throw new Error('Cannot create record with empty address')
      let coinTypeInstance
      if (!Number.isNaN(parseInt(key))) {
        coinTypeInstance = formatsByCoinType[parseInt(key)]
      } else {
        coinTypeInstance = formatsByName[key.toUpperCase()]
      }
      const inputCoinType = coinTypeInstance.coinType
      const encodedAddress = coinTypeInstance.decoder(value)
      console.log('- addr:', inputCoinType, '->', value)
      const tx = await publicResolver['setAddr(bytes32,uint256,bytes)'](
        node,
        inputCoinType,
        encodedAddress,
      )
      await tx.wait()
    }

    // Contenthash record
    if (contentHash) {
      const _contentHash = encodeContenthash(contentHash)
      if (_contentHash.error) throw new Error(_contentHash.error)
      if (typeof _contentHash.encoded !== 'string')
        throw new Error('Error occured while encoding contenthash')
      console.log('- contenthash:', _contentHash.encoded)
      const tx = await publicResolver.setContenthash(node, _contentHash.encoded as string)
      await tx.wait()
    }

    // ABI record
    if (abi) {
      console.log('- abi:', abi)
      const tx = await publicResolver.setABI(
        node,
        abi.contentType || 1,
        toUtf8Bytes(JSON.stringify(abi.data)),
      )
      await tx.wait()
    }
  }
