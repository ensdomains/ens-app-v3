import { BigNumber } from 'ethers'
import { ENS } from '..'
import setup from '../tests/setup'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let createSnapshot: Awaited<ReturnType<typeof setup>>['createSnapshot']
let withWrappedSnapshot: any

const unwrappedNameDefault = {
  expiryDate: new Date(0).toString(),
  fuseObj: {
    CANNOT_BURN_FUSES: false,
    CANNOT_CREATE_SUBDOMAIN: false,
    CANNOT_SET_RESOLVER: false,
    CANNOT_SET_TTL: false,
    CANNOT_TRANSFER: false,
    CANNOT_UNWRAP: false,
    PARENT_CANNOT_CONTROL: false,
    CAN_DO_EVERYTHING: true,
  },
  owner: '0x0000000000000000000000000000000000000000',
  rawFuses: BigNumber.from(0),
}

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

describe('getFuses', () => {
  it('should return default data for an unwrapped name', async () => {
    const result = await ensInstance.getFuses('with-profile.eth')
    expect({ ...result, expiryDate: result?.expiryDate.toString() }).toEqual(
      unwrappedNameDefault,
    )
  })
  it('should return with CAN_DO_EVERYTHING set to true for a name with no fuses burned', async () => {
    const result = await ensInstance.getFuses('test.wrapped-with-subnames.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result.fuseObj.CAN_DO_EVERYTHING).toBe(true)
      expect(
        Object.values(result.fuseObj).reduce(
          (prev, curr) => (curr ? prev + 1 : prev),
          0,
        ),
      ).toBe(1)
      expect(result.rawFuses.toHexString()).toBe('0x00')
    }
  })
  it('should return with other correct fuses', async () => {
    const tx = await ensInstance.burnFuses('wrapped.eth', {
      namedFusesToBurn: [
        'CANNOT_UNWRAP',
        'CANNOT_CREATE_SUBDOMAIN',
        'CANNOT_SET_TTL',
      ],
      addressOrIndex: 1,
    })
    await tx.wait()

    const result = await ensInstance.getFuses('wrapped.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result.fuseObj).toMatchObject({
        CANNOT_UNWRAP: true,
        CANNOT_BURN_FUSES: false,
        CANNOT_TRANSFER: false,
        CANNOT_SET_RESOLVER: false,
        CANNOT_SET_TTL: true,
        CANNOT_CREATE_SUBDOMAIN: true,
        PARENT_CANNOT_CONTROL: true,
        CAN_DO_EVERYTHING: false,
      })
      expect(result.rawFuses.toHexString()).toBe('0x71')
    }
  })
  it('should return correct expiry', async () => {
    const result = await ensInstance.getFuses('wrapped.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result.expiryDate).toBeInstanceOf(Date)
    }
  })
})
