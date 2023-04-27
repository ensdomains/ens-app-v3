import { ENS } from '../index'
import setup from '../tests/setup'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let createSnapshot: Awaited<ReturnType<typeof setup>>['createSnapshot']
let withWrappedSnapshot: any

beforeAll(async () => {
  ;({ ensInstance, revert, createSnapshot } = await setup())

  withWrappedSnapshot = await createSnapshot()
})

afterEach(async () => {
  await revert(withWrappedSnapshot)
  withWrappedSnapshot = await createSnapshot()
})

afterAll(async () => {
  await revert()
})

describe('getWrapperData', () => {
  it('should return default data for an unwrapped name', async () => {
    const result = await ensInstance.getWrapperData('with-profile.eth')
    expect(result?.expiryDate).toBeUndefined()
    expect(result?.rawFuses).toEqual(0)
    expect(result?.child.CAN_DO_EVERYTHING).toBeTruthy()
  })
  it('should return with CAN_DO_EVERYTHING set to true for a name with no fuses burned', async () => {
    const result = await ensInstance.getWrapperData(
      'test.wrapped-with-subnames.eth',
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result.child.CAN_DO_EVERYTHING).toBe(true)
      expect(result.rawFuses).toBe(0)
    }
  })
  it('should return with other correct fuses', async () => {
    const tx = await ensInstance.setFuses('wrapped.eth', {
      named: [
        'CANNOT_UNWRAP',
        'CANNOT_CREATE_SUBDOMAIN',
        'CANNOT_SET_TTL',
        'CANNOT_APPROVE',
      ],
      addressOrIndex: 1,
    })
    await tx.wait()

    const result = await ensInstance.getWrapperData('wrapped.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result.child.CAN_DO_EVERYTHING).toBe(false)
      expect(result.child.CANNOT_UNWRAP).toBe(true)
      expect(result.child.CANNOT_CREATE_SUBDOMAIN).toBe(true)
      expect(result.child.CANNOT_SET_TTL).toBe(true)
      expect(result.child.CANNOT_APPROVE).toBe(true)
      expect(result.parent.IS_DOT_ETH).toBe(true)
    }
  })
  it('should return correct expiry', async () => {
    const result = await ensInstance.getWrapperData('wrapped.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result.expiryDate).toBeInstanceOf(Date)
      expect(Number.isNaN(result.expiryDate?.getTime())).toBe(false)
    }
  })
  it('should return correct expiry for large expiry', async () => {
    const result = await ensInstance.getWrapperData('wrapped-big-duration.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result.expiryDate).toBeInstanceOf(Date)
      expect(result.expiryDate!.getFullYear()).toBe(275760)
      expect(Number.isNaN(result.expiryDate?.getTime())).toBe(false)
    }
  })
  it('should return correct max expiry for expiry larger than maximum for date', async () => {
    const result = await ensInstance.getWrapperData('wrapped-max-duration.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result.expiryDate).toBeInstanceOf(Date)
      expect(result.expiryDate!.getFullYear()).toBe(275760)
      expect(Number.isNaN(result.expiryDate?.getTime())).toBe(false)
    }
  })
})
