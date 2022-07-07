import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { NameSnippetMobile } from '@app/components/pages/profile/NameSnippetMobile'
import { OwnerButton } from '@app/components/pages/profile/OwnerButton'
import { DetailSnippet } from '@app/components/pages/profile/[name]/details/DetailSnippet'
import More from '@app/components/pages/profile/[name]/details/MoreTab/MoreTab'
import { RecordsTab } from '@app/components/pages/profile/[name]/details/RecordsTab'
import { SubnamesTab } from '@app/components/pages/profile/[name]/details/SubnamesTab'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { mq, Typography } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { ReactElement, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'
import { useTranslation } from 'react-i18next'

const DetailsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: ${theme.space['1']};
    ${mq.sm.min(css`
      flex-direction: row;
      justify-content: center;
    `)}
    ${mq.md.min(css`
      flex-direction: column;
      justify-content: flex-start;
    `)}
  `,
)

const OwnerButtons = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: stretch;
    gap: ${theme.space['1']};
    flex-gap: ${theme.space['1']};
    ${mq.xs.min(css`
      flex-direction: row;
    `)}
    ${mq.sm.min(css`
      flex-direction: column;
      & > div {
        max-width: initial !important;
      }
    `)}
  `,
)

const TabButtonContainer = styled.div(
  ({ theme }) => css`
    margin-left: ${theme.radii.extraLarge};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['3']};
    flex-gap: ${theme.space['3']};
  `,
)

const TabButton = styled.button<{ $selected: boolean }>(
  ({ theme, $selected }) => css`
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
  `,
)

export default function Page() {
  const { t } = useTranslation('profile')
  const breakpoints = useBreakpoint()
  const router = useRouter()
  const name = router.query.name as string

  const chainId = useChainId()
  const { data: accountData, isLoading: accountLoading } = useAccount()
  const address = accountData?.address

  const {
    normalisedName,
    expiryDate,
    ownerData,
    profile,
    dnsOwner,
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
    <Content
      title={normalisedName}
      subtitle={t('details.title')}
      loading={isLoading}
    >
      {{
        leading: (
          <DetailsContainer>
            {breakpoints.md ? (
              <NFTWithPlaceholder
                name={normalisedName}
                network={chainId}
                style={{ width: '270px', height: '270px' }}
              />
            ) : (
              <NameSnippetMobile
                expiryDate={expiryDate}
                name={normalisedName}
                network={chainId}
                canSend={selfAbilities.canSend}
              />
            )}
            <OwnerButtons>
              {ownerData?.owner && (
                <OwnerButton
                  address={ownerData.owner}
                  network={chainId}
                  label={
                    ownerData.ownershipLevel === 'nameWrapper'
                      ? t('name.owner', { ns: 'common' })
                      : t('name.controller', { ns: 'common' })
                  }
                  type={breakpoints.lg ? 'dropdown' : 'dialog'}
                  description={
                    ownerData.ownershipLevel === 'nameWrapper'
                      ? t('details.descriptions.owner')
                      : t('details.descriptions.controller')
                  }
                  canTransfer={selfAbilities.canChangeOwner}
                />
              )}
              {dnsOwner && (
                <OwnerButton
                  address={dnsOwner}
                  network={chainId}
                  label={t('name.dnsOwner', { ns: 'common' })}
                  type={breakpoints.lg ? 'dropdown' : 'dialog'}
                  description={t('details.descriptions.dnsOwner')}
                />
              )}
              {ownerData?.registrant && (
                <OwnerButton
                  address={ownerData.registrant}
                  network={chainId}
                  label={t('name.registrant', { ns: 'common' })}
                  type={breakpoints.lg ? 'dropdown' : 'dialog'}
                  description={t('details.descriptions.registrant')}
                  canTransfer={selfAbilities.canChangeRegistrant}
                />
              )}
            </OwnerButtons>
            {breakpoints.md && (
              <DetailSnippet
                canSend={selfAbilities.canSend}
                expiryDate={expiryDate}
              />
            )}
          </DetailsContainer>
        ),
        trailing: {
          records: (
            <RecordsTab
              network={chainId}
              name={normalisedName}
              texts={(profile?.records?.texts as any) || []}
              addresses={(profile?.records?.coinTypes as any) || []}
              contentHash={profile?.records?.contentHash}
              canEdit={selfAbilities.canEdit}
            />
          ),
          subnames: <SubnamesTab name={normalisedName} network={chainId} />,
          more: <More />,
        }[tab],
        header: (
          <TabButtonContainer>
            <TabButton
              $selected={tab === 'records'}
              onClick={() => setTab('records')}
            >
              <Typography weight="bold">
                {t('details.tabs.records.label')}
              </Typography>
            </TabButton>
            <TabButton
              $selected={tab === 'subnames'}
              onClick={() => setTab('subnames')}
            >
              <Typography weight="bold">
                {t('details.tabs.subnames.label')}
              </Typography>
            </TabButton>
            <TabButton
              $selected={tab === 'more'}
              onClick={() => setTab('more')}
            >
              <Typography weight="bold">
                {t('details.tabs.more.label')}
              </Typography>
            </TabButton>
          </TabButtonContainer>
        ),
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
