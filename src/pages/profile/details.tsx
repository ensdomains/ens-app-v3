import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { ENS } from '@ensdomains/ensjs'
import { Typography, mq } from '@ensdomains/thorin'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { NameSnippetMobile } from '@app/components/pages/profile/NameSnippetMobile'
import { OwnerButton } from '@app/components/pages/profile/OwnerButton'
import Advanced from '@app/components/pages/profile/[name]/details/AdvancedTab/AdvancedTab'
import { DetailSnippet } from '@app/components/pages/profile/[name]/details/DetailSnippet'
import { RecordsTab } from '@app/components/pages/profile/[name]/details/RecordsTab'
import { SubnamesTab } from '@app/components/pages/profile/[name]/details/SubnamesTab'
import { WrapperCallToAction } from '@app/components/pages/profile/[name]/details/WrapperCallToAction'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { useWrapperExists } from '@app/hooks/useWrapperExists'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

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

const OwnerButtons = styled(CacheableComponent)(
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

export const Details = ({
  expiryDate,
  ownerData,
  breakpoints,
  normalisedName,
  chainId,
  selfAbilities,
  dnsOwner,
  isCached,
}: {
  expiryDate: Date | null | undefined
  ownerData: Awaited<ReturnType<ENS['getOwner']>>
  breakpoints: ReturnType<typeof useBreakpoint>
  normalisedName: string
  chainId: number
  selfAbilities: ReturnType<typeof useSelfAbilities>
  dnsOwner: string
  isCached?: boolean
}) => {
  const { t } = useTranslation('profile')

  return (
    <DetailsContainer>
      {breakpoints.md ? (
        <NFTWithPlaceholder
          name={normalisedName}
          network={chainId}
          style={{ width: '270px', height: '270px' }}
        />
      ) : (
        <NameSnippetMobile
          isCached={isCached}
          expiryDate={expiryDate}
          name={normalisedName}
          network={chainId}
          canSend={selfAbilities.canSend}
        />
      )}
      <OwnerButtons $isCached={isCached}>
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
            data-testid="owner-button-owner"
          />
        )}
        {dnsOwner && (
          <OwnerButton
            address={dnsOwner}
            network={chainId}
            label={t('name.dnsOwner', { ns: 'common' })}
            type={breakpoints.lg ? 'dropdown' : 'dialog'}
            description={t('details.descriptions.dnsOwner')}
            canTransfer={false}
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
            data-testid="owner-button-registrant"
          />
        )}
      </OwnerButtons>
      {breakpoints.md && (
        <DetailSnippet
          isCached={isCached}
          canSend={selfAbilities.canSend}
          expiryDate={expiryDate}
        />
      )}
    </DetailsContainer>
  )
}

type Tab = 'records' | 'subnames' | 'advanced'

export default function Page() {
  const { t } = useTranslation('profile')
  const breakpoints = useBreakpoint()
  const router = useRouter()
  const name = router.query.name as string

  const chainId = useChainId()
  const { address, isConnecting, isReconnecting } = useAccount()
  const accountLoading = isConnecting || isReconnecting

  const {
    normalisedName,
    expiryDate,
    ownerData,
    profile,
    dnsOwner,
    isLoading: detailsLoading,
    isWrapped,
    basicIsCachedData,
    profileIsCachedData,
  } = useNameDetails(name)
  const nameWrapperExists = useWrapperExists()
  const canBeWrapped = nameWrapperExists && ownerData?.registrant === address && !isWrapped

  const selfAbilities = useSelfAbilities(address, ownerData)

  const isLoading = detailsLoading || accountLoading

  const tab = (router.query.tab as Tab) || 'records'
  const setTab = (newTab: Tab) => {
    const url = new URL(router.asPath, window.location.origin)
    url.searchParams.set('tab', newTab)
    router.push(url.toString(), undefined, {
      shallow: true,
    })
  }

  return (
    <Content title={normalisedName} subtitle={t('details.title')} loading={isLoading}>
      {{
        info: canBeWrapped && <WrapperCallToAction name={normalisedName} />,
        leading: (
          <Details
            {...{
              expiryDate,
              ownerData,
              breakpoints,
              normalisedName,
              chainId,
              selfAbilities,
              dnsOwner,
              isCached: basicIsCachedData,
            }}
          />
        ),
        trailing: {
          records: (
            <>
              <RecordsTab
                network={chainId}
                name={normalisedName}
                texts={(profile?.records?.texts as any) || []}
                addresses={(profile?.records?.coinTypes as any) || []}
                contentHash={profile?.records?.contentHash}
                canEdit={selfAbilities.canEdit}
                isCached={profileIsCachedData}
              />
            </>
          ),
          subnames: (
            <SubnamesTab
              name={normalisedName}
              isWrapped={isWrapped}
              canEdit={selfAbilities.canEdit}
              network={chainId}
            />
          ),
          advanced: <Advanced />,
        }[tab],
        header: (
          <TabButtonContainer>
            <TabButton
              data-testid="records-tab"
              $selected={tab === 'records'}
              onClick={() => setTab('records')}
            >
              <Typography weight="bold">{t('details.tabs.records.label')}</Typography>
            </TabButton>
            <TabButton
              data-testid="subnames-tab"
              $selected={tab === 'subnames'}
              onClick={() => setTab('subnames')}
            >
              <Typography weight="bold">{t('details.tabs.subnames.label')}</Typography>
            </TabButton>
            <TabButton
              data-testid="advanced-tab"
              $selected={tab === 'advanced'}
              onClick={() => setTab('advanced')}
            >
              <Typography weight="bold">{t('details.tabs.advanced.label')}</Typography>
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
