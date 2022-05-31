import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { DetailSnippet } from '@app/components/profile/details/DetailSnippet'
import { RecordsTab } from '@app/components/profile/details/RecordsTab'
import { SubnamesTab } from '@app/components/profile/details/SubnamesTab'
import { NameSnippetMobile } from '@app/components/profile/NameSnippetMobile'
import { OwnerButton } from '@app/components/profile/OwnerButton'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { Basic } from '@app/layouts/Basic'
import mq from '@app/mediaQuery'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { Card, Typography } from '@ensdomains/thorin'
import type { GetStaticPaths, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount, useNetwork } from 'wagmi'

const GridItem = styled.div<{ $area: string }>`
  grid-area: ${({ $area }) => $area};
`

const WrapperGrid = styled.div<{ $hasError?: boolean }>`
  flex-grow: 1;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content;
  gap: ${({ theme }) => theme.space['5']};
  align-self: center;
  ${({ $hasError }) => css`
    grid-template-areas: ${$hasError ? "'error error'" : ''} 'details details' 'content content';
    ${mq.lg.min`
      grid-template-areas: ${
        $hasError ? "'error error'" : ''
      } "details content";
      grid-template-columns: 270px 2fr;
    `}
  `}
`

const DetailsContainer = styled(GridItem)`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: ${theme.space['1']};
    ${mq.sm.min`
      flex-direction: row;
      justify-content: center;
    `}
    ${mq.lg.min`
      flex-direction: column;
      justify-content: flex-start;
    `}
  `}
`

const OwnerButtons = styled.div`
  ${({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    gap: ${theme.space['1']};
    flex-gap: ${theme.space['1']};
    ${mq.xs.min`
      flex-direction: row;
    `}
    ${mq.sm.min`
      flex-direction: column;
      & > div {
        max-width: initial !important;
      }
    `}
  `}
`

const TabButtonContainer = styled.div`
  ${({ theme }) => css`
    margin-left: ${theme.radii.extraLarge};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['3']};
    flex-gap: ${theme.space['3']};
  `}
`

const TabContainer = styled(GridItem)`
  ${({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: ${theme.space['3']};
  `}
`

const TabButton = styled.button<{ $selected: boolean }>`
  ${({ theme, $selected }) => css`
    display: block;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    background: none;
    color: ${$selected ? theme.colors.accent : theme.colors.textTertiary};
    font-size: ${theme.fontSizes.extraLarge};
    transition: all 0.15s ease-in-out;
    cursor: pointer;

    &:hover {
      color: ${$selected ? theme.colors.accent : theme.colors.textSecondary};
    }
  `}
`

const NameDetails: NextPage = () => {
  const breakpoints = useBreakpoint()
  const router = useRouter()
  const name = router.query.name as string

  const { activeChain: chain } = useNetwork()
  const { data: accountData, isLoading: accountLoading } = useAccount()
  const address = accountData?.address

  const {
    normalisedName,
    expiryDate,
    ownerData,
    profile,
    isLoading: detailsLoading,
  } = useNameDetails(name)

  const selfAbilities = useMemo(() => {
    const abilities = {
      canEdit: false,
      canSend: false,
      canChangeOwner: false,
      canChangeRegistrant: false,
    }
    if (!address || !ownerData) return abilities
    if (
      ownerData.registrant === address ||
      (!ownerData.registrant && ownerData.owner === address)
    ) {
      abilities.canSend = true
      abilities.canChangeOwner = true
      abilities.canChangeRegistrant = true
    }
    if (ownerData.owner === address) {
      abilities.canEdit = true
      abilities.canChangeOwner = true
    }
    return abilities
  }, [address, ownerData])

  const isLoading = detailsLoading || accountLoading

  const [tab, setTab] = useState<'records' | 'subnames' | 'more'>('records')

  return (
    <Basic
      heading={normalisedName}
      subheading="Name Details"
      loading={isLoading}
      title={`${normalisedName} - `}
    >
      <WrapperGrid>
        <DetailsContainer $area="details">
          {breakpoints.lg ? (
            <NFTWithPlaceholder
              name={normalisedName}
              network={chain?.name!}
              style={{ width: '270px', height: '270px' }}
            />
          ) : (
            <NameSnippetMobile
              expiryDate={expiryDate}
              name={normalisedName}
              network={chain?.name!}
              canSend={selfAbilities.canSend}
            />
          )}
          <OwnerButtons>
            {ownerData?.owner && (
              <OwnerButton
                address={ownerData.owner}
                network={chain?.name!}
                label={
                  ownerData.ownershipLevel === 'nameWrapper'
                    ? 'Owner'
                    : 'Controller'
                }
                type={breakpoints.lg ? 'dropdown' : 'dialog'}
                description={
                  ownerData.ownershipLevel === 'nameWrapper'
                    ? 'Owns and controls the name'
                    : 'Controls all the records of the name'
                }
                canTransfer={selfAbilities.canChangeOwner}
              />
            )}
            {ownerData?.registrant && (
              <OwnerButton
                address={ownerData.registrant}
                network={chain?.name!}
                label="Registrant"
                type={breakpoints.lg ? 'dropdown' : 'dialog'}
                description="The owner of the NFT"
                canTransfer={selfAbilities.canChangeRegistrant}
              />
            )}
          </OwnerButtons>
          {breakpoints.lg && (
            <DetailSnippet
              canSend={selfAbilities.canSend}
              expiryDate={expiryDate}
            />
          )}
        </DetailsContainer>
        <TabContainer $area="content">
          <TabButtonContainer>
            <TabButton
              $selected={tab === 'records'}
              onClick={() => setTab('records')}
            >
              <Typography weight="bold">Records</Typography>
            </TabButton>
            <TabButton
              $selected={tab === 'subnames'}
              onClick={() => setTab('subnames')}
            >
              <Typography weight="bold">Subnames</Typography>
            </TabButton>
            <TabButton
              $selected={tab === 'more'}
              onClick={() => setTab('more')}
            >
              <Typography weight="bold">More</Typography>
            </TabButton>
          </TabButtonContainer>
          {
            {
              records: (
                <RecordsTab
                  texts={(profile?.records?.texts as any) || []}
                  addresses={(profile?.records?.coinTypes as any) || []}
                  contentHash={profile?.records?.contentHash}
                  canEdit={selfAbilities.canEdit}
                />
              ),
              subnames: (
                <SubnamesTab name={normalisedName} network={chain?.name!} />
              ),
              more: <Card>Test</Card>,
            }[tab]
          }
        </TabContainer>
      </WrapperGrid>
    </Basic>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  }
}

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default NameDetails
