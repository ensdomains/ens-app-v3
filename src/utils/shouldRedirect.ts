/* eslint-disable @typescript-eslint/naming-convention */
import { match, P } from 'ts-pattern'

import { getSupportedChainById } from '@app/constants/chains'
import { useDotBoxAvailabilityOffchain } from '@app/hooks/dotbox/useDotBoxAvailabilityOffchain'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'

type RouteParams = {
  '/unsupportedNetwork': { isConnected: boolean; chainId: number | undefined }
  '/profile/<name>': ReturnType<typeof useDotBoxAvailabilityOffchain>
}

export const shouldRedirect = (
  router: ReturnType<typeof useRouterWithHistory>,
  destination: keyof RouteParams,
  params: RouteParams[keyof RouteParams],
) => {
  match([destination, params])
    .with(
      ['/unsupportedNetwork', { isConnected: true, chainId: P.number }],
      (_params) =>
        !getSupportedChainById(_params[1].chainId) && router.pathname !== '/unsupportedNetwork',
      () => router.push('/unsupportedNetwork'),
    )
    .with(
      ['/profile/<name>', { isLoading: false }],
      (_params) =>
        _params[1].data?.data.status !== 'AVAILABLE' &&
        _params[1].data?.data.status !== 'UNAVAILABLE' &&
        router.isReady,
      () => router.push(router.query.name as string),
    )
    .otherwise(() => {
      // Do nothing
    })
}
