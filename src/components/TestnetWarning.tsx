// import { useSearchParams } from 'next/dist/client/components/navigation'
import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

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

/*
const getChainFromQueryString = (searchParams: URLSearchParams) => {
  // Query param only possible in test/dev
  if (
    !(
      window.location.hostname.endsWith('localhost') ||
      window.location.hostname.endsWith('ens.pages.dev')
    )
  )
    return

  // If requested chain id is supported return it, otherwise default to mainnet
  searchParams.get('chainId')
}

const getChainFromSubdomain = (subdomain: string) => {
  // if (subdomain === 'testnet') return chains[0]
  // if (subdomain === 'beta') return chains[1]
  // return chains[2]
}

const useGetConifguredChain = () => {
  const searchParams = useSearchParams()
}
  */

export const TestnetWarning = () => {
  const { chain } = useAccount()
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (isClient && chain && chain.id !== 1)
    return <Container>You are viewing the ENS app on {chain.name} testnet.</Container>
  return null
}
