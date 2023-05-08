import { ComponentProps, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Button, mq } from '@ensdomains/thorin'

const StyledWrapButton = styled(Button)(
  ({ theme }) => css`
    width: 100%;
    ${mq.sm.min(css`
      max-width: ${theme.space['36']};
    `)}
  `,
)

const BaseWrapButton = forwardRef(
  ({ children, ...props }: ComponentProps<typeof StyledWrapButton>, ref) => {
    return (
      <StyledWrapButton size="small" colorStyle="accentPrimary" ref={ref} {...props}>
        {children}
      </StyledWrapButton>
    )
  },
)

export default BaseWrapButton
