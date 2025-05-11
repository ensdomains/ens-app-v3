import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

import { getChainsFromUrl } from '@app/constants/chains'

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
  const chains = getChainsFromUrl()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (isClient && chains && chains[0].id !== 1)
    return <Container>You are viewing the ENS app on {chains[0].name} testnet.</Container>
  return null
}
