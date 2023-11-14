import styled, { css } from 'styled-components'

import { Spinner } from '@ensdomains/thorin'

const Container = styled.div(
  () => css`
    width: 100%;
    height: 100%;
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
