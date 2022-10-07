import { ENS } from '..'
import setup from '../tests/setup'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']

beforeAll(async () => {
  ;({ ensInstance, revert } = await setup())
})

afterAll(async () => {
  await revert()
})

describe('getOwner', () => {
  it('should return null for an unregistered name', async () => {
    const result = await ensInstance.getOwner('test123123cool.eth')
    expect(result).toBeUndefined()
  })
  it('should return the owner, registrant, and ownership level for a registered name', async () => {
    const result = await ensInstance.getOwner('with-profile.eth')
    expect(result).toMatchObject({
      owner: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      registrant: '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
      ownershipLevel: 'registrar',
    })
  })
  it('should return nameWrapper as the ownership level for a wrapped name', async () => {
    const result = await ensInstance.getOwner('wrapped.eth')
    expect(result?.ownershipLevel).toBe('nameWrapper')
  })
  it('should return the owner at a specific level if specified', async () => {
    const result = await ensInstance.getOwner('wrapped.eth', 'registrar')
    const nameWrapperAddress = (await ensInstance.contracts!.getNameWrapper())
      .address
    expect(result?.ownershipLevel).toBe('registrar')
    expect(result?.registrant).toBe(nameWrapperAddress)
  })
  it('should return the owner of a TLD on the registry', async () => {
    const result = await ensInstance.getOwner('eth')
    const baseRegistrarAddress = (
      await ensInstance.contracts!.getBaseRegistrar()
    ).address
    expect(result?.ownershipLevel).toBe('registry')
    expect(result?.owner?.toLowerCase()).toBe(
      baseRegistrarAddress.toLowerCase(),
    )
  })
  it('should return registry as the ownership level for an unwrapped subname', async () => {
    const result = await ensInstance.getOwner('test.with-subnames.eth')
    expect(result?.ownershipLevel).toBe('registry')
    expect(result?.owner).toBe('0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC')
  })
  it('should return registry ownership for a pseudo-wrapped name', async () => {
    const nameWrapper = await ensInstance.contracts!.getNameWrapper()
    const tx = await ensInstance.transferSubname('test.with-subnames.eth', {
      contract: 'registry',
      owner: nameWrapper.address,
      addressOrIndex: 1,
    })
    await tx.wait()

    const result = await ensInstance.getOwner('test.with-subnames.eth')
    expect(result?.ownershipLevel).toBe('registry')
    expect(result?.owner).toBe(nameWrapper.address)
  })
})
