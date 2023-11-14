import { Box, BoxProps } from '@ensdomains/thorin'
import { Skeleton } from '@ensdomains/thorin2'

import GasSVG from '@app/assets/Gas.svg'
import { makeDisplay } from '@app/utils/currency'

const Container = (props: BoxProps) => (
  <Box
    {...props}
    display="flex"
    flexDirection="row"
    alignItems="center"
    justifyContent="flex-start"
    gap="$1"
    fontSize="$small"
    color="$grey"
    fontWeight="bold"
    px="$4"
  />
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
