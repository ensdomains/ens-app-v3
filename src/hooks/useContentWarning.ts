import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ContentWarning } from '@app/layouts/Content'
import { useHasSubgraphSyncErrors } from '@app/utils/useHasSubgraphSyncErrors'

import { useReadLocalStorage } from './useLocalStorage'

export const useContentWarning = (
  otherErrors: ContentWarning[] = [],
): ContentWarning | undefined => {
  const { t } = useTranslation('common')

  const { slow, error } = useHasSubgraphSyncErrors()

  const subgraphDebug = useReadLocalStorage<string>('subgraph-debug')

  const warning = useMemo(() => {
    const otherError = otherErrors.at(-1)
    if (otherError) return otherError

    const networkErrors = ['ENSJSUnknownError', 'ENSJSSubgraphError']

    if (networkErrors.includes(subgraphDebug!) || error > 0) {
      return {
        type: 'warning',
        title: t('errors.networkError.title'),
        message: t('errors.networkError.message'),
      } as ContentWarning
    }

    if (subgraphDebug === 'ENSJSSubgraphLatency' || slow > 0) {
      return {
        type: 'warning',
        title: t('errors.networkLatency.title'),
        message: t('errors.networkLatency.message'),
      } as ContentWarning
    }

    return undefined
  }, [otherErrors, subgraphDebug, error, slow, t])

  return warning
}
