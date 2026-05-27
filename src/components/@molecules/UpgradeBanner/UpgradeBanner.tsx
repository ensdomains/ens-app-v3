import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

/**
 * UpgradeBanner ("A new ENS app is here!")
 *
 * Pink banner that prompts users to switch to the new Manager app at
 * https://app.ens.dev. Shown wherever the legacy v1 flow has been disabled
 * on-chain (e.g. registration / renewal once the ETHRegistrarController is
 * removed from BaseRegistrarImplementation).
 *
 * Visual reference: Figma node `10:3826` ("Upgrade Banner") in the
 * Manager v3 / ENSv2 file. The colours are custom garnet / pink tones that
 * don't map to Thorin's banner variants, so this is a bespoke component.
 */

const GARNET_900 = '#5a0024'
const GARNET_500 = '#e72a96'
const GARNET_50 = '#fff6f9'
const PINK_TOP = '#feeaf0'
const PINK_BOTTOM = '#ffbcdb'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.space['4']};
    background-image: linear-gradient(180deg, ${PINK_TOP} 0%, ${PINK_BOTTOM} 174%);
    width: 100%;
  `,
)

const Inner = styled.div(
  ({ theme }) => css`
    display: flex;
    flex: 1 0 0;
    align-items: center;
    gap: ${theme.space['4']};
    max-width: 780px;
    min-width: 0;
  `,
)

const Content = styled.div(
  () => css`
    display: flex;
    flex: 1 0 0;
    flex-direction: column;
    align-items: flex-start;
    min-width: 0;
    overflow-wrap: break-word;
  `,
)

const Title = styled.p(
  () => css`
    margin: 0;
    width: 100%;
    font-size: 16px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: -0.32px;
    color: ${GARNET_900};
  `,
)

const Subtitle = styled.p(
  () => css`
    margin: 0;
    width: 100%;
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 0.14px;
    color: ${GARNET_500};
  `,
)

const CTA = styled.a(
  ({ theme }) => css`
    position: relative;
    display: inline-flex;
    align-items: center;
    justify-content: center;
    flex-shrink: 0;
    height: 46px;
    padding: ${theme.space['2.5']} ${theme.space['5']};
    border-radius: ${theme.radii.medium};
    background-color: ${GARNET_900};
    color: ${GARNET_50};
    font-size: 14px;
    font-weight: 500;
    line-height: normal;
    letter-spacing: 0.56px;
    text-transform: uppercase;
    text-decoration: none;
    white-space: nowrap;
    box-shadow: inset 0 -3px 0 0 rgba(0, 0, 0, 0.35);
    transition: filter 0.15s ease-in-out;
    cursor: pointer;

    &:hover {
      filter: brightness(1.1);
    }

    &:focus-visible {
      outline: 2px solid ${GARNET_500};
      outline-offset: 2px;
    }
  `,
)

type Props = {
  /**
   * Destination URL for the "Open new app" CTA. Defaults to the Manager root
   * (`https://app.ens.dev`). Pass a deep link (e.g. `/register/<name>` or
   * `/renew/<name>`) when there's a meaningful target for the user's flow.
   */
  href?: string
  className?: string
}

const DEFAULT_HREF = 'https://app.ens.dev'

const UpgradeBanner = ({ href = DEFAULT_HREF, className }: Props) => {
  const { t } = useTranslation('common')

  return (
    <Container className={className} data-testid="upgrade-banner">
      <Inner>
        <Content>
          <Title>{t('upgradeBanner.title')}</Title>
          <Subtitle>{t('upgradeBanner.subtitle')}</Subtitle>
        </Content>
        <CTA href={href} rel="noopener noreferrer">
          {t('upgradeBanner.cta')}
        </CTA>
      </Inner>
    </Container>
  )
}

export default UpgradeBanner
