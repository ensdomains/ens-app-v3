import { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { GetWrapperDataReturnType } from '@ensdomains/ensjs/public'
import { Button, Typography } from '@ensdomains/thorin'

import { StyledLink } from '@app/components/@atoms/StyledLink'
import type { useFusesSetDates } from '@app/hooks/fuses/useFusesSetDates'
import type { useFusesStates } from '@app/hooks/fuses/useFusesStates'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { Section, SectionFooter, SectionItem, SectionList } from './Section'

type FusesSetDates = ReturnType<typeof useFusesSetDates>['data']
type FusesStatus = ReturnType<typeof useFusesStates>

type Props = {
  name: string
  wrapperData: GetWrapperDataReturnType | undefined
  parentWrapperData: GetWrapperDataReturnType | undefined
  fusesSetDates: FusesSetDates
} & FusesStatus

const TypographyGreyDim = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.greyDim};
  `,
)

const ButtonRow = styled.div(
  () => css`
    display: flex;
    justify-content: flex-end;
  `,
)

export const OwnershipPermissions = ({
  name,
  wrapperData,
  fusesSetDates,
  parentState,
  state,
  expiry,
  expiryLabel,
  parentExpiry,
  parentExpiryLabel,
  isUserOwner,
  isUserParentOwner,
}: Props) => {
  const { t } = useTranslation('profile')

  const { usePreparedDataInput } = useTransactionFlow()
  const showRevokePermissionsInput = usePreparedDataInput('RevokePermissions')

  const nameParts = name.split('.')
  const parentName = nameParts.slice(1).join('.')
  const isSubname = nameParts.length > 2

  // Ownership status
  const ownershipStatus = useMemo(() => {
    if (!isSubname || state === 'unwrapped') return
    return ['emancipated', 'locked'].includes(state)
      ? 'parent-cannot-control'
      : 'parent-can-control'
  }, [state, isSubname])

  // Editor status
  const editorStatus = useMemo(() => {
    if (wrapperData?.fuses.child.CANNOT_BURN_FUSES) return 'owner-cannot-change-permissions'
    if (['emancipated', 'locked'].includes(state)) return 'owner-can-change-permissions'
    return 'parent-can-change-permissions'
  }, [wrapperData, state])

  const buttonProps = useMemo(() => {
    if (!wrapperData) return
    if (isUserParentOwner && ownershipStatus === 'parent-can-control' && parentState === 'locked')
      return {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'data-testid': 'button-revoke-pcc',
        onClick: () => {
          if (!parentExpiry) return
          showRevokePermissionsInput(`revoke-permissions-${name}`, {
            name,
            flowType: 'revoke-pcc',
            parentFuses: wrapperData.fuses.parent,
            childFuses: wrapperData.fuses.child,
            owner: wrapperData.owner,
            minExpiry: expiry,
            maxExpiry: parentExpiry,
          })
        },
        children: t('tabs.permissions.ownership.action.giveUpControl'),
      }
    if (
      isUserOwner &&
      editorStatus === 'owner-can-change-permissions' &&
      wrapperData.fuses.child.CANNOT_UNWRAP
    )
      return {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'data-testid': 'button-revoke-change-fuses',
        onClick: () => {
          showRevokePermissionsInput(`revoke-permissions-${name}`, {
            name,
            flowType: 'revoke-change-fuses',
            parentFuses: wrapperData.fuses.parent,
            childFuses: wrapperData.fuses.child,
            owner: wrapperData.owner,
          })
        },
        children: t('tabs.permissions.ownership.action.revokePermission'),
      }
  }, [
    isUserParentOwner,
    ownershipStatus,
    isUserOwner,
    editorStatus,
    parentState,
    t,
    showRevokePermissionsInput,
    name,
    wrapperData,
    expiry,
    parentExpiry,
  ])

  return (
    <Section>
      {ownershipStatus === 'parent-cannot-control' && (
        <SectionItem icon="disabled" data-testid="parent-cannot-control">
          <Typography fontVariant="bodyBold">
            <Trans
              t={t}
              i18nKey="tabs.permissions.ownership.parentCannotControl.label"
              values={{ parent: parentName }}
              components={{ parentLink: <StyledLink href={`/${parentName}`} /> }}
            />
          </Typography>
          {fusesSetDates?.PARENT_CANNOT_CONTROL && (
            <TypographyGreyDim fontVariant="extraSmall">
              {t('tabs.permissions.revokedLabel', {
                date: fusesSetDates.PARENT_CANNOT_CONTROL,
              })}
            </TypographyGreyDim>
          )}
          <Typography fontVariant="small">
            {t('tabs.permissions.ownership.parentCannotControl.sublabel')}
          </Typography>
          <SectionList title={t('tabs.permissions.ownership.parentCannotControl.list.title')}>
            <li>
              {t('tabs.permissions.ownership.parentCannotControl.list.item1', {
                date: expiryLabel,
              })}
            </li>
            <li>
              {t('tabs.permissions.ownership.parentCannotControl.list.item2', {
                date: parentExpiryLabel,
              })}
            </li>
            <li>{t('tabs.permissions.ownership.parentCannotControl.list.item3')}</li>
          </SectionList>
        </SectionItem>
      )}
      {ownershipStatus === 'parent-can-control' && (
        <SectionItem icon="info" data-testid="parent-can-control">
          <Typography fontVariant="bodyBold">
            <Trans
              t={t}
              i18nKey="tabs.permissions.ownership.parentCanControl.label"
              values={{ parent: parentName }}
              components={{ parentLink: <StyledLink href={`/${parentName}`} /> }}
            />
          </Typography>
          <SectionList title={t('tabs.permissions.ownership.parentCanControl.list.title')}>
            <li>{t('tabs.permissions.ownership.parentCanControl.list.item1')}</li>
            <li>{t('tabs.permissions.ownership.parentCanControl.list.item2')}</li>
            <li>{t('tabs.permissions.ownership.parentCanControl.list.item3')}</li>
          </SectionList>
        </SectionItem>
      )}
      {editorStatus === 'owner-can-change-permissions' && (
        <SectionItem icon="info" data-testid="owner-can-change-permissions">
          <Typography fontVariant="bodyBold">
            {t('tabs.permissions.ownership.ownerCanChange.label')}
          </Typography>
          <SectionList title={t('tabs.permissions.ownership.ownerCanChange.list.title')}>
            <li>{t('tabs.permissions.ownership.ownerCanChange.list.item1')}</li>
            <li>{t('tabs.permissions.ownership.ownerCanChange.list.item2')}</li>
          </SectionList>
        </SectionItem>
      )}
      {editorStatus === 'owner-cannot-change-permissions' && (
        <SectionItem icon="disabled" data-testid="owner-cannot-change-permissions">
          <Typography fontVariant="bodyBold">
            {t('tabs.permissions.ownership.ownerCannotChange.label')}
          </Typography>
          {fusesSetDates?.CANNOT_BURN_FUSES && (
            <TypographyGreyDim fontVariant="extraSmall">
              {t('tabs.permissions.revokedLabel', { date: fusesSetDates.CANNOT_BURN_FUSES })}
            </TypographyGreyDim>
          )}
          <SectionList title={t('tabs.permissions.ownership.ownerCannotChange.list.title')}>
            <li>{t('tabs.permissions.ownership.ownerCanChange.list.item1')}</li>
            <li>{t('tabs.permissions.ownership.ownerCanChange.list.item2')}</li>
          </SectionList>
        </SectionItem>
      )}
      {editorStatus === 'parent-can-change-permissions' && (
        <SectionItem icon="info" data-testid="parent-can-change-permissions">
          <Typography fontVariant="bodyBold">
            <Trans
              t={t}
              i18nKey="tabs.permissions.ownership.parentCanChange.label"
              values={{ parent: parentName }}
              components={{ parentLink: <StyledLink href={`/${parentName}`} /> }}
            />
          </Typography>
          <SectionList title={t('tabs.permissions.ownership.parentCanChange.list.title')}>
            <li>{t('tabs.permissions.ownership.parentCanChange.list.item1')}</li>
            <li>{t('tabs.permissions.ownership.parentCanChange.list.item2')}</li>
          </SectionList>
        </SectionItem>
      )}
      {buttonProps && (
        <SectionFooter>
          <ButtonRow>
            <div>
              <Button {...buttonProps} />
            </div>
          </ButtonRow>
        </SectionFooter>
      )}
    </Section>
  )
}
