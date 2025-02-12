import { useTranslation } from 'react-i18next'

import { Helper } from '@ensdomains/thorin'

import { SupportOutlink } from '@app/components/@atoms/SupportOutlink'
import { CenteredTypography } from '@app/transaction-flow/input/ProfileEditor/components/CenteredTypography'
import { getSupportLink } from '@app/utils/supportLinks'

import { DnsImportCard, DnsImportHeading } from '../shared'
import { SelectedItemProperties } from '../useDnsImportReducer'

export const ImportError = ({ selected }: { selected: SelectedItemProperties }) => {
  const { t } = useTranslation('dnssec', { keyPrefix: 'steps' })

  return (
    <DnsImportCard>
      <DnsImportHeading>{t('selectType.title', { name: selected.name })}</DnsImportHeading>
      <CenteredTypography>{t('selectType.subtitle')}</CenteredTypography>
      <SupportOutlink href={getSupportLink('dnsNames')}>{t('selectType.learnMore')}</SupportOutlink>
      <Helper type="error">{t('importError.message')}</Helper>
    </DnsImportCard>
  )
}
