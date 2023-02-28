import ISO6391 from 'iso-639-1'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CheckCircleSVG, LeftArrowSVG, Typography } from '@ensdomains/thorin'

const Container = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  `,
)

const HeadingWrapper = styled.div(
  ({ theme }) => css`
    border-bottom: 1px solid ${theme.colors.border};
  `,
)

const Heading = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    gap: ${theme.space['2']};
    padding: ${theme.space['4']} ${theme.space['6']};
    margin: ${theme.space['2']};

    border-radius: ${theme.radii.large};

    cursor: pointer;
    transition: all 0.1s ease-in-out;

    &:hover {
      background-color: ${theme.colors.greySurface};
    }
  `,
)

const LanguagesContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    padding: ${theme.space['2']};
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
  `,
)

const LanguageMenu = ({
  setCurrentView,
}: {
  setCurrentView: (view: 'main' | 'language') => void
}) => {
  const { i18n } = useTranslation()
  const languages = (i18n.options.supportedLngs || []).filter(
    (lang: string) => lang && lang !== i18n.resolvedLanguage && lang !== 'cimode',
  )

  return (
    <Container>
      <HeadingWrapper>
        <Heading onClick={() => setCurrentView('main')}>
          <LeftArrowSVG />
          <Typography weight="bold">Language</Typography>
        </Heading>
      </HeadingWrapper>
      <LanguagesContainer>
        <LanguageItem>
          <div>
            <CheckCircleSVG />
            <Typography weight="bold">{ISO6391.getNativeName(i18n.resolvedLanguage)}</Typography>
          </div>
          <Typography>{i18n.resolvedLanguage.toLocaleUpperCase()}</Typography>
        </LanguageItem>
        {languages.map((lang: string) => (
          <LanguageItem key={lang} onClick={() => i18n.changeLanguage(lang)}>
            <div>
              <div style={{ width: '16px' }} />
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
