import { ReactElement, useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount, useSwitchChain } from 'wagmi'

import { Button, Helper } from '@ensdomains/thorin'

import { getSupportedChainById } from '@app/constants/chains'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'

const Card = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['3.5']};
    border-radius: ${theme.radii['3xLarge']};
    background-color: ${theme.colors.background};
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: flex-start;
    width: ${theme.space.full};
    gap: ${theme.space['4']};
    max-height: 75vh;
    overflow-y: auto;

     @media (min-width: ${theme.breakpoints.sm}px) {
      width: initial;
      min-width: ${theme.space['128']};
    }
  `,
)

const Container = styled.div`
  flex: 1;
  display: flex;
  align-items: center;
  justify-content: center;
`

export default function Page() {
  const { t } = useTranslation()

  const router = useRouterWithHistory()

  const { chainId, isConnected } = useAccount()
  const { switchChain } = useSwitchChain()

  useEffect(() => {
    if (isConnected && getSupportedChainById(chainId)) {
      router.push('/')
    }
  }, [isConnected, chainId, router])

  const handleChangeNetwork = () => {
    switchChain({ chainId: 1 })
  }

  return (
    <Container>
      <Card>
        <Helper alert="error">{t('unsupportedNetwork')}</Helper>
        <Button onClick={handleChangeNetwork}>{t('action.changeNetwork')}</Button>
      </Card>
    </Container>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <Container>{page}</Container>
}
