import { ComponentProps, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Input, mq } from '@ensdomains/thorin'

const Wrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    margin-bottom: -${theme.space['4']};
    ${mq.sm.min(css`
      margin-bottom: -${theme.space['6']};
    `)}
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
