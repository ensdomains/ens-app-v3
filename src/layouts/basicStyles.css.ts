/* eslint-disable @typescript-eslint/naming-convention */

import { createVar, style } from '@vanilla-extract/css'

const paddingSizeVar = createVar()

export const container = style({
  padding: paddingSizeVar,
  vars: {
    [paddingSizeVar]: '1rem',
  },
  '@media': {
    'screen and (min-width: 768px)': {
      vars: {
        [paddingSizeVar]: '2rem',
      },
    },
  },
  '@supports': {
    // hack for iOS/iPadOS Safari
    // width should always be 100% - total padding
    '--webkit-touch-callout:none': {
      width: `calc(100% - ${paddingSizeVar} * 2)`,
      boxSizing: 'content-box',
    },
  },
})
