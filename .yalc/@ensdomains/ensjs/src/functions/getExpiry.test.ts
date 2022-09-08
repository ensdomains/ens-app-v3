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

describe('getExpiry', () => {
  it('should get the expiry for a .eth name with no other args', async () => {
    const result = await ENSInstance.getExpiry('with-profile.eth')
    expect(result).toBeTruthy()
    if (result) {
      const { expiry, gracePeriod } = result
      expect(expiry).toBeInstanceOf(Date)
      expect(gracePeriod).toBe(7776000000)
    }
  })
  it('should get the expiry for a wrapped name', async () => {
    const result = await ENSInstance.getExpiry('wrapped.eth', {
      contract: 'nameWrapper',
    })

    expect(result).toBeTruthy()
    if (result) {
      const { expiry, gracePeriod } = result
      expect(expiry).toBeInstanceOf(Date)
      expect(gracePeriod).toBe(null)
    }
  })
  it('should throw an error for a non .eth name if not wrapped', async () => {
    try {
      await ENSInstance.getExpiry('sub.with-profile.eth')
      expect(false).toBeTruthy()
    } catch {
      expect(true).toBeTruthy()
    }
  })
  it('should throw an error for a non .eth name if registrar is specified', async () => {
    try {
      await ENSInstance.getExpiry('sub.with-profile.eth', {
        contract: 'registrar',
      })
      expect(false).toBeTruthy()
    } catch {
      expect(true).toBeTruthy()
    }
  })
})
