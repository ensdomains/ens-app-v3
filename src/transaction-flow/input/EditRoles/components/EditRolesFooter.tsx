import { ComponentProps } from 'react'
import styled, { css } from 'styled-components'

import { Dialog, mq } from '@ensdomains/thorin2'

const Container = styled.div(({ theme }) => [
  css`
    border-top: 1px solid ${theme.colors.border};
    width: calc(100% + 2 * ${theme.space['4']});
    margin: 0 -${theme.space['4']};
    padding: ${theme.space['4']} ${theme.space['4']} 0;
  `,
  mq.sm.min(css`
    width: calc(100% + 2 * ${theme.space['6']});
    margin: 0 -${theme.space['6']};
    padding: ${theme.space['4']} ${theme.space['6']} 0;
  `),
])

type Props = ComponentProps<typeof Dialog.Footer>

export const EditRolesFooter = (props: Props) => {
  return (
    <Container>
      <Dialog.Footer {...props} />
    </Container>
  )
}
