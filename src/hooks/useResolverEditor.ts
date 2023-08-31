import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { Address } from 'viem'

import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'

import { useContractAddress } from './chain/useContractAddress'

type FormData = {
  resolverChoice: 'latest' | 'custom'
  address: string
}

export type Props = {
  callback: (data: Address) => void
  resolverAddress: string | undefined
}

const useResolverEditor = ({ callback, resolverAddress }: Props) => {
  const lastestResolverAddress = useContractAddress({ contract: 'ensPublicResolver' })
  const isResolverAddressLatest = resolverAddress === lastestResolverAddress

  const { register, formState, handleSubmit, reset, trigger, watch, getFieldState, setValue } =
    useForm<FormData>({
      mode: 'onChange',
      defaultValues: { resolverChoice: 'latest', address: '' },
    })

  useEffect(() => {
    if (isResolverAddressLatest) reset({ resolverChoice: 'custom', address: '' })
  }, [isResolverAddressLatest, reset])

  const resolverChoice: 'latest' | 'custom' = watch('resolverChoice')
  const customResolver = watch('address')

  const { errors: resolverWarnings } = useResolverHasInterfaces({
    interfaceNames: ['AddressResolver', 'TextResolver', 'ContentHashResolver'],
    resolverAddress: customResolver as Address,
    enabled: resolverChoice === 'custom',
  })

  const handleResolverSubmit = async (values: FormData) => {
    const { resolverChoice: choice, address } = values
    let newResolver
    if (choice === 'latest') {
      newResolver = lastestResolverAddress
    }
    if (choice === 'custom') {
      newResolver = address
    }
    if (!newResolver) return
    callback(newResolver as Address)
  }

  const hasWarnings =
    resolverChoice === 'custom' &&
    customResolver?.length === 42 &&
    resolverWarnings &&
    resolverWarnings.length > 0

  const hasErrors = Object.keys(formState.errors || {}).length > 0 && resolverChoice === 'custom'

  return {
    lastestResolverAddress,
    isResolverAddressLatest,
    register,
    handleSubmit: handleSubmit(handleResolverSubmit),
    reset,
    trigger,
    watch,
    getFieldState,
    resolverChoice,
    customResolver,
    resolverWarnings,
    hasWarnings,
    hasErrors,
    setValue,
    formState,
  }
}

export default useResolverEditor
