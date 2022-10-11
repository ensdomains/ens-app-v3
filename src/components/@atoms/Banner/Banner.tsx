import { PropsWithChildren } from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div<{ $zIndex?: number }>(
  ({ $zIndex }) => css`
    width: 100%;
    aspect-ratio: 6/1;
    position: relative;
    ${$zIndex && `z-index: ${$zIndex};`}
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

type Props = {
  zIndex?: number
}

export const Banner = ({ zIndex, children }: PropsWithChildren<Props>) => {
  return (
    <Container $zIndex={zIndex}>
      <InnerContainer>{children}</InnerContainer>
    </Container>
  )
}
