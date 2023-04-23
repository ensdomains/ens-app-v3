import styled, { css } from 'styled-components'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'

export const StyledInnerDialog = styled(InnerDialog)(
  ({ theme }) => css`
    flex: 1;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['4']};
  `,
)
