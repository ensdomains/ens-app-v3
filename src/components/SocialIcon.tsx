import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { tokens } from '@ensdomains/thorin'
import { ElementType } from 'react'
import styled from 'styled-components'

const SocialIconWrapper = styled.a<{ $boxSize: keyof typeof tokens.space }>`
  position: relative;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: center;
  width: ${({ $boxSize }) => tokens.space[$boxSize]};
  min-height: ${({ $boxSize }) => tokens.space[$boxSize]};
`

const StyledIcon = styled.div<{ $iconColor?: string }>`
  height: 80%;
  position: absolute;
  transition: 0.15s all ease-in-out;
  fill: ${({ theme }) => tokens.colors[theme.mode].backgroundHide};
  ${SocialIconWrapper}:hover && {
    ${({ $iconColor }) => `fill: ${$iconColor};`};
  }
`

const StyledColoredIcon = styled.div`
  height: 80%;
  position: absolute;
  transition: 0.15s all ease-in-out;
  opacity: 0;
  ${SocialIconWrapper}:hover && {
    opacity: 1;
  }
`

export const SocialIcon = ({
  Icon,
  ColoredIcon,
  color,
  href,
}: {
  Icon: ElementType
  ColoredIcon?: ElementType
  color?: string
  href: string
}) => {
  const breakpoints = useBreakpoint()

  return (
    <SocialIconWrapper href={href} $boxSize={breakpoints.sm ? '10' : '8'}>
      <StyledIcon key={href} $iconColor={color} as={Icon} />
      {ColoredIcon && <StyledColoredIcon as={ColoredIcon} />}
    </SocialIconWrapper>
  )
}
