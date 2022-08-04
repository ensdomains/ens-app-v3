/* eslint-disable no-param-reassign */
import { Spacer } from '@app/components/@atoms/Spacer'
import { ErrorContainer } from '@app/components/@molecules/ErrorContainer'
import { Outlink } from '@app/components/Outlink'
import { useProfile } from '@app/hooks/useProfile'
import { RESOLVER_ADDRESSES, RESOLVER_INTERFACE_IDS } from '@app/utils/constants'
import { Button, Dialog, Input, mq, RadioButton } from '@ensdomains/thorin'
import { ethers } from 'ethers'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useQuery } from 'react-query'
import styled, { css } from 'styled-components'
import { useProvider } from 'wagmi'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { makeTransactionItem } from '../transaction'

const supportsInterfaceAbi = [
  {
    inputs: [
      {
        internalType: 'bytes4',
        name: 'interfaceID',
        type: 'bytes4',
      },
    ],
    name: 'supportsInterface',
    outputs: [
      {
        internalType: 'bool',
        name: '',
        type: 'bool',
      },
    ],
    stateMutability: 'view',
    type: 'function',
  },
]

const validateResolver = async (address: string, provider: any) => {
  const maybeResolver = new ethers.Contract(address, supportsInterfaceAbi, provider)
  let results
  try {
    results = await Promise.all([
      maybeResolver.supportsInterface(RESOLVER_INTERFACE_IDS.addrInterfaceId),
      maybeResolver.supportsInterface(RESOLVER_INTERFACE_IDS.contentHashInterfaceId),
      maybeResolver.supportsInterface(RESOLVER_INTERFACE_IDS.txtInterfaceId),
    ])
    return results
      .map((result, idx) => {
        if (result) return undefined
        if (idx === 0 && !result) {
          return 'addr method not supported'
        }
        if (idx === 1 && !result) {
          return 'contentHash method not supported'
        }
        if (idx === 2 && !result) {
          return 'txt method not supported'
        }
        return undefined
      })
      .filter((x) => x)
  } catch (error: any) {
    if (error.method === 'supportsInterface(bytes4)') {
      return ['Cannot determine if address supports common resolver methods']
    }
    return []
  }
}

const customResolverErrorMessage = (errors: any) => {
  if (errors.customResolver?.type === 'minLength' || errors.customResolver?.type === 'maxLength') {
    return 'Address should be 42 characters long'
  }
  if (errors.customResolver?.type === 'isCurrentResolver') {
    return 'This is the current resolver'
  }
  return undefined
}

const EditResolverFormContainer = styled.div(() => [
  css`
    width: 100%;
  `,
  mq.sm.min(css`
    width: 510px;
  `),
])

const LatestResolverContainer = styled.div(
  () => css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
  `,
)

const InputContainer = styled.div(
  ({ theme }) => css`
    margin-left: ${theme.space[8]};
  `,
)

type Data = {
  name: string
}

export const EditResolver = ({
  data,
  dispatch,
  onDismiss,
}: {
  data: Data
} & TransactionDialogPassthrough) => {
  const { name } = data

  const { profile = { resolverAddress: '' } } = useProfile(name as string)
  const { resolverAddress } = profile
  const resolverAddressIndex = RESOLVER_ADDRESSES.indexOf(resolverAddress ?? '')

  const {
    register,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const { t } = useTranslation('profile')
  const resolverChoice: 'latest' | 'custom' = watch('resolverChoice')
  const customResolver = watch('customResolver')
  const provider = useProvider()

  const { data: validity } = useQuery(
    ['validateResolverInterfaces', customResolver],
    () => validateResolver(customResolver, provider),
    {
      enabled: ethers.utils.isAddress(customResolver),
    },
  )

  useEffect(() => {
    console.log('RENDERING!!!')
  }, [])

  useEffect(() => {
    const isValid = () => {
      if (resolverChoice === 'latest' && resolverAddressIndex === 0) {
        return false
      }
      if (resolverChoice === 'latest') {
        return true
      }
      if (resolverChoice === 'custom' && !customResolver?.length) {
        return false
      }
      return !Object.keys(errors).length
    }

    const hasValidity = isValid()

    // dispatchDialog({
    //   name: 'addTrailingProps',
    //   payload: {
    //     disabled: !hasValidity,
    //   },
    // })

    if (hasValidity) {
      let newResolver
      if (resolverChoice === 'latest') {
        // eslint-disable-next-line prefer-destructuring
        newResolver = RESOLVER_ADDRESSES[0]
      }
      if (resolverChoice === 'custom') {
        newResolver = customResolver
      }

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
    }
  }, [resolverChoice, customResolver, errors, resolverAddressIndex, dispatch, name, resolverAddress])

  return (
    <>
      <EditResolverFormContainer>
        {resolverChoice === 'custom' && validity?.length ? (
          <>
            <ErrorContainer
              message={
                <ul>
                  {validity?.map((message) => (
                    <li key={message}>- {message}</li>
                  ))}
                </ul>
              }
              type="warning"
            />
            <Spacer $height="4" />
          </>
        ) : null}
        <form data-testid="edit-resolver-form">
          <LatestResolverContainer>
            <RadioButton
              label="Use latest resolver"
              value="latest"
              labelRight
              width={44}
              {...register('resolverChoice', {
                required: true,
              })}
              defaultChecked
            />
            <Outlink href={`https://etherscan.io/address/${RESOLVER_ADDRESSES[0]}`}>
              {t('details.tabs.advanced.resolver.etherscan')}
            </Outlink>
          </LatestResolverContainer>

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
                maxLength: 42,
                minLength: 42,
                validate: {
                  isCurrentResolver: (value) => !(value === resolverAddress),
                },
              })}
              error={customResolverErrorMessage(errors)}
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
          <Button shadowless onClick={() => dispatch({ name: 'setFlowStage', payload: 'transaction' })}>
            Update
          </Button>
        }
      />
    </>
  )
}
