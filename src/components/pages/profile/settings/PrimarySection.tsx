import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/NameDetailItem'
import { useBasicName } from '@app/hooks/useBasicName'
import { useChainId } from '@app/hooks/useChainId'
import { usePrimary } from '@app/hooks/usePrimary'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { Button, Typography } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'
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

  const { data: addressData } = useAccount()
  const address = addressData?.address!

  const { name, loading: primaryLoading } = usePrimary(address, !address)

  const { expiryDate, ownerData, truncatedName, isLoading: basicLoading } = useBasicName(name, true)

  const { canChangeOwner, canChangeRegistrant } = useSelfAbilities(address, ownerData)

  const isLoading = basicLoading || primaryLoading

  const changePrimary = () =>
    showDataInput(`changePrimary-${address}`, 'SelectPrimaryName', { address })

  return (
    <SectionContainer
      title={t('section.primary.title')}
      action={
        <Button shadowless onClick={() => changePrimary()}>
          {t('action.change', { ns: 'common' })}
        </Button>
      }
      fill={!!name}
    >
      {name ? (
        <ItemWrapper>
          <TaggedNameItem
            name={name}
            network={chainId}
            expiryDate={expiryDate || undefined}
            isController={canChangeOwner}
            isRegistrant={canChangeRegistrant}
            truncatedName={truncatedName}
          />
        </ItemWrapper>
      ) : (
        <Typography>{isLoading ? 'Loading primary name...' : 'No primary name set.'}</Typography>
      )}
    </SectionContainer>
  )
}
