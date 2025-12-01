import { useRouter } from 'next/router'

export const useReferrer = (): string | undefined => {
  const router = useRouter()
  const referrer = router.query.referrer as string | undefined
  console.log('[useReferrer] Full router.query:', JSON.stringify(router.query, null, 2))
  console.log('[useReferrer] referrer value:', referrer)
  return referrer
}
