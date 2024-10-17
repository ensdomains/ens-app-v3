import styled, { css, keyframes } from 'styled-components'

import { Colors, DefaultTheme } from '@ensdomains/thorin'

const dotOneAnimation = (theme: DefaultTheme, color: Colors) => keyframes`
  0% { background-color: ${theme.colors[color]} }
  14.285% { background-color: ${theme.colors.accentPrimary} }
  42.857% { background-color: ${theme.colors.accentPrimary} }
  57.142% { background-color: ${theme.colors[color]} }
`

const Dot = styled.div(
  ({ theme }) => css`
    width: ${theme.space['4']};
    height: ${theme.space['4']};
    border-radius: 50%;
  `,
)

const Container = styled.div<{ $animate: boolean; $color: Colors }>(
  ({ theme, $animate, $color }) => css`
    width: ${theme.space['22.5']};
    height: ${theme.space['4']};
    display: flex;
    justify-content: space-between;
    padding: 0 ${theme.space['0.25']};

    > div {
      background-color: ${theme.colors[$color]};
      ${$animate &&
      css`
        animation: ${dotOneAnimation(theme, $color)} 1050ms infinite;
      `}
    }

    > div:nth-child(2) {
      animation-delay: 150ms;
    }
    > div:nth-child(3) {
      animation-delay: 300ms;
    }
    > div:nth-child(4) {
      animation-delay: 450ms;
    }
  `,
)

export const StatusDots = ({ animate, color }: { animate: boolean; color: Colors }) => {
  return (
    <Container $animate={animate} $color={color}>
      <Dot />
      <Dot />
      <Dot />
      <Dot />
    </Container>
  )
}
