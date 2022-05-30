import { Button } from '@ensdomains/thorin'
import { ComponentProps } from 'react'
import styled from 'styled-components'

const OutlinedButtonWrapper = styled.div`
  ${({ theme }) => `
  & > button {
    border: 1px solid rgba(0, 0, 0, 0.06);
    height: ${theme.space['12']};
    border-radius: ${theme.radii.extraLarge};
  }
  `}
`

export const OutlinedButton = ({
  className,
  ...props
}: ComponentProps<typeof Button> & { className?: string }) => (
  <OutlinedButtonWrapper className={className}>
    <Button {...props} />
  </OutlinedButtonWrapper>
)
