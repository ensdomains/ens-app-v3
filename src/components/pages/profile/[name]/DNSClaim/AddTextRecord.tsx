import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { Outlink } from '@app/components/Outlink'

const Container = styled.div(
  ({ theme }) => css`
    text-align: center;
  `,
)

export const AddTextRecord = ({ currentStep }) => {
  return (
    <Container>
      <Typography>Add Text Records</Typography>
      <Spacer $height={5} />
      <Typography>
        You need to create a new DNS record for your domain using these details. This will claim
        your Ethereum address as the owner of this domain.
      </Typography>
      <Outlink href="https://google.com">
        It looks like your registrar is Namecheap, who have a guide available here.
      </Outlink>
      <Spacer $height={5} />
    </Container>
  )
}
