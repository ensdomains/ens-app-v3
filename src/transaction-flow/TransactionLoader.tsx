import styled, { css } from 'styled-components'

import { Spinner } from '@ensdomains/thorin'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    padding: ${theme.space[4]};
    width: 100%;

    @media (min-width: ${theme.breakpoints.sm}px) {
      width: calc(80vw - 2 * ${theme.space['6']});
      max-width: ${theme.space['128']};
    }
  `,
)

const TransactionLoader = ({ isComponentLoader }: { isComponentLoader?: boolean }) => {
  return (
    <Container className={`transaction-loader ${isComponentLoader ? 'component-loader' : ''}`}>
      <Spinner color="accent" />
    </Container>
  )
}

export default TransactionLoader
