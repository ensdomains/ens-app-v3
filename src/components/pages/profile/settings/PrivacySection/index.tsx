import { useTranslation } from 'react-i18next'

import { Button } from '@ensdomains/thorin'

import { HistoryItem } from '@app/components/@molecules/SearchInput/types'
import { useLocalStorage } from '@app/hooks/useLocalStorage'

import { SectionContainer } from '../Section'

export function PrivacySection() {
  const { t } = useTranslation('settings')

  const [history, setHistory] = useLocalStorage<HistoryItem[]>('search-history-v2', [])

  const canClear = !!history.length

  // SNRC: no analytics/trackers, so there is no cookie consent to manage here.
  // The only locally-stored item with a privacy angle is search history.
  return (
    <SectionContainer
      data-testid="privacy-section"
      title={t('section.privacy.title')}
      action={
        <Button
          size="small"
          colorStyle="accentSecondary"
          onClick={() => setHistory([])}
          disabled={!canClear}
          data-testid="history-clear-button"
        >
          {t('section.privacy.action.clearHistory')}
        </Button>
      }
    >
      {null}
    </SectionContainer>
  )
}
