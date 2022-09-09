import { HTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div<{
  $expanded: boolean
  $maxHeight?: string
}>(
  ({ $expanded, $maxHeight }) => css`
    max-height: ${$expanded ? $maxHeight : '0px'};
    opacity: ${$expanded ? '1' : '0'};
    visibility: ${$expanded ? 'visible' : 'hidden'};
    transition: all 0.3s ease-in-out;
    width: 100%;
    position: relative;
  `,
)

type Props = {
  expanded?: boolean
  maxHeight?: string
} & HTMLAttributes<HTMLDivElement>

const CollapsibleContent = ({
  expanded = false,
  maxHeight = '100vh',
  children,
  ...props
}: Props) => {
  return (
    <Container $expanded={expanded} $maxHeight={maxHeight} {...props}>
      {children}
    </Container>
  )
}

export default CollapsibleContent
