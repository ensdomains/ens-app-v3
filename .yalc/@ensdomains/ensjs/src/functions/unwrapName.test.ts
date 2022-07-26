import { ethers, utils } from 'ethers'
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

describe('unwrapName', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should return a .eth unwrap name transaction and succeed', async () => {
    const wrapNameTx = await ENSInstance.wrapName('parthtejpal.eth', {
      wrappedOwner: accounts[0],
    })
    await wrapNameTx.wait()

    const tx = await ENSInstance.unwrapName('parthtejpal.eth', {
      newController: accounts[0],
      newRegistrant: accounts[0],
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const baseRegistrar = await ENSInstance.contracts!.getBaseRegistrar()!
    const result = await baseRegistrar.ownerOf(
      utils.solidityKeccak256(['string'], ['parthtejpal']),
    )
    expect(result).toBe(accounts[0])
  })
  it('should return a regular unwrap name transaction and succeed', async () => {
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

    const tx = await ENSInstance.unwrapName('test.parthtejpal.eth', {
      newController: accounts[0],
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const registry = await ENSInstance.contracts!.getRegistry()!
    const result = await registry.owner(namehash('test.parthtejpal.eth'))
    expect(result).toBe(accounts[0])
  })
})
