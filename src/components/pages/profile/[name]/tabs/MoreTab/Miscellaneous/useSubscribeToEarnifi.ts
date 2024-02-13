import { useMutation, UseMutationOptions } from '@tanstack/react-query'

export const EARNIFI_ENDPOINT = 'https://notifications-api.vercel.app/api/v1/ens/subscribe'

export const getErrorMessage = async (response: Response) => {
  try {
    const json = await response.json()
    return (json as any)?.message
  } catch (e) {
    console.error(e)
    return undefined
  }
}

type Variables = {
  email: string
  address: string
  chainId: number
}

const subscribeToEarnifi = async (params: Variables): Promise<void> => {
  const response = await fetch(EARNIFI_ENDPOINT, {
    method: 'POST',
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(params),
  })
  if (!response.ok) {
    const message = await getErrorMessage(response)
    throw new Error(message)
  }
}

type Props = UseMutationOptions<void, unknown, Variables, unknown>

export const useSubscribeToEarnifi = (options: Props) => {
  const { mutate: subscribe, ...rest } = useMutation({ mutationFn: subscribeToEarnifi, ...options })
  return {
    subscribe,
    ...rest,
  }
}
