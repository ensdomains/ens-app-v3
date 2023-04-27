/* eslint-disable no-await-in-loop */
import { ethers } from 'ethers'
import { ENS } from '..'
import setup from '../tests/setup'
import { Name } from './getNames'
import { names as wrappedNames } from '../../deploy/00_register_wrapped'
import { ENSJSError } from '../utils/errors'

let ensInstance: ENS
let provider: ethers.providers.JsonRpcProvider
let accounts: string[]
let spyOnRequest: any

beforeAll(async () => {
  ;({ ensInstance, provider } = await setup())
  accounts = await provider.listAccounts()
  spyOnRequest = jest.spyOn(ensInstance.gqlInstance.client, 'request')
})

const testProperties = (obj: object, ...properties: string[]) =>
  properties.map((property) => expect(obj).toHaveProperty(property))

const testNotProperties = (obj: object, ...properties: string[]) =>
  properties.map((property) => expect(obj).not.toHaveProperty(property))

const letterItems = [
  'w',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  ...Array(5).fill('3'),
  ...Array(11).fill('2'),
  ...Array(11).fill('1'),
  '0',
]

const domainLetterItems = [
  ...Array(3).fill('['),
  'x',
  'w',
  't',
  'l',
  'a',
  '9',
  '8',
  '7',
  '6',
  '5',
  '4',
  ...Array(5).fill('3'),
  ...Array(11).fill('2'),
  ...Array(11).fill('1'),
  '0',
]

const makeName = () => ({
  expiryDate: '2023-12-14T20:23:53.000Z',
  registrationDate: '2022-12-14T20:23:53.000Z',
  fuses: 0,
  id: '0x6795e4e9369e4d0f3d4046bd0e5265ad34721b47164ec688461055c67779e235',
  labelName: '0-dummy',
  labelhash:
    '0xcdb02d2e0fba3102e50c6fa2f06f253ae47f59df932141cf0a8e8729ed99783b',
  name: '0-dummy.eth',
  isMigrated: true,
  parent: {
    name: 'eth',
    id: '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae',
  },
  createdAt: ' 2022-12-14T20:23:53.000Z',
  truncatedName: '0-dummy.eth',
  type: 'registration',
  domain: {
    id: '0x25f67b3beed01f6f4f507fb9262c86ffaf97caf28274dbffb990b5ddd07ecf7c',
    labelName: 'test',
    labelhash:
      '0x9c22ff5f21f0b81b113e63f7db6da94fedef11b2119b4088b89664fb9a3cb658',
    name: 'test.wrapped-with-subnames.eth',
    isMigrated: true,
    parent: {
      name: 'wrapped-with-subnames.eth',
      id: '0xdf47b9278aaef2dfff71549176a6f05ec020bf188a378e40d6f8a01eca829f16',
    },
    createdAt: '1671055808',
    registration: null,
  },
})

