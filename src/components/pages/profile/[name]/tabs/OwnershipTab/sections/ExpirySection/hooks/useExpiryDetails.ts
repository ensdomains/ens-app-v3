import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { P, match } from 'ts-pattern'

import { useChainName } from '@app/hooks/useChainName'
import type { useNameDetails } from '@app/hooks/useNameDetails'
import { useNameType } from '@app/hooks/useNameType'
import useParentBasicName from '@app/hooks/useParentBasicName'
import useRegistrationData from '@app/hooks/useRegistrationData'
import { GRACE_PERIOD } from '@app/utils/constants'
import { makeEtherscanLink } from '@app/utils/utils'

type Input = {
  name: string
  details: ReturnType<typeof useNameDetails>
}

type Options = {
  enabled?: boolean
}

export const useExpiryDetails = ({ name, details }: Input, options: Options = {}) => {
  const enabled = options.enabled ?? true

  const { t } = useTranslation('profile')

  const nameType = useNameType(name, { enabled })
  const parentData = useParentBasicName(name)
  const chainName = useChainName()
  const registrationData = useRegistrationData(name)

  const isLoading =
    nameType.isLoading || details.isLoading || parentData.isLoading || registrationData.isLoading

  const data = useMemo(
    () => {
      if (isLoading) return undefined
      const expiry = details.expiryDate || details.wrapperData?.expiryDate
      const parentExpiry = parentData?.expiryDate || parentData?.wrapperData?.expiryDate

      return match(nameType.data!)
        .with(P.union('eth-unwrapped-2ld', 'eth-emancipated-2ld', 'eth-locked-2ld'), () => [
          {
            type: 'expiry',
            date: expiry,
          },
          {
            type: 'grace-period',
            date: expiry ? new Date(expiry.getTime() + GRACE_PERIOD) : undefined,
            tooltip: t('tabs.ownership.sections.expiry.labels.tooltip'),
          },
          {
            type: 'registration',
            date: registrationData?.data?.registrationDate,
            link: makeEtherscanLink(registrationData?.data?.transactionHash!, chainName),
          },
        ])
        .with(P.union('eth-emancipated-subname', 'eth-locked-subname'), () => [
          {
            type: 'expiry',
            date: expiry,
          },
          {
            type: 'parent-expiry',
            date: parentExpiry,
          },
        ])
        .with(
          P.union('eth-unwrapped-subname', 'eth-wrapped-subname', 'eth-pcc-expired-subname'),
          () => [
            {
              type: 'parent-expiry',
              date: parentExpiry,
            },
            {
              type: 'parent-grace-period',
              date: parentExpiry ? new Date(parentExpiry.getTime() + GRACE_PERIOD) : undefined,
            },
          ],
        )
        .with(
          P.union(
            'root',
            'tld',
            'dns-unwrapped-2ld',
            'dns-wrapped-2ld',
            'dns-emancipated-2ld',
            'dns-locked-2ld',
            'dns-unwrapped-subname',
            'dns-wrapped-subname',
            'dns-emancipated-subname',
            'dns-locked-subname',
            'dns-pcc-expired-subname',
          ),
          () => [],
        )
        .exhaustive()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [
      isLoading,
      nameType.data,
      details.wrapperData,
      details.expiryDate,
      parentData.wrapperData,
      parentData.expiryDate,
      registrationData.data,
      chainName,
    ],
  )

  return {
    data,
    isLoading,
  }
}
