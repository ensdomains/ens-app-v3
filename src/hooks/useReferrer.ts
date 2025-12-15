import { useRouter } from 'next/router'

export const useReferrer = (): string | undefined => {
  const router = useRouter()
  return router.query.referrer as string | undefined
}
