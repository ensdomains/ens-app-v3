import {
  PropsWithChildren,
  useState,
  useEffect,
  forwardRef,
  useRef,
  RefObject,
} from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div(
  ({ theme }) => css`
    position: relative;
    border-radius: ${theme.radii.large};
    flex: 1;
    overflow: hidden;
    height: 100%;
    padding-right: ${theme.space['1']};
  `,
)

const OverflowContainer = styled.div(
  ({ theme }) => css`
    position: relative;
    overflow-y: scroll;
    overflow-x: hidden;
    height: 100%;
    border-color: rgba(${theme.shadesRaw.foreground}, 0.05);
    transition: border-color 0.15s ease-in-out;
    padding-right: ${theme.space['1']};

    /* stylelint-disable-next-line selector-pseudo-element-no-unknown */
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar {
      width: ${theme.space['1.5']};
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border: none;
      border-radius: ${theme.radii.full};
      border-right-style: inset;
      border-right-width: calc(100vw + 100vh);
      border-color: inherit;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    &:hover {
      border-color: rgba(${theme.shadesRaw.foreground}, 0.2);
    }
  `,
)

const OverflowContent = styled.div(
  ({ theme }) => css`
    position: relative;
    border-radius: ${theme.radii.large};
  `,
)

const OverflowIndicator = styled.div<{ $show: boolean }>(
  ({ theme, $show }) => css`
    position: absolute;
    bottom: 0;
    left: 0;
    width: calc(100% - ${theme.space['3.5']});
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
    border-bottom-left-radius: ${theme.radii.large};
    border-bottom-right-radius: ${theme.radii.large};
  `,
)

type Props = {
  page?: string
}

const ScrollIndicatorContainer = forwardRef<
  HTMLDivElement,
  PropsWithChildren<Props>
>(({ page, children }, ref) => {
  const defaultRef = useRef<HTMLDivElement>(null)
  const scrollRef = (ref as RefObject<HTMLDivElement>) || defaultRef

  const [show, setShow] = useState(false)

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollTop, scrollHeight, clientHeight } = scrollRef.current
      const scrollPercent = scrollTop / (scrollHeight - clientHeight)
      if (scrollPercent < 0.9) setShow(true)
      else setShow(false)
    }
  }

  useEffect(() => {
    handleScroll()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page])

  return (
    <Container>
      <OverflowContainer ref={scrollRef} onScroll={handleScroll}>
        <OverflowContent>{children}</OverflowContent>
      </OverflowContainer>
      <OverflowIndicator $show={show} />
    </Container>
  )
})

export default ScrollIndicatorContainer
