import { ethers, utils } from 'ethers'
import { ENS } from '..'
import setup from '../tests/setup'
import { namehash } from '../utils/normalise'

let ensInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let provider: ethers.providers.JsonRpcProvider
let accounts: string[]

beforeAll(async () => {
  ;({ ensInstance, revert, provider } = await setup())
  accounts = await provider.listAccounts()
})

afterAll(async () => {
  await revert()
})

describe('transferName', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should allow a transfer on the registrar', async () => {
    const tx = await ensInstance.transferName('test123.eth', {
      contract: 'baseRegistrar',
      newOwner: accounts[2],
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const baseRegistrar = await ensInstance.contracts!.getBaseRegistrar()!
    const result = await baseRegistrar.ownerOf(
      utils.solidityKeccak256(['string'], ['test123']),
    )
    expect(result).toBe(accounts[2])
  })
  it('should allow a transfer on the namewrapper', async () => {
    const tx = await ensInstance.transferName('wrapped.eth', {
      newOwner: accounts[2],
      contract: 'nameWrapper',
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const nameWrapper = await ensInstance.contracts!.getNameWrapper()!
    const result = await nameWrapper.ownerOf(namehash('wrapped.eth'))
    expect(result).toBe(accounts[2])
  })
  it('should allow a transfer on the registry', async () => {
    const tx = await ensInstance.transferName('test.with-subnames.eth', {
      newOwner: accounts[1],
      contract: 'registry',
      addressOrIndex: accounts[2],
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const registry = await ensInstance.contracts!.getRegistry()!
    const result = await registry.owner(namehash('test.with-subnames.eth'))
    expect(result).toBe(accounts[1])
  })
})
