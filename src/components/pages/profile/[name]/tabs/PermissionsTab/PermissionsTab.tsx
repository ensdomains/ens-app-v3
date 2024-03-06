import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { GetWrapperDataReturnType } from '@ensdomains/ensjs/public'
import { Banner } from '@ensdomains/thorin'

import BaseLink from '@app/components/@atoms/BaseLink'
import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useFusesSetDates } from '@app/hooks/fuses/useFusesSetDates'
import { useFusesStates } from '@app/hooks/fuses/useFusesStates'
import { useParentBasicName } from '@app/hooks/useParentBasicName'

import { ExpiryPermissions } from './ExpiryPermissions'
import { NameChangePermissions } from './NameChangePermissions'
import { OwnershipPermissions } from './OwnershipPermissions'

type Props = {
  name: string
  wrapperData: GetWrapperDataReturnType | undefined
  isCached: boolean
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

export const PermissionsTab = ({ name, wrapperData, isCached: isBasicCached }: Props) => {
  const { t } = useTranslation('profile')

  const nameParts = name.split('.')
  const parentName = nameParts.slice(1).join('.')

  const is2LDEth = nameParts.length === 2 && nameParts[1] === 'eth'
  const isSubname = nameParts.length > 2

  const abilities = useAbilities({ name })
  const { wrapperData: parentWrapperData, isCachedData: isParentBasicCachedData } =
    useParentBasicName({ name })

  const { data: fusesSetDates } = useFusesSetDates({ name })
  const fusesStatus = useFusesStates({
    wrapperData,
    parentWrapperData,
  })

  const showUnwrapWarning =
    isSubname && fusesStatus.isUserParentOwner && fusesStatus.parentState !== 'locked'

  const isCached = isBasicCached || isParentBasicCachedData
  return (
    <Container $isCached={isCached}>
      {showUnwrapWarning && (
        <BaseLink href={`/${parentName}?tab=permissions`} passHref>
          <Banner alert="warning" as="a" data-testid="banner-parent-not-locked">
            <Trans
              t={t}
              i18nKey="tabs.permissions.parentUnlockedWarning"
              values={{ parent: parentName }}
            />
          </Banner>
        </BaseLink>
      )}
      <OwnershipPermissions
        name={name}
        wrapperData={wrapperData}
        parentWrapperData={parentWrapperData}
        fusesSetDates={fusesSetDates}
        {...fusesStatus}
      />
      {!is2LDEth && (
        <ExpiryPermissions
          name={name}
          wrapperData={wrapperData}
          fusesSetDates={fusesSetDates}
          {...fusesStatus}
        />
      )}
      <NameChangePermissions
        name={name}
        wrapperData={wrapperData}
        fusesSetDates={fusesSetDates}
        canEditPermissions={abilities.data?.canEditPermissions}
        {...fusesStatus}
      />
    </Container>
  )
}
