import styled, { css } from 'styled-components'

import SocialDiscord from '@app/assets/social/SocialDiscord.svg'
import SocialDiscourse from '@app/assets/social/SocialDiscourse.svg'
import SocialDiscourseColour from '@app/assets/social/SocialDiscourseColour.svg'
import SocialGithub from '@app/assets/social/SocialGithub.svg'
import SocialMirror from '@app/assets/social/SocialMirror.svg'
import SocialMirrorColour from '@app/assets/social/SocialMirrorColour.svg'
import SocialX from '@app/assets/social/SocialX.svg'
import SocialYoutube from '@app/assets/social/SocialYoutube.svg'

type Social = 'discord' | 'discourse' | 'github' | 'mirror' | 'x' | 'youtube'

const socials: { social: Social; icon: React.ElementType; coloredIcon?: React.ElementType }[] = [
  {
    social: 'discord',
    icon: SocialDiscord,
  },
  {
    social: 'discourse',
    icon: SocialDiscourse,
    coloredIcon: SocialDiscourseColour,
  },
  {
    social: 'github',
    icon: SocialGithub,
  },
  {
    social: 'mirror',
    icon: SocialMirror,
    coloredIcon: SocialMirrorColour,
  },
  {
    social: 'x',
    icon: SocialX,
  },
  {
    social: 'youtube',
    icon: SocialYoutube,
  },
]

const SocialIconWrapper = styled.a(
  ({ theme }) => css`
    position: relative;
    cursor: pointer;
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${theme.space['6']};
    min-height: ${theme.space['6']};
  `,
)

const BaseStyledIcon = styled.div(
  () => css`
    height: 100%;
    position: absolute;
    transition: 0.15s all ease-in-out;
  `,
)

const StyledIcon = styled(BaseStyledIcon)<{ $iconColor?: string }>(
  ({ theme, $iconColor }) => css`
    fill: ${theme.colors.greyPrimary};

    ${SocialIconWrapper}:hover && {
      fill: ${$iconColor};
    }
  `,
)

const StyledColoredIcon = styled(BaseStyledIcon)(
  () => css`
    opacity: 0;

    ${SocialIconWrapper}:hover && {
      opacity: 1;
    }
  `,
)

export const SocialIcon = ({
  color,
  href,
  social,
  Icon,
  ColoredIcon,
}: {
  social: Social
  color?: string
  href: string
  Icon?: React.ElementType
  ColoredIcon?: React.ElementType
}) => {
  const { icon, coloredIcon } = socials.find((i) => i.social === social) as (typeof socials)[number]

  return (
    <SocialIconWrapper href={href} target="_blank" data-testid={`social-icon-${social}`}>
      <StyledIcon key={href} $iconColor={color} as={Icon ?? icon} />
      {coloredIcon && <StyledColoredIcon as={ColoredIcon ?? coloredIcon} />}
    </SocialIconWrapper>
  )
}
