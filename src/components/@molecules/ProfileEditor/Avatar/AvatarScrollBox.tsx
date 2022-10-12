import styled, { css } from 'styled-components'

import { ScrollBox } from '@ensdomains/thorin'

const AvatarScrollBox = styled(ScrollBox)(
  ({ theme }) => css`
    padding: 0 ${theme.space['4']};
  `,
)

export default AvatarScrollBox
