import { ethers, BigNumber } from 'ethers'
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

describe.only('setFuses', () => {
  beforeEach(async () => {
    await revert()
  })
  it('should set fuses sucessfully', async () => {
    const signer = provider.getSigner(0) 
    const populatedTransaction = await ENSInstance.setFuses.populateTransaction(
        'wrapped.eth', 
        { selectedFuses: ['CANNOT_UNWRAP', 'CANNOT_BURN_FUSES'], signer }
    )
    populatedTransaction.gasLimit = BigNumber.from(10000000) 
    expect(populatedTransaction).toBeTruthy()
    await signer.sendTransaction(
        populatedTransaction,
      )
    const result = await ENSInstance.getFuses('wrapped.eth')
      expect(
        Object.values(result!.fuseObj).reduce(
          (prev, current) => prev + (current ? 1 : 0),
          0,
        ),
      ).toBe(4)
  })
})
