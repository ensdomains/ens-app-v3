import { useRouter } from 'next/router'
import { ReactElement, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address, keccak256, toBytes } from 'viem'
import { useAccount } from 'wagmi'

import { Banner, Button, QuestionCircleSVG, Typography } from '@ensdomains/thorin'

import { NameListView } from '@app/components/@molecules/NameListView/NameListView'
import { useNamesForAddress } from '@app/hooks/ensjs/subgraph/useNamesForAddress'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { getSupportLink } from '@app/utils/supportLinks'

const ContentContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[6]};

    & > *:nth-child(2) svg {
      color: var(--thorin-color-indigoPrimary);
    }
  `,
)

const GuessCard = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[3]};
    padding: ${theme.space[4]};
    border-radius: ${theme.radii['2xLarge']};
    background-color: ${theme.colors.backgroundSecondary};
  `,
)

const GuessRow = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space[2]};
    align-items: stretch;
    flex-wrap: wrap;
    & > input {
      flex: 1 1 220px;
      min-width: 0;
    }
  `,
)

// Thorin's <Input> wraps in label/border/icon scaffolding that fights flex
// sizing — using a styled native input here so it actually fills the row.
const GuessInput = styled.input(
  ({ theme }) => css`
    width: 100%;
    height: ${theme.space[12]};
    padding: 0 ${theme.space[4]};
    border-radius: ${theme.radii['2xLarge']};
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.background};
    color: ${theme.colors.text};
    font: inherit;
    font-size: ${theme.fontSizes.body};
    &:focus {
      outline: none;
      border-color: ${theme.colors.accent};
    }
    &::placeholder { color: ${theme.colors.greyPrimary}; }
  `,
)

/**
 * When there is no subgraph (SNRC), the chain-scan fallback can find a
 * tokenId but not its human label — so a name without a populated label
 * cache shows up as `[<hex>].testing`. This tiny form lets the user guess
 * the label: we compute keccak256(guess), persist it to the same
 * `ensjs:labels` cache the chain-scan reads, and reload. Wrong guesses
 * are harmless (the cache just gains an unused entry).
 */
const LabelGuess = () => {
  const tld = (process.env.NEXT_PUBLIC_SIMPLEX_TLD || 'testing') as string
  const [label, setLabel] = useState('')
  const [hint, setHint] = useState<string | null>(null)

  const submit = () => {
    const clean = label.trim().toLowerCase()
    if (!clean) return
    const hash = keccak256(toBytes(clean))
    try {
      const cache = JSON.parse(window.localStorage.getItem('ensjs:labels') || '{}')
      cache[hash] = clean
      window.localStorage.setItem('ensjs:labels', JSON.stringify(cache))
      setHint(`Cached "${clean}.${tld}" → ${hash.slice(0, 10)}…. Refreshing list…`)
      // Reload the page so the chain-scan re-reads the cache. The query
      // result itself is cached by react-query, and the lightest way to
      // invalidate it without threading queryClient keys here is a reload.
      setTimeout(() => window.location.reload(), 700)
    } catch {
      setHint('localStorage unavailable — guess not saved')
    }
  }

  return (
    <GuessCard>
      <Typography weight="bold">Identify a hashed name</Typography>
      <Typography fontVariant="small">
        Entries that appear as <code>[hex].{tld}</code> are names the chain knows you own
        but whose human label the dApp hasn't seen yet (no subgraph). Type a label you think
        is yours — if it matches one of the hashes above it'll display by name on refresh.
      </Typography>
      <GuessRow>
        <GuessInput
          placeholder="your-label"
          value={label}
          onChange={(e) => setLabel(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') submit() }}
        />
        <Button onClick={submit}>Identify</Button>
      </GuessRow>
      {hint && <Typography fontVariant="small">{hint}</Typography>}
    </GuessCard>
  )
}

export default function Page() {
  const { t } = useTranslation('names')
  const router = useRouter()
  const { address, isConnecting, isReconnecting } = useAccount()

  const isLoading = !router.isReady || isConnecting || isReconnecting

  useProtectedRoute('/', isLoading ? true : address && (address as any) !== '')

  // Mirror NameListView's default useNamesForAddress params so this call
  // shares the react-query cache entry (sortType='expiryDate' is the
  // initial state in NameListView; pageSize=20 matches). The first call
  // to land fetches; the second is a cache hit.
  const { infiniteData } = useNamesForAddress({
    address: (address || undefined) as Address | undefined,
    orderBy: 'expiryDate',
    orderDirection: 'desc',
    pageSize: 20,
    filter: {
      searchString: '',
      searchType: 'name',
      resolvedAddress: false,
    },
    enabled: !!address,
  } as any)

  const hasUnresolved = useMemo(() => {
    if (!Array.isArray(infiniteData)) return false
    return infiniteData.some((entry: any) => entry && entry.labelName == null)
  }, [infiniteData])

  return (
    <Content title={t('title')} singleColumnContent loading={isLoading}>
      {{
        trailing: (
          <ContentContainer>
            <NameListView address={address} selfAddress={address} />
            {hasUnresolved && <LabelGuess />}
            {/* SNRC has no off-chain names (no CCIP-Read, no DNS import). The
                banner is always misleading on our deployments — same env-var
                gate as the SyncProvider bypasses. */}
            {!process.env.NEXT_PUBLIC_PROVIDER &&
              !process.env.NEXT_PUBLIC_SEPOLIA_DEPLOYMENT_ADDRESSES &&
              !process.env.NEXT_PUBLIC_MAINNET_DEPLOYMENT_ADDRESSES && (
                <Banner
                  as="a"
                  target="_blank"
                  rel="noopener noreferrer"
                  href={getSupportLink('offchain-not-in-names')}
                  icon={QuestionCircleSVG}
                  title={t('offchainWarning.title')}
                >
                  {t('offchainWarning.text')}
                </Banner>
              )}
          </ContentContainer>
        ),
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
