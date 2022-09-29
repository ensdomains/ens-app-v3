import { ethers } from 'ethers'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount, useProvider, useQuery } from 'wagmi'

import { Button, Checkbox, Dialog, Helper, Input, Typography, mq } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { ErrorContainer } from '@app/components/@molecules/ErrorContainer'
import { NameAvatar } from '@app/components/AvatarWithZorb'
import { Outlink } from '@app/components/Outlink'
import { useBasicName } from '@app/hooks/useBasicName'
import { useChainId } from '@app/hooks/useChainId'
import { usePrimary } from '@app/hooks/usePrimary'
import { useProfile } from '@app/hooks/useProfile'
import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { useEns } from '@app/utils/EnsProvider'
import { RESOLVER_ADDRESSES } from '@app/utils/constants'

import { makeTransactionItem } from '../transaction'

const EditResolverFormContainer = styled.div(() => [
  css`
    width: 100%;
  `,
  mq.sm.min(css`
    width: 510px;
  `),
])

const InputContainer = styled.div(
  ({ theme }) => css`
    margin-left: ${theme.space[8]};
  `,
)

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['7']};
    min-width: ${theme.space['7']};
    height: ${theme.space['7']};
  `,
)

const ValueTypography = styled(Typography)(
  () => css`
    text-align: right;
  `,
)

const ValueWithAvatarContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['4']};
    padding: 20px;
    width: 100%;
    border-radius: ${theme.radii.extraLarge};
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid}
      rgba(${theme.shadesRaw.foreground}, 0.06);
  `,
)

const SwitchBox = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['4']};
    padding: 20px;
    width: 100%;
    border-radius: ${theme.radii.extraLarge};
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid}
      rgba(${theme.shadesRaw.foreground}, 0.06);
  `,
)

const TextContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
  `,
)

const InnerContainer = styled.div(() => [
  css`
    width: 100%;
  `,
  mq.sm.min(css`
    width: 510px;
  `),
])

const NameValue = ({ value }: { value: string }) => {
  const network = useChainId()

  return (
    <ValueWithAvatarContainer>
      <ValueTypography weight="bold">{value}</ValueTypography>
      <AvatarWrapper>
        <NameAvatar name={value} label={`${value}-avatar`} network={network} />
      </AvatarWrapper>
    </ValueWithAvatarContainer>
  )
}

type Data = {
  name: string
}

