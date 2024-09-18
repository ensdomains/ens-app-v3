import styled, { css } from 'styled-components'

import { Spinner } from '@ensdomains/thorin'

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

export const SearchViewLoadingView = () => {
  return (
    <Container>
      <Spinner color="accent" size="medium" />
    </Container>
  )
}
