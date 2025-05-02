/* eslint-disable @typescript-eslint/naming-convention */
import { match, P } from 'ts-pattern'

import {
  DnsImportReducerDataItem,
  DnsStep,
} from '@app/components/pages/import/[name]/useDnsImportReducer'
import { useDotBoxAvailabilityOffchain } from '@app/hooks/dotbox/useDotBoxAvailabilityOffchain'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { getEncodedLabelAmount } from '@app/utils/utils'

import { RegistrationStatus } from './registrationStatus'

type RouteParams = {
  'Basic.tsx': { isConnected: boolean; chainId: number | undefined }
  'DotBoxRegistration.tsx': ReturnType<typeof useDotBoxAvailabilityOffchain>
  'Profile.tsx': {
    isSelf: boolean
    name: string | undefined
    decodedName: string | undefined
    normalisedName: string | undefined
    visibileTabs: readonly string[]
    tab: string
  }

  'DnsClaim.tsx': {
    shouldRun: boolean
    payload: {
      name: string | undefined
      isLoading: boolean
      registrationStatus?: RegistrationStatus
      item: DnsImportReducerDataItem
      step: DnsStep
    }
  }
}

const shouldDnsClaimRedirect = ({
  isLoading,
  registrationStatus,
  item,
  step,
}: {
  isLoading: boolean
  registrationStatus?: RegistrationStatus
  item: DnsImportReducerDataItem
  step: DnsStep
}) => {
  if (isLoading || !registrationStatus) return false
  if (registrationStatus === 'notImported' || registrationStatus === 'notOwned') return false

  if (!item.started) return true

  if (step === 'completeOnchain' || step === 'completeOffchain') return false

  return true
}

export const shouldRedirect = (
  router: ReturnType<typeof useRouterWithHistory>,
  source: keyof RouteParams,
  destination: string,
  extraData: RouteParams[keyof RouteParams],
) => {
  match([source, extraData])
    .with(
      ['DotBoxRegistration.tsx', { isLoading: false }],
      (_params) =>
        _params[1].data?.data.status !== 'AVAILABLE' &&
        _params[1].data?.data.status !== 'UNAVAILABLE' &&
        router.isReady,
      () => router.push(destination),
    )
    .with(
      ['DnsClaim.tsx', { shouldRun: true }],
      (_params) => _params && router.isReady,
      (_params) => {
        const params = _params[1]
        const isHome = params.payload.item?.name?.includes('.box')
        const isProfile = shouldDnsClaimRedirect(params.payload)

        if (isHome) {
          return router.push(`/`)
        }

        if (isProfile) {
          return router.push(`/profile/${params.payload.name}`)
        }
      },
    )
    .with(
      ['Profile.tsx', { isSelf: P.boolean, name: P.string }],
      (_params) => _params && router.isReady,
      (_params) => {
        const { name, isSelf, decodedName, normalisedName, visibileTabs, tab } = _params[1]

        const hasValidTab = visibileTabs.includes(tab)
        const tabQuery = tab !== 'profile' && hasValidTab ? `?tab=${tab}` : ''

        if (
          name !== decodedName &&
          decodedName &&
          !isSelf &&
          getEncodedLabelAmount(normalisedName ?? '') > getEncodedLabelAmount(decodedName)
        ) {
          // if the fetched decrypted name is different to the current name
          // and the decrypted name has less encrypted labels than the normalised name
          // direct to the fetched decrypted name
          return router.replace(`${destination}/${decodedName}${tabQuery}`, {
            shallow: true,
            maintainHistory: true,
          })
        }

        if (
          name !== normalisedName &&
          normalisedName &&
          !isSelf &&
          (!decodedName ||
            getEncodedLabelAmount(decodedName) > getEncodedLabelAmount(normalisedName)) &&
          decodeURIComponent(name) !== normalisedName
        ) {
          // if the normalised name is different to the current name
          // and the normalised name has less encrypted labels than the decrypted name
          // direct to normalised name
          return router.replace(`${destination}/${normalisedName}${tabQuery}`, {
            shallow: true,
            maintainHistory: true,
          })
        }

        if (isSelf && name) {
          return router.replace(`${destination}/${name}${tabQuery}`)
        }

        if (!hasValidTab) {
          return router.replace(`${destination}/${name}`)
        }
      },
    )
    .otherwise(() => {
      // Do nothing
    })
}
