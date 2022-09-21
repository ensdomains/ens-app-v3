import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Avatar, Button, Dialog, mq } from '@ensdomains/thorin'

import { CurrencySwitch } from '@app/components/@atoms/CurrencySwitch/CurrencySwitch'
import { Invoice } from '@app/components/@atoms/Invoice/Invoice'
import { PlusMinusControl } from '@app/components/@atoms/PlusMinusControl/PlusMinusControl'
import { RegistrationTimeComparisonBanner } from '@app/components/@atoms/RegistrationTimeComparisonBanner/RegistrationTimeComparisonBanner'
import { StyledName } from '@app/components/@atoms/StyledName/StyledName'
import { useAvatar } from '@app/hooks/useAvatar'
import { useEstimateTransactionCost } from '@app/hooks/useTransactionCost'
import { useZorb } from '@app/hooks/useZorb'
import TransactionLoader from '@app/transaction-flow/TransactionLoader'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { CurrencyUnit } from '@app/types'
import { yearsToSeconds } from '@app/utils/utils'

import { ShortExpiry } from '../../../components/@atoms/ExpiryComponents/ExpiryComponents'
import GasDisplay from '../../../components/@atoms/GasDisplay'
import { useChainId } from '../../../hooks/useChainId'
import { useExpiry } from '../../../hooks/useExpiry'
import { usePrice } from '../../../hooks/usePrice'

const Container = styled.form(
  ({ theme }) => css`
    display: flex;
    width: 100%;
    flex-direction: column;
    gap: ${theme.space['4']};
    align-items: center;

    ${mq.sm.min(
      css`
        min-width: 600px;
      `,
    )}
  `,
)

const PlusMinusWrapper = styled.div(
  () => css`
    width: 100%;
    max-width: 60%;
    overflow: hidden;
    display: flex;
  `,
)

const OptionBar = styled.div(
  () => css`
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
)

const NamesListItemContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    align-items: center;
    gap: ${theme.space['2']};
    height: ${theme.space['16']};
    border: 1px solid ${theme.colors.borderSecondary};
    border-radius: ${theme.radii.full};
    padding: ${theme.space['2']};
    padding-right: ${theme.space['5']};
  `,
)

const NamesListItemAvatarWrapper = styled.div(
  ({ theme }) => css`
    position: relative;
    width: ${theme.space['12']};
    height: ${theme.space['12']};
  `,
)

const NamesListItemContent = styled.div(
  () => css`
    flex: 1;
    position: relative;
    overflow: hidden;
  `,
)

const NamesListItemTitle = styled.div(
  ({ theme }) => css`
    font-size: ${theme.space['5.5']};
    background: 'red';
  `,
)

const NamesListItemSubtitle = styled.div(
  ({ theme }) => css`
    font-weight: ${theme.fontWeights.normal};
    font-size: ${theme.space['3.5']};
    line-height: 1.43;
    color: ${theme.colors.textTertiary};
  `,
)

const NamesListItem = ({ name }: { name: string }) => {
  const chainId = useChainId()
  const { avatar } = useAvatar(name, chainId)
  const zorb = useZorb(name, 'name')
  const { expiry, loading: expiryLoading } = useExpiry(name)
  console.log(expiry, typeof expiry?.expiry)

  if (expiryLoading) return null
  return (
    <NamesListItemContainer>
      <NamesListItemAvatarWrapper>
        <Avatar src={avatar || zorb} label={name} />
      </NamesListItemAvatarWrapper>
      <NamesListItemContent>
        <NamesListItemTitle>
          <StyledName name={name} />
        </NamesListItemTitle>
        {expiry?.expiry && (
          <NamesListItemSubtitle>
            <ShortExpiry expiry={expiry.expiry} textOnly />
          </NamesListItemSubtitle>
        )}
      </NamesListItemContent>
    </NamesListItemContainer>
  )
}

type NamesListProps = {
  names: string[]
}

type Data = {
  name: string
  contract: 'nameWrapper' | 'registry'
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const DeleteSubname = ({ data: { name, contract }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const handleClick = () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('deleteSubname', {
          name,
          contract,
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }
  return (
    <>
      <Dialog.Heading title="delete subname" />
      <Container>Hello</Container>
      <Dialog.Footer
        leading={
          <Button shadowless tone="grey" variant="secondary" onClick={onDismiss}>
            Back
          </Button>
        }
        trailing={
          <Button shadowless onClick={handleClick}>
            Forward
          </Button>
        }
      />
    </>
  )
}

export default DeleteSubname
