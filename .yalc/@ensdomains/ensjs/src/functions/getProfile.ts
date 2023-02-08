import { formatsByName } from '@ensdomains/address-encoder'
import { defaultAbiCoder } from '@ethersproject/abi'
import { hexStripZeros, isBytesLike } from '@ethersproject/bytes'
import { ENSArgs } from '..'
import { decodeContenthash, DecodedContentHash } from '../utils/contentHash'
import { hexEncodeName } from '../utils/hexEncodedName'
import { namehash } from '../utils/normalise'
import { parseInputType } from '../utils/validation'

type InternalProfileOptions = {
  contentHash?: boolean | string | DecodedContentHash
  texts?: string[]
  coinTypes?: string[]
}

type ProfileResponse = {
  contentHash?: string | DecodedContentHash
  texts?: string[]
  coinTypes?: string[]
}

type FallbackRecords = {
  contentHash?: boolean
  texts?: string[]
  coinTypes?: string[]
}

type DataItem = {
  key: string | number
  type: 'addr' | 'text' | 'contentHash'
  coin?: string
  value: string
}

type ResolvedProfile = {
  isMigrated: boolean | null
  createdAt: string | null
  address?: string
  name?: string | null
  decryptedName?: string | null
  match?: boolean
  message?: string
  records?: {
    contentHash?: DecodedContentHash | string | null
    texts?: DataItem[]
    coinTypes?: DataItem[]
  }
  resolverAddress?: string
  isInvalidResolverAddress?: boolean
  reverseResolverAddress?: string
}

type CallObj = {
  key: string
  data: {
    to: string
    data: string
  }
  type: 'addr' | 'text' | 'contentHash'
}

const makeMulticallData = async (
  {
    _getAddr,
    _getContentHash,
    _getText,
  }: ENSArgs<'_getText' | '_getAddr' | '_getContentHash'>,
  name: string,
  options: InternalProfileOptions,
) => {
  let calls: (CallObj | null)[] = []
  if (options.texts)
    calls = [
      ...calls,
      ...(await Promise.all(
        options.texts.map(async (x) => ({
          key: x,
          data: await _getText.raw(name, x),
          type: 'text' as const,
        })),
      )),
    ]

  if (options.coinTypes)
    calls = [
      ...calls,
      ...(await Promise.all(
        options.coinTypes.map(async (x) => ({
          key: x,
          data: await _getAddr.raw(name, x, true),
          type: 'addr' as const,
        })),
      )),
    ]

  if (typeof options.contentHash === 'boolean' && options.contentHash) {
    calls.push({
      key: 'contentHash',
      data: await _getContentHash.raw(name),
      type: 'contentHash' as const,
    })
  }

  if (!calls.find((x) => x!.key === '60')) {
    calls.push({
      key: '60',
      data: await _getAddr.raw(name, '60', true),
      type: 'addr' as const,
    })
  }

  return { data: calls.map((x) => x!.data.data), calls }
}

const fetchWithoutResolverMulticall = async (
  { multicallWrapper }: ENSArgs<'multicallWrapper'>,
  calls: {
    key: string | number
    data: {
      to: string
      data: string
    }
    type: 'addr' | 'text' | 'contentHash'
  }[],
  resolverAddress: string,
) => {
  const callsWithResolver = calls.map((call) => ({
    to: resolverAddress,
    data: call.data.data,
  }))

  const results = await multicallWrapper(callsWithResolver)

  if (!results || !results.length) return []

  return results.map((x: [boolean, string]) => x[1])
}

