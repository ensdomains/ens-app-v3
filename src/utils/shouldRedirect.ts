/* eslint-disable @typescript-eslint/naming-convention */
import { match, P } from 'ts-pattern'

import { getSupportedChainById } from '@app/constants/chains'
import { useDotBoxAvailabilityOffchain } from '@app/hooks/dotbox/useDotBoxAvailabilityOffchain'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'

type RouteParams = {
  'Basic.tsx': { isConnected: boolean; chainId: number | undefined }
  'DotBoxRegistration.tsx': ReturnType<typeof useDotBoxAvailabilityOffchain>
}

export const shouldRedirect = (
  router: ReturnType<typeof useRouterWithHistory>,
  source: keyof RouteParams,
  destination: string,
  extraData: RouteParams[keyof RouteParams],
) => {
  match([source, extraData])
    .with(
      ['Basic.tsx', { isConnected: true, chainId: P.number }],
      (_params) =>
        !getSupportedChainById(_params[1].chainId) && router.pathname !== '/unsupportedNetwork',
      () => router.push(destination),
    )
    .with(
      ['DotBoxRegistration.tsx', { isLoading: false }],
      (_params) =>
        _params[1].data?.data.status !== 'AVAILABLE' &&
        _params[1].data?.data.status !== 'UNAVAILABLE' &&
        router.isReady,
      () => router.push(destination),
    )
    .otherwise(() => {
      // Do nothing
    })
}
