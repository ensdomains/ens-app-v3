import { style } from '@vanilla-extract/css'

import { cssVars } from '@ensdomains/thorin'

export const snippet = style({
  backgroundRepeat: 'no-repeat',
  backgroundAttachment: 'scroll',
  backgroundSize: `100% ${cssVars.space['28']}`,
  backgroundPositionY: '-1px',
})