const formatRecords = async (
  {
    _getText,
    _getAddr,
    _getContentHash,
  }: ENSArgs<'_getText' | '_getAddr' | '_getContentHash'>,
  data: any[],
  calls: any[],
  options: InternalProfileOptions,
) => {
  const returnedRecords: DataItem[] = (
    await Promise.all(
      data.map(async (item: string, i: number) => {
        let decodedFromAbi: any
        let itemRet: Record<string, any> = {
          key: calls[i].key,
          type: calls[i].type,
        }
        if (itemRet.type === 'contentHash') {
          ;[decodedFromAbi] = defaultAbiCoder.decode(['bytes'], item)
          if (hexStripZeros(decodedFromAbi) === '0x') {
            return
          }
        }
        switch (calls[i].type) {
          case 'text':
            itemRet = {
              ...itemRet,
              value: await _getText.decode(item),
            }
            if (itemRet.value === '' || itemRet.value === undefined) return
            break
          case 'addr':
            try {
              const addr = await _getAddr.decode(item, '', calls[i].key)
              if (addr) {
                itemRet = {
                  ...itemRet,
                  ...addr,
                }
                break
              } else {
                return
              }
            } catch {
              return
            }
          case 'contentHash':
            try {
              itemRet = {
                ...itemRet,
                value: await _getContentHash.decode(item),
              }
              break
            } catch {
              return
            }
          // no default
        }
        return itemRet
      }),
    )
  )
    .filter((x): x is DataItem => {
      return typeof x === 'object'
    })
    .filter((x) => x)

  const returnedResponse: {
    contentHash?: string | null | DecodedContentHash
    coinTypes?: DataItem[]
    texts?: DataItem[]
  } = {}

  if (
    typeof options.contentHash === 'string' ||
    typeof options.contentHash === 'object'
  ) {
    if (
      typeof options.contentHash === 'string' &&
      hexStripZeros(options.contentHash) === '0x'
    ) {
      returnedResponse.contentHash = null
    } else if (
      isBytesLike((options.contentHash as any).decoded) &&
      hexStripZeros((options.contentHash as any).decoded) === '0x'
    ) {
      returnedResponse.contentHash = null
    } else {
      returnedResponse.contentHash = options.contentHash
    }
  } else if (options.contentHash) {
    const foundRecord = returnedRecords.find(
      (item: any) => item.type === 'contentHash',
    )
    returnedResponse.contentHash = foundRecord ? foundRecord.value : null
  }
  if (options.texts) {
    returnedResponse.texts = returnedRecords.filter(
      (x: any) => x.type === 'text',
    )
  }
  if (options.coinTypes) {
    returnedResponse.coinTypes = returnedRecords.filter(
      (x: any) => x.type === 'addr',
    )
  }
  return returnedResponse
}

const getDataForName = async (
  {
    contracts,
    _getAddr,
    _getContentHash,
    _getText,
    multicallWrapper,
  }: ENSArgs<
    | 'contracts'
    | '_getText'
    | '_getAddr'
    | '_getContentHash'
    | 'resolverMulticallWrapper'
    | 'multicallWrapper'
  >,
  name: string,
  options: InternalProfileOptions,
  specificResolver?: string,
) => {
  const universalResolver = await contracts?.getUniversalResolver()!

  const { data, calls } = await makeMulticallData(
    { _getAddr, _getContentHash, _getText },
    name,
    options,
  )

  let recordData: (string | null)[] | undefined
  let resolverAddress: string | undefined = specificResolver

  if (specificResolver) {
    try {
      const publicResolver = await contracts?.getPublicResolver(
        undefined,
        specificResolver,
      )
      recordData = await publicResolver?.callStatic.multicall(data)
    } catch (e: any) {
      console.error('getProfile error:', e)
      recordData = await fetchWithoutResolverMulticall(
        { multicallWrapper },
        calls as CallObj[],
        resolverAddress!,
      )
    }
  } else {
    try {
      const resolvedData = await universalResolver['resolve(bytes,bytes[])'](
        hexEncodeName(name),
        data,
        {
          ccipReadEnabled: true,
        },
      )
      recordData = [...resolvedData['0']]
      resolverAddress = resolvedData['1']
      for (let i = 0; i < recordData.length; i += 1) {
        // error code for reverted call in batch
        // this is expected when using offchain resolvers, so should be ignored
        if (recordData[i]!.startsWith('0x0d1947a9')) {
          calls[i] = null
          recordData[i] = null
        }
      }
    } catch {
      const registryContract = await contracts?.getRegistry()
      resolverAddress = await registryContract?.resolver(namehash(name))
      return {
        address: undefined,
        records: {},
        resolverAddress,
        isInvalidResolverAddress: true,
      }
    }
  }
  if (
    !resolverAddress ||
    !recordData ||
    hexStripZeros(resolverAddress) === '0x'
  ) {
    return {
      address: undefined,
      records: {},
      resolverAddress: undefined,
    }
  }

  const filteredCalls = calls.filter((x) => x) as CallObj[]
  const filteredRecordData = recordData.filter((x) => x)

  const matchAddress =
    filteredRecordData[filteredCalls.findIndex((x) => x.key === '60')]

  return {
    address:
      matchAddress && (await _getAddr.decode(matchAddress).catch(() => false)),
    records: await formatRecords(
      { _getAddr, _getContentHash, _getText },
      filteredRecordData,
      filteredCalls,
      options,
    ),
    resolverAddress,
  }
}

