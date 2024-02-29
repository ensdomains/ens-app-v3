/* eslint-disable default-case */

/* eslint-disable no-param-reassign */
import { useQueryClient } from '@tanstack/react-query'
import { ReactNode, useEffect, useRef, useState } from 'react'
import styled, { css } from 'styled-components'

import { Spinner } from '@ensdomains/thorin'

import DynamicLoadingContext from './DynamicLoadingContext'

const SpinnerOverlay = styled.div(
  () => css`
    z-index: 1;
    position: absolute;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
)

const getModalCard = () => document.querySelector('.modal')

const InputComponentWrapper = ({ children }: { children: ReactNode }) => {
  const queryClient = useQueryClient()

  const [isCached, _setIsCached] = useState(false)
  const [componentLoading, setComponentLoading] = useState(false)
  const [showSpinner, setShowSpinner] = useState(false)

  const cachedRef = useRef(false)

  const setIsCached = (cached: boolean) => {
    _setIsCached(cached)
    cachedRef.current = cached
  }

  useEffect(() => {
    const cache = queryClient.getQueryCache()
    const externalQueries = cache
      .getAll()
      .filter((q) => q.state.fetchStatus === 'fetching' && !q.getObserversCount())

    if (externalQueries.length > 0) {
      for (const eq of externalQueries) {
        eq.setState({ ...eq.state, fetchStatus: 'idle' })
      }
    }
  }, [queryClient])

  // hook for detecting when all queries have been refetched on mount generically
  // also handles stale queries
  useEffect(() => {
    let staleCheckInterval: NodeJS.Timeout | undefined
    // this can be either the first cache subscription OR the stale check interval subscription
    let unsubscribe: (() => void) | undefined

    // if the component is loading, don't do anything
    if (!componentLoading) {
      const cache = queryClient.getQueryCache()

      const makeStaleCheckInterval = () => {
        clearInterval(staleCheckInterval)
        // poll for stale queries
        staleCheckInterval = setInterval(() => {
          // queries must be:
          // refetch queries (under the input component)
          // enabled
          // active
          // stale
          // and have been updated more than staleTime ago (isStale() doesn't always work for some reason)
          const staleQueries = cache.getAll().filter((q) => {
            const { enabled } = q.options as any
            return (
              q.meta?.isRefetchQuery &&
              (typeof enabled === 'undefined' || enabled) &&
              q.isActive() &&
              q.isStale() &&
              Date.now() >
                q.state.dataUpdatedAt + queryClient.getDefaultOptions().queries!.staleTime!
            )
          })
          // if there are stale queries, stop polling, set isCached to true, and subscribe to the cache
          if (staleQueries.length > 0) {
            clearInterval(staleCheckInterval)
            setIsCached(true)
            unsubscribe = cache.subscribe((query) => {
              // only care about updated queries
              if (query.type === 'updated') {
                const staleQueryIndex = staleQueries.findIndex(
                  (q) => q?.queryHash === query.query.queryHash,
                )
                const queryState = query.query.state
                if (
                  staleQueryIndex !== -1 &&
                  queryState.fetchStatus === 'idle' &&
                  // assume that errored queries are handled by the component
                  (queryState.status === 'success' || queryState.status === 'error')
                ) {
                  // if stale query exists in staleQueries and is updated, delete it from staleQueries
                  delete staleQueries[staleQueryIndex]
                  // if all stale queries have been updated, set isCached to false, unsubscribe from cache, and start polling again
                  if (staleQueries.every((q) => q === undefined)) {
                    setIsCached(false)
                    unsubscribe!()
                    makeStaleCheckInterval()
                  }
                }
              }
            })
          }
        }, 5000) // poll every 5 seconds
      }

      const getFetchingQueries = () =>
        cache.getAll().filter((q) => q.state.fetchStatus === 'fetching' && q.meta?.isRefetchQuery)
      const fetchedKeys: string[] = []

      // if there are any queries to fetch, run the cache subscription
      if (getFetchingQueries().length !== 0) {
        setIsCached(true)
        unsubscribe = cache.subscribe((query) => {
          // only care about updated queries
          if (query.type === 'updated') {
            const queryState = query.query.state
            if (
              queryState.fetchStatus === 'idle' &&
              // assume that errored queries are handled by the component
              (queryState.status === 'success' || queryState.status === 'error')
            ) {
              // if query is updated, add it to fetchedKeys
              fetchedKeys.push(query.query.queryHash)
              // if all queries are updated, set isCached to false, unsubscribe from cache, and start polling for stale queries
              const stillToFetch = getFetchingQueries()
              if (stillToFetch.length === 0) {
                setIsCached(false)
                unsubscribe!()
                makeStaleCheckInterval()
              }
            }
          }
        })
      } else {
        // if there are no queries, assume there is no initial data needed and start polling for stale queries
        setIsCached(false)
        makeStaleCheckInterval()
      }
    }

    return () => {
      clearInterval(staleCheckInterval)
      unsubscribe?.()
    }
  }, [componentLoading, queryClient])

  // hook for detecting when the modal card is mounted
  // and adding the cacheable-component class to it
  // this is needed because of the way the modal is rendered
  useEffect(() => {
    const observer = new MutationObserver(() => {
      const element = getModalCard()
      if (element) {
        element.classList.add('cacheable-component')
        if (cachedRef.current) {
          element.classList.add('cacheable-component-cached')
        }
        observer.disconnect()
      }
    })
    observer.observe(document.body, {
      childList: true,
      subtree: true,
    })
    return () => {
      observer.disconnect()
      const modalCard = getModalCard()
      modalCard?.classList.remove('cacheable-component')
    }
  }, [])

  useEffect(() => {
    const modalCard = getModalCard()
    if (isCached) {
      modalCard?.classList.add('cacheable-component-cached')
    } else {
      modalCard?.classList.remove('cacheable-component-cached')
    }
    return () => {
      modalCard?.classList.remove('cacheable-component-cached')
    }
  }, [isCached])

  // hook for showing the spinner after 3 seconds
  // uses isMounted to prevent the spinner from showing up on top of the TransactionLoader spinner
  useEffect(() => {
    let timeout: NodeJS.Timeout | undefined
    if (isCached && !componentLoading) {
      timeout = setTimeout(() => {
        setShowSpinner(true)
      }, 3000)
    } else {
      clearTimeout(timeout)
      setShowSpinner(false)
    }
    return () => {
      clearTimeout(timeout)
    }
  }, [componentLoading, isCached])

  return (
    <DynamicLoadingContext.Provider value={setComponentLoading}>
      {showSpinner && (
        <SpinnerOverlay data-testid="spinner-overlay" className="transaction-loader">
          <Spinner size="large" color="accent" />
        </SpinnerOverlay>
      )}
      {children}
    </DynamicLoadingContext.Provider>
  )
}

export default InputComponentWrapper
