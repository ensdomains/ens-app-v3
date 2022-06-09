import { Header } from '@app/components/Header'
import { TabBar } from '@app/components/TabBar'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

export const Navigation = () => {
  const breakpoints = useBreakpoint()

  if (breakpoints.sm) {
    return <Header />
  }

  return <TabBar />
}
