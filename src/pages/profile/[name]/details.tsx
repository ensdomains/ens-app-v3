import { RecordsTab } from '@app/components/profile/details/RecordsTab'
import { SubnamesTab } from '@app/components/profile/details/SubnamesTab'
import { NameSnippetMobile } from '@app/components/profile/NameSnippetMobile'
import { OwnerButton } from '@app/components/profile/OwnerButton'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { Basic } from '@app/layouts/Basic'
import mq from '@app/mediaQuery'
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
    ${mq.medium.min`
      grid-template-areas: ${
        $hasError ? "'error error'" : ''
      } "details content";
      grid-template-columns: 270px 2fr;
    `}
  `}
`

const DetailsContainer = styled(GridItem)`
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: ${theme.space['1']};
  `}
`

const OwnerButtons = styled.div`
  ${({ theme }) => `
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: stretch;
    gap: ${theme.space['1']};
    flex-gap: ${theme.space['1']};
  `}
`

const TabButtonContainer = styled.div`
  ${({ theme }) => `
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
  ${({ theme }) => `
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: ${theme.space['3']};
  `}
`

const TabButton = styled.button<{ $selected: boolean }>`
  ${({ theme, $selected }) => `
    display: block;
    outline: none;
    border: none;
    padding: 0;
    margin: 0;
    background: none;
    color: ${$selected ? theme.colors.accent : theme.colors.textTertiary};
    font-size: ${theme.fontSizes.extraLarge};
  `}
`

const NameDetails: NextPage = () => {
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

  const ownerAbilities = useMemo(() => {
    const abilities = {
      canEdit: false,
      canSend: false,
    }
    if (!address || !ownerData) return abilities
    if (
      ownerData.registrant === address ||
      (!ownerData.registrant && ownerData.owner === address)
    ) {
      abilities.canSend = true
    }
    if (ownerData.owner === address) {
      abilities.canEdit = true
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
          <NameSnippetMobile
            expiryDate={expiryDate}
            name={normalisedName}
            network={chain?.name!}
            canSend={ownerAbilities.canSend}
          />
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
              />
            )}
            {ownerData?.registrant && (
              <OwnerButton
                address={ownerData.registrant}
                network={chain?.name!}
                label="Registrant"
              />
            )}
          </OwnerButtons>
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
                  canEdit={ownerAbilities.canEdit}
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
