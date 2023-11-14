import { createVar, styleVariants } from '@vanilla-extract/css'

import { cssVars } from '@ensdomains/thorin'

export const tabBarWidth = createVar()

export const tabContainer = styleVariants({
  normal: {
    vars: {
      [tabBarWidth]: cssVars.space['56'],
    },
  },
  shrink: {
    vars: {
      [tabBarWidth]: `calc(${cssVars.space['40']} + ${cssVars.space['2']})`,
    },
  },
})
