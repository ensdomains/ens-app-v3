import { ethers } from 'ethers'
import { ENS } from '..'
import setup from '../tests/setup'

let ENSInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let createSnapshot: Awaited<ReturnType<typeof setup>>['createSnapshot']
let provider: ethers.providers.JsonRpcProvider
let accounts: string[]
let withWrappedSnapshot: any

beforeAll(async () => {
  ;({ ENSInstance, revert, provider, createSnapshot } = await setup())
  accounts = await provider.listAccounts()

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
  it('should return null for an unwrapped name', async () => {
    const result = await ENSInstance.getFuses('with-profile.eth')
    expect(result).toBeUndefined()
  })
  it('should return with canDoEverything set to true for a name with no fuses burned', async () => {
    const nameWrapper = await ENSInstance.contracts!.getNameWrapper()!
    const result = await ENSInstance.getFuses('test.wrapped-with-subnames.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result.fuseObj.canDoEverything).toBe(true)
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
    const tx = await ENSInstance.burnFuses('wrapped.eth', {
      fusesToBurn: {
        cannotUnwrap: true,
        cannotSetTtl: true,
        cannotCreateSubdomain: true,
      },
      addressOrIndex: 1,
    })
    await tx.wait()

    const result = await ENSInstance.getFuses('wrapped.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result.fuseObj).toMatchObject({
        cannotUnwrap: true,
        cannotBurnFuses: false,
        cannotTransfer: false,
        cannotSetResolver: false,
        cannotSetTtl: true,
        cannotCreateSubdomain: true,
        parentCannotControl: true,
        canDoEverything: false,
      })
      expect(result.rawFuses.toHexString()).toBe('0x71')
    }
  })
  it('should return correct expiry', async () => {
    const result = await ENSInstance.getFuses('wrapped.eth')
    expect(result).toBeTruthy()
    if (result) {
      expect(result.expiryDate).toBeInstanceOf(Date)
    }
  })
})
