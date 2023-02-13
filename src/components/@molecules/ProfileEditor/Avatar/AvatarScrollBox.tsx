import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

const AvatarScrollBox = styled.div(
  ({ theme }) => css`
    height: 100%;
    width: 100%;
    overflow-y: auto;
    ${mq.sm.min(css`
      padding: 0 ${theme.space['4']};
    `)}
  `,
)

export default AvatarScrollBox
