/* eslint-disable import/no-extraneous-dependencies */

/* eslint-disable no-await-in-loop */
import { toUtf8Bytes } from '@ethersproject/strings/lib/utf8'
import { Accounts, User } from 'playwright/fixtures/accounts'
import { Provider } from 'playwright/fixtures/provider'

import { formatsByCoinType, formatsByName } from '@ensdomains/address-encoder'
import { PublicResolver } from '@ensdomains/ensjs/generated/PublicResolver'
import { encodeContenthash } from '@ensdomains/ensjs/utils/contentHash'
import { namehash } from '@ensdomains/ensjs/utils/normalise'
import { RecordOptions } from '@ensdomains/ensjs/utils/recordHelpers'

import { emptyAddress } from '@app/utils/constants'

import { getContract } from '../utils/getContract'

type Input = {
  name: string
  owner: User
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
  console.log(name, owner, resolver, records)
  if (!resolver || !records || !owner) return

  // Connect contract
  const signer = provider.getSigner(accounts.getIndex(owner))
  const publicResolver = getContract('PublicResolver', {
    address: resolver,
    signer,
  }) as PublicResolver

  // Make records
  const node = namehash(name)
  const { texts = [], coinTypes = [], contentHash, abi } = records

  // Text records
  for (const { key, value } of texts) {
    await publicResolver.setText(node, key, value)
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
    console.log('cointtype', inputCoinType)
    await publicResolver['setAddr(bytes32,uint256,bytes)'](node, inputCoinType, encodedAddress)
  }

  // Contenthash record
  if (contentHash) {
    const _contentHash = encodeContenthash(contentHash)
    if (_contentHash.error) throw new Error(_contentHash.error)
    if (typeof _contentHash.encoded !== 'string')
      throw new Error('Error occured while encoding contenthash')
    const tx = await publicResolver.setContenthash(node, _contentHash.encoded as string)
    await tx.wait()
  }

  // ABI record
  if (abi) {
    await publicResolver.setABI(node, abi.contentType || 1, toUtf8Bytes(JSON.stringify(abi.data)))
  }
}
