import styled, { css, keyframes } from 'styled-components'

const anim = keyframes`
  0% {
    opacity: 1;
  }

  0%, 99% {
    pointer-events: auto;
  }

  100% {
    opacity: 0.5;
    pointer-events: none;
  }
`

export const cacheableComponentStyles = ({ $isCached }: { $isCached?: boolean }) => css`
  transition: opacity 0.15s ease-in-out;
  opacity: 1;
  ${$isCached &&
  css`
    opacity: 0.5;
    pointer-events: none;
    animation: ${anim} 0.25s ease-in-out 0.5s backwards;
  `}
`

export const CacheableComponent = styled.div<{ $isCached?: boolean }>(cacheableComponentStyles)
