import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CurrentFuses } from '@ensdomains/ensjs/utils/fuses'
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

type NameChangeFuse = keyof Pick<
  CurrentFuses,
  | 'CANNOT_UNWRAP'
  | 'CANNOT_CREATE_SUBDOMAIN'
  | 'CANNOT_TRANSFER'
  | 'CANNOT_SET_RESOLVER'
  | 'CANNOT_SET_TTL'
>

type FuseItem = {
  fuse: NameChangeFuse
  translationKey: string
  revoked?: string
}

const PERMISSIONS: NameChangeFuse[] = [
  'CANNOT_UNWRAP',
  'CANNOT_CREATE_SUBDOMAIN',
  'CANNOT_TRANSFER',
  'CANNOT_SET_RESOLVER',
  'CANNOT_SET_TTL',
]

const PERMISSION_TRANSLATION_KEY: Record<NameChangeFuse, { burned: string; unburned: string }> = {
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

  const permissions = PERMISSIONS.reduce<{ burned: FuseItem[]; unburned: FuseItem[] }>(
    (acc, permission) => {
      const isBurned = wrapperData?.fuseObj[permission]
      if (isBurned)
        acc.burned.push({
          fuse: permission,
          translationKey: PERMISSION_TRANSLATION_KEY[permission].burned,
        })
      else
        acc.unburned.push({
          fuse: permission,
          translationKey: PERMISSION_TRANSLATION_KEY[permission].unburned,
        })
      return acc
    },
    { burned: [], unburned: [] },
  )

  const handleRevokePermissions = () => {
    showDataInput(`revoke-permissions-${name}`, 'RevokePermissions', {
      name,
      owner: 'test.eth',
      fuseObj: wrapperData!.fuseObj,
      flowType: 'revoke-permissions',
    })
  }

  return (
    <Section $isCached={isCachedData}>
      {permissions.unburned.map(({ translationKey }) => (
        <SectionItem icon="info">
          <Typography fontVariant="bodyBold">
            {t(`tabs.permissions.nameChangePermissions.permissions.${translationKey}.label`)}
          </Typography>
          <Typography fontVariant="small">
            {t(`tabs.permissions.nameChangePermissions.permissions.${translationKey}.description`, {
              owner: ownerLabel,
            })}{' '}
          </Typography>
        </SectionItem>
      ))}
      {permissions.burned.map(({ translationKey }) => (
        <SectionItem icon="disabled">
          <Typography fontVariant="bodyBold">
            {t(`tabs.permissions.nameChangePermissions.permissions.${translationKey}.label`)}
          </Typography>
          <TypographyGreyDim fontVariant="extraSmall">Revoked Oct 27, 2022</TypographyGreyDim>
          <Typography fontVariant="small">
            {t(`tabs.permissions.nameChangePermissions.permissions.${translationKey}.description`, {
              owner: ownerLabel,
            })}
          </Typography>
        </SectionItem>
      ))}
      <SectionFooter>
        <FooterContainer>
          <div>
            <Button onClick={handleRevokePermissions}>Revoke permissions</Button>
          </div>
        </FooterContainer>
      </SectionFooter>
    </Section>
  )
}
