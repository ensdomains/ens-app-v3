import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Banner } from '@ensdomains/thorin'

import BaseLink from '@app/components/@atoms/BaseLink'
import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { useGetHistory } from '@app/hooks/useGetHistory'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { usePrimary } from '@app/hooks/usePrimary'
import { useEns } from '@app/utils/EnsProvider'

import { ExpiryPermissions } from './ExpiryPermissions'
import { NameChangePermissions } from './NameChangePermissions'
import { OwnershipPermissions } from './OwnershipPermissions'

type GetWrapperDataFunc = ReturnType<typeof useEns>['getWrapperData']
type WrapperData = Awaited<ReturnType<GetWrapperDataFunc>>

type Props = {
  name: string
  wrapperData: WrapperData
}

const Container = styled(CacheableComponent)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    width: 100%;
    gap: ${theme.space['4']};
  `,
)

export const PermissionsTab = ({ name, wrapperData }: Props) => {
  const { t } = useTranslation('profile')

  const { address } = useAccount()
  const nameParts = name.split('.')
  const parentName = nameParts.slice(1).join('.')
  const is2LDEth = nameParts.length === 2 && nameParts[1] === 'eth'
  const isSubnameEth = nameParts.length >= 3 && nameParts[nameParts.length - 1] === 'eth'

  const { wrapperData: parentWrapperData } = useNameDetails(parentName)

  const primaryName = usePrimary(wrapperData?.owner)

  const { history } = useGetHistory(name)
  console.log('history', history)
  console.log('wrapperData', wrapperData)
  console.log('parentWrapperData', parentWrapperData)
  console.log('primaryName', primaryName)
  console.log('parentExpiry', parentWrapperData?.expiryDate)

  const userIsParentOwner = parentWrapperData?.owner === address
  const showUnwrapWarning =
    isSubnameEth && !parentWrapperData?.fuseObj.CANNOT_UNWRAP && userIsParentOwner

  return (
    <Container>
      {showUnwrapWarning && (
        <BaseLink href={`/${parentName}?tab=permissions`} passHref>
          <Banner alert="warning" as="a">
            <Trans
              t={t}
              i18nKey="tabs.permissions.revokeUnwrapWarning"
              values={{ parent: parentName }}
            />
          </Banner>
        </BaseLink>
      )}
      <OwnershipPermissions
        name={name}
        is2LDEth={is2LDEth}
        wrapperData={wrapperData}
        parentWrapperData={parentWrapperData}
        isCachedData={false}
      />
      <ExpiryPermissions
        name={name}
        isCachedData={false}
        wrapperData={wrapperData}
        parentWrapperData={parentWrapperData}
      />
      <NameChangePermissions
        name={name}
        isCachedData={false}
        wrapperData={wrapperData}
        parentWrapperData={parentWrapperData}
      />
    </Container>
  )
}
