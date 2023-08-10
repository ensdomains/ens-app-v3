import ISO6391 from 'iso-639-1'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import {
  CurrencyToggle,
  LanguageSVG,
  RightChevronSVG,
  Spinner,
  Typography,
  WalletSVG,
  mq,
} from '@ensdomains/thorin'

import SocialDiscord from '@app/assets/social/SocialDiscord.svg'
import SocialDiscourse from '@app/assets/social/SocialDiscourse.svg'
import SocialDiscourseColour from '@app/assets/social/SocialDiscourseColour.svg'
import SocialGithub from '@app/assets/social/SocialGithub.svg'
import SocialMirror from '@app/assets/social/SocialMirror.svg'
import SocialMirrorColour from '@app/assets/social/SocialMirrorColour.svg'
import SocialTwitter from '@app/assets/social/SocialTwitter.svg'
import SocialYoutube from '@app/assets/social/SocialYoutube.svg'
import BaseLink from '@app/components/@atoms/BaseLink'
import { SocialIcon } from '@app/components/SocialIcon'
import { useChainName } from '@app/hooks/useChainName'
import useGasPrice from '@app/hooks/useGasPrice'
import { routes } from '@app/routes'
import { useGraphOutOfSync } from '@app/utils/SyncProvider/SyncProvider'
import { makeDisplay } from '@app/utils/currency'
import useUserConfig from '@app/utils/useUserConfig'

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    background-color: ${theme.colors.background};

    padding: ${theme.space['4']};
    gap: ${theme.space['2']};

    ${mq.sm.min(css`
      padding: 0;
      gap: 0;
      & > div {
        border-bottom: 1px solid ${theme.colors.border};
      }

      & > div:last-child {
        border-bottom: none;
      }
    `)}
  `,
)

const SettingsSection = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    padding: 0;
    margin-bottom: ${theme.space['2']};
    gap: ${theme.space['2']};

    ${mq.sm.min(css`
      padding: ${theme.space['2']};
      margin: 0;
      gap: 0;
    `)}
  `,
)

const SettingsItem = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    padding: ${theme.space['4']};
    height: ${theme.space['13']};

    border-radius: ${theme.radii.large};
    border: 1px solid ${theme.colors.border};

    & > div:first-child {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: ${theme.space['2']};

      svg {
        display: block;
      }
    }

    ${mq.sm.min(css`
      border: none;
    `)}
  `,
)

const HoverableSettingsItem = styled(SettingsItem)(
  ({ theme }) => css`
    transition: all 0.1s ease-in-out;
    cursor: pointer;

    & > div:last-child {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-end;
      gap: ${theme.space['1']};

      svg {
        width: ${theme.space['3']};
        height: ${theme.space['3']};
        display: block;
      }
    }

    &:hover {
      background-color: ${theme.colors.greySurface};
    }
  `,
)

const miscSectionStyle = css(
  ({ theme }) => css`
    background-color: ${theme.colors.greySurface};
    border-radius: ${theme.radii.large};

    ${mq.sm.min(css`
      background-color: transparent;
      border-radius: none;
    `)}
  `,
)

const RoutesSection = styled.div(
  ({ theme }) => css`
    width: 100%;
    padding: ${theme.space['2']};

    display: grid;
    grid-template-columns: repeat(2, 1fr);
  `,
  miscSectionStyle,
)

const RouteItem = styled.a(
  ({ theme }) => css`
    transition: all 0.1s ease-in-out;
    text-align: left;
    padding: ${theme.space['2']} ${theme.space['2']};
    border-radius: ${theme.radii.large};

    &:hover {
      background-color: ${theme.colors.greySurface};
    }

    ${mq.sm.min(css`
      padding: ${theme.space['2']} ${theme.space['4']};
    `)}
  `,
)

const SocialSection = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.space['4']} ${theme.space['6']};
  `,
  miscSectionStyle,
)

const NetworkSectionContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    padding: ${theme.space['2']};

    #chain-name {
      text-transform: capitalize;
    }

    ${mq.sm.min(css`
      padding: ${theme.space['4']} ${theme.space['6']};
    `)}
  `,
  miscSectionStyle,
)

const NetworkSectionRow = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    text-align: center;
  `,
)

const NetworkSection = () => {
  const { t } = useTranslation('common')
  const graphOutOfSync = useGraphOutOfSync()
  const chainName = useChainName()
  const { gasPrice } = useGasPrice()

  return (
    <NetworkSectionContainer>
      <NetworkSectionRow>
        {graphOutOfSync && <Spinner color="accent" />}
        <Typography id="chain-name" weight="bold" color="text">
          {chainName}
        </Typography>
        {gasPrice && (
          <Typography color="grey">{makeDisplay(gasPrice, undefined, 'Gwei', 9)}</Typography>
        )}
      </NetworkSectionRow>
      {graphOutOfSync && (
        <NetworkSectionRow>
          <Typography fontVariant="small">{t('navigation.syncMessage')}</Typography>
        </NetworkSectionRow>
      )}
    </NetworkSectionContainer>
  )
}

const disconnectedRoutes = routes.filter(
  (route) => route.name !== 'search' && route.connected === false,
)

const MainMenu = ({ setCurrentView }: { setCurrentView: (view: 'main' | 'language') => void }) => {
  const { t, i18n } = useTranslation('common')
  const language = i18n.resolvedLanguage || 'en'
  const { userConfig, setCurrency } = useUserConfig()

  return (
    <Container>
      <SettingsSection>
        <HoverableSettingsItem onClick={() => setCurrentView('language')}>
          <div>
            <LanguageSVG />
            <Typography weight="bold">{t('navigation.language')}</Typography>
          </div>
          <div>
            <Typography>
              {ISO6391.getNativeName(language)} ({language.toLocaleUpperCase()})
            </Typography>
            <RightChevronSVG />
          </div>
        </HoverableSettingsItem>
        <SettingsItem>
          <div>
            <WalletSVG />
            <Typography weight="bold">{t('navigation.currency')}</Typography>
          </div>
          <div>
            <CurrencyToggle
              size="extraSmall"
              fiat={userConfig.fiat}
              checked={userConfig.currency === 'fiat'}
              onChange={(e) => setCurrency(e.target.checked ? 'fiat' : 'eth')}
            />
          </div>
        </SettingsItem>
      </SettingsSection>
      <RoutesSection>
        {disconnectedRoutes.map((route) => (
          <BaseLink href={route.href} passHref key={route.href}>
            <RouteItem {...(route.href.startsWith('http') ? { target: '_blank' } : {})}>
              <Typography>{t(route.label)}</Typography>
            </RouteItem>
          </BaseLink>
        ))}
      </RoutesSection>
      <SocialSection>
        <SocialIcon Icon={SocialTwitter} color="#5298FF" href="https://twitter.com/ensdomains" />
        <SocialIcon Icon={SocialGithub} color="#0F0F0F" href="https://github.com/ensdomains" />
        <SocialIcon Icon={SocialDiscord} color="#7F83FF" href="https://chat.ens.domains" />
        <SocialIcon
          Icon={SocialMirror}
          ColoredIcon={SocialMirrorColour}
          href="https://ens.mirror.xyz"
        />
        <SocialIcon
          Icon={SocialDiscourse}
          ColoredIcon={SocialDiscourseColour}
          href="https://discuss.ens.domains/"
        />
        <SocialIcon
          Icon={SocialYoutube}
          color="#EE1919"
          href="https://www.youtube.com/ensdomains"
        />
      </SocialSection>
      <NetworkSection />
    </Container>
  )
}

export default MainMenu
