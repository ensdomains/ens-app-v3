import { ethers } from 'ethers'
import { useEffect, useRef, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useProvider, useQuery } from 'wagmi'

import { Button, Dialog, Input, Typography, mq } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { ErrorContainer } from '@app/components/@molecules/ErrorContainer'
import { Outlink } from '@app/components/Outlink'
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

const NegativeSpacer = styled.div(
  ({ theme }) => css`
    margin-top: -${theme.space['5.5']};
  `,
)

const LatestResolverLabel = styled.div<{ $offset: boolean }>(
  ({ theme, $offset }) => css`
    display: flex;
    flex-direction: column;
    ${$offset && `padding-top: ${theme.space['5.5']};`}
  `,
)

const LatestResolverTitleContainer = styled.div(
  () => css`
    display: flex;
    align-items: center;
  `,
)

const LatestResolverTitle = styled.span(
  () => css`
    :after {
      content: '\xa0';
    }
  `,
)

const LatestResolverSubtitle = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textSecondary};
  `,
)

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
  const provider = useProvider({ chainId: 1 })
  const providerRef = useRef(new ethers.getDefaultProvider())
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

  console.log('ethNameValidation: ', ethNameValidation)

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
      <EditResolverFormContainer>
        <form
          data-testid="edit-resolver-form"
          onSubmit={handleSubmit(handleTransaction)}
          ref={formRef}
        >
          <InputContainer>
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
          </InputContainer>
          <Spacer $height="4" />
        </form>
      </EditResolverFormContainer>
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
            {t('action.update', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default EditResolver