const graphFetch = async (
  { gqlInstance }: ENSArgs<'gqlInstance'>,
  name: string,
  wantedRecords?: ProfileOptions,
  resolverAddress?: string,
) => {
  const query = gqlInstance.gql`
    query getRecords($id: String!) {
      domain(id: $id) {
        name
        isMigrated
        createdAt
        resolver {
          texts
          coinTypes
          contentHash
          addr {
            id
          }
        }
      }
    }
  `

  const customResolverQuery = gqlInstance.gql`
    query getRecordsWithCustomResolver($id: String!, $resolverId: String!) {
      domain(id: $id) {
        name
        isMigrated
        createdAt
      }
      resolver(id: $resolverId) {
        texts
        coinTypes
        contentHash
        addr {
          id
        }
      }
    }
  `

  const { client } = gqlInstance

  const id = namehash(name)

  let domain: any
  let resolverResponse: any

  if (!resolverAddress) {
    const response = await client.request(query, { id })
    domain = response?.domain
    resolverResponse = domain?.resolver
  } else {
    const resolverId = `${resolverAddress.toLowerCase()}-${id}`
    const response = await client.request(customResolverQuery, {
      id,
      resolverId,
    })
    resolverResponse = response?.resolver
    domain = response?.domain
  }

  if (!domain) return

  const { isMigrated, createdAt, name: decryptedName } = domain

  const returnedRecords: ProfileResponse = {}

  if (!resolverResponse || !wantedRecords)
    return { isMigrated, createdAt, decryptedName }

  Object.keys(wantedRecords).forEach((key: string) => {
    const data = wantedRecords[key as keyof ProfileOptions]
    if (typeof data === 'boolean' && data) {
      if (key === 'contentHash') {
        returnedRecords[key] = decodeContenthash(resolverResponse.contentHash)
      } else {
        returnedRecords[key as keyof ProfileOptions] = resolverResponse[key]
      }
    }
  })

  return {
    ...returnedRecords,
    decryptedName,
    isMigrated,
    createdAt,
  }
}

type ProfileOptions = {
  contentHash?: boolean
  texts?: boolean | string[]
  coinTypes?: boolean | string[]
}

type InputProfileOptions = ProfileOptions & {
  resolverAddress?: string
  fallback?: FallbackRecords
}

const getProfileFromName = async (
  {
    contracts,
    gqlInstance,
    _getAddr,
    _getContentHash,
    _getText,
    resolverMulticallWrapper,
    multicallWrapper,
  }: ENSArgs<
    | 'contracts'
    | 'gqlInstance'
    | '_getText'
    | '_getAddr'
    | '_getContentHash'
    | 'resolverMulticallWrapper'
    | 'multicallWrapper'
  >,
  name: string,
  options?: InputProfileOptions,
): Promise<ResolvedProfile | undefined> => {
  const { resolverAddress, fallback, ..._options } = options || {}
  const optsLength = Object.keys(_options).length
  let usingOptions: InputProfileOptions | undefined
  if (!optsLength || _options?.texts === true || _options?.coinTypes === true) {
    if (optsLength) usingOptions = _options
    else usingOptions = { contentHash: true, texts: true, coinTypes: true }
  }

  const graphResult = await graphFetch(
    { gqlInstance },
    name,
    usingOptions,
    resolverAddress,
  )
  let isMigrated: boolean | null = null
  let createdAt: string | null = null
  let decryptedName: string | null = null
  let result: Awaited<ReturnType<typeof getDataForName>> | null = null
  if (!graphResult) {
    if (!fallback) return
    result = await getDataForName(
      {
        contracts,
        _getAddr,
        _getContentHash,
        _getText,
        resolverMulticallWrapper,
        multicallWrapper,
      },
      name,
      fallback,
      undefined,
    )
  } else {
    const {
      isMigrated: _isMigrated,
      createdAt: _createdAt,
      decryptedName: _decryptedName,
      ...wantedRecords
    }: {
      isMigrated: boolean
      createdAt: string
      decryptedName: string
    } & InternalProfileOptions = graphResult
    isMigrated = _isMigrated
    createdAt = _createdAt
    decryptedName = _decryptedName
    let recordsWithFallback = usingOptions
      ? wantedRecords
      : (_options as InternalProfileOptions)
    if (
      (Object.keys(recordsWithFallback).length === 0 ||
        (!recordsWithFallback.coinTypes &&
          !recordsWithFallback.texts &&
          Object.keys(recordsWithFallback.contentHash || {}).length === 0)) &&
      fallback
    ) {
      recordsWithFallback = fallback
    }
    result = await getDataForName(
      {
        contracts,
        _getAddr,
        _getContentHash,
        _getText,
        resolverMulticallWrapper,
        multicallWrapper,
      },
      name,
      recordsWithFallback,
      options?.resolverAddress!,
    )
  }
  if (!result?.resolverAddress)
    return {
      isMigrated,
      createdAt,
      message: !result
        ? "Records fetch didn't complete"
        : "Name doesn't have a resolver",
    }
  return { ...result, isMigrated, createdAt, decryptedName, message: undefined }
}

