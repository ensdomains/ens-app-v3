import { ethers } from 'ethers'
import { ENS } from '..'
import setup from '../tests/setup'
import { randomSecret } from '../utils/registerHelpers'

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

describe('commitName', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should return a populated commit transaction with extra data and succeed', async () => {
    const { customData, ...popTx } =
      await ensInstance.commitName.populateTransaction('commitment.eth', {
        duration: 31536000,
        owner: accounts[1],
        addressOrIndex: accounts[1],
      })
    expect(popTx).toBeTruthy()
    expect(customData).toHaveProperty('secret')
    expect(customData).toHaveProperty('commitment')

    const tx = await provider.getSigner().sendTransaction(popTx)
    await tx.wait()

    const controller = await ensInstance.contracts!.getEthRegistrarController()!
    const commitment = await controller.commitments(customData!.commitment)
    expect(commitment).toBeTruthy()
  })
  it('should return a customised commmit transaction and succeed', async () => {
    const secret = randomSecret()
    const tx = await ensInstance.commitName('commitment.eth', {
      duration: 31536000,
      owner: accounts[1],
      addressOrIndex: accounts[1],
      secret,
    })
    await tx.wait()
    expect(tx.customData).toBeTruthy()
    expect(tx.customData!.secret).toBe(secret)

    const controller = await ensInstance.contracts!.getEthRegistrarController()!
    const commitment = await controller.commitments(tx.customData!.commitment)
    expect(commitment).toBeTruthy()
  })
})
