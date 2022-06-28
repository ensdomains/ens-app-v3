import { useTranslation } from 'react-i18next'

export const useLoadedTranslation = (namespaces?: string | string[]) => {
  const { t: _t, ready, ...props } = useTranslation(namespaces)
  const t = (key: any, placeholder?: string, options?: any) =>
    ready ? _t(key, options) : '\u00a0'.repeat(placeholder?.length || 1)
  return { t, ...props }
}
