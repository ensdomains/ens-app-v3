import { style } from '@vanilla-extract/css'

import { cssVars } from '@ensdomains/thorin'

export const gradientText = style({
  backgroundImage: cssVars.color.blueGradient,
  backgroundClip: 'text',
  backgroundSize: '110%',
  backgroundRepeat: 'no-repeat',
  WebkitBackgroundClip: 'text',
  color: 'transparent',
  margin: 0,
})
