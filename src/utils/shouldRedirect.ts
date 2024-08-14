/* eslint-disable @typescript-eslint/naming-convention */
import { match, P } from 'ts-pattern'

import { getSupportedChainById } from '@app/constants/chains'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'

type RouteParams = {
  '/unsupportedNetwork': { isConnected: boolean; chainId: number | undefined }
}

export const shouldRedirect = (
  router: ReturnType<typeof useRouterWithHistory>,
  destination: keyof RouteParams,
  params: RouteParams[keyof RouteParams],
) => {
  // console.log('should redreict')
  match([destination, params])
    .with(
      ['/unsupportedNetwork', { isConnected: true, chainId: P.number }],
      () => !getSupportedChainById(params.chainId) && router.pathname !== '/unsupportedNetwork',
      () => {
        router.push('/unsupportedNetwork')
      },
    )
    .otherwise(() => {
      //   console.warn('shouldRedirect otherwise called: ', destination, params)
    })
}
