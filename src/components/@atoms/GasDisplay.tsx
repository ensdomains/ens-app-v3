import styled, { css } from 'styled-components'

import { Skeleton } from '@ensdomains/thorin'

import GasSVG from '@app/assets/Gas.svg'
import { makeDisplay } from '@app/utils/currency'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['1']};

    font-size: ${theme.fontSizes.small};
    color: ${theme.colors.grey};
    font-weight: bold;

    padding: 0 ${theme.space['4']};
  `,
)

type Props = {
  gasPrice: bigint | undefined
}

const GasDisplay = ({ gasPrice }: Props) => {
  const gasLabel = gasPrice
    ? makeDisplay({ value: gasPrice, symbol: 'Gwei', fromDecimals: 9 })
    : '-'

  return (
    <Container>
      <GasSVG />
      <Skeleton loading={!gasPrice}>{gasLabel}</Skeleton>
    </Container>
  )
}

export default GasDisplay
