import { PropsWithChildren, useRef, useState, useEffect } from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div(
  ({ theme }) => css`
    position: relative;
    border-radius: ${theme.radii.large};
    flex: 1;
    overflow: hidden;
  `,
)

const OverflowContainer = styled.div(
  () => css`
    position: relative;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
  `,
)

const OverflowIndicator = styled.div<{ $show: boolean }>(
  ({ $show }) => css`
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 150px;
    pointer-events: none;
    background: linear-gradient(
      180deg,
      rgba(255, 255, 255, 0) 0%,
      #bebebe 100%
    );
    z-index: 1000;
    opacity: ${$show ? 1 : 0};
    transition: opacity 0.3s ease-in-out;
  `,
)

const ScrollIndicatorContainer = ({ children }: PropsWithChildren<{}>) => {
  const ref = useRef<HTMLDivElement>(null)
  const [show, setShow] = useState(false)
  const handleScroll = () => {
    if (ref.current) {
      const { scrollTop, scrollHeight, clientHeight } = ref.current
      const scrollPercent = scrollTop / (scrollHeight - clientHeight)
      if (scrollPercent < 0.9) setShow(true)
      else setShow(false)
    }
  }

  useEffect(() => {
    handleScroll()
  }, [])

  return (
    <Container>
      <OverflowContainer ref={ref} onScroll={handleScroll}>
        {children}
      </OverflowContainer>
      <OverflowIndicator $show={show} />
    </Container>
  )
}

export default ScrollIndicatorContainer
