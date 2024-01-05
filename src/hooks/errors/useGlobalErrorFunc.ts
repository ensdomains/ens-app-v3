import { QueryKey, hashQueryKey } from '@tanstack/react-query'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'

import { ENSJSError } from '@ensdomains/ensjs/utils/errors'

import { useGlobalErrorDispatch } from '@app/utils/GlobalErrorProvider/GlobalErrorProvider'

type BaseFunc = (...args: any[]) => Promise<any>

export const useGlobalErrorFunc = <Func extends BaseFunc>({
  queryKey,
  func,
  ms = 5000,
  skip = false,
}: {
  queryKey: QueryKey
  func: Func
  ms?: number
  skip?: boolean
}) => {
  const { t } = useTranslation('common')
  const globalStateDispatch = useGlobalErrorDispatch()
  const hash = hashQueryKey(queryKey)

  const timeoutRef = useRef<number | null>(null)

  useEffect(() => {
    if (!skip) {
      globalStateDispatch({
        type: 'REGISTER_KEY',
        payload: {
          key: queryKey,
        },
      })
    }

    return () => {
      globalStateDispatch({
        type: 'UNREGISTER_KEY',
        payload: {
          key: queryKey,
        },
      })
    }
    // Do not include queryKey in deps, otherwise it will could cause infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hash, globalStateDispatch, skip])

  const watchedFunc = useCallback(
    async (...args: Parameters<Func>): Promise<ReturnType<Func> | undefined> => {
      try {
        if (skip || typeof window === 'undefined') return await func(...args)

        // useQuery may call a function twice at the same time in certain cases, such as when cache is
        // removed/invalidate or keys change. We only follow the latest call and cancel the previous one.
        if (timeoutRef.current !== null) clearTimeout(timeoutRef.current)
        timeoutRef.current = window.setTimeout(() => {
          globalStateDispatch({
            type: 'SET_ERROR',
            payload: {
              key: queryKey,
              title: t('errors.networkLatency.title'),
              message: t('errors.networkLatency.message'),
              type: 'ENSJSNetworkLatencyError',
              priority: 1,
            },
          })
          timeoutRef.current = null
        }, ms)

        // Execute the function
        const result: Awaited<ReturnType<Func>> = await func(...args)

        // If timeout does not exist, then network latency has error has been thrown.
        if (!timeoutRef.current) return result

        clearTimeout(timeoutRef.current)
        timeoutRef.current = null

        globalStateDispatch({
          type: 'CLEAR_ERROR',
          payload: {
            key: queryKey,
          },
        })
        return result
      } catch (e) {
        console.error(e)
        clearTimeout(timeoutRef.current)
        timeoutRef.current = null

        const error = e as ENSJSError<Awaited<ReturnType<Func>>>
        if (error instanceof ENSJSError && error.name === 'ENSJSSubgraphError') {
          globalStateDispatch({
            type: 'SET_SUBGRAPH_ERROR',
            payload: {
              key: queryKey,
            },
          })
          return error.data
        }

        globalStateDispatch({
          type: 'SET_NETWORK_ERROR',
          payload: {
            key: queryKey,
          },
        })
        return undefined
      }
    },
    // Do not include queryKey in deps, otherwise it will could cause infinite loop
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [func, hash, globalStateDispatch, ms, t, skip],
  )

  return watchedFunc
}