describe('getNames', () => {
  let totalRegistrations: number = 0
  let totalOwnedNames: number = 0
  it('should get the registrations for an address', async () => {
    const result = await ensInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'registrant',
    })
    totalRegistrations = result.length
    expect(result).toBeTruthy()
    testProperties(
      result[0],
      'expiryDate',
      'registrationDate',
      'id',
      'labelName',
      'labelhash',
      'name',
      'isMigrated',
      'parent',
      'truncatedName',
    )
  })
  it('should get the owned names for an address', async () => {
    const result = await ensInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'owner',
    })
    totalOwnedNames = result.length
    expect(result).toBeTruthy()
    testProperties(
      result[0],
      'id',
      'labelName',
      'labelhash',
      'name',
      'isMigrated',
      'parent',
      'truncatedName',
    )
    testNotProperties(result[0], 'expiryDate', 'registrationDate')
  })
  it('should get wrapped domains for an address', async () => {
    const result = await ensInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'wrappedOwner',
    })
    expect(result).toBeTruthy()
    testProperties(
      result[0],
      'id',
      'labelName',
      'labelhash',
      'name',
      'isMigrated',
      'parent',
      'truncatedName',
      'expiryDate',
      'fuses',
    )
  })
  it('should get the registrations for an address with pagination', async () => {
    const pageOne = await ensInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'registrant',
      page: 0,
    })
    expect(pageOne).toHaveLength(10)
    const pageTwo = await ensInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'registrant',
      page: 1,
    })
    expect(pageTwo).toHaveLength(10)
    const pageThree = await ensInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'registrant',
      page: 2,
    })
    expect(pageThree).toHaveLength(10)
    const pageFour = await ensInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'registrant',
      page: 3,
    })
    expect(pageFour).toHaveLength(totalRegistrations % 10)
  })
  it('should get the owned names for an address with pagination', async () => {
    const pageOne = await ensInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'owner',
      page: 0,
    })
    expect(pageOne).toHaveLength(10)
    const pageTwo = await ensInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'owner',
      page: 1,
    })
    expect(pageTwo).toHaveLength(10)
    const pageThree = await ensInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'owner',
      page: 2,
    })
    expect(pageThree).toHaveLength(10)
    const pageFour = await ensInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'owner',
      page: 3,
    })
    expect(pageFour).toHaveLength(10)
    const pageFive = await ensInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'owner',
      page: 4,
    })
    expect(pageFive).toHaveLength(totalOwnedNames % 10)
  })
  it('should get wrapped domains for an address with pagination, and filter out pcc expired names', async () => {
    const pageOne = await ensInstance.getNames({
      address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      type: 'wrappedOwner',
      page: 0,
    })

    const nameCout = wrappedNames.reduce<number>((count, name) => {
      if (name.namedOwner === 'owner2') count += 1
      ;(name.subnames || []).forEach((subname: any) => {
        if (subname.namedOwner === 'owner2') count += 1
      })
      return count
    }, 0)

    // length of page one should be all the names on 0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC
    // minus 1 for the PCC expired name.
    // the result here implies that the PCC expired name is not returned
    expect(pageOne).toHaveLength(nameCout - 1)
  })

  describe('resolved addresses', () => {
    /* eslint-disable @typescript-eslint/naming-convention */
    const RESOLVED_ADDRESS_COUNT: { [key: string]: number } = {
      '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266': 2,
      '0x70997970C51812dc3A010C7d01b50e0d17dc79C8': 16,
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC': 35,
    }
    /* eslint-enable @typescript-eslint/naming-convention */

    it('should get the names that resolve to an address by labelName', async () => {
      const ADDRESSES = [accounts[0], accounts[1], accounts[2]]
      for (const ADDRESS of ADDRESSES) {
        const pageOne = await ensInstance.getNames({
          address: ADDRESS,
          type: 'resolvedAddress',
          orderBy: 'labelName',
          orderDirection: 'asc',
        })
        expect(pageOne.length).toBe(RESOLVED_ADDRESS_COUNT[ADDRESS])
        let prevLabelName = pageOne[0].labelName
        for (const name of pageOne) {
          expect(
            !!name.labelName &&
              prevLabelName &&
              name.labelName >= prevLabelName,
          ).toBe(true)
          prevLabelName = name.labelName
          const profile = await ensInstance.getProfile(name.name)
          const eth = profile?.records?.coinTypes?.find(
            (coin) => coin.coin === 'ETH',
          )
          expect((eth as any).addr).toBe(ADDRESS)
        }
      }
    })

    it('should get the names that resolve to an address by creationDate', async () => {
      const ADDRESSES = [accounts[0], accounts[1], accounts[2]]
      for (const ADDRESS of ADDRESSES) {
        const pageOne = await ensInstance.getNames({
          address: ADDRESS,
          type: 'resolvedAddress',
          orderBy: 'createdAt',
          orderDirection: 'desc',
        })
        expect(pageOne.length).toBe(RESOLVED_ADDRESS_COUNT[ADDRESS])
        let prevCreatedAt = pageOne[0].createdAt?.getTime()
        for (const name of pageOne) {
          expect(
            !!name.createdAt &&
              !!prevCreatedAt &&
              name.createdAt.getTime() <= prevCreatedAt,
          ).toBe(true)
          prevCreatedAt = name.createdAt?.getTime()
          const profile = await ensInstance.getProfile(name.name)
          const eth = profile?.records?.coinTypes?.find(
            (coin) => coin.coin === 'ETH',
          )
          expect((eth as any).addr).toBe(ADDRESS)
        }
      }
    })
  })
  describe('orderBy', () => {
    describe('registrations', () => {
      it('descending registrationDate', async () => {
        const registrationDateOrderedDesc = (await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'registrant',
          orderBy: 'registrationDate',
          orderDirection: 'desc',
        })) as Name[]
        registrationDateOrderedDesc.reduce((prev, curr) => {
          expect(prev.registrationDate!.getTime()).toBeGreaterThanOrEqual(
            curr.registrationDate!.getTime(),
          )
          return curr
        })
      })
      it('ascending registrationDate', async () => {
        const registrationDateOrderedAsc = (await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'registrant',
          orderBy: 'registrationDate',
          orderDirection: 'asc',
        })) as Name[]
        registrationDateOrderedAsc.reduce((prev, curr) => {
          expect(prev.registrationDate!.getTime()).toBeLessThanOrEqual(
            curr.registrationDate!.getTime(),
          )
          return curr
        })
      })
      it('descending expiryDate', async () => {
        const expiryDateOrderedDesc = (await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'registrant',
          orderBy: 'expiryDate',
          orderDirection: 'desc',
        })) as Name[]
        expiryDateOrderedDesc.reduce((prev, curr) => {
          expect(prev.expiryDate!.getTime()).toBeGreaterThanOrEqual(
            curr.expiryDate!.getTime(),
          )
          return curr
        })
      })
      it('ascending expiryDate', async () => {
        const expiryDateOrderedAsc = (await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'registrant',
          orderBy: 'expiryDate',
          orderDirection: 'asc',
        })) as Name[]
        expiryDateOrderedAsc.reduce((prev, curr) => {
          expect(prev.expiryDate!.getTime()).toBeLessThanOrEqual(
            curr.expiryDate!.getTime(),
          )
          return curr
        })
      })
      it('descending labelName', async () => {
        const labelNameOrderedDesc = (await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'registrant',
          orderBy: 'labelName',
          orderDirection: 'desc',
        })) as Name[]
        expect(labelNameOrderedDesc.map((n) => n.labelName![0])).toStrictEqual(
          letterItems,
        )
      })
      it('ascending labelName', async () => {
        const labelNameOrderedAsc = (await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'registrant',
          orderBy: 'labelName',
          orderDirection: 'asc',
        })) as Name[]
        expect(labelNameOrderedAsc.map((n) => n.labelName![0])).toStrictEqual(
          letterItems.reverse(),
        )
      })
    })
    describe('owned names', () => {
      it('descending createdAt', async () => {
        const createdAtOrderedDesc = (await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'owner',
          orderBy: 'createdAt',
          orderDirection: 'desc',
        })) as Name[]
        createdAtOrderedDesc.reduce((prev, curr) => {
          expect(prev.createdAt!.getTime()).toBeGreaterThanOrEqual(
            curr.createdAt!.getTime(),
          )
          return curr
        })
      })
      it('ascending createdAt', async () => {
        const createdAtOrderedAsc = (await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'owner',
          orderBy: 'createdAt',
          orderDirection: 'asc',
        })) as Name[]
        createdAtOrderedAsc.reduce((prev, curr) => {
          expect(prev.createdAt!.getTime()).toBeLessThanOrEqual(
            curr.createdAt!.getTime(),
          )
          return curr
        })
      })
      it('descending labelName', async () => {
        const labelNameOrderedDesc = (await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'owner',
          orderBy: 'labelName',
          orderDirection: 'desc',
        })) as Name[]
        expect(labelNameOrderedDesc.map((n) => n.name[0])).toStrictEqual(
          domainLetterItems,
        )
      })
      it('ascending labelName', async () => {
        const labelNameOrderedAsc = (await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'owner',
          orderBy: 'labelName',
          orderDirection: 'asc',
        })) as Name[]
        expect(labelNameOrderedAsc.map((n) => n.name[0])).toStrictEqual(
          domainLetterItems.reverse(),
        )
      })
    })
  })

  describe('error', () => {
    beforeEach(() => {
      spyOnRequest.mockImplementation(() => ({
        _meta: {
          hasIndexingErrors: true,
          block: { number: 271 },
        },
        account: {
          domains: [makeName()],
          registrations: [makeName()],
          wrappedDomains: [makeName()],
        },
      }))
    })

    it('should throw an ENSJSError for type "all"', async () => {
      try {
        await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'all',
        })
      } catch (e) {
        if (e instanceof ENSJSError) {
          const error = e as ENSJSError<Name[]>
          expect(error.name).toBe('ENSJSSubgraphIndexingError')
          expect(error.data?.length).toBeTruthy()
          expect(error.timestamp).toBeTruthy()
        }
      }
    })

    it('should throw an ENSJSError for type "resolverAddress"', async () => {
      try {
        await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'resolvedAddress',
        })
      } catch (e) {
        if (e instanceof ENSJSError) {
          const error = e as ENSJSError<Name[]>
          expect(error.name).toBe('ENSJSSubgraphIndexingError')
          expect(error.data?.length).toBeTruthy()
          expect(error.timestamp).toBeTruthy()
        }
      }
    })

    it('should throw an ENSJSError for type "owner"', async () => {
      try {
        await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'owner',
        })
      } catch (e) {
        if (e instanceof ENSJSError) {
          const error = e as ENSJSError<Name[]>
          expect(error.name).toBe('ENSJSSubgraphIndexingError')
          expect(error.data?.length).toBeTruthy()
          expect(error.timestamp).toBeTruthy()
        }
      }
    })

    it('should throw an ENSJSError for type "wrappedOwner"', async () => {
      try {
        await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'wrappedOwner',
        })
      } catch (e) {
        if (e instanceof ENSJSError) {
          const error = e as ENSJSError<Name[]>
          expect(error.name).toBe('ENSJSSubgraphIndexingError')
          expect(error.data?.length).toBeTruthy()
          expect(error.timestamp).toBeTruthy()
        }
      }
    })

    it('should throw an ENSJSError for type "registrant"', async () => {
      try {
        await ensInstance.getNames({
          address: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
          type: 'registrant',
        })
      } catch (e) {
        if (e instanceof ENSJSError) {
          const error = e as ENSJSError<Name[]>
          expect(error.name).toBe('ENSJSSubgraphIndexingError')
          expect(error.data?.length).toBeTruthy()
          expect(error.timestamp).toBeTruthy()
        }
      }
    })
  })
})
