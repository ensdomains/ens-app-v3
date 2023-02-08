import { ethers } from 'ethers'
import { ENS } from '..'
import setup from '../tests/setup'
import { labelhash } from '../utils/labels'

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

describe('renewNames', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should return a renew transaction and succeed', async () => {
    const name = 'to-be-renewed.eth'
    const label = name.split('.')[0]
    const duration = 31536000
    const baseRegistrar = await ensInstance.contracts!.getBaseRegistrar()!
    const oldExpiry = await baseRegistrar.nameExpires(labelhash(label))

    const controller = await ensInstance.contracts!.getEthRegistrarController()!
    const [price] = await controller.rentPrice(label, duration)

    const tx = await ensInstance.renewNames(name, {
      value: price.mul(2),
      duration,
      addressOrIndex: accounts[0],
    })
    await tx.wait()

    const newExpiry = await baseRegistrar.nameExpires(labelhash(label))
    expect(newExpiry.toNumber()).toBe(oldExpiry.add(31536000).toNumber())
  })

  it('should return a renew transaction and succeed', async () => {
    const names = ['to-be-renewed.eth', 'test123.eth']
    const label = names[0].split('.')[0]
    const duration = 31536000
    const baseRegistrar = await ensInstance.contracts!.getBaseRegistrar()!
    const oldExpiry = await baseRegistrar.nameExpires(labelhash(label))
    const bulkRenewal = await ensInstance.contracts!.getBulkRenewal()!
    const price = await bulkRenewal.rentPrice(names, duration)

    const tx = await ensInstance.renewNames(names, {
      value: price.mul(4),
      duration,
      addressOrIndex: accounts[1],
    })
    await tx.wait()

    const newExpiry = await baseRegistrar.nameExpires(labelhash(label))
    expect(newExpiry.toNumber()).toBe(oldExpiry.add(31536000).toNumber())
  })
})
