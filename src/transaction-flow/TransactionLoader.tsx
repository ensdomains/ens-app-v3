import styled, { css } from 'styled-components'

import { Spinner } from '@ensdomains/thorin'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${theme.space[4]};
    width: 100%;
  `,
)

const TransactionLoader = () => {
  return (
    <Container>
      <Spinner color="accent" />
    </Container>
  )
}

export default TransactionLoader
