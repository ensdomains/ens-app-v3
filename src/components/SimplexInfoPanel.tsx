import styled, { css } from 'styled-components'

import { Helper, Typography } from '@ensdomains/thorin'

import { useControllerLimits } from '@app/hooks/useControllerLimits'
import { useNftGateStatus } from '@app/hooks/useNftGateStatus'
import { useReservedStatus } from '@app/hooks/useReservedStatus'

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

const TierCard = styled.div<{ $active?: boolean }>(
  ({ theme, $active }) => css`
    border: 1px solid ${$active ? theme.colors.accent : theme.colors.border};
    border-radius: ${theme.radii.medium};
    padding: ${theme.space['3']};
    text-align: center;
    background: ${$active ? theme.colors.accentSurface : theme.colors.backgroundSecondary};
    ${$active &&
    css`
      box-shadow: 0 0 0 2px ${theme.colors.accent} inset;
    `}
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

type Props = { name?: string; address?: `0x${string}` }

/**
 * Highlights the pricing tier matching `name`'s label length and renders the
 * SimplexController-specific banners (NFT gate, reserved name, min char length).
 * The four tier cards correspond directly to the StablePriceOracle config in
 * `scripts/deploy-local.mjs`. The `active` tier reflects what the contract will
 * charge; verify against the FullInvoice below the panel.
 */
export const SimplexInfoPanel = ({ name, address }: Props) => {
  const { minCharLength } = useControllerLimits()
  const { required: nftRequired, hasNft, loaded: nftLoaded, nftAddress } = useNftGateStatus({ address })
  const { isReserved } = useReservedStatus({ name })

  const label = name ? name.split('.')[0] : ''
  const labelLen = label.length
  // Tier buckets correspond to the StablePriceOracle array indices: 3, 4, and 5+
  // (the contract collapses 5+ into a single tier). The deploy script also
  // declares the human-readable 5-char tier at $8 in the plan; if the deployed
  // oracle ever splits 5 and 6+, this will need a matching tier card.
  const activeTier =
    labelLen <= 0
      ? null
      : labelLen <= 3
        ? 3
        : labelLen === 4
          ? 4
          : labelLen === 5
            ? 5
            : 6

  return (
    <Container data-testid="simplex-info-panel">
      {isReserved && (
        <Helper type="error" alignment="horizontal" data-testid="simplex-reserved-helper">
          <div>
            <Typography weight="bold">This name is reserved</Typography>
            <Typography>
              <code>{label}</code> has been reserved by the admin and cannot be registered through
              the public flow. Reach out to the SimpleX team if you believe it should be available
              to you.
            </Typography>
          </div>
        </Helper>
      )}
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
              {nftLoaded && hasNft === false && ' Your wallet does not currently hold one.'}
              {nftLoaded && hasNft === true && ' Your wallet holds one — you can register.'}
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
          <TierCard data-testid="simplex-tier-6" data-active={activeTier === 6} $active={activeTier === 6}>
            <TierLabel>6+ chars</TierLabel>
            <TierPrice>$1</TierPrice>
          </TierCard>
          <TierCard data-testid="simplex-tier-5" data-active={activeTier === 5} $active={activeTier === 5}>
            <TierLabel>5 chars</TierLabel>
            <TierPrice>$8</TierPrice>
          </TierCard>
          <TierCard data-testid="simplex-tier-4" data-active={activeTier === 4} $active={activeTier === 4}>
            <TierLabel>4 chars</TierLabel>
            <TierPrice>$32</TierPrice>
          </TierCard>
          <TierCard data-testid="simplex-tier-3" data-active={activeTier === 3} $active={activeTier === 3}>
            <TierLabel>3 chars</TierLabel>
            <TierPrice>$128</TierPrice>
          </TierCard>
        </TiersGrid>
      </div>
    </Container>
  )
}
