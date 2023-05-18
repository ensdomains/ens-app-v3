import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ContentWarning } from '@app/layouts/Content'
import { useGlobalErrorState } from '@app/utils/GlobalErrorProvider/GlobalErrorProvider'

export const useContentWarning = (
  otherErrors: ContentWarning[] = [],
): ContentWarning | undefined => {
  const { t } = useTranslation('common')
  const globalState = useGlobalErrorState()

  const warning = useMemo(() => {
    const otherError = otherErrors[otherErrors.length - 1]
    if (otherError) return otherError

    const { errors, activeHashes } = globalState
    const activeErrors = activeHashes
      .map((key) => errors[key])
      .filter((error) => error)
      .sort(({ priority: left = 0 }, { priority: right = 0 }) => right - left)

    if (activeErrors[0]?.type === 'ENSJSSubgraphError') {
      const datetime = globalState?.meta?.timestamp
        ? new Date(globalState.meta.timestamp * 1000).toLocaleDateString(undefined, {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: 'numeric',
            minute: 'numeric',
            second: 'numeric',
          })
        : undefined
      return {
        type: 'warning',
        title: t('errors.indexingErrors.title'),
        message: t('errors.indexingErrors.message', {
          datetime,
          context: datetime ? 'datetime' : undefined,
        }),
      } as ContentWarning
    }

    if (activeErrors[0]?.type === 'ENSJSUnknownError') {
      return {
        type: 'warning',
        title: t('errors.networkError.title'),
        message: t('errors.networkError.message'),
      } as ContentWarning
    }

    if (activeErrors[0]?.message) {
      return {
        type: 'warning',
        title: activeErrors[0].title,
        message: activeErrors[0].message,
      } as ContentWarning
    }

    return undefined
  }, [globalState, otherErrors, t])

  return warning
}
