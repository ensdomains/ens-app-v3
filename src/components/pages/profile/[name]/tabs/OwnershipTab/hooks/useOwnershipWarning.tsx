import { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import { P, match } from 'ts-pattern'

import { useAccountSafely } from '@app/hooks/useAccountSafely'
import type { useNameDetails } from '@app/hooks/useNameDetails'
import type { useNameType } from '@app/hooks/useNameType'
import useParentBasicName from '@app/hooks/useParentBasicName'

const getParentNameFromName = (name: string) => name.split('.').slice(1).join('.')

type Input = {
  name: string
  details: ReturnType<typeof useNameDetails>
  nameType: ReturnType<typeof useNameType>
}

export const useOwnershipWarning = ({ name, nameType, details }: Input) => {
  const { t } = useTranslation('profile')
  const account = useAccountSafely()
  const parent = useParentBasicName(name)
  const isLoading = !account.address || nameType.isLoading || details.isLoading || parent.isLoading

  const data = useMemo(() => {
    if (isLoading) return undefined
    return match([
      nameType.data,
      {
        isRegistrant: details.ownerData?.registrant === account.address,
        isParentOwner: parent?.ownerData?.owner === account.address,
        isManager: details.ownerData?.owner === account.address,
        isDNSOwner: details.dnsOwner === account.address,
      },
    ])
      .with(
        [
          'eth-unwrapped-2ld',
          {
            isRegistrant: true,
            isManager: false,
            isParentOwner: P._,
            isDNSOwner: P._,
          },
        ],
        () => t('tabs.ownership.warning.ownerNotManager'),
      )
      .with(
        [
          P.union('dns-unwrapped-2ld', 'dns-wrapped-2ld'),
          {
            isRegistrant: P._,
            isManager: true,
            isParentOwner: P._,
            isDNSOwner: false,
          },
        ],
        () => t('tabs.ownership.warning.managerNotDNSOwner'),
      )
      .with(
        [
          P.union('dns-unwrapped-2ld', 'dns-wrapped-2ld'),
          {
            isRegistrant: P._,
            isManager: false,
            isParentOwner: P._,
            isDNSOwner: true,
          },
        ],
        () => t('tabs.ownership.warning.dnsOwnerNotManager'),
      )
      .with(
        [
          P.union(
            'eth-unwrapped-subname',
            'eth-wrapped-subname',
            'dns-unwrapped-subname',
            'dns-wrapped-subname',
          ),
          {
            isRegistrant: P._,
            isManager: true,
            isParentOwner: false,
            isDNSOwner: P._,
          },
        ],
        () => (
          <Trans
            t={t}
            i18nKey="tabs.ownership.warning.managerNotParentOwner"
            values={{ parent: getParentNameFromName(name) }}
          />
        ),
      )
      .otherwise(() => undefined)
  }, [
    isLoading,
    name,
    account.address,
    parent.ownerData,
    details.ownerData,
    details.dnsOwner,
    nameType.data,
    t,
  ])

  return {
    data,
    isLoading,
  }
}
