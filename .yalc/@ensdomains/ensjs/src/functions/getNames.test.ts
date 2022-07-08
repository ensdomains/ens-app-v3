import { ENS } from '..'
import { OwnedName, Registration } from '../functions/getNames'
import setup from '../tests/setup'

let ENSInstance: ENS

beforeAll(async () => {
  ;({ ENSInstance } = await setup())
})

const testProperties = (obj: object, ...properties: string[]) =>
  properties.map((property) => expect(obj).toHaveProperty(property))

const testNotProperties = (obj: object, ...properties: string[]) =>
  properties.map((property) => expect(obj).not.toHaveProperty(property))

describe('getNames', () => {
  let totalRegistrations: number = 0
  let totalOwnedNames: number = 0
  it('should get the registrations for an address', async () => {
    const result = await ENSInstance.getNames({
      address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
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
    const result = await ENSInstance.getNames({
      address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
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
  it('should get the registrations for an address with pagination', async () => {
    const pageOne = await ENSInstance.getNames({
      address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
      type: 'registrant',
      page: 0,
    })
    expect(pageOne).toHaveLength(10)
    const pageTwo = await ENSInstance.getNames({
      address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
      type: 'registrant',
      page: 1,
    })
    expect(pageTwo).toHaveLength(totalRegistrations % 10)
  })
  it('should get the owned names for an address with pagination', async () => {
    const pageOne = await ENSInstance.getNames({
      address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
      type: 'owner',
      page: 0,
    })
    expect(pageOne).toHaveLength(10)
    const pageTwo = await ENSInstance.getNames({
      address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
      type: 'owner',
      page: 1,
    })
    expect(pageTwo).toHaveLength(10)
    const pageThree = await ENSInstance.getNames({
      address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
      type: 'owner',
      page: 2,
    })
    expect(pageThree).toHaveLength(10)
    const pageFour = await ENSInstance.getNames({
      address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
      type: 'owner',
      page: 3,
    })
    expect(pageFour).toHaveLength(totalOwnedNames % 10)
  })
  describe('orderBy', () => {
    describe('registrations', () => {
      it('descending registrationDate', async () => {
        const registrationDateOrderedDesc = (await ENSInstance.getNames({
          address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
          type: 'registrant',
          orderBy: 'registrationDate',
          orderDirection: 'desc',
        })) as Registration[]
        registrationDateOrderedDesc.reduce((prev, curr) => {
          expect(prev.registrationDate.getTime()).toBeGreaterThanOrEqual(
            curr.registrationDate.getTime(),
          )
          return curr
        })
      })
      it('ascending registrationDate', async () => {
        const registrationDateOrderedAsc = (await ENSInstance.getNames({
          address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
          type: 'registrant',
          orderBy: 'registrationDate',
          orderDirection: 'asc',
        })) as Registration[]
        registrationDateOrderedAsc.reduce((prev, curr) => {
          expect(prev.registrationDate.getTime()).toBeLessThanOrEqual(
            curr.registrationDate.getTime(),
          )
          return curr
        })
      })
      it('descending expiryDate', async () => {
        const expiryDateOrderedDesc = (await ENSInstance.getNames({
          address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
          type: 'registrant',
          orderBy: 'expiryDate',
          orderDirection: 'desc',
        })) as Registration[]
        expiryDateOrderedDesc.reduce((prev, curr) => {
          expect(prev.expiryDate.getTime()).toBeGreaterThanOrEqual(
            curr.expiryDate.getTime(),
          )
          return curr
        })
      })
      it('ascending expiryDate', async () => {
        const expiryDateOrderedAsc = (await ENSInstance.getNames({
          address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
          type: 'registrant',
          orderBy: 'expiryDate',
          orderDirection: 'asc',
        })) as Registration[]
        expiryDateOrderedAsc.reduce((prev, curr) => {
          expect(prev.expiryDate.getTime()).toBeLessThanOrEqual(
            curr.expiryDate.getTime(),
          )
          return curr
        })
      })
      it('descending labelName', async () => {
        const labelNameOrderedDesc = (await ENSInstance.getNames({
          address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
          type: 'registrant',
          orderBy: 'labelName',
          orderDirection: 'desc',
        })) as Registration[]
        labelNameOrderedDesc.reduce((prev, curr) => {
          expect((prev.labelName || '') > (curr.labelName || '')).toBeTruthy()
          return curr
        })
      })
      it('ascending labelName', async () => {
        const labelNameOrderedAsc = (await ENSInstance.getNames({
          address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
          type: 'registrant',
          orderBy: 'labelName',
          orderDirection: 'asc',
        })) as Registration[]
        labelNameOrderedAsc.reduce((prev, curr) => {
          expect((prev.labelName || '') < (curr.labelName || '')).toBeTruthy()
          return curr
        })
      })
    })
    describe('owned names', () => {
      it('descending createdAt', async () => {
        const createdAtOrderedDesc = (await ENSInstance.getNames({
          address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
          type: 'owner',
          orderBy: 'createdAt',
          orderDirection: 'desc',
        })) as OwnedName[]
        createdAtOrderedDesc.reduce((prev, curr) => {
          expect(prev.createdAt.getTime()).toBeGreaterThanOrEqual(
            curr.createdAt.getTime(),
          )
          return curr
        })
      })
      it('ascending createdAt', async () => {
        const createdAtOrderedAsc = (await ENSInstance.getNames({
          address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
          type: 'owner',
          orderBy: 'createdAt',
          orderDirection: 'asc',
        })) as OwnedName[]
        createdAtOrderedAsc.reduce((prev, curr) => {
          expect(prev.createdAt.getTime()).toBeLessThanOrEqual(
            curr.createdAt.getTime(),
          )
          return curr
        })
      })
      it('descending labelName', async () => {
        const labelNameOrderedDesc = (await ENSInstance.getNames({
          address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
          type: 'owner',
          orderBy: 'labelName',
          orderDirection: 'desc',
        })) as Registration[]
        labelNameOrderedDesc.reduce((prev, curr) => {
          if (
            (!prev.labelName && !curr.labelName) ||
            (!prev.labelName && curr.labelName)
          )
            return curr
          expect((prev.labelName || '') > (curr.labelName || '')).toBeTruthy()
          return curr
        })
      })
      it('ascending labelName', async () => {
        const labelNameOrderedAsc = (await ENSInstance.getNames({
          address: '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
          type: 'owner',
          orderBy: 'labelName',
          orderDirection: 'asc',
        })) as Registration[]
        labelNameOrderedAsc.reduce((prev, curr) => {
          if (
            (!prev.labelName && !curr.labelName) ||
            (prev.labelName && !curr.labelName)
          )
            return curr
          expect((prev.labelName || '') < (curr.labelName || '')).toBeTruthy()
          return curr
        })
      })
    })
  })
})
