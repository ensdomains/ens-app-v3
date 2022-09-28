import { ethers } from 'ethers'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useProvider, useQuery } from 'wagmi'

import { Button, Dialog, Input, Typography, mq } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { ErrorContainer } from '@app/components/@molecules/ErrorContainer'
import { NameAvatar } from '@app/components/AvatarWithZorb'
import { Outlink } from '@app/components/Outlink'
import { useChainId } from '@app/hooks/useChainId'
import { usePrimary } from '@app/hooks/usePrimary'
import { useProfile } from '@app/hooks/useProfile'
import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'
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
    border: 1px solid grey;
    padding: 20px;
    border-radius: 15px;
    width: 100%;
  `,
)

const InnerContainer = styled.div(() => [
  css`
    padding: 0 20px;
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

export const EditResolver = ({ data, dispatch, onDismiss }: Props) => {
  const { name } = data
  const formRef = useRef<HTMLFormElement>(null)
  const { ready, getRecords } = useEns()

  const { profile = { resolverAddress: '' } } = useProfile(name as string)
  const { resolverAddress } = profile
  const lastestResolverAddress = RESOLVER_ADDRESSES[0]
  const isResolverAddressLatest = resolverAddress === lastestResolverAddress

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
    '0x70997970C51812dc3A010C7d01b50e0d17dc79C8',
  )

  console.log('ethNameValidation: ', ethNameValidation)
  console.log('sendNameWatch: ', sendNameWatch)
  console.log('primaryName: ', primaryName)

  useEffect(() => {
    if (isResolverAddressLatest) reset({ resolverChoice: 'custom', customResolver: '' })
  }, [isResolverAddressLatest, reset])

  const { t } = useTranslation('transactionFlow')

  const resolverChoice: 'latest' | 'custom' = watch('resolverChoice')
  const customResolver = watch('customResolver')

  const { errors: resolverWarnings } = useResolverHasInterfaces(
    ['IAddrResolver', 'ITextResolver', 'IContentHashResolver'],
    customResolver,
    resolverChoice !== 'custom',
    {
      fallbackMsg: 'Cannot determine if address supports resolver methods',
    },
  )

  const handleTransaction = async (values: FormData) => {
    const { resolverChoice: choice, customResolver: address } = values
    let newResolver
    if (choice === 'latest') {
      newResolver = lastestResolverAddress
    }
    if (choice === 'custom') {
      newResolver = address
    }
    if (!newResolver) return
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('updateResolver', {
          name,
          contract: 'registry',
          resolver: newResolver,
          oldResolver: resolverAddress!,
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  const handleSubmitForm = () => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  const hasErrors = () => {
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
      <InnerContainer>
        <form
          data-testid="edit-resolver-form"
          onSubmit={handleSubmit(handleTransaction)}
          ref={formRef}
        >
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

export default EditResolver
