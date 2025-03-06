import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import {
  CheckCircleSVG,
  LanguageSVG,
  LeftArrowSVG,
  MoonSVG,
  SunSVG,
  Typography,
  useTheme,
} from '@ensdomains/thorin'

import { useLocalStorage } from '@app/hooks/useLocalStorage'

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

const LanguagesContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column-reverse;
    align-items: stretch;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    @media (min-width: ${theme.breakpoints.sm}px) {
      flex-direction: column;
      padding: ${theme.space['2']};
      gap: 0;
    }
  `,
)

const LanguageItem = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;

    padding: ${theme.space['4']};
    border-radius: ${theme.radii.large};
    border: 1px solid ${theme.colors.border};

    transition: all 0.1s ease-in-out;
    cursor: pointer;

    &:hover {
      background-color: ${theme.colors.greySurface};
    }

    & > div {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: flex-start;
      gap: ${theme.space['2']};
    }
    @media (min-width: ${theme.breakpoints.sm}px) {
      border: none;
    }
  `,
)

const CheckIcon = styled.svg(
  ({ theme }) => css`
    width: 1rem;
    height: 1rem;

    display: block;
    color: ${theme.colors.green};
  `,
)

export const ThemeMenu = ({
  setCurrentView,
}: {
  setCurrentView: (view: HamburgerView) => void
}) => {
  const { setMode, mode } = useTheme()
  const { t } = useTranslation()
  const [usingSystemTheme, setUsingSystemTheme] = useLocalStorage('usingSystemTheme', false)

  useEffect(() => {
    if (usingSystemTheme) {
      const darkQuery = window.matchMedia('(prefers-color-scheme: dark)')
      document.documentElement.setAttribute('data-theme', darkQuery.matches ? 'dark' : 'light')
      const listener = (event: MediaQueryListEvent) => {
        document.documentElement.setAttribute('data-theme', event.matches ? 'dark' : 'light')
      }
      darkQuery.addEventListener('change', listener)
      return () => darkQuery.removeEventListener('change', listener)
    }
  }, [usingSystemTheme])

  return (
    <Container>
      <HeadingWrapper>
        <Heading onClick={() => setCurrentView('main')}>
          <LeftArrowSVG width={16} height={16} />
          <InnerHeading>
            <LanguageSVG />
            <Typography weight="bold">{t('navigation.theme')}</Typography>
          </InnerHeading>
        </Heading>
      </HeadingWrapper>
      <LanguagesContainer>
        <LanguageItem
          onClick={() => {
            setMode('light')

            setUsingSystemTheme(false)
          }}
        >
          <div>
            <CheckIcon
              as={CheckCircleSVG}
              style={{ display: mode === 'light' && !usingSystemTheme ? 'block' : 'none' }}
            />
            <Typography>{t('navigation.mode.light')}</Typography>
          </div>
          <SunSVG height={16} width={16} />
        </LanguageItem>
        <LanguageItem
          onClick={() => {
            setMode('dark')

            setUsingSystemTheme(false)
          }}
        >
          <div>
            <CheckIcon
              as={CheckCircleSVG}
              style={{ display: mode === 'dark' && !usingSystemTheme ? 'block' : 'none' }}
            />
            <Typography>{t('navigation.mode.dark')}</Typography>
          </div>
          <MoonSVG height={16} width={16} />
        </LanguageItem>
        <LanguageItem
          onClick={() => {
            setUsingSystemTheme(true)
          }}
        >
          <div>
            <CheckIcon
              style={{ display: usingSystemTheme ? 'block' : 'none' }}
              as={CheckCircleSVG}
            />
            <Typography>{t('navigation.mode.system')}</Typography>
          </div>
          <MoonSVG height={16} width={16} />
        </LanguageItem>
      </LanguagesContainer>
    </Container>
  )
}
