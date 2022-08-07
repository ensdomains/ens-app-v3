import { Spacer } from '@app/components/@atoms/Spacer'
import { ErrorContainer } from '@app/components/@molecules/ErrorContainer'
import { Outlink } from '@app/components/Outlink'
import { useProfile } from '@app/hooks/useProfile'
import { RESOLVER_ADDRESSES } from '@app/utils/constants'
import { Button, Dialog, Input, mq, RadioButton, Typography } from '@ensdomains/thorin'
import { ethers } from 'ethers'
import { useEffect, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'
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

export const EditResolver = ({
  data,
  dispatch,
  onDismiss,
}: {
  data: Data
} & TransactionDialogPassthrough) => {
  const { name } = data
  const formRef = useRef<HTMLFormElement>(null)

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

  useEffect(() => {
    if (isResolverAddressLatest) reset({ resolverChoice: 'custom', customResolver: '' })
  }, [isResolverAddressLatest, reset])

  const { t } = useTranslation('profile')

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

  const latestResolverLabel = (
    <LatestResolverLabel $offset={isResolverAddressLatest}>
      <LatestResolverTitleContainer>
        <LatestResolverTitle>Use latest resolver</LatestResolverTitle>
        <Outlink href={`https://etherscan.io/address/${lastestResolverAddress}`}>
          {t('details.tabs.advanced.resolver.etherscan')}
        </Outlink>
      </LatestResolverTitleContainer>
      {isResolverAddressLatest && (
        <LatestResolverSubtitle weight="medium" variant="small">
          You are on the latest resolver
        </LatestResolverSubtitle>
      )}
    </LatestResolverLabel>
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

  const hasWarnings =
    resolverChoice === 'custom' &&
    customResolver.length === 42 &&
    resolverWarnings &&
    resolverWarnings.length > 0

  const hasErrors = Object.keys(errors || {}).length > 0

  return (
    <>
      <EditResolverFormContainer>
        {hasWarnings && (
          <>
            <ErrorContainer
              message={
                <ul>
                  {resolverWarnings?.map((message) => (
                    <li key={message}>- {message}</li>
                  ))}
                </ul>
              }
              type="warning"
            />
            <Spacer $height="4" />
          </>
        )}
        <form
          data-testid="edit-resolver-form"
          onSubmit={handleSubmit(handleTransaction)}
          ref={formRef}
        >
          {isResolverAddressLatest && <NegativeSpacer />}
          <RadioButton
            label={latestResolverLabel}
            value="latest"
            labelRight
            disabled={isResolverAddressLatest}
            {...register('resolverChoice', {
              required: true,
              validate: {},
              onChange: () => {
                process.nextTick(() => trigger())
                trigger()
              },
            })}
          />
          <RadioButton
            label={t('details.tabs.advanced.resolver.custom')}
            value="custom"
            labelRight
            {...register('resolverChoice')}
          />
          <InputContainer>
            <Input
              label="Custom resolver"
              hideLabel
              placeholder="Enter custom resolver address"
              disabled={resolverChoice !== 'custom'}
              {...register('customResolver', {
                validate: {
                  length: (value) =>
                    resolverChoice === 'custom' && value.length !== 42
                      ? 'Address should be 42 characters long'
                      : undefined,
                  isCurrentResolver: (value) =>
                    resolverChoice === 'custom' && value === resolverAddress
                      ? 'This is the current resolver'
                      : undefined,
                  isAddress: (value) =>
                    resolverChoice === 'custom' && !ethers.utils.isAddress(value)
                      ? 'Not a valid address'
                      : undefined,
                },
              })}
              error={getFieldState('customResolver').error?.message}
            />
          </InputContainer>
          <Spacer $height="4" />
        </form>
      </EditResolverFormContainer>
      <Dialog.Footer
        leading={
          <Button variant="secondary" tone="grey" shadowless onClick={onDismiss}>
            Cancel
          </Button>
        }
        trailing={
          <Button shadowless onClick={handleSubmitForm} disabled={hasErrors}>
            Update
          </Button>
        }
      />
    </>
  )
}
