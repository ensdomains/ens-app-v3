import { PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div(
  () => css`
    width: 100%;
    position: relative;
    padding-bottom: 25%;
  `,
)

const InnerContainer = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background-image: ${theme.colors.gradients.blue};
  `,
)

export const Banner = ({ children }: PropsWithChildren<{}>) => {
  return (
    <Container>
      <InnerContainer>{children}</InnerContainer>
    </Container>
  )
}
