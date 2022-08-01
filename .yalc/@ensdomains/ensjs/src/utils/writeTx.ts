import { JsonRpcSigner } from '@ethersproject/providers'
import type { PopulatedTransaction } from 'ethers'

export default (signer: JsonRpcSigner, populate: boolean) =>
  (tx: PopulatedTransaction) =>
    populate ? tx : signer.sendTransaction(tx)
