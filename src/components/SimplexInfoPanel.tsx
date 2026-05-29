import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Helper, Typography } from '@ensdomains/thorin'

import { useControllerLimits } from '@app/hooks/useControllerLimits'
import { useNftGateStatus } from '@app/hooks/useNftGateStatus'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['3']};
  `,
)

const TiersGrid = styled.div(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: ${theme.space['2']};
    @media (min-width: ${theme.breakpoints.sm}px) {
      grid-template-columns: repeat(4, 1fr);
    }
  `,
)

const TierCard = styled.div(
  ({ theme }) => css`
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.medium};
    padding: ${theme.space['3']};
    text-align: center;
    background: ${theme.colors.backgroundSecondary};
  `,
)

const TierLabel = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.small};
    color: ${theme.colors.greyPrimary};
  `,
)

const TierPrice = styled(Typography)(
  ({ theme }) => css`
    font-size: ${theme.fontSizes.large};
    font-weight: ${theme.fontWeights.bold};
    color: ${theme.colors.text};
  `,
)

type Props = { address?: `0x${string}` }

/**
 * Renders the SimplexController-specific info box on the registration page:
 *  - NFT-gate banner (only when the gate is enabled)
 *  - Minimum-character-length banner (only when the active minimum is above ENS's default 3)
 *  - The four SimpleX USD pricing tiers (always shown)
 */
export const SimplexInfoPanel = ({ address }: Props) => {
  const { minCharLength } = useControllerLimits()
  const { required: nftRequired, hasNft, loaded, nftAddress } = useNftGateStatus({ address })

  return (
    <Container data-testid="simplex-info-panel">
      {nftRequired && (
        <Helper
          type={hasNft === false ? 'error' : 'info'}
          alignment="horizontal"
          data-testid="simplex-nft-gate-helper"
        >
          <div>
            <Typography weight="bold">SimpleX NFT required</Typography>
            <Typography>
              During the testing phase only SMPXNFT holders may register names. The gate contract
              is <code>{nftAddress}</code>.
              {loaded && hasNft === false && ' Your wallet does not currently hold one.'}
              {loaded && hasNft === true && ' Your wallet holds one — you can register.'}
            </Typography>
          </div>
        </Helper>
      )}
      {!!minCharLength && minCharLength > 3 && (
        <Helper type="info" alignment="horizontal" data-testid="simplex-min-chars-helper">
          <div>
            <Typography weight="bold">Minimum {minCharLength} characters</Typography>
            <Typography>
              Names shorter than {minCharLength} characters are not yet registrable. The admin
              lowers this limit over time.
            </Typography>
          </div>
        </Helper>
      )}
      <div>
        <Typography weight="bold">SimpleX pricing (per year)</Typography>
        <TiersGrid>
          <TierCard data-testid="simplex-tier-6">
            <TierLabel>6+ chars</TierLabel>
            <TierPrice>$1</TierPrice>
          </TierCard>
          <TierCard data-testid="simplex-tier-5">
            <TierLabel>5 chars</TierLabel>
            <TierPrice>$8</TierPrice>
          </TierCard>
          <TierCard data-testid="simplex-tier-4">
            <TierLabel>4 chars</TierLabel>
            <TierPrice>$32</TierPrice>
          </TierCard>
          <TierCard data-testid="simplex-tier-3">
            <TierLabel>3 chars</TierLabel>
            <TierPrice>$128</TierPrice>
          </TierCard>
        </TiersGrid>
      </div>
    </Container>
  )
}
