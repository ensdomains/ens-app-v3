const TENDERLY_WORKER_URL = 'https://gas-estimate-worker.ens-cf.workers.dev'

type BaseRequest = {
  networkId: number
}

type RegistrationRequest = {
  type: 'registration'
  label: string
  owner: string
  resolver: string
  data: string[]
  reverseRecord: boolean
  ownerControlledFuses: number
}

type ExtensionRequest = {
  type: 'extension'
  labels: string[]
  duration: number
  from: string
}

export const fetchTenderlyEstimate = async (
  req: BaseRequest & (RegistrationRequest | ExtensionRequest),
) => {
  const { type, ...bodyData } = req
  const result = await fetch(`${TENDERLY_WORKER_URL}/${type}`, {
    method: 'POST',
    body: JSON.stringify(bodyData),
  }).then((res) => {
    return res.json<{
      /* eslint-disable @typescript-eslint/naming-convention */
      gasUsed: number
      status: boolean
      /* eslint-enable @typescript-eslint/naming-convention */
    }>()
  })

  if (typeof result.status === 'boolean' && result.status === false) {
    throw new Error(`Tenderly estimate failed: ${JSON.stringify(result)}`)
  }

  return result.gasUsed
}
