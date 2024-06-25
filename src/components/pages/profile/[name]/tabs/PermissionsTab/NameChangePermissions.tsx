import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { GetWrapperDataReturnType } from '@ensdomains/ensjs/public'
import { ChildFuseKeys, ChildFuseReferenceType } from '@ensdomains/ensjs/utils'
import { Button, Typography } from '@ensdomains/thorin'

import type { useFusesSetDates } from '@app/hooks/fuses/useFusesSetDates'
import type { useFusesStates } from '@app/hooks/fuses/useFusesStates'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { DisabledButtonWithTooltip } from '../../../../../@molecules/DisabledButtonWithTooltip'
import { Section, SectionFooter, SectionItem } from './Section'

type FusesSetDates = ReturnType<typeof useFusesSetDates>['data']
type FusesStates = ReturnType<typeof useFusesStates>

type Props = {
  name: string
  wrapperData: GetWrapperDataReturnType | undefined
  fusesSetDates: FusesSetDates
  canEditPermissions?: boolean
} & FusesStates

type FuseItem = {
  fuse: ChildFuseReferenceType['Key']
  translationKey: string
  revoked?: string
}

const CHILD_FUSES_WITHOUT_CBF = ChildFuseKeys.filter((fuse) => fuse !== 'CANNOT_BURN_FUSES')

const PERMISSION_TRANSLATION_KEY: {
  [key in ChildFuseReferenceType['Key']]?: {
    burned: string
    unburned: string
  }
} = {
  CANNOT_UNWRAP: {
    burned: 'cannotUnwrap',
    unburned: 'canUnwrap',
  },
  CANNOT_CREATE_SUBDOMAIN: {
    burned: 'cannotCreateSubnames',
    unburned: 'canCreateSubnames',
  },
  CANNOT_TRANSFER: {
    burned: 'cannotSend',
    unburned: 'canSend',
  },
  CANNOT_SET_RESOLVER: {
    burned: 'cannotSetResolver',
    unburned: 'canSetResolver',
  },
  CANNOT_SET_TTL: {
    burned: 'cannotSetTTL',
    unburned: 'canSetTTL',
  },
  CANNOT_APPROVE: {
    burned: 'cannotApprove',
    unburned: 'canApprove',
  },
}

const TypographyGreyDim = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.greyDim};
  `,
)

const FooterContainer = styled.div(
  () => css`
    display: flex;
    justify-content: flex-end;
  `,
)

export const NameChangePermissions = ({
  name,
  wrapperData,
  fusesSetDates,
  state,
  parentState,
  isUserOwner,
  canEditPermissions,
}: Props) => {
  const { t } = useTranslation('profile')
  const { usePreparedDataInput } = useTransactionFlow()
  const showRevokePermissionsInput = usePreparedDataInput('RevokePermissions')

  const isParentLocked = parentState === 'locked' || wrapperData?.fuses?.parent.IS_DOT_ETH

  const permissions = CHILD_FUSES_WITHOUT_CBF.reduce<{ burned: FuseItem[]; unburned: FuseItem[] }>(
    (acc, permission) => {
      const isBurned = !!wrapperData?.fuses.child[permission]
      const burnedTranslationKey = PERMISSION_TRANSLATION_KEY[permission]?.burned
      const unburnedTranslationKey = PERMISSION_TRANSLATION_KEY[permission]?.unburned

      if (isBurned && burnedTranslationKey)
        acc.burned.push({
          fuse: permission,
          translationKey: burnedTranslationKey,
        })

      if (!isBurned && unburnedTranslationKey)
        acc.unburned.push({
          fuse: permission,
          translationKey: unburnedTranslationKey,
        })
      return acc
    },
    { burned: [], unburned: [] },
  )

  const handleRevokePermissions = () => {
    if (!wrapperData) return
    showRevokePermissionsInput(`revoke-permissions-${name}`, {
      name,
      owner: wrapperData.owner,
      parentFuses: wrapperData.fuses.parent,
      childFuses: wrapperData.fuses.child,
      flowType: 'revoke-permissions',
    })
  }

  const ButtonComponent = useMemo(() => {
    const showButton =
      isUserOwner &&
      ['emancipated', 'locked'].includes(state) &&
      permissions.unburned.length > 0 &&
      canEditPermissions
    if (!showButton) return null
    if (wrapperData?.fuses.child.CANNOT_BURN_FUSES)
      return (
        <DisabledButtonWithTooltip
          buttonId="button-revoke-permissions-disabled"
          content={t('errors.permissionRevoked')}
          buttonText={t('tabs.permissions.nameChangePermissions.action.changePermissions')}
          placement="left"
          mobilePlacement="top"
          mobileWidth={150}
        />
      )

    return (
      <Button data-testid="button-revoke-permissions" onClick={handleRevokePermissions}>
        {t('tabs.permissions.nameChangePermissions.action.changePermissions')}
      </Button>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions, wrapperData, state, isUserOwner])

  return (
    <Section>
      {permissions.unburned.map(({ translationKey, fuse }) => (
        <SectionItem key={fuse} icon="info" data-testid={`unburned-${fuse}`}>
          <Typography fontVariant="bodyBold">
            {t(`tabs.permissions.nameChangePermissions.permissions.${translationKey}.label`)}
          </Typography>

          <Typography fontVariant="small">
            {t(`tabs.permissions.nameChangePermissions.permissions.${translationKey}.description`, {
              owner: isParentLocked
                ? t('tabs.permissions.role.owner')
                : t('tabs.permissions.role.parent'),
            })}
          </Typography>
        </SectionItem>
      ))}
      {permissions.burned.map(({ translationKey, fuse }) => (
        <SectionItem key={fuse} icon="disabled" data-testid={`burned-${fuse}`}>
          <Typography fontVariant="bodyBold">
            {t(`tabs.permissions.nameChangePermissions.permissions.${translationKey}.label`)}
          </Typography>
          {fusesSetDates?.[fuse] && (
            <TypographyGreyDim fontVariant="extraSmall">
              {t('tabs.permissions.revokedLabel', { date: fusesSetDates[fuse] })}
            </TypographyGreyDim>
          )}
          <Typography fontVariant="small">
            {t(`tabs.permissions.nameChangePermissions.permissions.${translationKey}.description`, {
              owner: isParentLocked
                ? t('tabs.permissions.role.owner')
                : t('tabs.permissions.role.parent'),
            })}
          </Typography>
        </SectionItem>
      ))}
      {ButtonComponent && (
        <SectionFooter>
          <FooterContainer>
            <div>{ButtonComponent}</div>
          </FooterContainer>
        </SectionFooter>
      )}
    </Section>
  )
}
