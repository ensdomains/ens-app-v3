import dynamic from 'next/dynamic'

export type DynamicNetworkIconName = keyof typeof dynamicNetworkIcons

export const dynamicNetworkIcons = {
  default: dynamic(() => import('./ens.svg')),
  eth: dynamic(() => import('./ethereum.svg')),
  arb1: dynamic(() => import('./arbitrum.svg')),
  base: dynamic(() => import('./base.svg')),
  linea: dynamic(() => import('./linea.svg')),
  op: dynamic(() => import('./optimism.svg')),
  scr: dynamic(() => import('./scroll.svg')),
}
