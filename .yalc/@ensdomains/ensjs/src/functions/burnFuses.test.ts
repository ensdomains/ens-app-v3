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

describe('burnFuses', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should return a burnFuses transaction and succeed', async () => {
    const tx = await ENSInstance.burnFuses('wrapped.eth', {
      fusesToBurn: ['CANNOT_UNWRAP', 'CANNOT_CREATE_SUBDOMAIN', 'CANNOT_SET_TTL'],
      addressOrIndex: accounts[1],
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const nameWrapper = await ENSInstance.contracts!.getNameWrapper()!
    const [fuses] = await nameWrapper.getFuses(namehash('wrapped.eth'))
    expect(fuses).toBe(113)
  })
})
