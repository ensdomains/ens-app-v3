import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Typography } from '@ensdomains/thorin'

import type { useEns } from '@app/utils/EnsProvider'

import { useTransactionFlow } from '../../../../../../transaction-flow/TransactionFlowProvider'
import { Section, SectionFooter, SectionItem } from './Section'

type GetWrapperDataFunc = ReturnType<typeof useEns>['getWrapperData']
type WrapperData = Awaited<ReturnType<GetWrapperDataFunc>>

type Props = {
  isCachedData: boolean
  name: string
  wrapperData: WrapperData
  parentWrapperData: WrapperData
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

export const ExpiryPermissions = ({
  isCachedData,
  name,
  wrapperData,
  parentWrapperData,
}: Props) => {
  const { t } = useTranslation('profile')
  const { showDataInput } = useTransactionFlow()

  const nameParts = name.split('.')
  // const parentName = nameParts.slice(1).join('.')
  const isSubname = nameParts.length > 2

  const isLocked = isSubname
    ? parentWrapperData?.fuseObj.CANNOT_UNWRAP && parentWrapperData?.fuseObj.PARENT_CANNOT_CONTROL
    : true

  const ownerLabel = isLocked ? 'owner' : 'parent'

  const handleRevokePermissions = () => {
    showDataInput(`revoke-permissions-${name}`, 'RevokePermissions', {
      name,
      owner: 'test.eth',
      fuseObj: wrapperData!.fuseObj,
      flowType: 'revoke-permissions',
    })
  }

  const canExtendExpiry = !!(wrapperData?.fuseObj as any)?.CAN_EXTEND_EXPIRY

  return (
    <Section $isCached={isCachedData}>
      {canExtendExpiry ? (
        <SectionItem icon="info">
          <Typography fontVariant="bodyBold">
            {t(`tabs.permissions.expiry.permissions.canExtendExpiry.label`)}
          </Typography>
          <TypographyGreyDim fontVariant="extraSmall">Revoked Oct 27, 2022</TypographyGreyDim>
          <Typography fontVariant="small">
            {t(`tabs.permissions.expiry.permissions.canExtendExpiry.description`, {
              owner: ownerLabel,
              date: 'Oct 27, 2022',
            })}
          </Typography>
        </SectionItem>
      ) : (
        <SectionItem icon="disabled">
          <Typography fontVariant="bodyBold">
            {t(`tabs.permissions.expiry.permissions.cannotExtendExpiry.label`)}
          </Typography>
          <Typography fontVariant="small">
            {t(`tabs.permissions.expiry.permissions.cannotExtendExpiry.description`, {
              owner: ownerLabel,
              date: 'Oct 27, 2022',
            })}
          </Typography>
        </SectionItem>
      )}
      <SectionFooter>
        <FooterContainer>
          <div>
            <Button onClick={handleRevokePermissions}>Change permissions</Button>
          </div>
        </FooterContainer>
      </SectionFooter>
    </Section>
  )
}
