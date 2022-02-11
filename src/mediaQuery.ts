import { css } from "styled-components";

type Breakpoint = "small" | "medium" | "large" | "xLarge";
type BreakpointType = "min" | "max";

const breakpointTypes: Record<BreakpointType, string> = {
  min: "min-width",
  max: "max-width",
};

const breakpoints: Record<Breakpoint, string> = {
  small: "480px",
  medium: "768px",
  large: "992px",
  xLarge: "1200px",
};

type CSSParams = Parameters<typeof css>;
const keys = Object.keys(breakpoints) as Array<Breakpoint>;
const typeKeys = Object.keys(breakpointTypes) as Array<BreakpointType>;

const mq = keys.reduce((acc, sizeLabel) => {
  acc[sizeLabel] = typeKeys.reduce((accumulator, typeLabel) => {
    accumulator[typeLabel] = (...args: CSSParams) => {
      return css`
        @media (${breakpointTypes[typeLabel]}: ${breakpoints[sizeLabel]}) {
          ${css(...args)};
        }
      `;
    };
    return accumulator;
  }, {} as Record<BreakpointType, Function>);
  return acc;
}, {} as Record<Breakpoint, Record<BreakpointType, Function>>);

export default mq;
