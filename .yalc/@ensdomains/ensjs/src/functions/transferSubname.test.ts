import { ethers } from 'ethers'
import { ENS } from '..'
import setup from '../tests/setup'
import { namehash } from '../utils/normalise'

let ENSInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let provider: ethers.providers.JsonRpcProvider
let accounts: string[]

beforeAll(async () => {
  ;({ ENSInstance, revert, provider } = await setup())
  accounts = await provider.listAccounts()
})

afterAll(async () => {
  await revert()
})

describe('transferSubname', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should allow transferring a subname on the registry', async () => {
    const createSubnameTx = await ENSInstance.createSubname(
      'test.parthtejpal.eth',
      {
        contract: 'registry',
        owner: accounts[0],
        addressOrIndex: 0,
      },
    )
    await createSubnameTx.wait()

    const tx = await ENSInstance.transferSubname('test.parthtejpal.eth', {
      contract: 'registry',
      address: accounts[1],
      addressOrIndex: 0,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const registry = await ENSInstance.contracts!.getRegistry()!
    const result = await registry.owner(namehash('test.parthtejpal.eth'))
    expect(result).toBe(accounts[1])
  })
  it('should allow transferring a subname on the nameWrapper', async () => {
    const wrapNameTx = await ENSInstance.wrapName('parthtejpal.eth', {
      wrappedOwner: accounts[0],
    })
    await wrapNameTx.wait()
    const createSubnameTx = await ENSInstance.createSubname(
      'test.parthtejpal.eth',
      {
        contract: 'nameWrapper',
        owner: accounts[0],
        addressOrIndex: 0,
      },
    )
    await createSubnameTx.wait()

    const tx = await ENSInstance.transferSubname('test.parthtejpal.eth', {
      contract: 'nameWrapper',
      address: accounts[1],
      addressOrIndex: 0,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const nameWrapper = await ENSInstance.contracts!.getNameWrapper()!
    const result = await nameWrapper.ownerOf(namehash('test.parthtejpal.eth'))
    expect(result).toBe(accounts[1])
  })
})