type FormData = {
  resolverChoice: 'latest' | 'custom'
  customResolver: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

export const SendName = ({ data, dispatch, onDismiss }: Props) => {
  const { name } = data
  const formRef = useRef<HTMLFormElement>(null)
  const { ready, getRecords } = useEns()
  const { createTransactionFlow, resumeTransactionFlow, getResumable } = useTransactionFlow()
  const { ownerData, isWrapped } = useBasicName(name as string)
  const { address } = useAccount()
  const { canChangeOwner, canChangeRegistrant } = useSelfAbilities(address, ownerData)

  const { profile = { resolverAddress: '' } } = useProfile(name as string)

  const {
    register,
    formState: { errors },
    handleSubmit,
    reset,
    trigger,
    watch,
    getFieldState,
  } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: { resolverChoice: 'latest', customResolver: '' },
  })

  const managerChoiceWatch = watch('managerChoice')
  const ownerChoiceWatch = watch('ownerChoice')
  const sendNameWatch = watch('sendName')
  const { data: ethNameValidation, isLoading } = useQuery(
    ['ethNameValidation', sendNameWatch],
    async () => {
      const result = await getRecords(sendNameWatch)
      return result?.address
    },
    { enabled: sendNameWatch?.includes('.eth') },
  )

  const { name: primaryName, loading: isLoadingPrimaryName } = usePrimary(
    ethNameValidation || sendNameWatch,
  )

  const { t } = useTranslation('transactionFlow')

  console.log('ownerData: ', ownerData)

  const handleSubmitForm = () => {
    console.log('handleSubmitForm')
    const isController = ownerData?.owner === address

    if (managerChoiceWatch && !ownerChoiceWatch) {
      dispatch({
        name: 'setTransactions',
        payload: [
          makeTransactionItem('transferController', {
            name,
            newOwner: sendNameWatch,
          }),
        ],
      })
      dispatch({ name: 'setFlowStage', payload: 'transaction' })
      return
    }

    if (!managerChoiceWatch && ownerChoiceWatch) {
      if (isWrapped) {
        dispatch({
          name: 'setTransactions',
          payload: [
            makeTransactionItem('transferName', {
              name,
              newOwner: sendNameWatch,
              contract: 'nameWrapper',
            }),
          ],
        })
        dispatch({ name: 'setFlowStage', payload: 'transaction' })
        return
      }

      //subname
      if (name.split('.').length > 2) {
        dispatch({
          name: 'setTransactions',
          payload: [
            makeTransactionItem('transferName', {
              name,
              newOwner: sendNameWatch,
              contract: 'registry',
            }),
          ],
        })
        dispatch({ name: 'setFlowStage', payload: 'transaction' })
        return
      }

      //.eth name
      dispatch({
        name: 'setTransactions',
        payload: [
          makeTransactionItem('transferName', {
            name,
            newOwner: sendNameWatch,
            contract: 'baseRegistrar',
          }),
        ],
      })
      dispatch({ name: 'setFlowStage', payload: 'transaction' })
      return
    }

    if (managerChoiceWatch && ownerChoiceWatch) {
      //.eth name
      dispatch({
        name: 'setTransactions',
        payload: [
          makeTransactionItem('transferName', {
            name,
            newOwner: sendNameWatch,
            contract: 'baseRegistrar',
          }),
          makeTransactionItem('transferController', {
            name,
            newOwner: sendNameWatch,
          }),
        ],
      })
      dispatch({ name: 'setFlowStage', payload: 'transaction' })
      return
    }
  }

  const hasErrors = () => {
    if (!managerChoiceWatch && !ownerChoiceWatch) {
      return { formMessage: 'Must choose either Manager or Owner to send' }
    }
    if (getFieldState('sendName').error) return {}
    if (isLoading) return {}
    if (sendNameWatch?.includes('.') && !ethNameValidation)
      return { message: 'No address set on name' }
    return false
  }

  console.log('fieldstate: ', getFieldState('sendName'))
  console.log('hasErrors: ', hasErrors())

  return (
    <>
      <Typography variant="extraLarge">Send Name</Typography>
      <Typography style={{ textAlign: 'center' }}>
        Sending this name will make the  new address both the owner and manager.
      </Typography>
      <Outlink href="">Learn more about name ownership.</Outlink>
      <SwitchBox>
        <TextContainer>
          <Typography weight="bold">Make Manager</Typography>
          <Typography weight="light" variant="small">
            The Manager can change and set records
          </Typography>
        </TextContainer>
        <Checkbox {...register('managerChoice')} size="large" variant="switch" value="manager" />
      </SwitchBox>
      <SwitchBox>
        <TextContainer>
          <Typography weight="bold">Make Owner</Typography>
          <Typography weight="light" variant="small">
            The owner can send to a new manager
          </Typography>
        </TextContainer>
        <Checkbox {...register('ownerChoice')} size="large" variant="switch" value="owner" />
      </SwitchBox>
      <InnerContainer>
        <form data-testid="edit-resolver-form" ref={formRef}>
          <Input
            label="Send to"
            placeholder="Enter an Ethereum address or ENS name"
            {...register('sendName', {
              validate: {
                length: (value) =>
                  !value.includes('.eth') && value.length !== 42
                    ? 'If address it should be 42 characters long'
                    : undefined,
                isAddress: (value) =>
                  !value.includes('.eth') && !ethers.utils.isAddress(value)
                    ? 'Not a valid address'
                    : undefined,
              },
            })}
            error={getFieldState('sendName').error?.message || hasErrors()?.message}
          />
          <Spacer $height="4" />
        </form>
        {primaryName && <NameValue value={primaryName} />}
      </InnerContainer>
      {hasErrors()?.formMessage && <Helper type="error">Must send Owner or Manager</Helper>}
      <Dialog.Footer
        leading={
          <Button
            variant="secondary"
            tone="grey"
            shadowless
            onClick={onDismiss}
            loading={isLoading}
          >
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button shadowless onClick={handleSubmitForm} disabled={hasErrors()}>
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default SendName
