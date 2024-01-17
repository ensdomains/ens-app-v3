import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'

import type { ContentWarning } from '@app/layouts/Content'
import { useGlobalErrorState } from '@app/utils/GlobalErrorProvider/GlobalErrorProvider'

export const useContentWarning = (
  otherErrors: ContentWarning[] = [],
): ContentWarning | undefined => {
  const { t } = useTranslation('common')
  const globalState = useGlobalErrorState()

  const [ensjsDebug] = useState(() =>
    typeof localStorage === 'undefined' ? '' : localStorage.getItem('ensjs-debug') || '',
  )

  const warning = useMemo(() => {
    const otherError = otherErrors[otherErrors.length - 1]
    if (otherError) return otherError

    const { errors, activeHashes } = globalState
    const activeErrors = (
      activeHashes.length === 0 ? Object.values(errors) : activeHashes.map((key) => errors[key])
    ).sort(({ priority: left = 0 }, { priority: right = 0 }) => right - left)

    const networkErrors = ['ENSJSUnknownError', 'ENSJSSubgraphError']

    if (networkErrors.includes(ensjsDebug)) {
      return {
        type: 'warning',
        title: t('errors.networkError.title'),
        message: t('errors.networkError.message'),
      } as ContentWarning
    }

    if (ensjsDebug === 'ENSJSSubgraphLatency') {
      return {
        type: 'warning',
        title: t('errors.networkLatency.title'),
        message: t('errors.networkLatency.message'),
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
  }, [globalState, otherErrors, t, ensjsDebug])

  return warning
}
