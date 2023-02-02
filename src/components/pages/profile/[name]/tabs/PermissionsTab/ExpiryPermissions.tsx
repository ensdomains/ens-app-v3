import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Typography } from '@ensdomains/thorin'

import type { useFusesStates } from '@app/hooks/fuses/useFusesStates'
import type { useGetFusesSetDates } from '@app/hooks/fuses/useGetFusesSetDates'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import type { useEns } from '@app/utils/EnsProvider'

import { Section, SectionFooter, SectionItem } from './Section'

type GetWrapperDataFunc = ReturnType<typeof useEns>['getWrapperData']
type WrapperData = Awaited<ReturnType<GetWrapperDataFunc>>
type FusesStates = ReturnType<typeof useFusesStates>
type FusesSetDates = ReturnType<typeof useGetFusesSetDates>['fusesSetDates']

type Props = {
  name: string
  wrapperData: WrapperData
  fusesSetDates: FusesSetDates
} & FusesStates

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

export const ExpiryPermissions = ({
  name,
  wrapperData,
  state,
  parentState,
  fusesSetDates,
  expiryLabel,
  isUserParentOwner,
  expiry,
  parentExpiry,
}: Props) => {
  const { t } = useTranslation('profile')
  const { showDataInput } = useTransactionFlow()

  const handleRevokePermissions = () => {
    if (!wrapperData) return
    showDataInput(`revoke-permissions-${name}`, 'RevokePermissions', {
      name,
      owner: wrapperData.owner,
      parentFuses: wrapperData.parent,
      childFuses: wrapperData.child,
      flowType: 'grant-extend-expiry',
      minExpiry: expiry,
      maxExpiry: parentExpiry,
    })
  }

  const canExtendExpiry = wrapperData?.parent?.CAN_EXTEND_EXPIRY

  const canCanExtendExpiryBeBurned =
    !canExtendExpiry && !wrapperData?.parent.PARENT_CANNOT_CONTROL && parentState === 'locked'

  const showChangePermissionsButton = canCanExtendExpiryBeBurned && isUserParentOwner

  return (
    <Section>
      {canExtendExpiry ? (
        <SectionItem icon="info">
          <Typography fontVariant="bodyBold">
            {t(`tabs.permissions.expiry.permissions.canExtendExpiry.label`)}
          </Typography>
          {fusesSetDates.CAN_EXTEND_EXPIRY && (
            <TypographyGreyDim fontVariant="extraSmall">
              {t('tabs.permissions.grantedLabel', { date: fusesSetDates.CAN_EXTEND_EXPIRY })}
            </TypographyGreyDim>
          )}
          <Typography fontVariant="small">
            {t(`tabs.permissions.expiry.permissions.canExtendExpiry.description`, {
              managerOrOwner:
                state === 'locked'
                  ? t('tabs.permissions.expiry.owner')
                  : t('tabs.permissions.expiry.manager'),
              date: expiryLabel,
            })}
          </Typography>
        </SectionItem>
      ) : (
        <>
          <SectionItem icon="disabled">
            <Typography fontVariant="bodyBold">
              {t(`tabs.permissions.expiry.permissions.cannotExtendExpiry.label`)}
            </Typography>
            <Typography fontVariant="small">
              {t(`tabs.permissions.expiry.permissions.cannotExtendExpiry.description`, {
                date: expiryLabel,
              })}
            </Typography>
          </SectionItem>
          {showChangePermissionsButton && (
            <SectionFooter>
              <FooterContainer>
                <div>
                  <Button data-testid="button-extend-expiry" onClick={handleRevokePermissions}>
                    {t('tabs.permissions.expiry.action.changePermissions')}
                  </Button>
                </div>
              </FooterContainer>
            </SectionFooter>
          )}
        </>
      )}
    </Section>
  )
}
