import { globalStyle, style } from '@vanilla-extract/css'

export const labelContainer = style({})

export const labelInput = style({
  opacity: 0,
  MozAppearance: 'textfield',
  selectors: {
    [`${labelContainer}:focus-within &`]: {
      opacity: '1',
    },
  },
})

export const labelLabel = style({
  opacity: 1,
  selectors: {
    [`${labelContainer}:focus-within &`]: {
      opacity: '0',
    },
  },
})

globalStyle(`${labelInput}::-webkit-outer-spin-button, ${labelInput}::-webkit-inner-spin-button`, {
  WebkitAppearance: 'none',
  margin: 0,
})
