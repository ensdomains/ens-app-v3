import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

const DescriptionWrapper = styled(Typography)(
  ({ theme }) => css`
    display: inline;
    text-align: center;
    a {
      display: inline-block;
    }
    margin-bottom: ${theme.space['2']};
  `,
)

export const GenericWithDescription = ({ description }: { description: string }) => {
  return (
    <DescriptionWrapper>
      <Typography>{description}</Typography>
    </DescriptionWrapper>
  )
}
