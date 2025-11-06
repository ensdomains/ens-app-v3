import { useRouter } from 'next/router'

/**
 * Hook to access the referrer query parameter.
 * The referrer is automatically preserved across all internal navigation.
 *
 * Note: The referrer is never set by the app, only read from the URL.
 * It persists across navigation unless manually removed from the URL by the user.
 *
 * @returns The referrer value from URL query params, or undefined if not present
 *
 * @example
 * const referrer = useReferrer()
 * if (referrer === 'partner-site') {
 *   // Handle partner-specific logic
 * }
 */
export const useReferrer = (): string | undefined => {
  const router = useRouter()
  return router.query.referrer as string | undefined
}
