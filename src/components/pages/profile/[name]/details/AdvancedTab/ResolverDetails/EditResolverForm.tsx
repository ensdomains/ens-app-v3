import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { ethers } from 'ethers'
import { useProvider } from 'wagmi'
import { useRouter } from 'next/router'
import { useQuery } from 'react-query'

import { RadioButton, Input, mq } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'
import { RESOLVER_ADDRESSES, RESOLVER_INTERFACE_IDS } from '@app/utils/constants'
import { useProfile } from '@app/hooks/useProfile'
import { ErrorContainer } from '@app/components/@molecules/ErrorContainer'
import { Spacer } from '@app/components/@atoms/Spacer'

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
  } catch (error) {
    if (error.method === 'supportsInterface(bytes4)') {
      return ['Cannot determine if address supports common resolver methods']
    }
    return []
  }
}

const customResolverErrorMessage = (errors) => {
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
  ({ theme }) => css`
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

const EditResolverForm = ({ onSubmit, actions }: { onSubmit: () => null }) => {
  const router = useRouter()
  const { name } = router.query

  const { profile = { resolverAddress: '' } } = useProfile(name as string)
  const { resolverAddress } = profile
  const resolverAddressIndex = RESOLVER_ADDRESSES.indexOf(resolverAddress ?? '')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' })

  const { t } = useTranslation('profile')
  const resolverChoice: 'latest' | 'custom' = watch('resolverChoice')
  const customResolver = watch('customResolver')
  const provider = useProvider()

  const { data } = useQuery(
    ['validateResolverInterfaces', customResolver],
    () => validateResolver(customResolver, provider),
    {
      enabled: ethers.utils.isAddress(customResolver),
    },
  )

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
    actions.setCanAdvance(hasValidity)
    if (hasValidity) {
      let newResolver
      if (resolverChoice === 'latest') {
        newResolver = RESOLVER_ADDRESSES[0]
      }
      if (resolverChoice === 'custom') {
        newResolver = customResolver
      }

      actions.setUpdateResolverTransactionInfo({
        currentResolver: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266',
        newResolver,
        name,
      })
    }
  }, [resolverChoice, customResolver, errors, resolverAddressIndex, actions])

  return (
    <EditResolverFormContainer>
      {resolverChoice === 'custom' && data?.length ? (
        <>
          <ErrorContainer
            message={
              <ul>
                {data?.map((message) => (
                  <li key={message}>- {message}</li>
                ))}
              </ul>
            }
            type="warning"
          />
          <Spacer $height={4} />
        </>
      ) : null}
      <form onSubmit={handleSubmit(onSubmit)}>
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
        <Spacer $height={4} />
      </form>
    </EditResolverFormContainer>
  )
}

export { EditResolverForm }
