import styled, { css } from 'styled-components'

import { Button, Typography, mq } from '@ensdomains/thorin'

import GoDaddySVG from '@app/assets/GoDaddy.svg'

import { Card } from '../Card'

const Container = styled(Card)(
  ({ theme }) => css`
    flex-direction: row;
    justify-content: space-between;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
    ${mq.sm.max(css`
      width: 100%;
      flex-direction: column;
      a {
        width: 100%;
      }
    `)}
  `,
)

const Row = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['5']};
    width: 100%;
    ${mq.sm.max(css`
      justify-content: center;
    `)}
  `,
)

export const Banner = () => {
  return (
    <Container>
      <Row>
        <GoDaddySVG />
        <div>
          <Typography color="textPrimary" fontVariant="largeBold" weight="bold">
            GoDaddy x ENS
          </Typography>
          <Typography fontVariant="small" color="textSecondary">
            Import DNS domains with <strong>zero gas</strong>!
          </Typography>
        </div>
      </Row>
      <Button
        as="a"
        width="max"
        colorStyle="blueSecondary"
        href="https://blog.ens.domains/post/beginners-guide-to-ethereum-and-ens"
        target="_blank"
      >
        Learn More
      </Button>
    </Container>
  )
}
