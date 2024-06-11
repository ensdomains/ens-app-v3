import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { AlertSVG, Typography } from '@ensdomains/thorin'

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    height: 100%;
    min-height: ${theme.space['40']};
    display: flex;
    align-items: center;
    justify-content: center;
  `,
)

const Message = styled.div(
  ({ theme }) => css`
    color: ${theme.colors.yellow};
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: ${theme.space[2]};
    svg {
      width: ${theme.space[5]};
      height: ${theme.space[5]};
    }
  `,
)

export const SearchViewNoResultsView = () => {
  const { t } = useTranslation('transactionFlow')
  return (
    <Container>
      <Message>
        <AlertSVG />
        <Typography fontVariant="body">
          {t('input.sendName.views.search.views.noResults.message')}
        </Typography>
      </Message>
    </Container>
  )
}
