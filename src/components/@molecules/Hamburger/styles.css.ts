/* eslint-disable @typescript-eslint/naming-convention */
import { keyframes, styleVariants } from '@vanilla-extract/css'

export const backwardsSlide = keyframes({
  '0%': {
    transform: 'translateX(0)',
  },
  '100%': {
    transform: 'translateX(100%)',
  },
})

export const slideContainer = styleVariants({
  forwards: {
    animation: `${backwardsSlide} 0.2s ease-in-out reverse`,
  },
  backwards: {
    animation: `${backwardsSlide} 0.2s ease-in-out forwards`,
  },
})
