import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

import { useChainId } from '@app/hooks/useChainId'
import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'
import { NAMESYS_RESOLVERS, RESOLVER_ADDRESSES } from '@app/utils/constants'

type FormData = {
  resolverChoice: 'latest' | 'custom' | 'namesys'
  address: string
}

export type Props = {
  callback: (data: string) => void
  resolverAddress: string | undefined
}

const useResolverEditor = ({ callback, resolverAddress }: Props) => {
  const chainId = useChainId()
  const lastestResolverAddress = RESOLVER_ADDRESSES[`${chainId}`]?.[0]
  const isResolverAddressLatest = resolverAddress === lastestResolverAddress
  const namesysResolverAddress = NAMESYS_RESOLVERS[`${chainId}`]?.[0]
  const isResolverAddressNameSys = resolverAddress === namesysResolverAddress

  const { register, formState, handleSubmit, reset, trigger, watch, getFieldState, setValue } =
    useForm<FormData>({
      mode: 'onChange',
      defaultValues: { resolverChoice: 'latest', address: '' },
    })

  useEffect(() => {
    if (isResolverAddressLatest) reset({ resolverChoice: 'custom', address: '' })
  }, [isResolverAddressLatest, reset])

  const resolverChoice: 'latest' | 'custom' | 'namesys' = watch('resolverChoice')
  const customResolver = resolverChoice === 'namesys' ? namesysResolverAddress : watch('address')

  const { errors: resolverWarnings } = useResolverHasInterfaces(
    ['IAddrResolver', 'ITextResolver', 'IContentHashResolver'],
    customResolver,
    resolverChoice === 'latest',
    {
      fallbackMsg:
        resolverChoice === 'namesys'
          ? 'Records for this resolver can only be updated on NameSys client'
          : 'Cannot determine if address supports resolver methods',
    },
  )

  const handleResolverSubmit = async (values: FormData) => {
    const { resolverChoice: choice, address } = values
    let newResolver
    if (choice === 'latest') {
      newResolver = lastestResolverAddress
    }
    if (choice === 'custom') {
      newResolver = address
    }
    if (choice === 'namesys') {
      newResolver = namesysResolverAddress
    }
    if (!newResolver) return
    callback(newResolver)
  }

  const hasWarnings =
    ['custom', 'namesys'].includes(resolverChoice) &&
    customResolver?.length === 42 &&
    resolverWarnings &&
    resolverWarnings.length > 0

  const hasErrors = Object.keys(formState.errors || {}).length > 0 && resolverChoice === 'custom'

  return {
    lastestResolverAddress,
    isResolverAddressLatest,
    isResolverAddressNameSys,
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
