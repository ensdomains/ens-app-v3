import { Header } from '@app/components/Header'
import { TabBar } from '@app/components/TabBar'
import { useInitial } from '@app/hooks/useInitial'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

export const Navigation = () => {
  const isInitial = useInitial()
  const breakpoints = useBreakpoint()
  if (!isInitial) {
    if (breakpoints.sm) {
      return <Header key="header-nav" />
    }
    return <TabBar key="tab-bar-nav" />
  }

  return (
    <>
      <Header key="header-nav" />
      <TabBar key="tab-bar-nav" />
    </>
  )
}
