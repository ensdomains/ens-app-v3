import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { ScrollBox, Spinner } from '@ensdomains/thorin'

const SpinnerContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    padding: ${theme.space['4']} 0;

    display: flex;
    align-items: center;
    justify-content: center;
  `,
)

export const LoadingContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    height: ${theme.space['64']};

    display: flex;
    align-items: center;
    justify-content: center;
    flex-direction: column;
    gap: ${theme.space['4']};

    text-align: center;
  `,
)

export const SpinnerRow = () => (
  <SpinnerContainer>
    <Spinner color="accent" size="large" />
  </SpinnerContainer>
)

export const ScrollBoxWithSpinner = ({
  showSpinner,
  children,
  ...props
}: {
  showSpinner?: boolean
} & ComponentProps<typeof ScrollBox>) => {
  return (
    <ScrollBox {...props}>
      {children}
      {showSpinner && <SpinnerRow />}
    </ScrollBox>
  )
}
