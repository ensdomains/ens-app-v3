import { Address, Hex } from 'viem'

const TENDERLY_WORKER_URL = 'https://gas-estimate-worker.ens-cf.workers.dev'

type BaseRequest = {
  networkId: number
}

type RegistrationRequest = {
  type: 'registration'
  label: string
  owner: Address
  resolver: Address
  data: Hex[]
  reverseRecord: boolean
  ownerControlledFuses: number
}

type ExtensionRequest = {
  type: 'extension'
  labels: string[]
  duration: number
  from: Address
}

type TenderlyRepsonse = {
  gasUsed: number
  status: boolean
}

export const fetchTenderlyEstimate = async (
  req: BaseRequest & (RegistrationRequest | ExtensionRequest),
) => {
  const { type, ...bodyData } = req
  const result: TenderlyRepsonse = await fetch(`${TENDERLY_WORKER_URL}/${type}`, {
    method: 'POST',
    body: JSON.stringify(bodyData),
  }).then((res) => res.json())

  if (typeof result.status === 'boolean' && result.status === false) {
    throw new Error(`Tenderly estimate failed: ${JSON.stringify(result)}`)
  }

  return result.gasUsed
}
