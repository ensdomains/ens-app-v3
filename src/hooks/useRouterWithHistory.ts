import { useRouter } from 'next/router'

export const useRouterWithHistory = () => {
  const router = useRouter()

  const push = (path: string, query?: Record<string, any>) =>
    router.push({
      pathname: path,
      query: {
        ...query,
        from: router.asPath,
      },
    })

  return { ...router, push }
}
