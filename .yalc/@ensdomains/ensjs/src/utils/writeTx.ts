import type { PopulatedTransaction } from '@ethersproject/contracts'
import type { JsonRpcSigner } from '@ethersproject/providers'

type CustomData = Record<string, any>

const withCustomData = <T extends object>(
  tx: T,
  customData: CustomData | undefined,
): (T & { customData: CustomData }) | T =>
  customData ? { ...tx, customData } : tx

export default (signer: JsonRpcSigner, populate: boolean) =>
  ({ customData, ...tx }: PopulatedTransaction) =>
    populate
      ? withCustomData(tx, customData)
      : signer.sendTransaction(tx).then((r) => withCustomData(r, customData))
