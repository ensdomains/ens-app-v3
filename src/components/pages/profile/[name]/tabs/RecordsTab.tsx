import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Typography, mq } from '@ensdomains/thorin'

import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { Outlink } from '@app/components/Outlink'
import RecordItem from '@app/components/RecordItem'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { getContentHashLink } from '@app/utils/contenthash'

import { TabWrapper as OriginalTabWrapper } from '../../TabWrapper'

type TextRecord = {
  key: string
  value: string
}

type AddressRecord = {
  key: string
  coin: string
  addr: string
}

type ContentHash =
  | {
      protocolType?: any
      decoded?: any
      error?: any
    }
  | null
  | string

const TabWrapper = styled(OriginalTabWrapper)(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
  `,
  cacheableComponentStyles,
)

const AllRecords = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: flex-start;
    gap: ${theme.space['3']};
    padding: ${theme.space['4.5']};
    ${mq.md.min(css`
      padding: ${theme.space['6']};
      gap: ${theme.space['6']};
    `)}
  `,
)

const RecordSection = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: stretch;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `,
)

const SectionHeader = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: ${theme.space.full};
    padding: 0 ${theme.radii.large};
  `,
)

const SectionTitleContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['4']};
    flex-gap: ${theme.space['4']};
  `,
)

const SectionTitle = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.foreground};
  `,
)

const SectionSubtitle = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `,
)

const Actions = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-flow: row wrap;
    gap: ${theme.space['2']};

    border-top: 1px solid ${theme.colors.borderSecondary};
    padding: ${theme.space['4']};

    ${mq.md.min(css`
      padding: ${theme.space['4']} ${theme.space['6']};
    `)}
  `,
)

export const RecordsTab = ({
  name,
  network,
  texts,
  addresses,
  contentHash,
  canEdit,
  isCached,
}: {
  name: string
  network: number
  texts?: TextRecord[]
  addresses?: AddressRecord[]
  contentHash?: ContentHash
  canEdit?: boolean
  isCached?: boolean
}) => {
  const { t } = useTranslation('profile')

  const filteredTexts = useMemo(() => texts?.filter(({ value }) => value), [texts])
  const filteredAddresses = useMemo(() => addresses?.filter(({ addr }) => addr), [addresses])

  const formattedContentHash = useMemo(() => {
    if (contentHash) {
      if (typeof contentHash === 'string') {
        return contentHash
      }
      if (typeof contentHash === 'object' && contentHash.decoded) {
        return `${contentHash.protocolType}://${contentHash.decoded}`
      }
    }
    return undefined
  }, [contentHash])

  const formattedContentHashLink = useMemo(() => {
    if (contentHash) {
      return getContentHashLink(name, network, contentHash as any)
    }
  }, [name, network, contentHash])

  const { showDataInput } = useTransactionFlow()
  const handleShowEditor = () =>
    showDataInput(
      `advanced-editor-${name}`,
      `AdvancedEditor`,
      { name },
      { disableBackgroundClick: true },
    )
  return (
    <TabWrapper $isCached={isCached} data-testid="records-tab">
      <AllRecords>
        <RecordSection>
          <SectionHeader>
            <SectionTitleContainer>
              <SectionTitle data-testid="text-heading" weight="bold">
                {t('details.tabs.records.text')}
              </SectionTitle>
              <SectionSubtitle data-testid="text-amount">
                {filteredTexts ? filteredTexts.length : 0} {t('records.label', { ns: 'common' })}
              </SectionSubtitle>
            </SectionTitleContainer>
          </SectionHeader>
          {filteredTexts &&
            filteredTexts.map((text) => (
              <RecordItem key={text.key} type="text" itemKey={text.key} value={text.value} />
            ))}
        </RecordSection>
        <RecordSection>
          <SectionHeader>
            <SectionTitleContainer>
              <SectionTitle data-testid="address-heading" weight="bold">
                {t('address.label', { ns: 'common' })}
              </SectionTitle>
              <SectionSubtitle data-testid="address-amount">
                {filteredAddresses ? filteredAddresses.length : 0}{' '}
                {t('records.label', { ns: 'common' })}
              </SectionSubtitle>
            </SectionTitleContainer>
          </SectionHeader>
          {filteredAddresses &&
            filteredAddresses.map((address) => (
              <RecordItem
                type="address"
                key={address.key}
                itemKey={address.coin}
                value={address.addr}
                showLegacy={address.coin.endsWith('_LEGACY')}
              />
            ))}
        </RecordSection>
        <RecordSection>
          <SectionHeader>
            <SectionTitleContainer>
              {formattedContentHash ? (
                <>
                  <SectionTitle data-testid="content-hash-heading" weight="bold">
                    {t('details.tabs.records.contentHash')}
                  </SectionTitle>
                  {formattedContentHashLink && (
                    <Outlink href={formattedContentHashLink}>
                      {t('action.view', { ns: 'common' })}
                    </Outlink>
                  )}
                </>
              ) : (
                <SectionSubtitle data-testid="content-hash-heading">
                  {t('details.tabs.records.noContentHash')}
                </SectionSubtitle>
              )}
            </SectionTitleContainer>
          </SectionHeader>
          {formattedContentHash && <RecordItem type="contentHash" value={formattedContentHash} />}
        </RecordSection>
      </AllRecords>
      {canEdit && (
        <Actions>
          <div>
            <Button shadowless onClick={handleShowEditor} size="small">
              {t('details.tabs.records.editRecords')}
            </Button>
          </div>
        </Actions>
      )}
    </TabWrapper>
  )
}
