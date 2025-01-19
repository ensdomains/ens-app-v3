import { ComponentProps, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Input } from '@ensdomains/thorin'

const Wrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    z-index: 1;
    margin-bottom: -${theme.space['4']};
    @media (min-width: ${theme.breakpoints.sm}px) {
      margin-bottom: -${theme.space['6']};
    }
  `,
)

export const DialogInput = forwardRef<HTMLInputElement, ComponentProps<typeof Input>>(
  (props, ref) => {
    return (
      <Wrapper>
        <Input ref={ref} {...props} />
      </Wrapper>
    )
  },
)
