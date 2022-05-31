import React, { PropsWithChildren, useEffect, useState } from 'react'
import styled from 'styled-components'

const Container = styled.div`
  ${({ theme }) => `

  overflow: hidden;
  border-color: ${theme.colors.borderTertiary};
  box-sizing: border-box;
  box-shadow: ${theme.boxShadows['0.02']};
  background: ${theme.colors.white};
  border: 1px solid ${theme.colors.borderTertiary};
  border-bottom: none;
  clip-path: inset(0 -8px);

  &:first-of-type {
    border-top-left-radius: ${theme.space['4']};
    border-top-right-radius: ${theme.space['4']};
    clip-path: inset(-8px -8px 0);

  }
  &:last-of-type {
    border-bottom-left-radius: ${theme.space['4']};
    border-bottom-right-radius: ${theme.space['4']};
    border-bottom: 1px solid ${theme.colors.borderTertiary};
    clip-path: inset(0 -8px -8px -8px);
  }
  `}
`

const DetailsContainer = styled.div<{
  $expanded: boolean
}>`
  transition: max-height 0.3s cubic-bezier(1, 0, 0.22, 1.6);

  ${({ theme }) => `
    > * {
      border-top: 1px solid ${theme.colors.borderTertiary};
    }
  `}

  ${({ $expanded }) => `
    max-height: ${$expanded ? '1000px' : '0px'};
  `}
`

type Props = {
  disabled?: boolean
  expanded?: boolean
}

const Accordian = ({
  expanded: _expanded = false,
  disabled = false,
  children,
}: PropsWithChildren<Props>) => {
  const [expanded, setExpanded] = useState(_expanded)
  useEffect(() => {
    if (_expanded !== expanded) setExpanded(_expanded)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_expanded])

  const [summary, ...details] = React.Children.toArray(children)

  const handleSummaryClick = () => {
    setExpanded(!expanded)
  }

  return (
    <Container>
      {React.isValidElement(summary) &&
        React.cloneElement(summary, {
          expanded,
          disabled,
          onClick: handleSummaryClick,
        })}
      <DetailsContainer $expanded={expanded}>{details}</DetailsContainer>
    </Container>
  )
}

export default Accordian
