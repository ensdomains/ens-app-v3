import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { LeftArrowSVG, ThemeSVG, ThemeToggle, Typography } from '@ensdomains/thorin'

import type { HamburgerView } from './Hamburger'

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    align-items: stretch;
    justify-content: flex-start;

    padding: ${theme.space['4']};
    gap: ${theme.space['4']};

    @media (min-width: ${theme.breakpoints.sm}px) {
      flex-direction: column;
      padding: 0;
      gap: 0;
    }
  `,
)

const HeadingWrapper = styled.div(
  ({ theme }) => css`
    @media (min-width: ${theme.breakpoints.sm}px) {
      border-bottom: 1px solid ${theme.colors.border};
    }
  `,
)

const Heading = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    gap: ${theme.space['2']};
    padding: ${theme.space['2']} ${theme.space['4']};

    border-radius: ${theme.radii.large};

    cursor: pointer;
    transition: all 0.1s ease-in-out;

    &:hover {
      background-color: ${theme.colors.greySurface};
    }

    & > svg {
      color: ${theme.colors.grey};
    }

    @media (min-width: ${theme.breakpoints.sm}px) {
      justify-content: flex-start;
      padding: ${theme.space['4']} ${theme.space['6']};
      margin: ${theme.space['2']};

      & > svg {
        color: ${theme.colors.text};
      }

      & > div > svg {
        display: none;
      }
    }
  `,
)

const InnerHeading = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['2']};
  `,
)

export const ThemeMenu = ({
  setCurrentView,
}: {
  setCurrentView: (view: HamburgerView) => void
}) => {
  const { t } = useTranslation()

  return (
    <Container>
      <HeadingWrapper>
        <Heading onClick={() => setCurrentView('main')}>
          <LeftArrowSVG width={16} height={16} />
          <InnerHeading>
            <ThemeSVG height={16} width={16} />
            <Typography weight="bold">{t('navigation.theme')}</Typography>
          </InnerHeading>
        </Heading>
      </HeadingWrapper>
      <ThemeToggle
        labels={{
          light: t('navigation.mode.light'),
          dark: t('navigation.mode.dark'),
          system: t('navigation.mode.system'),
        }}
      />
    </Container>
  )
}
