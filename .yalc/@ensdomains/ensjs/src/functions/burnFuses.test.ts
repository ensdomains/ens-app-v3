import { BigNumber, ethers } from 'ethers'
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

describe('burnFuses', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should return a burnFuses transaction and succeed', async () => {
    const wrapNameTx = await ENSInstance.wrapName(
      'parthtejpal.eth',
      accounts[0],
    )
    await wrapNameTx.wait()

    const tx = await ENSInstance.burnFuses('parthtejpal.eth', {
      cannotUnwrap: true,
      cannotCreateSubdomain: true,
      cannotSetTtl: true,
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const nameWrapper = await ENSInstance.contracts!.getNameWrapper()!
    const result = await nameWrapper.getFuses(namehash('parthtejpal.eth'))
    const fuseBN = result.fuses as BigNumber
    expect(fuseBN.toHexString()).toBe('0x71')
  })
})
