import { Heading, Spinner } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

const Container = styled.div(
  ({ theme }) => css`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: row;
    flex-gap: ${theme.space['4']};
    gap: ${theme.space['4']};
  `,
)

export const LoadingOverlay = () => {
  const { t } = useTranslation('common')

  return (
    <Container>
      <Heading level="1">{t('loading')}</Heading>
      <Spinner size="large" color="accent" />
    </Container>
  )
}
