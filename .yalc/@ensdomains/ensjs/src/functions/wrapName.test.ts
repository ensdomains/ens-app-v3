import { BigNumber, ethers } from 'ethers'
import { ENS } from '..'
import setup from '../tests/setup'
import { hexEncodeName } from '../utils/hexEncodedName'
import { namehash } from '../utils/normalise'

let ENSInstance: ENS
let revert: Awaited<ReturnType<typeof setup>>['revert']
let createSnapshot: Awaited<ReturnType<typeof setup>>['createSnapshot']
let provider: ethers.providers.JsonRpcProvider
let accounts: string[]

beforeAll(async () => {
  ;({ ENSInstance, revert, createSnapshot, provider } = await setup())
  accounts = await provider.listAccounts()
})

afterAll(async () => {
  await revert()
})

describe('wrapName', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should return a wrap name transaction and succeed', async () => {
    const tx = await ENSInstance.wrapName('parthtejpal.eth', {
      wrappedOwner: accounts[0],
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const nameWrapper = await ENSInstance.contracts!.getNameWrapper()!
    const [result] = await nameWrapper.getFuses(namehash('parthtejpal.eth'))
    expect((result as BigNumber).toHexString()).toBe('0x40')
  })
  it('should allow initial fuses', async () => {
    const tx = await ENSInstance.wrapName('parthtejpal.eth', {
      wrappedOwner: accounts[0],
      fuseOptions: {
        cannotUnwrap: true,
        cannotSetTtl: true,
      },
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const nameWrapper = await ENSInstance.contracts!.getNameWrapper()!
    const [result] = await nameWrapper.getFuses(namehash('parthtejpal.eth'))
    expect((result as BigNumber).toHexString()).toBe('0x40')
  })
  it('should allow an initial resolver address', async () => {
    const tx = await ENSInstance.wrapName('parthtejpal.eth', {
      wrappedOwner: accounts[0],
      resolverAddress: '0x42D63ae25990889E35F215bC95884039Ba354115',
    })
    expect(tx).toBeTruthy()
    await tx.wait()

    const universalResolver =
      await ENSInstance.contracts!.getUniversalResolver()!
    const [result] = await universalResolver.findResolver(
      hexEncodeName('parthtejpal.eth'),
    )
    expect(result).toBe('0x42D63ae25990889E35F215bC95884039Ba354115')
  })
})
