import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { AlertSVG, Button, Typography } from '@ensdomains/thorin'

import { useNftGateStatus } from '@app/hooks/useNftGateStatus'

// Always point at mainnet SMPXNFT regardless of which chain the dApp is
// configured for. On testnets the on-chain gate uses a MockSMPXNFT, but the
// canonical contract a user will need to hold (and the one their wallet's
// real balance lives on) is the mainnet deployment.
const MAINNET_SMPXNFT = '0x3AF6D9Ee862376A8DFC0a78847Eb20A153557291'
const ETHERSCAN_URL = `https://etherscan.io/token/${MAINNET_SMPXNFT}`

const Card = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    width: 100%;
    max-width: 466px;
    margin: 0 auto;
    padding: ${theme.space['4']};
    gap: ${theme.space['4']};
    align-items: stretch;
    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.yellowSurface};
    border: 1px solid ${theme.colors.yellowPrimary};

    @media (min-width: ${theme.breakpoints.sm}px) {
      flex-direction: row;
      align-items: center;
      justify-content: space-between;
    }
  `,
)

const TextRow = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['3']};
    flex: 1;
  `,
)

const IconCircle = styled.div(
  ({ theme }) => css`
    flex-shrink: 0;
    width: ${theme.space['10']};
    height: ${theme.space['10']};
    border-radius: ${theme.radii.full};
    background-color: ${theme.colors.yellowPrimary};
    color: ${theme.colors.backgroundPrimary};
    display: flex;
    align-items: center;
    justify-content: center;

    svg {
      width: 18px;
      height: 18px;
    }
  `,
)

const TextStack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['0.5']};
  `,
)

const Subtle = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.greyPrimary};
  `,
)

const ActionWrap = styled.div(
  ({ theme }) => css`
    flex-shrink: 0;
    width: 100%;
    @media (min-width: ${theme.breakpoints.sm}px) {
      width: auto;
    }
  `,
)

/**
 * Yellow warning card shown on the homepage when the connected wallet does
 * not hold an SMPXNFT but the controller has the gate enabled. Links to the
 * canonical mainnet SMPXNFT contract on Etherscan (not the testnet mock) so
 * users know what they actually need to hold.
 */
export const SimplexHomeBanner = () => {
  const { address } = useAccount()
  const { required, hasNft, loaded } = useNftGateStatus({ address })

  if (!required) return null
  if (!address) return null
  if (!loaded) return null
  if (hasNft !== false) return null

  return (
    <Card role="alert">
      <TextRow>
        <IconCircle>
          <AlertSVG />
        </IconCircle>
        <TextStack>
          <Typography weight="bold">SimpleX NFT required</Typography>
          <Subtle fontVariant="small">
            During the testing phase, only holders of the SMPXNFT can register names. Connect a
            wallet that holds one.
          </Subtle>
        </TextStack>
      </TextRow>
      <ActionWrap>
        <Button
          as="a"
          href={ETHERSCAN_URL}
          target="_blank"
          rel="noopener noreferrer"
          colorStyle="yellowSecondary"
          size="small"
        >
          View on Etherscan
        </Button>
      </ActionWrap>
    </Card>
  )
}
