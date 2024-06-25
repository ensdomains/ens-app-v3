import { useMemo } from 'react'
import { useTranslation } from 'react-i18next'

import type { ContentWarning } from '@app/layouts/Content'
import { useGraphErrorType } from '@app/utils/SyncProvider/SyncProvider'

export const useContentWarning = (
  otherErrors: ContentWarning[] = [],
): ContentWarning | undefined => {
  const { t } = useTranslation('common')

  const graphErrorType = useGraphErrorType()

  const warning = useMemo(() => {
    const otherError = otherErrors.at(-1)
    if (otherError) return otherError

    if (graphErrorType === 'SubgraphError') {
      return {
        type: 'warning',
        title: t('errors.networkError.title'),
        message: t('errors.networkError.message'),
      } as ContentWarning
    }

    if (graphErrorType === 'SubgraphLatency') {
      return {
        type: 'warning',
        title: t('errors.networkLatency.title'),
        message: t('errors.networkLatency.message'),
      } as ContentWarning
    }

    return undefined
  }, [otherErrors, graphErrorType, t])

  return warning
}
