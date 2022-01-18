import { useEffect, useState } from "react";
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

export const useMedia = (
  type: BreakpointType,
  query: Breakpoint,
  defaultState: boolean
) => {
  const [state, setState] = useState(defaultState);

  useEffect(() => {
    let mounted = true;
    const mql = window.matchMedia(
      `(${breakpointTypes[type]}: ${breakpoints[query]})`
    );
    const onChange = () => {
      if (!mounted) return;
      setState(!!mql.matches);
    };

    mql.addListener(onChange);
    setState(mql.matches);

    return () => {
      mounted = false;
      mql.removeListener(onChange);
    };
  }, [query, type]);

  return state;
};

export default mq;