const getProfileFromAddress = async (
  {
    contracts,
    gqlInstance,
    getName,
    _getAddr,
    _getContentHash,
    _getText,
    resolverMulticallWrapper,
    multicallWrapper,
  }: ENSArgs<
    | 'contracts'
    | 'gqlInstance'
    | 'getName'
    | '_getText'
    | '_getAddr'
    | '_getContentHash'
    | 'resolverMulticallWrapper'
    | 'multicallWrapper'
  >,
  address: string,
  options?: InputProfileOptions,
) => {
  let name
  try {
    name = await getName(address)
  } catch (e) {
    return
  }
  if (!name || !name.name || name.name === '') return
  if (!name.match) return { ...name, isMigrated: null, createdAt: null }
  const result = await getProfileFromName(
    {
      contracts,
      gqlInstance,
      _getAddr,
      _getContentHash,
      _getText,
      resolverMulticallWrapper,
      multicallWrapper,
    },
    name.name,
    options,
  )
  if (!result || result.message) return
  delete (result as any).address
  return {
    ...result,
    ...name,
    message: undefined,
  }
}

const mapCoinTypes = (coin: string) => {
  if (!Number.isNaN(parseInt(coin))) {
    return coin
  }
  return `${formatsByName[coin.toUpperCase()].coinType}`
}

export default async function (
  {
    contracts,
    gqlInstance,
    getName,
    _getAddr,
    _getContentHash,
    _getText,
    resolverMulticallWrapper,
    multicallWrapper,
  }: ENSArgs<
    | 'contracts'
    | 'gqlInstance'
    | 'getName'
    | '_getText'
    | '_getAddr'
    | '_getContentHash'
    | 'resolverMulticallWrapper'
    | 'multicallWrapper'
  >,
  nameOrAddress: string,
  options?: InputProfileOptions,
): Promise<ResolvedProfile | undefined> {
  if (options) {
    if (options.coinTypes && typeof options.coinTypes !== 'boolean') {
      options.coinTypes = options.coinTypes.map(mapCoinTypes)
    }
    if (options.fallback && options.fallback.coinTypes) {
      options.fallback.coinTypes = options.fallback.coinTypes.map(mapCoinTypes)
    }
  }

  const inputType = parseInputType(nameOrAddress)

  if (inputType.type === 'unknown' || inputType.info === 'unsupported') {
    throw new Error('Invalid input type')
  }

  if (inputType.type === 'address') {
    return getProfileFromAddress(
      {
        contracts,
        gqlInstance,
        getName,
        _getAddr,
        _getContentHash,
        _getText,
        resolverMulticallWrapper,
        multicallWrapper,
      },
      nameOrAddress,
      options,
    )
  }

  return getProfileFromName(
    {
      contracts,
      gqlInstance,
      _getAddr,
      _getContentHash,
      _getText,
      resolverMulticallWrapper,
      multicallWrapper,
    },
    nameOrAddress,
    options,
  )
}
