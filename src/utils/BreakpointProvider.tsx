import React, { createContext, useContext, useEffect, useState } from 'react'

const defaultValue = {}

const BreakpointContext = createContext<Partial<Query>>(defaultValue)

type QueryType = 'sm' | 'md' | 'lg' | 'xl'
type Query = Record<QueryType, string>

const BreakpointProvider = ({
  children,
  queries,
}: {
  children: React.ReactNode
  queries: Query
}) => {
  const [queryMatch, setQueryMatch] = useState({})

  useEffect(() => {
    const mediaQueryLists: Partial<Record<QueryType, MediaQueryList>> = {}
    const keys: QueryType[] = Object.keys(queries) as QueryType[]
    let isAttached = false

    const handleQueryListener = () => {
      const updatedMatches = keys.reduce((acc, media) => {
        acc[media] = !!(
          mediaQueryLists[media] && mediaQueryLists[media]?.matches
        )
        return acc
      }, {} as Record<QueryType, boolean>)
      setQueryMatch(updatedMatches)
    }

    if (window && window.matchMedia) {
      const matches: Record<string, any> = {}
      keys.forEach((media) => {
        if (typeof queries[media] === 'string') {
          mediaQueryLists[media] = window.matchMedia(
            queries[media as QueryType],
          )
          matches[media] = mediaQueryLists[media]?.matches
        } else {
          matches[media] = false
        }
      })
      setQueryMatch(matches)
      isAttached = true
      keys.forEach((media) => {
        if (typeof queries[media] === 'string') {
          mediaQueryLists[media]?.addListener(handleQueryListener)
        }
      })
    }

    return () => {
      if (isAttached) {
        keys.forEach((media) => {
          if (typeof queries[media] === 'string') {
            mediaQueryLists[media]?.removeListener(handleQueryListener)
          }
        })
      }
    }
  }, [queries])

  return (
    <BreakpointContext.Provider value={queryMatch}>
      {children}
    </BreakpointContext.Provider>
  )
}

function useBreakpoint() {
  const context = useContext(BreakpointContext)
  if (context === defaultValue) {
    throw new Error('useBreakpoint must be used within BreakpointProvider')
  }
  return context
}
export { useBreakpoint, BreakpointProvider }
