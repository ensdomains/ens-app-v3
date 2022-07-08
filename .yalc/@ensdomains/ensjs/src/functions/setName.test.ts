import { ethers } from 'ethers'
import { ENS } from '..'
import { hexEncodeName } from '../utils/hexEncodedName'
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

describe('setName', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should return a transaction for a name and set successfully', async () => {
    const tx = await ENSInstance.setName('fleek.eth')
    expect(tx).toBeTruthy()
    await tx?.wait()

    const universalResolver =
      await ENSInstance.contracts!.getUniversalResolver()!
    const reverseNode = accounts[0].toLowerCase().substring(2) + '.addr.reverse'
    const result = await universalResolver.reverse(hexEncodeName(reverseNode))
    expect(result[0]).toBe('fleek.eth')
  })
  it("should return a transaction for setting another address' name", async () => {
    jest.setTimeout(20000)
    const registry = (await ENSInstance.contracts!.getRegistry()!).connect(
      provider.getSigner(),
    )
    const setApprovedForAllTx = await registry.setApprovalForAll(
      accounts[1],
      true,
    )
    await setApprovedForAllTx?.wait()

    const tx = await ENSInstance.setName('fleek.eth', accounts[0], undefined, {
      addressOrIndex: 1,
    })
    expect(tx).toBeTruthy()
    await tx?.wait()

    const universalResolver =
      await ENSInstance.contracts!.getUniversalResolver()!
    const reverseNode = accounts[0].toLowerCase().substring(2) + '.addr.reverse'
    const result = await universalResolver.reverse(hexEncodeName(reverseNode))
    expect(result[0]).toBe('fleek.eth')
  })
})
