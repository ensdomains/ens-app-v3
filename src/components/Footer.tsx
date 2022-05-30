import mq from '@app/mediaQuery'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import SocialDiscord from '../assets/social/SocialDiscord.svg'
import SocialDiscourse from '../assets/social/SocialDiscourse.svg'
import SocialDiscourseColour from '../assets/social/SocialDiscourseColour.svg'
import SocialGithub from '../assets/social/SocialGithub.svg'
import SocialMedium from '../assets/social/SocialMedium.svg'
import SocialTwitter from '../assets/social/SocialTwitter.svg'
import SocialYoutube from '../assets/social/SocialYoutube.svg'
import { SocialIcon } from './SocialIcon'
import { StyledNavLink } from './StyledNavLink'

const Container = styled.footer`
  display: flex;
  flex-direction: column;
  align-items: center;
  margin-top: ${({ theme }) => theme.space['2.5']};
  ${mq.md.min`
    flex-direction: row;
  `}
`

const LinkContainer = styled.div`
  display: flex;
  direction: row;
  align-items: center;
  ${({ theme }) => `
  flex-gap: ${theme.space['4']};
  gap: ${theme.space['4']};
  `}
`

const FlexSeparator = styled.div`
  flex-grow: 1;
  margin-bottom: ${({ theme }) => theme.space['2.5']};
  ${mq.md.min`
    margin-bottom: 0;
  `}
`

const SocialIconContainer = styled.div`
  display: flex;
  flex-direction: row;
  ${({ theme }) => `
  flex-gap: ${theme.space['2']};
  gap: ${theme.space['2']};
  `}
`

export const Footer = () => {
  const { t } = useTranslation('common')

  return (
    <Container>
      <LinkContainer>
        <StyledNavLink disabled href="/bug-bounty">
          {t('navigation.bugBounty')}
        </StyledNavLink>
        <StyledNavLink disabled href="/media-kit">
          {t('navigation.mediaKit')}
        </StyledNavLink>
      </LinkContainer>
      <FlexSeparator />
      <SocialIconContainer>
        <SocialIcon
          Icon={SocialTwitter}
          color="#5298FF"
          href="https://twitter.com/ensdomains"
        />
        <SocialIcon
          Icon={SocialGithub}
          color="#0F0F0F"
          href="https://github.com/ensdomains"
        />
        <SocialIcon
          Icon={SocialDiscord}
          color="#7F83FF"
          href="https://chat.ens.domains"
        />
        <SocialIcon
          Icon={SocialMedium}
          color="#0F0F0F"
          href="https://medium.com/the-ethereum-name-service"
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
      </SocialIconContainer>
    </Container>
  )
}
