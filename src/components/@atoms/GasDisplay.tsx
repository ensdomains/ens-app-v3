import { BigNumber } from 'ethers'
import styled, { css } from 'styled-components'

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
    color: ${theme.colors.textTertiary};
    font-weight: bold;

    padding: 0 ${theme.space['4']};
  `,
)

type Props = {
  gasPrice: BigNumber | undefined
}

const GasDisplay = ({ gasPrice }: Props) => {
  const gasLabel = gasPrice ? makeDisplay(gasPrice, 0, 'Gwei', 9) : '-'

  return (
    <Container>
      <GasSVG />
      {gasLabel}
    </Container>
  )
}

export default GasDisplay
