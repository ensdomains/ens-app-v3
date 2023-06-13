import { ReactNode } from 'react'
import styled, { css } from 'styled-components'

import { mq } from '@ensdomains/thorin'

const Container = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
  `,
  mq.sm.min(css`
    flex-direction: row;
    justify-content: space-between;
  `),
])

type Props = {
  leading: ReactNode
  trailing: ReactNode
}

export const SplitHeader = ({ leading, trailing }: Props) => {
  return (
    <Container>
      <div>{leading}</div>
      <div>{trailing}</div>
    </Container>
  )
}
