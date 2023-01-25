import { useMemo } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Typography } from '@ensdomains/thorin'

import type { useEns } from '@app/utils/EnsProvider'

import { useTransactionFlow } from '../../../../../../transaction-flow/TransactionFlowProvider'
import { Section, SectionFooter, SectionItem, SectionList } from './Section'
import { AccountLink } from './components/AccountLink'

type GetWrapperDataFunc = ReturnType<typeof useEns>['getWrapperData']
type WrapperData = Awaited<ReturnType<GetWrapperDataFunc>>

type Props = {
  name: string
  is2LDEth: boolean
  isCachedData: boolean
  wrapperData: WrapperData
  parentWrapperData: WrapperData
}

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
  is2LDEth,
  wrapperData,
  parentWrapperData,
  isCachedData,
}: Props) => {
  const { address } = useAccount()
  const { showDataInput } = useTransactionFlow()
  const { t } = useTranslation('profile')

  const nameParts = name.split('.')
  const parentName = nameParts.slice(1).join('.')
  const isSubname = nameParts.length > 2

  const isParentLocked = is2LDEth
    ? true
    : parentWrapperData?.fuseObj.PARENT_CANNOT_CONTROL && parentWrapperData?.fuseObj.CANNOT_UNWRAP

  const isUserParentOwner = address === parentWrapperData?.owner
  const isUserOwner = address === wrapperData?.owner

  // Ownership Label
  const ownershipStatus = useMemo(() => {
    if (!isSubname) return
    return isParentLocked ? 'parent-cannot-control' : 'parent-can-control'
  }, [isSubname, isParentLocked])

  // Changes Label
  const editorStatus = useMemo(() => {
    if (wrapperData?.fuseObj.CANNOT_BURN_FUSES) return 'owner-cannot-change'
    if (isParentLocked) return 'owner-can-change'
    return 'parent-can-change'
  }, [wrapperData, isParentLocked])

  const showUnwrapWarning = isUserParentOwner && !parentWrapperData?.fuseObj.CANNOT_UNWRAP

  const buttonProps = useMemo(() => {
    if (isUserParentOwner && ownershipStatus === 'parent-can-control')
      return {
        onClick: () => {
          showDataInput(`revoke-permissions-${name}`, 'RevokePermissions', {
            name,
            flowType: 'revoke-pcc',
            fuseObj: wrapperData!.fuseObj,
            owner: wrapperData!.owner,
            // minExpiry: wrapperData!.expiryDate?.getTime(),
            // maxExpiry: parentWrapperData?.expiryDate?.getTime(),
            minExpiry: new Date(Date.now()).getTime(),
            maxExpiry: new Date(Date.now() + 12096e5).getTime(),
          })
        },
        disabled: showUnwrapWarning,
        text: t('tabs.permissions.ownership.action.giveUpControl'),
      }
    if (isUserOwner && editorStatus === 'owner-can-change')
      return {
        onClick: () => {
          showDataInput(`revoke-permissions-${name}`, 'RevokePermissions', {
            name,
            flowType: 'revoke-change-fuses',
            fuseObj: wrapperData!.fuseObj,
            owner: wrapperData!.owner,
            // minExpiry: wrapperData!.expiryDate?.getTime(),
            // maxExpiry: parentWrapperData?.expiryDate?.getTime(),
            minExpiry: new Date(Date.now()).getTime(),
            maxExpiry: new Date(Date.now() + 12096e5).getTime(),
          })
        },
        text: t('tabs.permissions.ownership.action.revokePermission'),
      }
  }, [
    isUserParentOwner,
    ownershipStatus,
    isUserOwner,
    editorStatus,
    showUnwrapWarning,
    t,
    showDataInput,
    name,
    wrapperData,
  ])

  return (
    <Section $isCached={isCachedData}>
      {ownershipStatus === 'parent-cannot-control' && (
        <SectionItem icon="disabled" date-testid="parent-cannot-control">
          <Typography fontVariant="bodyBold">
            <Trans
              t={t}
              i18nKey="tabs.permissions.ownership.parentCannotControl.label"
              values={{ parent: parentName }}
              components={{ parentLink: <AccountLink nameOrAddress={parentName} /> }}
            />
          </Typography>
          <TypographyGreyDim fontVariant="extraSmall">Revoked Oct 27, 2022</TypographyGreyDim>
          <Typography fontVariant="small">
            {t('tabs.permissions.ownership.parentCannotControl.sublabel')}
          </Typography>
          <SectionList title={t('tabs.permissions.ownership.parentCannotControl.list.title')}>
            <li>
              {t('tabs.permissions.ownership.parentCannotControl.list.item1', {
                date: 'Jan 1, 2036',
              })}
            </li>
            <li>
              {t('tabs.permissions.ownership.parentCannotControl.list.item2', {
                date: 'Jan 3, 3222',
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
              components={{ parentLink: <AccountLink nameOrAddress={parentName} /> }}
            />
          </Typography>
          <SectionList title={t('tabs.permissions.ownership.parentCanControl.list.title')}>
            <li>{t('tabs.permissions.ownership.parentCanControl.list.item1')}</li>
            <li>{t('tabs.permissions.ownership.parentCanControl.list.item2')}</li>
            <li>{t('tabs.permissions.ownership.parentCanControl.list.item3')}</li>
          </SectionList>
        </SectionItem>
      )}
      {editorStatus === 'owner-can-change' && (
        <SectionItem icon="info" date-testid="owner-can-change">
          <Typography fontVariant="bodyBold">
            {t('tabs.permissions.ownership.ownerCanChange.label')}
          </Typography>
          <SectionList title={t('tabs.permissions.ownership.ownerCanChange.list.title')}>
            <li>{t('tabs.permissions.ownership.ownerCanChange.list.item1')}</li>
            <li>{t('tabs.permissions.ownership.ownerCanChange.list.item2')}</li>
          </SectionList>
        </SectionItem>
      )}
      {editorStatus === 'owner-cannot-change' && (
        <SectionItem icon="disabled" date-testid="owner-cannot-change">
          <Typography fontVariant="bodyBold">
            {t('tabs.permissions.ownership.ownerCannotChange.label')}
          </Typography>
          <TypographyGreyDim fontVariant="extraSmall">Revoked Oct 27, 2022</TypographyGreyDim>
          <SectionList title={t('tabs.permissions.ownership.ownerCannotChange.list.title')}>
            <li>{t('tabs.permissions.ownership.ownerCanChange.list.item1')}</li>
            <li>{t('tabs.permissions.ownership.ownerCanChange.list.item2')}</li>
          </SectionList>
        </SectionItem>
      )}
      {editorStatus === 'parent-can-change' && (
        <SectionItem icon="info" date-testid="parent-can-change">
          <Typography fontVariant="bodyBold">
            <Trans
              t={t}
              i18nKey="tabs.permissions.ownership.parentCanChange.label"
              values={{ parent: parentName }}
              components={{ parentLink: <AccountLink nameOrAddress={parentName} /> }}
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
              <Button onClick={buttonProps.onClick} disabled={!!buttonProps.disabled}>
                {buttonProps.text}
              </Button>
            </div>
          </ButtonRow>
        </SectionFooter>
      )}
    </Section>
  )
}
