import { css } from 'styled-components'

type Breakpoint = 'xs' | 'sm' | 'md' | 'lg' | 'xl'
type BreakpointType = 'min' | 'max'

const breakpointTypes: Record<BreakpointType, string> = {
  min: 'min-width',
  max: 'max-width',
}

const breakpoints: Record<Breakpoint, number> = {
  xs: 360,
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280,
}

type MediaQuery = (args: ReturnType<typeof css>) => ReturnType<typeof css>

const keys = Object.keys(breakpoints) as Array<Breakpoint>
const typeKeys = Object.keys(breakpointTypes) as Array<BreakpointType>

const mq = keys.reduce((acc, sizeLabel) => {
  acc[sizeLabel] = typeKeys.reduce((accumulator, typeLabel) => {
    accumulator[typeLabel] = ((args: ReturnType<typeof css>) => {
      const size =
        typeLabel === 'max' ? `${breakpoints[sizeLabel] - 1}px` : `${breakpoints[sizeLabel]}px`
      return css`
        @media (${breakpointTypes[typeLabel]}: ${size}) {
          ${args};
        }
      `
    }) as MediaQuery
    return accumulator
  }, {} as Record<BreakpointType, MediaQuery>)
  return acc
}, {} as Record<Breakpoint, Record<BreakpointType, MediaQuery>>)

export default mq
