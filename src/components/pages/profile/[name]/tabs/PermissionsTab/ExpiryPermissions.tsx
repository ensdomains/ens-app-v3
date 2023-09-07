import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { GetWrapperDataReturnType } from '@ensdomains/ensjs/public'
import { Button, Typography } from '@ensdomains/thorin'

import type { useFusesSetDates } from '@app/hooks/fuses/useFusesSetDates'
import type { useFusesStates } from '@app/hooks/fuses/useFusesStates'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { Section, SectionFooter, SectionItem } from './Section'

type FusesStates = ReturnType<typeof useFusesStates>
type FusesSetDates = ReturnType<typeof useFusesSetDates>['data']

type Props = {
  name: string
  wrapperData: GetWrapperDataReturnType | undefined
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
  const { usePreparedDataInput } = useTransactionFlow()
  const showRevokePermissionsInput = usePreparedDataInput('RevokePermissions')

  const handleRevokePermissions = () => {
    if (!wrapperData || !parentExpiry) return
    showRevokePermissionsInput(`revoke-permissions-${name}`, {
      name,
      owner: wrapperData.owner,
      parentFuses: wrapperData.fuses.parent,
      childFuses: wrapperData.fuses.child,
      flowType: 'grant-extend-expiry',
      minExpiry: expiry,
      maxExpiry: parentExpiry,
    })
  }

  const canExtendExpiry = wrapperData?.fuses.parent.CAN_EXTEND_EXPIRY

  const canCanExtendExpiryBeBurned =
    !canExtendExpiry && !wrapperData?.fuses.parent.PARENT_CANNOT_CONTROL && parentState === 'locked'

  const showChangePermissionsButton = canCanExtendExpiryBeBurned && isUserParentOwner

  return (
    <Section>
      {canExtendExpiry ? (
        <SectionItem icon="info" data-testid="owner-can-extend-expiry">
          <Typography fontVariant="bodyBold">
            {t(`tabs.permissions.expiry.permissions.canExtendExpiry.label`)}
          </Typography>
          {fusesSetDates?.CAN_EXTEND_EXPIRY && (
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
              context: expiryLabel ? 'date' : undefined,
            })}
          </Typography>
        </SectionItem>
      ) : (
        <>
          <SectionItem icon="disabled" data-testid="owner-cannot-extend-expiry">
            <Typography fontVariant="bodyBold">
              {t(`tabs.permissions.expiry.permissions.cannotExtendExpiry.label`)}
            </Typography>
            <Typography fontVariant="small">
              {t(`tabs.permissions.expiry.permissions.cannotExtendExpiry.description`, {
                date: expiryLabel,
                context: expiryLabel ? 'date' : undefined,
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
