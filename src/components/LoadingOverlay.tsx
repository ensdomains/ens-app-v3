import { Heading, Spinner, tokens } from '@ensdomains/thorin'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'

const Container = styled.div`
  flex-grow: 1;
  display: flex;
  align-items: center;
  justify-content: center;
  flex-direction: row;
  flex-gap: ${tokens.space['4']};
  gap: ${tokens.space['4']};
`

export const LoadingOverlay = () => {
  const { t } = useTranslation('common')

  return (
    <Container>
      <Heading level="1">{t('loading')}</Heading>
      <Spinner size="large" color="accent" />
    </Container>
  )
}
