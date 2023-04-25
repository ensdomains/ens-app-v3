const TENDERLY_WORKER_URL = 'http://localhost:8787'

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
  }).then((res) =>
    res.json<{
      /* eslint-disable @typescript-eslint/naming-convention */
      gas_used: number
      status?: boolean
      error_details?: { error_message: string; address: string }
      /* eslint-enable @typescript-eslint/naming-convention */
    }>(),
  )

  if (typeof result.status === 'boolean' && result.status === false) {
    if (result.error_details) {
      throw new Error(
        `Tenderly estimate failed: ${result.error_details.error_message} (address=${result.error_details.address})`,
      )
    }
    throw new Error('Tenderly estimate failed: Unknown error')
  }

  return result.gas_used
}
