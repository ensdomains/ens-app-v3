import styled, { DefaultTheme, css, keyframes } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

const generateBgImg = (percent: number, theme: DefaultTheme) => css`
  background-image: linear-gradient(
    90deg,
    rgba(${theme.shadesRaw.foreground}, 1) 0%,
    rgba(${theme.shadesRaw.foreground}, 1) ${percent}%,
    rgba(${theme.shadesRaw.foreground}, 0) ${percent}%
  );
`

const ellipsesAnimation = ({ theme }: { theme: DefaultTheme }) => keyframes`
  33% {
    ${generateBgImg(33, theme)}
  }
  66% {
    ${generateBgImg(66, theme)}
  }
  100% {
    ${generateBgImg(100, theme)}
  }
`

export const TypographyWithAnimatedEllipses = styled(Typography)(
  ({ theme }) => css`
    &::after {
      content: '...';
      ${generateBgImg(100, theme)}
      /* stylelint-disable-next-line property-no-vendor-prefix */
      -webkit-background-clip: text;
      -webkit-text-fill-color: transparent;
      animation: ${ellipsesAnimation} 2s linear infinite;
    }
  `,
)
