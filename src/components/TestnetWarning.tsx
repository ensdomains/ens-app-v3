import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useNetwork } from 'wagmi'

const Container = styled.div(
  ({ theme }) => css`
    background-color: ${theme.colors.yellowSurface};
    color: ${theme.colors.textPrimary};
    font-size: ${theme.fontSizes.small};
    padding: ${theme.space['2']} ${theme.space['4']};
    text-align: center;
    font-weight: ${theme.fontWeights.bold};
  `,
)

export const TestnetWarning = () => {
  const { chain } = useNetwork()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (isClient && chain && chain.id !== 1)
    return <Container>You are viewing the ENS app on {chain.name} testnet.</Container>
  return null
}
