import { Button } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'

export const DisabledButton = styled(Button)(
  () => css`
    filter: grayscale(100%);
    opacity: 0.5;
    pointer-events: none;
  `,
)
