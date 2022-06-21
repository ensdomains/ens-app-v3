import { Header } from '@app/components/Header'
import { TabBar } from '@app/components/TabBar'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useRouter } from 'next/router'

export const Navigation = () => {
  const { isReady } = useRouter()
  const breakpoints = useBreakpoint()

  if (isReady && !breakpoints.md) {
    return <TabBar />
  }

  return <Header />
}
