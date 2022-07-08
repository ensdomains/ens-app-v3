import { ethers } from 'ethers'
import { ENS } from '..'
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

describe('getName', () => {
  it('should get a primary name from an address', async () => {
    const result = await ENSInstance.getName(
      '0x866B3c4994e1416B7C738B9818b31dC246b95eEE',
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result.name).toBe('jefflau.eth')
      expect(result.match).toBeTruthy()
    }
  })
  it('should return null for an address with no primary name', async () => {
    const result = await ENSInstance.getName(
      '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0',
    )
    expect(result).toBeUndefined()
  })
  it('should return with a false match for a name with no forward resolution', async () => {
    const tx = await ENSInstance.setName('jefflau.eth')
    await tx?.wait()

    const result = await ENSInstance.getName(accounts[0])
    expect(result).toBeTruthy()
    if (result) {
      expect(result.name).toBe('jefflau.eth')
      expect(result.match).toBeFalsy()
    }
  })
})
