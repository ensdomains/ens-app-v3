import { ethers, utils } from 'ethers'
import { ENS } from '..'
import { namehash } from '../utils/normalise'
import setup from '../tests/setup'

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

describe('transferName', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should allow a transfer on the registrar', async () => {
    const tx = await ENSInstance.transferName(
      'parthtejpal.eth',
      accounts[1],
      'baseRegistrar',
      { addressOrIndex: 0 },
    )
    expect(tx).toBeTruthy()
    await tx.wait()

    const baseRegistrar = await ENSInstance.contracts!.getBaseRegistrar()!
    const result = await baseRegistrar.ownerOf(
      utils.solidityKeccak256(['string'], ['parthtejpal']),
    )
    expect(result).toBe(accounts[1])
  })
  it('should allow a transfer on the namewrapper', async () => {
    const wrapNameTx = await ENSInstance.wrapName(
      'parthtejpal.eth',
      accounts[0],
    )
    await wrapNameTx.wait()
    const tx = await ENSInstance.transferName(
      'parthtejpal.eth',
      accounts[1],
      'nameWrapper',
      { addressOrIndex: 0 },
    )
    expect(tx).toBeTruthy()
    await tx.wait()

    const nameWrapper = await ENSInstance.contracts!.getNameWrapper()!
    const result = await nameWrapper.ownerOf(namehash('parthtejpal.eth'))
    expect(result).toBe(accounts[1])
  })
  it('should allow a transfer on the registry', async () => {
    const createSubnameTx = await ENSInstance.createSubname({
      name: 'test.parthtejpal.eth',
      contract: 'registry',
      owner: accounts[0],
      options: { addressOrIndex: accounts[0] },
    })
    await createSubnameTx.wait()

    const tx = await ENSInstance.transferName(
      'test.parthtejpal.eth',
      accounts[1],
      'registry',
      { addressOrIndex: accounts[0] },
    )
    expect(tx).toBeTruthy()
    await tx.wait()

    const registry = await ENSInstance.contracts!.getRegistry()!
    const result = await registry.owner(namehash('test.parthtejpal.eth'))
    expect(result).toBe(accounts[1])
  })
})
