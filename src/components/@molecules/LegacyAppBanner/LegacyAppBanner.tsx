import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Banner } from '@ensdomains/thorin'

/**
 * LegacyAppBanner ("You're on the legacy ENS app")
 *
 * Yellow warning banner shown on the home page in place of the standard
 * AnnouncementBanner ("ENSv2 Hub") when the legacy ETHRegistrarController
 * has been removed from BaseRegistrarImplementation (e.g. Sepolia post
 * ENSv2 beta). At that point this app's core flows (registration, renewal)
 * no longer work and users should be using the new Manager at app.ens.dev.
 *
 * Visual reference: Figma node `8:3126` ("Banners / legacy"). Implemented
 * with Thorin's standard warning Banner — the design uses the same colours
 * and shape as Thorin's `alert="warning"` variant.
 */

const Wrapper = styled.div(
  () => css`
    width: 100%;
    max-width: 466px;
    align-self: center;
  `,
)

const LegacyAppBanner = () => {
  const { t } = useTranslation('common')

  return (
    <Wrapper>
      <Banner alert="warning" title={t('legacyAppBanner.title')}>
        {t('legacyAppBanner.body')}
      </Banner>
    </Wrapper>
  )
}

export default LegacyAppBanner
