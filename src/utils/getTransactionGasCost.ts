export const getTransactionGasCost = ({
  gasPrice,
  gasEstimate,
}: {
  gasPrice: bigint | undefined
  gasEstimate: bigint | undefined
}) => {
  if (gasPrice === undefined || gasEstimate === undefined) return 0n
  return gasPrice * gasEstimate
}
