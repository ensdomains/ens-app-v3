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

describe('getPrice', () => {
  it('should return a base and premium price for an address', async () => {
    const {base, premium} = (await ENSInstance.getPrice('test123', 86400, false))!
    expect(base.toNumber()).toBe(86400)
    expect(premium.toNumber()).toBe(0)    
  })

  it('should return a base and premium price for an address in legacy mode', async () => {
    const {base, premium} = (await ENSInstance.getPrice('test123', 86400, true))!  
    expect(base.toNumber()).toBe(86400)
    expect(premium.toNumber()).toBe(0)    
  })

  it('should return a base and premium price for an array of names', async () => {
    const {base, premium} = (await ENSInstance.getPrice(['test123', 'to-be-renewed'], 86400, false))!
    expect(base.toNumber()).toBe(86400 * 2)
    expect(premium.toNumber()).toBe(0)    
  })
})
