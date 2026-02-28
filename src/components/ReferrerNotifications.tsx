import { useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Toast } from '@ensdomains/thorin'

import { useReferrer } from '@app/hooks/useReferrer'
import { useResolvedReferrer } from '@app/hooks/useResolvedReferrer'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

export const ReferrerNotifications = () => {
  const { t } = useTranslation()
  const breakpoints = useBreakpoint()
  const referrer = useReferrer()
  const { isError, error } = useResolvedReferrer({ referrer })

  const [open, setOpen] = useState<boolean>(false)
  const hasShownErrorRef = useRef<string | null>(null)

  useEffect(() => {
    if (isError && error && referrer && hasShownErrorRef.current !== referrer) {
      hasShownErrorRef.current = referrer
      setOpen(true)
    } else if (!referrer) {
      hasShownErrorRef.current = null
    }
  }, [isError, error, referrer])

  if (!error) return null

  return (
    <Toast
      open={open}
      onClose={() => setOpen(false)}
      variant={breakpoints.sm ? 'desktop' : 'touch'}
      title={t('errors.referrer.title')}
      description={error.message}
    />
  )
}
