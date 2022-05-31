import { PropsWithChildren } from 'react'
import styled from 'styled-components'

import { DownIndicatorSVG } from '@ensdomains/thorin'

const Container = styled.div<{
  $size: Props['size']
  $expanded: boolean
  $disabled: boolean
}>`
  ${({ theme }) => `
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space['4']};
  font-weight: ${theme.fontWeights.semiBold};
  cursor: pointer;
  position: relative;
  `}

  ${({ theme, $size }) => {
    switch ($size) {
      case 'small':
        return `
          padding: ${theme.space['0.5']} ${theme.space['0.25']};
        `
      case 'medium':
        return `
          padding: ${theme.space['3']} ${theme.space['4']};
        `
      default:
        return ``
    }
  }}
`

const Chevron = styled(DownIndicatorSVG)<{ $open: boolean }>`
  ${({ theme }) => `
margin-left: ${theme.space['1']};
width: ${theme.space['3']};
margin-right: ${theme.space['0.5']};
transition-duration: ${theme.transitionDuration['200']};
transition-property: all;
transition-timing-function: ${theme.transitionTimingFunction.inOut};
opacity: 0.3;
transform: rotate(0deg);
display: flex;
`}

  & > svg {
    fill: currentColor;
  }
  fill: currentColor;

  ${({ $open }) =>
    $open &&
    `
  opacity: 1;
  transform: rotate(180deg);
`}
`

type Props = {
  size?: 'small' | 'medium'
  expanded?: boolean
  disabled?: boolean
  onClick?: React.AllHTMLAttributes<HTMLDivElement>['onClick']
}

const AccordianSummary = ({
  size = 'medium',
  expanded = false,
  disabled = false,
  onClick,
  children,
}: PropsWithChildren<Props>) => {
  return (
    <Container
      $expanded={expanded}
      $disabled={disabled}
      $size={size}
      onClick={onClick}
    >
      {children}
      <Chevron $open={expanded} />
    </Container>
  )
}

export default AccordianSummary
