import { useMemo } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { ethers } from 'ethers'
import { useProvider } from 'wagmi'
import pMemoize from 'p-memoize'
import { useRouter } from 'next/router'

import { Dialog, RadioButton, Input, mq, Button } from '@ensdomains/thorin'

import { useTransaction } from '@app/utils/TransactionProvider'
import { Outlink } from '@app/components/Outlink'
import {
  RESOLVER_ADDRESSES,
  RESOLVER_INTERFACE_IDS,
} from '@app/utils/constants'
import { useProfile } from '@app/hooks/useProfile'

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
  const maybeResolver = new ethers.Contract(
    '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    supportsInterfaceAbi,
    provider,
  )
  const results = await Promise.all([
    maybeResolver.supportsInterface(RESOLVER_INTERFACE_IDS.addrInterfaceId),
    maybeResolver.supportsInterface(
      RESOLVER_INTERFACE_IDS.contentHashInterfaceId,
    ),
    maybeResolver.supportsInterface(RESOLVER_INTERFACE_IDS.txtInterfaceId),
  ])
  console.log('results: ', results)
  return 'this is my message'
}
const validateResolverMem = pMemoize(validateResolver)

const EditResolverFormContainer = styled.div(({ theme }) => [
  css`
    width: 100%;
  `,
  mq.sm.min(css`
    width: 520px;
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

const ButtonsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: ${theme.space[4]};
    margin-top: ${theme.space[4]};
  `,
)

interface Props {
  isOpen: boolean
  onDismiss: () => null
}

const EditResolverForm = () => {
  const router = useRouter()
  const { name } = router.query

  const { profile = { resolverAddress: '' } } = useProfile(name as string)
  const { resolverAddress } = profile
  const resolverAddressIndex = RESOLVER_ADDRESSES.indexOf(resolverAddress ?? '')

  const {
    register,
    handleSubmit,
    watch,
    formState: { errors, isDirty },
  } = useForm({ mode: 'onChange' })
  const onSubmit = (data) => console.log(data)
  const { t } = useTranslation('profile')
  const resolverChoice: 'latest' | 'custom' = watch('resolverChoice')
  const customResolver = watch('customResolver')
  const provider = useProvider()

  const isValid = useMemo(() => {
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
  }, [resolverChoice, customResolver, isDirty, errors, resolverAddressIndex])

  const customResolverWarnings = useMemo(() => {
    if (!customResolver) return []
    if (customResolver.length !== 42) return []
  }, [resolverChoice, customResolver])

  return (
    <EditResolverFormContainer>
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
          <Outlink
            href={`https://etherscan.io/address/${RESOLVER_ADDRESSES[0]}`}
          >
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
              validate: (value) => validateResolverMem(value, provider),
            })}
          />
        </InputContainer>

        {errors.customResolver && <span>This field is required</span>}

        <ButtonsContainer>
          <Button onClick={handleSubmit(onSubmit)} tone="grey">
            {t('action.cancel', { ns: 'common' })}
          </Button>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            disabled={!isValid}
          >
            {t('action.update', { ns: 'common' })}
          </Button>
        </ButtonsContainer>
      </form>
    </EditResolverFormContainer>
  )
}

const ResolverDetailsEditDialog = styled(Dialog)(({ theme }) => css``)

const ResolverDetailsEdit = ({ isOpen, onDismiss }: Props) => {
  const { setCurrentTransaction } = useTransaction()

  return (
    <ResolverDetailsEditDialog
      open={isOpen}
      title="Edit Resolver"
      subtitle="Edit the resolver details"
      onDismiss={onDismiss}
      variant="closable"
    >
      <EditResolverForm />
    </ResolverDetailsEditDialog>
  )
}

export { ResolverDetailsEdit }
