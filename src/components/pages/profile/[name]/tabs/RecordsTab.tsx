import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useChainId } from 'wagmi'

import { Button, Typography } from '@ensdomains/thorin'

import { cacheableComponentStyles } from '@app/components/@atoms/CacheableComponent'
import { DisabledButtonWithTooltip } from '@app/components/@molecules/DisabledButtonWithTooltip'
import { Outlink } from '@app/components/Outlink'
import RecordItem from '@app/components/RecordItem'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { AddressRecord, Profile, TextRecord } from '@app/types'
import { abiDisplayValue } from '@app/utils/abi'
import { emptyAddress } from '@app/utils/constants'
import { getContentHashLink } from '@app/utils/contenthash'
import { useHasGraphError } from '@app/utils/SyncProvider/SyncProvider'

import { TabWrapper as OriginalTabWrapper } from '../../TabWrapper'

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
    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['6']};
      gap: ${theme.space['6']};
    }
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
    color: ${theme.colors.greyPrimary};
  `,
)

const SectionSubtitle = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.grey};
  `,
)

const Actions = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-flow: row wrap;
    gap: ${theme.space['2']};

    border-top: 1px solid ${theme.colors.border};
    padding: ${theme.space['4']};

    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['4']} ${theme.space['6']};
    }
  `,
)

export const RecordsTab = ({
  name,
  texts,
  addresses,
  contentHash,
  abi,
  canEdit,
  canEditRecords,
  isCached,
  resolverAddress,
}: {
  name: string
  texts?: TextRecord[]
  addresses?: AddressRecord[]
  contentHash?: Profile['contentHash']
  abi?: Profile['abi']
  canEdit?: boolean
  canEditRecords?: boolean
  isCached?: boolean
  resolverAddress?: Profile['resolverAddress']
}) => {
  const { t } = useTranslation('profile')
  const { data: hasGraphError, isLoading: hasGraphErrorLoading } = useHasGraphError()

  const chainId = useChainId()

  const filteredTexts = useMemo(() => texts?.filter(({ value }) => value), [texts])
  const filteredAddresses = useMemo(() => addresses?.filter(({ value }) => value), [addresses])

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
      return getContentHashLink({ name, chainId, decodedContentHash: contentHash })
    }
  }, [name, chainId, contentHash])

  const { usePreparedDataInput } = useTransactionFlow()
  const showAdvancedEditorInput = usePreparedDataInput('AdvancedEditor')
  const handleShowEditor = () =>
    showAdvancedEditorInput(`advanced-editor-${name}`, { name }, { disableBackgroundClick: true })

  return (
    <TabWrapper $isCached={isCached} data-testid="records-tab">
      <AllRecords>
        <RecordSection>
          <SectionHeader>
            <SectionTitleContainer>
              <SectionTitle data-testid="text-heading" fontVariant="bodyBold">
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
              <SectionTitle data-testid="address-heading" fontVariant="bodyBold">
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
                key={address.id}
                itemKey={address.name}
                value={address.value}
                showLegacy={address.name.endsWith('_LEGACY')}
              />
            ))}
        </RecordSection>
        <RecordSection>
          <SectionHeader>
            <SectionTitleContainer>
              {formattedContentHash ? (
                <>
                  <SectionTitle data-testid="content-hash-heading" fontVariant="bodyBold">
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
        <RecordSection>
          <SectionHeader>
            <SectionTitleContainer>
              {abi ? (
                <>
                  <SectionTitle data-testid="abi-heading" fontVariant="bodyBold">
                    {t('details.tabs.records.abi')}
                  </SectionTitle>
                </>
              ) : (
                <SectionSubtitle data-testid="abi-heading">
                  {t('details.tabs.records.noAbi')}
                </SectionSubtitle>
              )}
            </SectionTitleContainer>
          </SectionHeader>
          {abi && <RecordItem type="abi" value={abiDisplayValue(abi)} />}
        </RecordSection>
      </AllRecords>
      {canEdit && resolverAddress !== emptyAddress && (
        <Actions>
          <div>
            {canEditRecords && !hasGraphError ? (
              <Button
                onClick={handleShowEditor}
                size="small"
                loading={hasGraphErrorLoading}
                disabled={hasGraphErrorLoading}
              >
                {t('details.tabs.records.editRecords')}
              </Button>
            ) : (
              <DisabledButtonWithTooltip
                buttonId="records-tab-edit-records-disabled"
                content={
                  hasGraphError
                    ? t('errors.networkError.blurb', { ns: 'common' })
                    : t('details.tabs.records.editRecordsDisabled')
                }
                buttonText={t('details.tabs.records.editRecords')}
                mobileWidth={150}
                mobilePlacement="top"
                placement="top"
                size="small"
                loading={hasGraphErrorLoading}
              />
            )}
          </div>
        </Actions>
      )}
    </TabWrapper>
  )
}
