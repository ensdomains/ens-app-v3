import styled, { css } from 'styled-components'

import { Button, DefaultTheme, Typography } from '@ensdomains/thorin'

import GoDaddySVG from '@app/assets/GoDaddy.svg'

import { Card } from '../Card'

const Row = styled.div<{$gap: '4'|'5'}>(
  ({ theme, $gap }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space[$gap]};
    width: 100%;
  `,
)

const Container = styled(Card)(
  ({ theme }) => css`
    padding: ${theme.space['4']};
  `,
)

export const Banner = () => {
  return (
    <Container>
      <Row $gap='4'>
        <Row $gap='5'>
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
        <Button as="a" width="max" colorStyle="greyPrimary" href="https://blog.ens.domains/post/beginners-guide-to-ethereum-and-ens" target="_blank" rel="noreferrer">
          Learn More
        </Button>
      </Row>
    </Container>
  )
}
