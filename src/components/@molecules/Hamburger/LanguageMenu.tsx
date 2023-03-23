import ISO6391 from 'iso-639-1'
import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CheckCircleSVG, LanguageSVG, LeftArrowSVG, Typography, mq } from '@ensdomains/thorin'

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    align-items: stretch;
    justify-content: flex-start;

    padding: ${theme.space['4']};
    gap: ${theme.space['4']};

    ${mq.sm.min(css`
      flex-direction: column;
      padding: 0;
      gap: 0;
    `)}
  `,
)

const HeadingWrapper = styled.div(
  ({ theme }) => css`
    ${mq.sm.min(css`
      border-bottom: 1px solid ${theme.colors.border};
    `)}
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

    ${mq.sm.min(css`
      justify-content: flex-start;
      padding: ${theme.space['4']} ${theme.space['6']};
      margin: ${theme.space['2']};

      & > svg {
        color: ${theme.colors.text};
      }

      & > div > svg {
        display: none;
      }
    `)}
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
    ${mq.sm.min(css`
      flex-direction: column;
      padding: ${theme.space['2']};
      gap: 0;
    `)}
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
      svg {
        display: block;
        color: ${theme.colors.green};
      }
    }

    ${mq.sm.min(css`
      border: none;
    `)}
  `,
)

const CheckIcon = styled.svg(() => css``)

const LanguageMenu = ({
  setCurrentView,
}: {
  setCurrentView: (view: 'main' | 'language') => void
}) => {
  const { i18n } = useTranslation()
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const initialLanguage = useMemo(() => i18n.resolvedLanguage, [])
  const languages = (i18n.options.supportedLngs || [])
    .filter((lang: string) => lang && lang !== 'cimode')
    .sort((a, b) => {
      if (a === initialLanguage) {
        return -1
      }
      if (b === initialLanguage) {
        return 1
      }
      return a.localeCompare(b)
    })

  return (
    <Container>
      <HeadingWrapper>
        <Heading onClick={() => setCurrentView('main')}>
          <LeftArrowSVG />
          <InnerHeading>
            <LanguageSVG />
            <Typography weight="bold">Language</Typography>
          </InnerHeading>
        </Heading>
      </HeadingWrapper>
      <LanguagesContainer>
        {languages.map((lang: string) => (
          <LanguageItem key={lang} onClick={() => i18n.changeLanguage(lang)}>
            <div>
              <CheckIcon
                as={CheckCircleSVG}
                style={{ display: i18n.resolvedLanguage === lang ? 'block' : 'none' }}
              />
              <Typography>{ISO6391.getNativeName(lang)}</Typography>
            </div>
            <Typography>{lang.toLocaleUpperCase()}</Typography>
          </LanguageItem>
        ))}
      </LanguagesContainer>
    </Container>
  )
}

export default LanguageMenu
