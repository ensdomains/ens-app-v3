import styled, { css } from 'styled-components'

import { Tag, Typography } from '@ensdomains/thorin'

const Container = styled.div(
  () => css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    align-items: center;
  `,
)

export const Header = ({ count }: { count: number }) => {
  return (
    <Container>
      <Typography fontVariant="headingTwo">Roles</Typography>
      <Tag size="small">{count} addresses</Tag>
    </Container>
  )
}
