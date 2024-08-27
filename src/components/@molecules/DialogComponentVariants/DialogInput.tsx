import { ComponentProps, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Input } from '@ensdomains/thorin'

const Wrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    margin-bottom: -${theme.space['4']};
    @media (min-width: 640px) {
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
