import styled, { css } from 'styled-components'

import { Button, mq, Typography } from '@ensdomains/thorin'

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
        <div>
          <Typography color="textPrimary" fontVariant="largeBold" weight="bold">
            Do not have a Universal Profile yet?
          </Typography>
          <Typography fontVariant="small" color="textSecondary">
            Install the 🆙 <strong>Browser Extension</strong> 🧩 !
          </Typography>
        </div>
      </Row>
      <Button
        as="a"
        width="max"
        colorStyle="blueSecondary"
        href="https://aboutus.godaddy.net/newsroom/company-news/news-details/2024/GoDaddy-and-Ethereum-Name-Service-Bridge-the-Gap-Between-Domain-Names-and-Crypto-Wallets/default.aspx?utm_source=Social&utm_medium=Twitter&utm_campaign=GoDaddy-and-Ethereum-Name-Service-Bridge-the-Gap-Between-Domain-Names-and-Crypto-Wallets/default.aspx"
        target="_blank"
      >
        Learn More
      </Button>
    </Container>
  )
}
