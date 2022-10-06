import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'
import { RESOLVER_ADDRESSES } from '@app/utils/constants'
import { useEffect } from 'react'
import { useForm } from 'react-hook-form'

type FormData = {
  resolverChoice: 'latest' | 'custom'
  customResolver: string
}

export type Props = {
  callback: (data: string) => void
  resolverAddress: string | undefined
}

const useResolverEditor = ({ callback, resolverAddress }: Props) => {
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

  const handleResolverSubmit = async (values: FormData) => {
    const { resolverChoice: choice, customResolver: address } = values
    let newResolver
    if (choice === 'latest') {
      newResolver = lastestResolverAddress
    }
    if (choice === 'custom') {
      newResolver = address
    }
    if (!newResolver) return
    callback(newResolver)
  }

  const hasWarnings =
    resolverChoice === 'custom' &&
    customResolver.length === 42 &&
    resolverWarnings &&
    resolverWarnings.length > 0

  const hasErrors = Object.keys(errors || {}).length > 0

  return {
    lastestResolverAddress,
    isResolverAddressLatest,
    register,
    errors,
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
  }
}

export default useResolverEditor
