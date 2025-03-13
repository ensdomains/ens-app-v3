import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'

import { Button, Typography } from '@ensdomains/thorin'

import { HistoryItem } from '@app/components/@molecules/SearchInput/types'
import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { useCookieConsent } from '@app/utils/analytics/cookies'

import { SectionContainer } from '../Section'

const EntryContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    width: 100%;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
    border-radius: ${theme.radii.large};
    border: 1px solid ${theme.colors.border};
  `,
)

const EntryContentContainer = styled.div(
  ({ theme }) => css`
    flex: 1;
    flex-direction: column;
    gap: ${theme.space['1']};
  `,
)

export function PrivacySection() {
  const { t } = useTranslation('settings')

  const [history, setHistory] = useLocalStorage<HistoryItem[]>('search-history-v2', [])

  const canClear = !!history.length

  const { consent, lastConsentDate, setConsent, clearCookieConsent } = useCookieConsent()

  const formatDate = (date?: Date) => {
    if (!date) return 'Never'
    return new Intl.DateTimeFormat('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    }).format(date)
  }

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
      <EntryContainer>
        <EntryContentContainer>
          <Typography fontVariant="bodyBold">Cookie Consent</Typography>
          <Typography fontVariant="small">
            {match([consent, lastConsentDate])
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .with(['yes', P.instanceOf(Date)], ([_, date]) => (
                <>Cookies accepted on {formatDate(date)}</>
              ))
              .with(['yes', P.nullish], () => <>Cookies accepted</>)
              // eslint-disable-next-line @typescript-eslint/no-unused-vars
              .with(['no', P.instanceOf(Date)], ([_, date]) => (
                <>Cookies declined on {formatDate(date)}</>
              ))
              .with(['no', P.nullish], () => <>Cookies declined</>)
              .otherwise(() => (
                <>Cookie preferences not yet configured</>
              ))}
          </Typography>
        </EntryContentContainer>
        {consent === 'yes' ? (
          <Button
            colorStyle="accentSecondary"
            onClick={() => clearCookieConsent()}
            data-testid="cookie-reset-button"
            width="fit"
            size="small"
          >
            Reset Consent
          </Button>
        ) : (
          <Button
            colorStyle="accentPrimary"
            onClick={() => setConsent('yes')}
            data-testid="cookie-accept-button"
            width="fit"
            size="small"
          >
            Accept Cookies
          </Button>
        )}
      </EntryContainer>
    </SectionContainer>
  )
}
