import dynamic from 'next/dynamic'

const DYNAMIC_ICONS = {
  PlusCircle: dynamic(() => import('@ensdomains/thorin').then((mod) => mod.PlusCircleSVG)),
  FastForward: dynamic(() => import('@ensdomains/thorin').then((mod) => mod.FastForwardSVG)),
  Flame: dynamic(() => import('@ensdomains/thorin').then((mod) => mod.FlameSVG)),
  Moon: dynamic(() => import('@ensdomains/thorin').then((mod) => mod.MoonSVG)),
  Heart: dynamic(() => import('@ensdomains/thorin').then((mod) => mod.HeartSVG)),
  Eth: dynamic(() => import('@ensdomains/thorin').then((mod) => mod.EthSVG)),
  Nametag: dynamic(() => import('@ensdomains/thorin').then((mod) => mod.NametagSVG)),
  GasPump: dynamic(() => import('@ensdomains/thorin').then((mod) => mod.GasPumpSVG)),
  Person: dynamic(() => import('@ensdomains/thorin').then((mod) => mod.PersonSVG)),
}

type Icon = keyof typeof DYNAMIC_ICONS

type Props = {
  icon: Icon
}

export const DynamicThorinIcon = ({ icon }: Props) => {
  const Icon = DYNAMIC_ICONS[icon]
  if (!Icon) return null
  return <Icon />
}
