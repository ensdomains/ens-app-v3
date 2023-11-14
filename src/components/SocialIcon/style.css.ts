import { style } from '@vanilla-extract/css'

export const iconWrapper = style({})

export const coloredIcon = style({
  opacity: 0,
  transition: 'opacity 0.15s ease-in-out',
  selectors: {
    [`${iconWrapper}:hover &`]: {
      opacity: 1,
    },
  },
})
