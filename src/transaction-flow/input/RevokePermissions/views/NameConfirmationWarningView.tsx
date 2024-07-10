import { useTranslation } from 'react-i18next'

import { Dialog, Input } from '@ensdomains/thorin'

import { CenterAlignedTypography } from '../components/CenterAlignedTypography'

export const NameConfirmationWarningView = ({
  expiry,
  name,
  setDisabled,
}: {
  expiry: Date
  name: string
  setDisabled: (v: boolean) => void
}) => {
  const { t } = useTranslation('transactionFlow')

  return (
    <>
      <Dialog.Heading title={t('input.revokePermissions.views.lastWarning.title')} />
      <CenterAlignedTypography color="red" weight="bold">
        {t('input.revokePermissions.views.lastWarning.subtitle', {
          date: Intl.DateTimeFormat(undefined, {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
          }).format(expiry),
        })}
      </CenterAlignedTypography>
      <CenterAlignedTypography>
        {t('input.revokePermissions.views.lastWarning.message', { name })}
      </CenterAlignedTypography>
      <Input
        placeholder="Enter your UNS name"
        label=""
        data-testid="input-name-confirmation"
        onKeyDown={(e) => {
          if (e.key === 'Enter') e.preventDefault()
        }}
        onChange={(e) => {
          setDisabled(e.currentTarget.value !== name)
        }}
      />
    </>
  )
}
