import { useMemo } from 'react'
import { UseFormRegister } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CurrentFuses } from '@ensdomains/ensjs/utils/fuses'
import { Dialog } from '@ensdomains/thorin'

import { PermissionsCheckbox } from '@app/components/@molecules/PermissionsCheckbox/PermissionsCheckbox'

import type { FormData } from '../RevokePermissions-flow'

type Fuse = keyof CurrentFuses

type Props = {
  fuses: Fuse[]
  register: UseFormRegister<FormData>
  showCannotBurnFuses: boolean
  onDismiss: () => void
}

const PERMISSIONS: Fuse[] = [
  'CANNOT_CREATE_SUBDOMAIN',
  'CANNOT_TRANSFER',
  'CANNOT_SET_RESOLVER',
  'CANNOT_SET_TTL',
  'CANNOT_BURN_FUSES',
]

const PermissionsList = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[2]};
  `,
)

export const RevokePermissionsView = ({
  fuses,
  showCannotBurnFuses,
  register,
  onDismiss,
}: Props) => {
  const { t } = useTranslation('transactionFlow')

  const availableFuses: Fuse[] = useMemo(
    () =>
      PERMISSIONS.filter((fuse) => {
        const fusesIncluded = fuses.includes(fuse)
        if (fuse === 'CANNOT_BURN_FUSES') return showCannotBurnFuses && fusesIncluded
        return fusesIncluded
      }),
    [fuses, showCannotBurnFuses],
  )

  return (
    <>
      <Dialog.Heading
        title={t('input.revokePermissions.views.revokePermissions.title')}
        onDismiss={() => onDismiss()}
      />
      <PermissionsList>
        {availableFuses.map((fuse) => (
          <PermissionsCheckbox
            key={fuse}
            title={t(`input.revokePermissions.views.revokePermissions.fuses.${fuse}`)}
            {...register(`fuseObj.${fuse}`)}
          />
        ))}
      </PermissionsList>
    </>
  )
}
