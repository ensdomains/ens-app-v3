import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Typography } from '@ensdomains/thorin'

import { useChainName } from '@app/hooks/chain/useChainName'
import { AnnouncementPlacement, trackEvent } from '@app/utils/analytics'
import { useCookieConsent } from '@app/utils/analytics/cookies'

const ENSV2_PRICING_ARTICLE_URL =
  'https://support.ens.domains/en/articles/15122781-what-s-changing-with-ensv2-pricing-discounts-and-grace-period'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    width: ${theme.space.full};
    padding: ${theme.space['4']};
    align-items: stretch;
    justify-content: space-between;
    gap: ${theme.space['4']};
    align-self: center;
    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.backgroundPrimary};
    border: 1px solid ${theme.colors.border};

    & > a {
      width: 100%;
      flex-shrink: 0;
    }

    @media (min-width: ${theme.breakpoints.sm}px) {
      flex-direction: row;
      align-items: center;

      & > a {
        width: auto;
      }
    }
  `,
)

const TextContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['4']};

    width: ${theme.space.full};
    min-width: 0;

    img {
      flex-shrink: 0;
    }
  `,
)

const Text = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    min-width: 0;
    overflow-wrap: anywhere;
  `,
)

const CTA = styled(Button)(
  ({ theme }) => css`
    &:focus-visible {
      outline: 2px solid ${theme.colors.bluePrimary};
      outline-offset: 2px;
    }
  `,
)

export const AnnouncementBanner = ({ placement }: { placement: AnnouncementPlacement }) => {
  const { t } = useTranslation('ensv2')
  const { consent } = useCookieConsent()
  const chainName = useChainName()

  return (
    <Container data-testid="ensv2-announcement">
      <TextContainer>
        <img src="/migrate/confetti.png" alt="" height={33} width={33} />
        <Text>
          <Typography fontVariant="largeBold">{t('banner.title')}</Typography>
          <Typography fontVariant="small" color="grey">
            {t('banner.caption')}
          </Typography>
        </Text>
      </TextContainer>
      <CTA
        as="a"
        href={ENSV2_PRICING_ARTICLE_URL}
        colorStyle="greenPrimary"
        width="max"
        size="small"
        onClick={() => {
          if (consent === 'yes') trackEvent('ensv2:banner_click', chainName, { placement })
        }}
      >
        {t('banner.cta')}
      </CTA>
    </Container>
  )
}
