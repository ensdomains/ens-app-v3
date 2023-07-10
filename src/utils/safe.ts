import { Connector } from 'wagmi'
import { SafeConnector } from 'wagmi/connectors/safe'
import { WalletConnectConnector } from 'wagmi/connectors/walletConnect'

export const SAFE_ENDPOINT = 'https://safe-client.safe.global'

const checkIsWcConnector = (c: Connector | undefined): c is WalletConnectConnector =>
  c instanceof WalletConnectConnector
const checkIsSafeConnector = (c: Connector | undefined): c is SafeConnector =>
  c instanceof SafeConnector

export type SafeAppType = 'iframe' | 'walletconnect'

export const checkIsSafeApp = async (
  connector: Connector | undefined,
): Promise<false | SafeAppType> => {
  const isWcConnector = checkIsWcConnector(connector)
  const isSafeConnector = checkIsSafeConnector(connector)

  if (!isWcConnector && !isSafeConnector) return false

  if (isSafeConnector) return 'iframe'

  const connectorProvider = await connector.getProvider()
  const { session } = connectorProvider
  if (!session) return false

  const { name, url } = session.peer.metadata
  if (name.startsWith('Safe') && url === 'https://app.safe.global/') return 'walletconnect'

  return false
}

type SafeTx = {
  safeAddress: string
  txId: string
  executedAt: number | null
  txStatus: string
  txInfo: {
    type: string
    to: object
    dataSize: string
    value: string
    methodName: string
    isCancellation: boolean
  }
  txData: {
    hexData: string
    dataDecoded: object
    to: object
    value: string
    operation: number
  }
  detailedExecutionInfo: {
    type: string
    submittedAt: number
    nonce: number
    safeTxGas: string
    baseGas: string
    gasPrice: string
    gasToken: string
    refundReceiver: object
    safeTxHash: string
    executor: object | null
    signers: object[]
    confirmationsRequired: number
    confirmations: object[]
    trusted: boolean
  }
  txHash: string | null
}

type SafeError = {
  code: number
  // JSON encoded string
  message: string
}

type SafeResponse = SafeTx | SafeError

export const fetchTxFromSafeTxHash = async ({
  chainId,
  safeTxHash,
}: {
  chainId: number
  safeTxHash: string
}): Promise<{ transactionHash: string } | null> => {
  const data = await fetch(`${SAFE_ENDPOINT}/v1/chains/${chainId}/transactions/${safeTxHash}`, {
    method: 'GET',
    headers: {
      accept: 'application/json',
    },
  }).then((res) => res.json<SafeResponse>())

  // error
  if ('code' in data) {
    console.error(JSON.parse(data.message))
    return null
  }

  if (!data.txHash) return null

  return {
    transactionHash: data.txHash,
  }
}
