import { useCallback } from 'react'
import { useTranslation } from 'react-i18next'

export const useLoadedTranslation = (namespaces?: string | string[]) => {
  const { t: _t, ready, ...props } = useTranslation(namespaces)
  const isReady = typeof window !== 'undefined' && ready

  const t = useCallback(
    (key: any, options?: any) => {
      if (isReady) return _t(key, options)
      return '\u00a0'.repeat(options?.placeholder?.length || 1)
    },
    [isReady, _t],
  )
  return { t, ...props }
}
