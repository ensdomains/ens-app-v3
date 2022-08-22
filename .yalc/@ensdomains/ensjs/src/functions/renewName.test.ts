import { ethers } from 'ethers'
import { ENS } from '..'
import setup from '../tests/setup'
import { labelhash } from '../utils/labels'

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

describe('registerName', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should return a renew transaction and succeed', async () => {
    const name = 'to-be-renewed.eth'
    const label = name.split('.')[0]
    const duration = 31536000
    const baseRegistrar = await ENSInstance.contracts!.getBaseRegistrar()!
    const oldExpiry = await baseRegistrar.nameExpires(labelhash(label))

    const controller = await ENSInstance.contracts!.getEthRegistrarController()!
    const [price] = await controller.rentPrice(label, duration)

    const tx = await ENSInstance.renewName(name, {
      value: price.mul(2),
      duration,
      addressOrIndex: accounts[1],
    })
    await tx.wait()

    const newExpiry = await baseRegistrar.nameExpires(labelhash(label))
    expect(newExpiry.toNumber()).toBe(oldExpiry.add(31536000).toNumber())
  })
})
