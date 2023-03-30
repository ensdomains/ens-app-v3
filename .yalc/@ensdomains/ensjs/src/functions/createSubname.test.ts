import { ethers } from 'ethers'
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

describe('createSubname', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should allow creating a subname on the registry', async () => {
    const tx = await ensInstance.createSubname('test.test123.eth', {
      contract: 'registry',
      owner: accounts[0],
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const registry = await ensInstance.contracts!.getRegistry()!
    const result = await registry.owner(namehash('test.test123.eth'))
    expect(result).toBe(accounts[0])
  })
  it('should allow creating a subname on the namewrapper', async () => {
    const tx = await ensInstance.createSubname('test.wrapped.eth', {
      contract: 'nameWrapper',
      owner: accounts[0],
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const nameWrapper = await ensInstance.contracts!.getNameWrapper()!
    const result = await nameWrapper.ownerOf(namehash('test.wrapped.eth'))
    expect(result).toBe(accounts[0])
  })
})
