import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Button, Typography } from '@ensdomains/thorin'

import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import { useBasicName } from '@app/hooks/useBasicName'
import { useChainId } from '@app/hooks/useChainId'
import { usePrimary } from '@app/hooks/usePrimary'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { SectionContainer } from './Section'

const ItemWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    background-color: ${theme.colors.background};
  `,
)

export const PrimarySection = () => {
  const { t } = useTranslation('settings')

  const { showDataInput } = useTransactionFlow()

  const chainId = useChainId()

  const { address: _address } = useAccount()
  const address = _address as string

  const { name, loading: primaryLoading } = usePrimary(address, !address)

  const { expiryDate, truncatedName, isLoading: basicLoading } = useBasicName(name, true)

  const { canSendOwner, canSendManager } = useSelfAbilities(address, name)

  const isLoading = basicLoading || primaryLoading

  const changePrimary = () =>
    showDataInput(`changePrimary-${address}`, 'SelectPrimaryName', {
      address,
      existingPrimary: name,
    })

  return (
    <SectionContainer
      title={t('section.primary.title')}
      action={
        <Button data-testid="primary-section-button" size="small" onClick={() => changePrimary()}>
          {t(`action.${name ? 'change' : 'set'}`, { ns: 'common' })}
        </Button>
      }
      fill={!!name}
    >
      {name ? (
        <ItemWrapper data-testid="primary-wrapper">
          <TaggedNameItem
            name={name}
            network={chainId}
            expiryDate={expiryDate || undefined}
            isController={canSendManager}
            isRegistrant={canSendOwner}
            truncatedName={truncatedName}
          />
        </ItemWrapper>
      ) : (
        <Typography data-testid="primary-section-text">
          {isLoading ? t('section.primary.loading') : t('section.primary.noName')}
        </Typography>
      )}
    </SectionContainer>
  )
}
