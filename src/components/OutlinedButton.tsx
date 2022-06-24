import { Button } from '@ensdomains/thorin'
import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'
import { DisabledButton } from './@atoms/DisabledButton'

const OutlinedButtonWrapper = styled.div(
  ({ theme }) => css`
    & > button {
      border: 1px solid rgba(0, 0, 0, 0.06);
      height: ${theme.space['12']};
      border-radius: ${theme.radii.extraLarge};
    }
  `,
)

export const OutlinedButton = ({
  className,
  disabled,
  ...props
}: ComponentProps<typeof Button> & { className?: string }) => (
  <OutlinedButtonWrapper className={className}>
    {disabled ? <DisabledButton {...(props as any)} /> : <Button {...props} />}
  </OutlinedButtonWrapper>
)
