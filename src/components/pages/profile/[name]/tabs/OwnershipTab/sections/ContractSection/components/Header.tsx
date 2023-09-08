import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { QuestionTooltip } from '@app/components/@molecules/QuestionTooltip/QuestionTooltip'

export const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space[2]};
  `,
)

export const Header = () => {
  return (
    <Container>
      <Typography fontVariant="headingFour">Contract address</Typography>
      <QuestionTooltip content="The address of the contract that enables Wrapped ENS names." />
    </Container>
  )
}
