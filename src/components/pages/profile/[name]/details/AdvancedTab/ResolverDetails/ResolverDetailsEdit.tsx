import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { ethers } from 'ethers'
import { useProvider } from 'wagmi'
import pMemoize from 'p-memoize'

import { Dialog, RadioButton, Input, mq } from '@ensdomains/thorin'

import { useTransaction } from '@app/utils/TransactionProvider'
import { Outlink } from '@app/components/Outlink'
import {
  RESOLVER_ADDRESSES,
  RESOLVER_INTERFACE_IDS,
} from '@app/utils/constants'

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
  console.log('validateResolver')
  const maybeResolver = new ethers.Contract(
    '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
    supportsInterfaceAbi,
    provider,
  )
  const supportsInterface = await maybeResolver.supportsInterface(
    RESOLVER_INTERFACE_IDS.addrInterfaceId,
  )
}
const validateResolverMem = pMemoize(validateResolver)

const EditResolverFormContainer = styled.div(({ theme }) => [
  css`
    width: 100%;
  `,
  mq.sm.min(css`
    width: 500px;
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

interface Props {
  isOpen: boolean
  onDismiss: () => null
}

const EditResolverForm = () => {
  const {
    register,
    handleSubmit,
    watch,
    formState: { errors },
  } = useForm({ mode: 'onChange' })
  const onSubmit = (data) => console.log(data)
  const { t } = useTranslation('profile')
  const resolverChoice: 'latest' | 'custom' = watch('resolverChoice')
  const inputValue: any = watch('customResolver')
  const provider = useProvider()

  // useEffect(() => {
  //   validateResolver(provider, '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41')
  // }, [resolverChoice])
  console.log('inputValue: ', inputValue)

  return (
    <EditResolverFormContainer>
      <form onSubmit={handleSubmit(onSubmit)}>
        <LatestResolverContainer>
          <RadioButton
            label="Use latest resolver"
            value="latest"
            labelRight
            width={44}
            {...register('resolverChoice')}
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

        {/* include validation with required or other standard HTML validation rules */}
        <input {...register('exampleRequired', { required: true })} />
        {/* errors will return when field validation fails  */}
        {errors.customResolver && <span>This field is required</span>}

        <input type="submit" />
      </form>
    </EditResolverFormContainer>
  )
}

const submitTransaction = (setCurrentTransaction) => {}

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
      <button>submit transaction</button>
    </ResolverDetailsEditDialog>
  )
}

export { ResolverDetailsEdit }
