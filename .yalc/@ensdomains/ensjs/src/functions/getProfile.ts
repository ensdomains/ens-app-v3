import { formatsByName } from '@ensdomains/address-encoder'
import { ethers } from 'ethers'
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
  match?: boolean
  message?: string
  records?: {
    contentHash?: DecodedContentHash | string | null
    texts?: DataItem[]
    coinTypes?: DataItem[]
  }
  resolverAddress?: string
  reverseResolverAddress?: string
}

const makeMulticallData = async (
  {
    _getAddr,
    _getContentHash,
    _getText,
    resolverMulticallWrapper,
  }: ENSArgs<
    '_getText' | '_getAddr' | '_getContentHash' | 'resolverMulticallWrapper'
  >,
  name: string,
  options: InternalProfileOptions,
) => {
  let calls: any[] = []
  if (options.texts)
    calls = [
      ...calls,
      ...(await Promise.all(
        options.texts.map(async (x) => ({
          key: x,
          data: await _getText.raw(name, x),
          type: 'text',
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
          type: 'addr',
        })),
      )),
    ]

  if (typeof options.contentHash === 'boolean' && options.contentHash) {
    calls.push({
      key: 'contentHash',
      data: await _getContentHash.raw(name),
      type: 'contenthash',
    })
  }

  if (!calls.find((x) => x.key === '60')) {
    calls.push({
      key: '60',
      data: await _getAddr.raw(name, '60', true),
      type: 'addr',
    })
  }

  const prRawData = await resolverMulticallWrapper.raw(calls.map((x) => x.data))

  return { data: prRawData.data, calls }
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

  return (await multicallWrapper(callsWithResolver)).map(
    (x: [boolean, string]) => x[1],
  )
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
        if (itemRet.type === 'contenthash') {
          ;[decodedFromAbi] = ethers.utils.defaultAbiCoder.decode(
            ['bytes'],
            item,
          )
          if (ethers.utils.hexStripZeros(decodedFromAbi) === '0x') {
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
          case 'contenthash':
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
      ethers.utils.hexStripZeros(options.contentHash) === '0x'
    ) {
      returnedResponse.contentHash = null
    } else if (
      ethers.utils.isBytesLike((options.contentHash as any).decoded) &&
      ethers.utils.hexStripZeros((options.contentHash as any).decoded) === '0x'
    ) {
      returnedResponse.contentHash = null
    } else {
      returnedResponse.contentHash = options.contentHash
    }
  } else if (options.contentHash) {
    const foundRecord = returnedRecords.find(
      (item: any) => item.type === 'contenthash',
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
    resolverMulticallWrapper,
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
  fallbackResolver?: string,
  specificResolver?: string,
) => {
  const universalResolver = await contracts?.getUniversalResolver()

  const { data, calls } = await makeMulticallData(
    { _getAddr, _getContentHash, _getText, resolverMulticallWrapper },
    name,
    options,
  )

  let resolvedData: any
  let useFallbackResolver = false
  try {
    if (specificResolver) {
      const publicResolver = await contracts?.getPublicResolver(
        undefined,
        specificResolver,
      )
      resolvedData = await publicResolver?.callStatic.multicall(
        calls.map((x) => x.data),
      )
    } else {
      resolvedData = await universalResolver?.resolve(hexEncodeName(name), data)
    }
  } catch {
    useFallbackResolver = true
  }

  let resolverAddress: string
  let recordData: any

  if (useFallbackResolver) {
    resolverAddress = specificResolver || fallbackResolver!
    recordData = await fetchWithoutResolverMulticall(
      { multicallWrapper },
      calls,
      resolverAddress,
    )
  } else {
    resolverAddress = specificResolver || resolvedData['1']
    if (specificResolver) {
      recordData = resolvedData
    } else {
      ;[recordData] = await resolverMulticallWrapper.decode(resolvedData['0'])
    }
  }

  const matchAddress = recordData[calls.findIndex((x) => x.key === '60')]

  return {
    address: matchAddress && (await _getAddr.decode(matchAddress)),
    records: await formatRecords(
      { _getAddr, _getContentHash, _getText },
      recordData,
      calls,
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
        isMigrated
        createdAt
        resolver {
          texts
          coinTypes
          contentHash
          addr {
            id
          }
          address
        }
      }
    }
  `

  const customResolverQuery = gqlInstance.gql`
    query getRecordsWithCustomResolver($id: String!, $resolverId: String!) {
      domain(id: $id) {
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
    ;({ domain } = await client.request(query, { id }))
    resolverResponse = domain?.resolver
  } else {
    const resolverId = `${resolverAddress.toLowerCase()}-${id}`
    ;({ resolver: resolverResponse, domain } = await client.request(
      customResolverQuery,
      { id, resolverId },
    ))
  }

  if (!domain) return

  const { isMigrated, createdAt } = domain

  const returnedRecords: ProfileResponse = {}

  if (!resolverResponse) return { isMigrated, createdAt }

  if (!wantedRecords)
    return {
      isMigrated,
      createdAt,
      graphResolverAddress: resolverResponse.address || resolverAddress,
    }

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
    isMigrated,
    createdAt,
    graphResolverAddress: resolverResponse.address || resolverAddress,
  }
}

type ProfileOptions = {
  contentHash?: boolean
  texts?: boolean | string[]
  coinTypes?: boolean | string[]
}

type InputProfileOptions = ProfileOptions & {
  resolverAddress?: string
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
) => {
  const { resolverAddress, ..._options } = options || {}
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
  if (!graphResult) return
  const {
    isMigrated,
    createdAt,
    graphResolverAddress,
    ...wantedRecords
  }: {
    isMigrated: boolean
    createdAt: string
    graphResolverAddress?: string
  } & InternalProfileOptions = graphResult
  if (!graphResolverAddress && !options?.resolverAddress)
    return { isMigrated, createdAt, message: "Name doesn't have a resolver" }
  const result = await getDataForName(
    {
      contracts,
      _getAddr,
      _getContentHash,
      _getText,
      resolverMulticallWrapper,
      multicallWrapper,
    },
    name,
    usingOptions ? wantedRecords : (options as InternalProfileOptions),
    graphResolverAddress,
    options?.resolverAddress!,
  )
  if (!result)
    return { isMigrated, createdAt, message: "Records fetch didn't complete" }
  return { ...result, isMigrated, createdAt, message: undefined }
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
  if (options && options.coinTypes && typeof options.coinTypes !== 'boolean') {
    options.coinTypes = options.coinTypes.map((coin: string) => {
      if (!Number.isNaN(parseInt(coin))) {
        return coin
      }
      return `${formatsByName[coin.toUpperCase()].coinType}`
    })
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
