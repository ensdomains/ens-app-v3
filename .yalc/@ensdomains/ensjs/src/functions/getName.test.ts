import { ethers } from 'ethers'
import { ENS } from '..'
import setup from '../tests/setup'

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

describe('getName', () => {
  it('should get a primary name from an address', async () => {
    const result = await ensInstance.getName(
      '0x3C44CdDdB6a900fa2b585dd299e03d12FA4293BC',
    )
    expect(result).toBeTruthy()
    if (result) {
      expect(result.name).toBe('with-profile.eth')
      expect(result.match).toBeTruthy()
    }
  })
  it('should return null for an address with no primary name', async () => {
    const result = await ensInstance.getName(
      '0x8c5be1e5ebec7d5bd14f71427d1e84f3dd0314c0',
    )
    expect(result?.name).toBeUndefined()
  })
  it('should return with a false match for a name with no forward resolution', async () => {
    const tx = await ensInstance.setName('with-profile.eth')
    await tx?.wait()

    const result = await ensInstance.getName(accounts[0])
    expect(result).toBeTruthy()
    if (result) {
      expect(result.name).toBe('with-profile.eth')
      expect(result.match).toBeFalsy()
    }
  })
})
