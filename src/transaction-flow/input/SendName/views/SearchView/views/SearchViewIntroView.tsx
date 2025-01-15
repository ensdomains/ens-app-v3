import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { MagnifyingGlassSVG, Typography } from '@ensdomains/thorin'

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
    display: flex;
    flex-direction: column;
    justify-content: center;
    text-align: center;
    gap: ${theme.space[2]};
    align-items: center;
    color: ${theme.colors.accent};
    width: ${theme.space[40]};
  `,
)

export const SearchViewIntroView = () => {
  const { t } = useTranslation('transactionFlow')
  return (
    <Container>
      <Message>
        <MagnifyingGlassSVG height={16} width={16} />
        <Typography fontVariant="body">
          {t('input.sendName.views.search.views.intro.message')}
        </Typography>
      </Message>
    </Container>
  )
}
