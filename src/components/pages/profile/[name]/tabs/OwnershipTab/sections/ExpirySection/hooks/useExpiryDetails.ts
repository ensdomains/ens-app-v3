import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'

import { useChainName } from '@app/hooks/chain/useChainName'
import { useNameType } from '@app/hooks/nameType/useNameType'
import { useBasicName } from '@app/hooks/useBasicName'
import type { useNameDetails } from '@app/hooks/useNameDetails'
import useRegistrationData from '@app/hooks/useRegistrationData'
import { GRACE_PERIOD } from '@app/utils/constants'
import { safeDateObj } from '@app/utils/date'
import { parentName } from '@app/utils/name'
import { getSupportLink } from '@app/utils/supportLinks'
import { checkETH2LDFromName, makeEtherscanLink } from '@app/utils/utils'

type Input = {
  name: string
  details: ReturnType<typeof useNameDetails>
}

type Options = {
  enabled?: boolean
}

const getExpiryDate = (expiryDate: Date | undefined, wrapperExpiryDate: Date | undefined) =>
  match([expiryDate, wrapperExpiryDate])
    .with([P.when((date) => !!safeDateObj(date)), P._], ([date]) => safeDateObj(date))
    .with(
      [P._, P.when((date) => !!safeDateObj(date))],
      ([, date]) => new Date(safeDateObj(date)!.getTime() - GRACE_PERIOD),
    )
    .otherwise(() => undefined)

export const useExpiryDetails = ({ name, details }: Input, options: Options = {}) => {
  const enabled = options.enabled ?? true

  const { t } = useTranslation('profile')

  const isETH2LD = checkETH2LDFromName(name)
  const nameType = useNameType(name, { enabled })
  const parentData = useBasicName({
    name: parentName(name),
    enabled: enabled && !!nameType.data && nameType.data!.includes('subname'),
  })
  const chainName = useChainName()
  const registrationData = useRegistrationData({ name, enabled: enabled && isETH2LD })

  const isLoading =
    nameType.isLoading || details.isLoading || parentData.isLoading || registrationData.isLoading
  const isCachedData =
    nameType.isCachedData || (isETH2LD && registrationData.isCachedData) || parentData.isCachedData

  const data = useMemo(
    () => {
      if (isLoading) return undefined
      const expiry = getExpiryDate(details?.expiryDate, details?.wrapperData?.expiry?.date)
      const parentExpiry = getExpiryDate(
        parentData?.expiryDate,
        parentData?.wrapperData?.expiry?.date,
      )

      return match(nameType.data!)
        .with(
          P.union(
            'eth-unwrapped-2ld',
            'eth-unwrapped-2ld:grace-period',
            'eth-emancipated-2ld',
            'eth-emancipated-2ld:grace-period',
            'eth-locked-2ld',
            'eth-locked-2ld:grace-period',
            'eth-desynced-2ld',
            'eth-desynced-2ld:grace-period',
          ),
          () => [
            ...(expiry
              ? [
                  {
                    type: 'expiry',
                    date: expiry,
                  },
                  {
                    type: 'grace-period',
                    date: expiry ? new Date(expiry.getTime() + GRACE_PERIOD) : undefined,
                    tooltip: t('tabs.ownership.sections.expiry.panel.grace-period.tooltip'),
                    supportLink: getSupportLink('grace-period'),
                  },
                ]
              : []),
            ...(registrationData?.data
              ? [
                  {
                    type: 'registration',
                    date: registrationData?.data?.registrationDate,
                    link: makeEtherscanLink(registrationData?.data?.transactionHash!, chainName),
                  },
                ]
              : []),
          ],
        )
        .with(P.union('eth-emancipated-subname', 'eth-locked-subname'), () => [
          ...(expiry
            ? [
                {
                  type: 'expiry',
                  date: expiry,
                },
              ]
            : []),
          ...(parentExpiry
            ? [
                {
                  type: 'parent-expiry',
                  date: parentExpiry,
                },
              ]
            : []),
        ])
        .with(
          P.union('eth-unwrapped-subname', 'eth-wrapped-subname', 'eth-pcc-expired-subname'),
          () =>
            parentExpiry
              ? [
                  {
                    type: 'parent-expiry',
                    date: parentExpiry,
                  },
                  {
                    type: 'parent-grace-period',
                    date: parentExpiry
                      ? new Date(parentExpiry.getTime() + GRACE_PERIOD)
                      : undefined,
                    tooltip: t('tabs.ownership.sections.expiry.panel.grace-period.tooltip'),
                    supportLink: getSupportLink('grace-period'),
                  },
                ]
              : [],
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
    isCachedData,
  }
}
