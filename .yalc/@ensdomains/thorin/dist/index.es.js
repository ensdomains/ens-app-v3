var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop in b || (b = {}))
    if (__hasOwnProp.call(b, prop))
      __defNormalProp(a, prop, b[prop]);
  if (__getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop))
        __defNormalProp(a, prop, b[prop]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target = {};
  for (var prop in source)
    if (__hasOwnProp.call(source, prop) && exclude.indexOf(prop) < 0)
      target[prop] = source[prop];
  if (source != null && __getOwnPropSymbols)
    for (var prop of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop) < 0 && __propIsEnum.call(source, prop))
        target[prop] = source[prop];
    }
  return target;
};
import * as React from "react";
import React__default from "react";
import styled, { keyframes, css, useTheme, createGlobalStyle } from "styled-components";
import * as ReactDOM from "react-dom";
const borderStyles = {
  none: "none",
  solid: "solid"
};
const borderWidths = {
  "0": "0px",
  px: "1px",
  "0.375": "0.09375rem",
  "0.5": "0.125rem",
  "0.75": "0.1875rem",
  "1": "0.25rem",
  "1.25": "0.3125rem",
  "1.5": "0.375rem",
  "1.75": "0.4375rem",
  "2": "0.5rem"
};
const radii = {
  none: "0",
  medium: "6px",
  large: "8px",
  almostExtraLarge: "10px",
  extraLarge: "12px",
  "2xLarge": "16px",
  "2.5xLarge": "20px",
  "3xLarge": "24px",
  "4xLarge": "40px",
  full: "9999px"
};
const shadows = {
  none: "none",
  "-px": "inset 0 0 0 1px",
  "0": "0 0 0 0",
  "0.02": "0 2px 8px",
  "0.25": "0 2px 12px",
  "0.5": "0 0 0 0.125rem",
  "1": "0 0 0 0.25rem",
  "2": "0 0 0 0.5rem"
};
const accentsRaw = {
  light: {
    blue: "82, 152, 255",
    green: "73, 179, 147",
    indigo: "88, 84, 214",
    orange: "255, 149, 0",
    pink: "255, 45, 85",
    purple: "175, 82, 222",
    red: "213, 85, 85",
    teal: "90, 200, 250",
    yellow: "255, 204, 0",
    grey: "232, 232, 235"
  },
  dark: {
    blue: "82, 152, 255",
    green: "73, 179, 147",
    indigo: "94, 92, 230",
    orange: "255, 159, 10",
    pink: "255, 55, 95",
    purple: "191, 90, 242",
    red: "213, 85, 85",
    teal: "100, 210, 255",
    yellow: "255, 214, 10",
    grey: "59, 59, 61"
  }
};
const accents = {
  light: {
    blue: `rgb(${accentsRaw.light.blue})`,
    green: `rgb(${accentsRaw.light.green})`,
    indigo: `rgb(${accentsRaw.light.indigo})`,
    orange: `rgb(${accentsRaw.light.orange})`,
    pink: `rgb(${accentsRaw.light.pink})`,
    purple: `rgb(${accentsRaw.light.purple})`,
    red: `rgb(${accentsRaw.light.red})`,
    teal: `rgb(${accentsRaw.light.teal})`,
    yellow: `rgb(${accentsRaw.light.yellow})`,
    grey: `rgb(${accentsRaw.light.grey})`
  },
  dark: {
    blue: `rgb(${accentsRaw.dark.blue})`,
    green: `rgb(${accentsRaw.dark.green})`,
    indigo: `rgb(${accentsRaw.dark.indigo})`,
    orange: `rgb(${accentsRaw.dark.orange})`,
    pink: `rgb(${accentsRaw.dark.pink})`,
    purple: `rgb(${accentsRaw.dark.purple})`,
    red: `rgb(${accentsRaw.dark.red})`,
    teal: `rgb(${accentsRaw.dark.teal})`,
    yellow: `rgb(${accentsRaw.dark.yellow})`,
    grey: `rgb(${accentsRaw.dark.grey})`
  }
};
const gradients = {
  light: {
    blue: "linear-gradient(330.4deg, #44BCF0 4.54%, #7298F8 59.2%, #A099FF 148.85%)",
    green: "linear-gradient(90deg, rgba(68,240,127,1) 4.54%, rgba(114,248,176,1) 59.2%, rgba(153,202,255,1) 148.85%)",
    red: "linear-gradient(90deg, rgba(240,68,87,1) 4.54%, rgba(248,114,149,1) 59.2%, rgba(212,153,255,1) 148.85%)"
  },
  dark: {
    blue: "linear-gradient(330.4deg, #44BCF0 4.54%, #7298F8 59.2%, #A099FF 148.85%)",
    green: "linear-gradient(90deg, rgba(68,240,127,1) 4.54%, rgba(114,248,176,1) 59.2%, rgba(153,202,255,1) 148.85%)",
    red: "linear-gradient(90deg, rgba(240,68,87,1) 4.54%, rgba(248,114,149,1) 59.2%, rgba(212,153,255,1) 148.85%)"
  }
};
const shades = {
  light: {
    accent: "0.7",
    accentSecondary: "0.15",
    accentSecondaryHover: "0.2",
    backgroundHide: "0.1",
    backgroundHideFallback: "0.5",
    foregroundSecondary: "0.05",
    foregroundSecondaryHover: "0.035",
    foregroundTertiary: "0.033",
    groupBorder: "0.075",
    border: "0.3",
    borderSecondary: "0.12",
    borderTertiary: "0.05",
    text: "0.8",
    textSecondary: "0.65",
    textSecondaryHover: "0.7",
    textTertiary: "0.4",
    textTertiaryHover: "0.5",
    textPlaceholder: "0.25"
  },
  dark: {
    accent: "0.66",
    accentSecondary: "0.2",
    accentSecondaryHover: "0.25",
    backgroundHide: "0.1",
    backgroundHideFallback: "0.5",
    foregroundSecondary: "0.1",
    foregroundSecondaryHover: "0.15",
    foregroundTertiary: "0.04",
    groupBorder: "0",
    border: "0.3",
    borderSecondary: "0.12",
    borderTertiary: "0.05",
    text: "0.7",
    textSecondary: "0.5",
    textSecondaryHover: "0.65",
    textTertiary: "0.35",
    textTertiaryHover: "0.4",
    textPlaceholder: "0.25"
  }
};
const colors = {
  base: {
    black: "rgb(0, 0, 0)",
    white: "rgb(255, 255, 255)",
    current: "currentColor",
    inherit: "inherit",
    transparent: "transparent"
  },
  light: __spreadValues({
    accent: `${accents.light.blue}`,
    accentSecondary: `rgba(${accentsRaw.light.blue}, ${shades.light.accentSecondary})`,
    accentSecondaryHover: `rgba(${accentsRaw.light.blue}, ${shades.light.accentSecondary})`,
    accentTertiary: `rgba(${accentsRaw.light.blue}, calc(${shades.light.accentSecondary} * 0.5))`,
    accentText: "rgb(255, 255, 255)",
    accentGradient: gradients.light.blue,
    background: "rgb(255, 255, 255)",
    backgroundHide: `rgba(0,0,0, ${shades.light.backgroundHide})`,
    backgroundSecondary: "rgb(246, 246, 248)",
    backgroundTertiary: "246, 246, 248",
    border: `rgb(0,0,0, ${shades.light.border})`,
    borderSecondary: `rgb(0,0,0, ${shades.light.borderSecondary})`,
    borderTertiary: `rgb(0,0,0, ${shades.light.borderTertiary})`,
    foreground: "rgb(0, 0, 0)",
    foregroundSecondary: `rgba(0,0,0, ${shades.light.foregroundSecondary})`,
    foregroundSecondaryHover: `rgba(0,0,0, ${shades.light.foregroundSecondaryHover})`,
    foregroundTertiary: `rgba(0,0,0, ${shades.light.foregroundTertiary})`,
    groupBackground: "rgb(253, 253, 255)",
    groupBorder: "rgb(0, 0, 0)",
    gradients: gradients.light,
    text: `rgb(0,0,0, ${shades.light.text})`,
    textPlaceholder: `rgb(0, 0, 0, ${shades.light.textPlaceholder})`,
    textSecondary: `rgb(0, 0, 0, ${shades.light.textSecondary})`,
    textTertiary: `rgb(0, 0, 0, ${shades.light.textTertiary})`
  }, accents.light),
  dark: __spreadValues({
    accent: `${accents.dark.blue}`,
    accentSecondary: `rgba(${accentsRaw.dark.blue}, ${shades.dark.accentSecondary})`,
    accentSecondaryHover: `rgba(${accentsRaw.dark.blue}, ${shades.dark.accentSecondary})`,
    accentTertiary: `rgba(${accentsRaw.dark.blue}, calc(${shades.dark.accentSecondary} * 0.5))`,
    accentText: "rgb(255, 255, 255)",
    accentGradient: gradients.dark.blue,
    background: "rgb(20, 20, 20)",
    backgroundHide: `rgba(255,255,255, ${shades.dark.backgroundHide})`,
    backgroundSecondary: "rgb(10, 10, 10)",
    backgroundTertiary: "rgb(20, 20, 20)",
    border: `rgb(255,255,255, ${shades.dark.border})`,
    borderSecondary: `rgb(255,255,255, ${shades.dark.borderSecondary})`,
    borderTertiary: `rgb(255,255,255, ${shades.dark.borderTertiary})`,
    foreground: "rgb(255, 255, 255)",
    foregroundSecondary: `rgba(255,255,255, ${shades.dark.foregroundSecondary})`,
    foregroundSecondaryHover: `rgba(255,255,255, ${shades.dark.foregroundSecondaryHover})`,
    foregroundTertiary: `rgba(255,255,255, ${shades.dark.foregroundTertiary})`,
    groupBackground: "rgb(10, 10, 10)",
    groupBorder: "rgb(255, 255, 255)",
    gradients: gradients.dark,
    text: `rgb(255,255,255, ${shades.dark.text})`,
    textPlaceholder: `rgb(255, 255, 255, ${shades.dark.textPlaceholder})`,
    textSecondary: `rgb(255, 255, 255, ${shades.dark.textSecondary})`,
    textTertiary: `rgb(255, 255, 255, ${shades.light.textTertiary})`
  }, accents.dark)
};
const opacity = {
  "0": "0",
  "30": ".3",
  "50": ".5",
  "70": ".7",
  "100": "1"
};
const space = {
  "0": "0",
  px: "1px",
  "0.25": "0.0625rem",
  "0.5": "0.125rem",
  "0.75": "0.1875rem",
  "1": "0.25rem",
  "1.25": "0.3125rem",
  "1.5": "0.375rem",
  "1.75": "0.4375rem",
  "2": "0.5rem",
  "2.5": "0.625rem",
  "3": "0.75rem",
  "3.5": "0.875rem",
  "4": "1rem",
  "4.5": "1.125rem",
  "5": "1.25rem",
  "6": "1.5rem",
  "7": "1.75rem",
  "8": "2rem",
  "9": "2.25rem",
  "10": "2.5rem",
  "11": "2.75rem",
  "12": "3rem",
  "13": "3.25rem",
  "14": "3.5rem",
  "15": "3.75rem",
  "16": "4rem",
  "18": "4.5rem",
  "20": "5rem",
  "24": "6rem",
  "28": "7rem",
  "32": "8rem",
  "36": "9rem",
  "40": "10rem",
  "44": "11rem",
  "48": "12rem",
  "52": "13rem",
  "56": "14rem",
  "60": "15rem",
  "64": "16rem",
  "72": "18rem",
  "80": "20rem",
  "96": "24rem",
  "112": "28rem",
  "128": "32rem",
  "144": "36rem",
  "168": "42rem",
  "192": "48rem",
  "224": "56rem",
  "256": "64rem",
  "288": "72rem",
  "320": "80rem",
  "1/4": "25%",
  "1/3": "33.333333%",
  "1/2": "50%",
  "2/3": "66.666667%",
  "3/4": "75%",
  auto: "auto",
  full: "100%",
  fit: "fit-content",
  max: "max-content",
  min: "min-content",
  viewHeight: "100vh",
  viewWidth: "100vw",
  none: "0"
};
const fonts = {
  mono: `"iAWriter Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace`,
  sans: `"Satoshi", -apple-system, BlinkMacSystemFont, "Segoe UI", "Roboto", "Oxygen", "Ubuntu", "Cantarell", "Fira Sans", "Droid Sans", "Helvetica Neue", sans-serif`
};
const fontSizes = {
  headingOne: "3rem",
  headingTwo: "1.875rem",
  headingThree: "1.625rem",
  extraLarge: "1.3125rem",
  large: "1.125rem",
  small: "0.9375rem",
  label: "0.8125rem",
  base: "1.0625rem",
  root: "16px"
};
const fontWeights = {
  light: "300",
  normal: "400",
  medium: "500",
  semiBold: "550",
  bold: "650"
};
const letterSpacings = {
  "-0.02": "-0.02em",
  "-0.015": "-0.015em",
  "-0.01": "-0.01em",
  normal: "0",
  "0.03": "0.03em"
};
const lineHeights = {
  normal: "normal",
  none: "1",
  "1.25": "1.25",
  "1.375": "1.375",
  "1.5": "1.5",
  "1.625": "1.625",
  "2": "2"
};
const transitionDuration = {
  "75": "75ms",
  "100": "100ms",
  "150": "150ms",
  "200": "200ms",
  "300": "300ms",
  "500": "500ms",
  "700": "700ms",
  "1000": "1000ms"
};
const transitionTimingFunction = {
  linear: "linear",
  in: "cubic-bezier(0.4, 0, 1, 1)",
  out: "cubic-bezier(0, 0, 0.2, 1)",
  inOut: "cubic-bezier(0.42, 0, 0.58, 1)"
};
const breakpoints = {
  sm: 640,
  md: 768,
  lg: 1024,
  xl: 1280
};
const boxShadows = {
  light: {
    "0": `${shadows["0"]} ${colors.light.foregroundSecondary}`,
    "0.02": `${shadows["0.02"]} ${colors.light.foregroundSecondary}`,
    "0.25": `${shadows["0.25"]} ${colors.light.foregroundSecondary}`,
    "0.5": `${shadows["0.5"]} ${colors.light.foregroundSecondary}`,
    "1": `${shadows["1"]} ${colors.light.foregroundSecondary}`
  },
  dark: {
    "0": `${shadows["0"]} ${colors.dark.foregroundSecondary}`,
    "0.02": `${shadows["0.02"]} ${colors.dark.foregroundSecondary}`,
    "0.25": `${shadows["0.25"]} ${colors.dark.foregroundSecondary}`,
    "0.5": `${shadows["0.5"]} ${colors.dark.foregroundSecondary}`,
    "1": `${shadows["1"]} ${colors.dark.foregroundSecondary}`
  }
};
const tokens = {
  borderStyles,
  borderWidths,
  colors,
  fonts,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  opacity,
  radii,
  shades,
  shadows,
  space,
  breakpoints,
  transitionDuration,
  transitionTimingFunction,
  boxShadows,
  accentsRaw
};
const Container$d = styled.div`
  ${({
  shape
}) => {
  switch (shape) {
    case "circle":
      return `
          border-radius: ${tokens.radii.full};
          &:after {
            border-radius: ${tokens.radii.full};
          }
        `;
    case "square":
      return `
          border-radius: ${tokens.radii["2xLarge"]}
          &:after {
            border-radius: ${tokens.radii["2xLarge"]}
          }
        `;
    default:
      return ``;
  }
}}

  ${({
  theme,
  noBorder
}) => !noBorder && `
      &:after {
      box-shadow: ${tokens.shadows["-px"]} ${tokens.colors[theme.mode].foregroundTertiary};
    content: '';
    inset: 0;
    position: absolute;
      }   
      }      
  `}

  ${({
  theme,
  size
}) => `
      height: ${tokens.space[size]};
      width: ${tokens.space[size]};
      min-width: ${tokens.space[size]};
      background-color: ${tokens.colors[theme.mode].foregroundSecondary};
      
       
  `}
  
  overflow: hidden;
  position: relative;
`;
const Placeholder = styled.div`
  ${({
  theme
}) => `
    background: ${tokens.colors[theme.mode].gradients.blue};
  `}

  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  height: 100%;
`;
const Img = styled.img`
  height: 100%;
  width: 100%;
  object-fit: cover;
`;
const Avatar = ({
  label,
  placeholder,
  noBorder,
  shape = "circle",
  size = "12",
  src
}) => {
  return /* @__PURE__ */ React.createElement(Container$d, __spreadValues({}, {
    shape,
    size,
    noBorder: placeholder || noBorder
  }), placeholder ? /* @__PURE__ */ React.createElement(Placeholder, {
    "aria-label": label
  }) : /* @__PURE__ */ React.createElement(Img, __spreadValues({}, {
    decoding: "async",
    src,
    alt: label
  })));
};
const Container$c = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  top: 0;
  ${({
  theme
}) => `
    backgroundColor: ${tokens.shades[theme.mode].backgroundHideFallback};
    
    @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    backdrop-filter: blur(30px);
    background-color: ${tokens.shades[theme.mode].backgroundHide};
  }
  `}
`;
const BackdropSurface = (props) => /* @__PURE__ */ React__default.createElement(Container$c, __spreadValues({}, props));
const VisuallyHidden = styled.div`
  border-width: 0;
  height: 1px;
  margin: -1px;
  overflow: hidden;
  padding: 0;
  position: absolute;
  white-space: nowrap;
  width: 1px;
`;
const rotate = keyframes`
  100% {
    transform: rotate(1turn);
  }
`;
const Container$b = styled.div`
  animation: ${rotate} 1.1s linear infinite;

  ${({
  theme,
  $color
}) => `
    color: ${tokens.colors[theme.mode][$color]};
    stroke: ${tokens.colors[theme.mode][$color]};
  `}

  ${({
  size
}) => {
  switch (size) {
    case "small":
      return `
          height: ${tokens.space["6"]};
          stroke-width: ${tokens.space["1.25"]};
          width: ${tokens.space["6"]};
        `;
    case "large":
      return `
          height: ${tokens.space["16"]};
          stroke-width: ${tokens.space["1"]};
          width: ${tokens.space["16"]};
        `;
    default:
      return ``;
  }
}}
`;
const Spinner = React.forwardRef(({
  accessibilityLabel,
  size = "small",
  color = "text"
}, ref) => {
  return /* @__PURE__ */ React.createElement(Container$b, {
    $color: color,
    ref,
    size
  }, accessibilityLabel && /* @__PURE__ */ React.createElement(VisuallyHidden, null, accessibilityLabel), /* @__PURE__ */ React.createElement("svg", {
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ React.createElement("circle", {
    cx: "12",
    cy: "12",
    fill: "none",
    r: "9",
    strokeDasharray: "42",
    strokeLinecap: "round"
  }), /* @__PURE__ */ React.createElement("circle", {
    cx: "12",
    cy: "12",
    fill: "none",
    opacity: "0.25",
    r: "9",
    strokeLinecap: "round"
  })));
});
Spinner.displayName = "Spinner";
const Container$a = styled.div`
  ${({
  font
}) => `
      font-family: ${tokens.fonts[font]};
      letter-spacing: ${tokens.letterSpacings["-0.01"]};
      letter-spacing: ${tokens.letterSpacings["-0.015"]};
      line-height: ${tokens.lineHeights.normal};
  `}

  ${({
  ellipsis
}) => ellipsis && `
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
  `}

  ${({
  variant,
  theme
}) => {
  switch (variant) {
    case "small":
      return `
          font-size: ${tokens.fontSizes["small"]};
          font-weight: ${tokens.fontWeights["normal"]};
          letter-spacing: ${tokens.letterSpacings["-0.01"]};
          line-height: ${tokens.lineHeights.normal};
        `;
    case "large":
      return `
          font-size: ${tokens.fontSizes["large"]};
          font-weight: ${tokens.fontWeights["normal"]};
          letter-spacing: ${tokens.letterSpacings["-0.02"]};
          line-height: ${tokens.lineHeights["2"]};
        `;
    case "extraLarge":
      return `
          font-size: ${tokens.fontSizes["extraLarge"]};
          font-weight: ${tokens.fontWeights["medium"]};
          letter-spacing: ${tokens.letterSpacings["-0.02"]};
          line-height: ${tokens.lineHeights["2"]};
        `;
    case "label":
      return `
          color: ${tokens.colors[theme.mode].text};
          font-size: ${tokens.fontSizes["label"]};
          font-weight: ${tokens.fontWeights["bold"]};
          letter-spacing: ${tokens.letterSpacings["-0.01"]};
          text-transform: capitalize;
        `;
    case "labelHeading":
      return `
          color: ${tokens.colors[theme.mode].text};
          font-size: ${tokens.fontSizes["small"]};
          font-weight: ${tokens.fontWeights["bold"]};
          letter-spacing: ${tokens.letterSpacings["-0.01"]};
          text-transform: capitalize;
        `;
    default:
      return ``;
  }
}}

  ${({
  theme,
  color
}) => color && `
    color: ${tokens.colors[theme.mode][color]};
  `}

  ${({
  size
}) => size && `
      font-size: ${tokens.fontSizes[size]};
  `}

  ${({
  weight
}) => weight && `
      font-weight: ${tokens.fontWeights[weight]};
  `}
`;
const Typography = React.forwardRef(({
  as = "div",
  children,
  ellipsis,
  variant,
  className,
  weight,
  font = "sans",
  color,
  size
}, ref) => {
  return /* @__PURE__ */ React.createElement(Container$a, __spreadProps(__spreadValues({
    as
  }, {
    variant,
    ellipsis: ellipsis ? true : void 0,
    className,
    weight,
    font,
    color,
    size
  }), {
    ref
  }), children);
});
Typography.displayName = "Typography";
const getCenterProps = ({
  center,
  size,
  side
}) => center && `
  position: absolute;
  ${side}: ${size === "medium" ? tokens.space["4"] : tokens.space["5"]};
`;
const getAccentColour = (mode, tone, accent) => {
  if (tone === "accent") {
    return tokens.colors[mode][accent];
  }
  switch (accent) {
    case "accent":
      return tokens.colors[mode][tone];
    case "accentText":
      return tokens.colors.base.white;
    case "accentGradient":
      return tokens.colors[mode].gradients[tone];
    case "accentSecondary":
      return `rgba(${tokens.accentsRaw[mode][tone]}, ${tokens.shades[mode][accent]})`;
    case "accentSecondaryHover":
      return `rgba(${tokens.accentsRaw[mode][tone]}, ${tokens.shades[mode][accent]})`;
    default:
      return ``;
  }
};
const ButtonElement = styled.button`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: ${tokens.space["4"]};
  justify-content: center;
  transition-propery: all;
  transition-duration: ${tokens.transitionDuration["150"]};
  transition-timing-function: ${tokens.transitionTimingFunction["inOut"]};
  letter-spacing: ${tokens.letterSpacings["-0.01"]};

  &:hover {
    transform: translateY(-1px);
    filter: brightness(1.05);
  }

  &:active {
    transform: translateY(0px);
    filter: brightness(1);
  }

  ${({
  theme,
  disabled,
  $center,
  $pressed,
  $shadowless
}) => `
    ${disabled ? `cursor: not-allowed` : ``};
    ${$center ? `position: relative` : ``};
    ${$pressed ? `brightness(0.95)` : ``};
    ${$shadowless ? `box-shadow: none !important` : ``};
    
    box-shadow: ${tokens.shadows["0.25"]} ${tokens.colors[theme.mode].grey};
    
    &:disabled {
      background-color: ${tokens.colors[theme.mode].grey};
      transform: translateY(0px);
      filter: brightness(1);
    }
  `}

  border-radius: ${tokens.radii.extraLarge};
  font-size: ${tokens.fontSizes.large};
  padding: ${tokens.space["3.5"]} ${tokens.space["4"]};

  ${({
  $size
}) => {
  switch ($size) {
    case "extraSmall":
      return `
          border-radius: ${tokens.radii.large};
          font-size: ${tokens.fontSizes.small};
          padding: ${tokens.space["2"]};
        `;
    case "small":
      return `
          border-radius: ${tokens.radii.large};
          font-size: ${tokens.fontSizes.small};
          height: ${tokens.space["10"]};
          padding: 0 ${tokens.space["4"]};
        `;
    case "medium":
      return ``;
    default:
      return ``;
  }
}}
  ${({
  theme,
  $variant,
  $tone
}) => {
  switch ($variant) {
    case "primary":
      return `
          color: ${getAccentColour(theme.mode, $tone, "accentText")};
          background: ${getAccentColour(theme.mode, $tone, "accent")};
        `;
    case "secondary":
      return `
          color: ${tokens.colors[theme.mode].textSecondary};
          background: ${tokens.colors[theme.mode].grey};
        `;
    case "action":
      return `
          color: ${getAccentColour(theme.mode, $tone, "accentText")};
          background: ${getAccentColour(theme.mode, $tone, "accentGradient")};
        `;
    case "transparent":
      return `
          color: ${tokens.colors[theme.mode].textTertiary};
          
          &:hover {
              background-color: ${tokens.colors[theme.mode].foregroundTertiary};
          }
          
          &:active {
              background-color: ${tokens.colors[theme.mode].foregroundTertiary};
          }
        `;
    default:
      return ``;
  }
}}
  ${({
  $size,
  $shape
}) => {
  switch ($shape) {
    case "circle":
      return `
          border-radius: ${tokens.radii.full};
        `;
    case "square":
      return `border-radius: ${$size === "small" ? tokens.radii["large"] : tokens.radii["2xLarge"]};`;
    default:
      return ``;
  }
}}

  ${({
  $size,
  $center
}) => {
  if ($size === "medium" && $center) {
    return `
        padding-left: ${tokens.space["14"]};
        padding-right: ${tokens.space["14"]};
      `;
  }
  return "";
}}

  ${({
  theme,
  $shadowless,
  $pressed,
  $variant
}) => {
  if ($shadowless && $pressed && $variant === "transparent") {
    return `
        background-color: ${tokens.colors[theme.mode].backgroundSecondary};
      `;
  }
  return "";
}}
`;
const PrefixContainer = styled.div`
  ${getCenterProps}
`;
const LoadingContainer = styled.div``;
const LabelContainer$1 = styled(Typography)`
  color: inherit;
  font-size: inherit;
  font-weight: ${tokens.fontWeights["semiBold"]};
`;
const Button = React.forwardRef(({
  center,
  children,
  disabled,
  href,
  prefix,
  loading,
  rel,
  shape,
  size = "medium",
  suffix,
  tabIndex,
  target,
  tone = "accent",
  type,
  variant = "primary",
  width,
  zIndex,
  onClick,
  pressed = false,
  shadowless = false
}, ref) => {
  const labelContent = /* @__PURE__ */ React.createElement(LabelContainer$1, {
    ellipsis: true
  }, children);
  let childContent;
  if (shape) {
    childContent = loading ? /* @__PURE__ */ React.createElement(Spinner, null) : labelContent;
  } else {
    childContent = /* @__PURE__ */ React.createElement(React.Fragment, null, prefix && /* @__PURE__ */ React.createElement(PrefixContainer, __spreadValues({}, {
      center,
      size,
      side: "left"
    }), prefix), labelContent, (loading || suffix) && /* @__PURE__ */ React.createElement(LoadingContainer, __spreadValues({}, {
      center,
      size,
      side: "right"
    }), loading ? /* @__PURE__ */ React.createElement(Spinner, null) : suffix));
  }
  return /* @__PURE__ */ React.createElement(ButtonElement, __spreadValues({}, {
    $variant: variant,
    $tone: tone,
    $size: size,
    $shape: shape,
    $shadowless: shadowless,
    $pressed: pressed,
    $center: center,
    disabled,
    href,
    ref,
    rel,
    tabIndex,
    target,
    type,
    onClick,
    zIndex,
    position: zIndex && "relative",
    width: width != null ? width : "100%"
  }), childContent);
});
Button.displayName = "Button";
const largerThanAccumulator = Object.keys(breakpoints).reduce((accumulator, label) => {
  const pxSize = breakpoints[label];
  const newAcc = accumulator;
  newAcc[label] = (...args) => css`
      @media screen and (min-width: ${pxSize}px) {
        ${css(...args)}
      }
    `;
  return newAcc;
}, {});
const largerThan = largerThanAccumulator;
const Container$9 = styled.div`
  padding: ${tokens.space["6"]};
  border-radius: ${tokens.radii["2xLarge"]};

  ${largerThan.lg`
    border-radius: ${tokens.radii["3xLarge"]};
  `}

  ${({
  dark
}) => dark ? `background-color: ${tokens.colors.base.black};` : `background-color: ${tokens.colors.base.white};`}

  ${({
  dark,
  shadow
}) => !dark && shadow && `
        box-shadow: 0px 0px ${tokens.radii["2xLarge"]} rgba(0,0,0,0.1);
        border-radius: ${tokens.radii["2xLarge"]};
        
        ${largerThan.lg`
            box-shadow: 0px 0px ${tokens.radii["3xLarge"]} rgba(0,0,0,0.1);
            border-radius: ${tokens.radii["3xLarge"]};
        `}
    `}
`;
const Card = ({
  children,
  shadow
}) => {
  const {
    mode,
    forcedMode
  } = useTheme();
  return /* @__PURE__ */ React.createElement(Container$9, __spreadValues({}, {
    dark: (forcedMode != null ? forcedMode : mode) === "dark",
    shadow
  }), children);
};
const useIsoMorphicEffect = typeof window !== "undefined" ? React.useLayoutEffect : React.useEffect;
const state = {
  serverHandoffComplete: false
};
const useServerHandoffComplete = () => {
  const [serverHandoffComplete, setServerHandoffComplete] = React.useState(state.serverHandoffComplete);
  React.useEffect(() => {
    if (serverHandoffComplete)
      return;
    setServerHandoffComplete(true);
  }, [serverHandoffComplete]);
  React.useEffect(() => {
    if (state.serverHandoffComplete)
      return;
    state.serverHandoffComplete = true;
  }, []);
  return serverHandoffComplete;
};
const idPrefix = "thorin";
let id = 0;
function generateId() {
  return ++id;
}
const useId = () => {
  const ready = useServerHandoffComplete();
  const [id2, setId] = React.useState(ready ? generateId : null);
  useIsoMorphicEffect(() => {
    if (id2 === null)
      setId(generateId());
  }, [id2]);
  return id2 != null ? `${idPrefix}` + id2 : void 0;
};
const useFieldIds = ({
  description: hasDescription,
  error: hasError,
  id: contentId
} = {}) => {
  const _id = useId();
  return React.useMemo(() => {
    const id2 = `${_id}${contentId ? `-${contentId}` : ""}`;
    const labelId = `${id2}-label`;
    let describedBy;
    let description;
    if (hasDescription) {
      description = {
        id: `${id2}-description`
      };
      describedBy = description.id;
    }
    let error;
    if (hasError) {
      error = {
        id: `${id2}-error`
      };
      describedBy = `${describedBy ? `${describedBy} ` : ""}${error.id}`;
    }
    return {
      content: {
        "aria-describedby": describedBy,
        "aria-labelledby": labelId,
        id: id2
      },
      description,
      error,
      label: {
        htmlFor: id2,
        id: labelId
      }
    };
  }, [_id, hasDescription, hasError, contentId]);
};
const Context$1 = React.createContext(void 0);
const Label = styled.label`
  ${({
  theme
}) => `
  color: ${tokens.colors[theme.mode].textTertiary};
  font-weight: ${tokens.fontWeights["semiBold"]};
  margin-right: ${tokens.space["4"]};
`}
`;
const LabelContentContainer = styled.div`
  display: flex;
  align-items: flex-end;
  justify-conetn: space-between;
  padding-left: ${tokens.space["4"]};
  padding-right: ${tokens.space["4"]};
  padding-top: 0;
  padding-bottom: 0;
`;
const LabelContent = ({
  ids,
  label,
  labelSecondary,
  required
}) => /* @__PURE__ */ React.createElement(LabelContentContainer, null, /* @__PURE__ */ React.createElement(Label, __spreadValues({}, ids.label), label, " ", required && /* @__PURE__ */ React.createElement(VisuallyHidden, null, "(required)")), labelSecondary && labelSecondary);
const Container$8 = styled.div`
  ${({
  inline
}) => inline ? "align-items: center" : ""};
  display: flex;
  flex-direction: ${({
  inline
}) => inline ? "row" : "column"};
  gap: ${tokens.space[2]};
  width: ${({
  width
}) => tokens.space[width]};
`;
const ContainerInner$2 = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space[2]};
`;
const Description$1 = styled.div`
  padding: 0 ${tokens.space["4"]};
  color: ${({
  mode
}) => tokens.shades[mode].textSecondary};
`;
const Error2 = styled.div`
  color: ${({
  theme
}) => tokens.colors[theme.mode].red};
  padding: 0 ${tokens.space[4]};
`;
const Field = ({
  children,
  description,
  error,
  hideLabel,
  id: id2,
  label,
  labelSecondary,
  required,
  inline,
  width = "full"
}) => {
  const ids = useFieldIds({
    id: id2,
    description: description !== void 0,
    error: error !== void 0
  });
  const {
    mode
  } = useTheme();
  let content;
  if (typeof children === "function")
    content = /* @__PURE__ */ React.createElement(Context$1.Provider, {
      value: ids
    }, /* @__PURE__ */ React.createElement(Context$1.Consumer, null, (context) => children(context)));
  else if (children)
    content = React.cloneElement(children, ids.content);
  else
    content = children;
  return inline ? /* @__PURE__ */ React.createElement(Container$8, {
    inline,
    width
  }, /* @__PURE__ */ React.createElement("div", null, content), /* @__PURE__ */ React.createElement(ContainerInner$2, null, hideLabel ? /* @__PURE__ */ React.createElement(VisuallyHidden, null, /* @__PURE__ */ React.createElement(LabelContent, __spreadValues({}, {
    ids,
    label,
    labelSecondary,
    required
  }))) : /* @__PURE__ */ React.createElement(LabelContent, __spreadValues({}, {
    ids,
    label,
    labelSecondary,
    required
  })), description && /* @__PURE__ */ React.createElement(Description$1, __spreadValues({}, {
    mode
  }), description), error && /* @__PURE__ */ React.createElement(Error2, __spreadValues({
    "aria-live": "polite"
  }, ids.error), error))) : /* @__PURE__ */ React.createElement(Container$8, {
    width
  }, hideLabel ? /* @__PURE__ */ React.createElement(VisuallyHidden, null, /* @__PURE__ */ React.createElement(LabelContent, __spreadValues({}, {
    ids,
    label,
    labelSecondary,
    required
  }))) : /* @__PURE__ */ React.createElement(LabelContent, __spreadValues({}, {
    ids,
    label,
    labelSecondary,
    required
  })), content, description && /* @__PURE__ */ React.createElement(Description$1, __spreadValues(__spreadValues({}, {
    mode
  }), ids.description), description), error && /* @__PURE__ */ React.createElement(Error2, __spreadValues({
    "aria-live": "polite"
  }, ids.error), error));
};
const validateAccept = (fileType, accept) => {
  const allowedTypes = accept == null ? void 0 : accept.split(", ");
  if (!allowedTypes)
    return true;
  const mime = getMimeType(fileType);
  return allowedTypes.some((x) => {
    const allowedMime = getMimeType(x);
    return allowedMime.type === mime.type && allowedMime.subtype === mime.subtype;
  });
};
const getMimeType = (type) => {
  const parts = type.split("/");
  return {
    type: parts[0],
    subtype: parts[1]
  };
};
const initialState = {};
const FileInput = React.forwardRef(({
  accept,
  autoFocus,
  children,
  defaultValue,
  disabled,
  error,
  id: id2,
  maxSize,
  name,
  required,
  tabIndex,
  onBlur,
  onChange,
  onError,
  onFocus,
  onReset
}, ref) => {
  const defaultRef = React.useRef(null);
  const inputRef = ref || defaultRef;
  const [state2, setState] = React.useState(initialState);
  const hasError = error ? true : void 0;
  const ids = useFieldIds({
    id: id2,
    error: hasError
  });
  const handleFile = React.useCallback((file, event) => {
    if (maxSize && file.size > maxSize * 1e6) {
      event == null ? void 0 : event.preventDefault();
      onError && onError(`File is ${(file.size / 1e6).toFixed(2)} MB. Must be smaller than ${maxSize} MB`);
      return;
    }
    setState((x) => __spreadProps(__spreadValues({}, x), {
      file,
      name: file.name,
      type: file.type
    }));
    onChange && onChange(file);
  }, [maxSize, onChange, onError]);
  const handleChange = React.useCallback((event) => {
    const files = event.target.files;
    if (!(files == null ? void 0 : files.length))
      return;
    handleFile(files[0], event);
  }, [handleFile]);
  const handleDragOver = React.useCallback((event) => {
    event.preventDefault();
    setState((x) => __spreadProps(__spreadValues({}, x), {
      droppable: true
    }));
  }, []);
  const handleDragLeave = React.useCallback((event) => {
    event.preventDefault();
    setState((x) => __spreadProps(__spreadValues({}, x), {
      droppable: false
    }));
  }, []);
  const handleDrop = React.useCallback((event) => {
    event.preventDefault();
    setState((x) => __spreadProps(__spreadValues({}, x), {
      droppable: false
    }));
    let file;
    if (event.dataTransfer.items) {
      const files = event.dataTransfer.items;
      if ((files == null ? void 0 : files[0].kind) !== "file")
        return;
      file = files[0].getAsFile();
      if (!file)
        return;
    } else {
      const files = event.dataTransfer.files;
      if (!(files == null ? void 0 : files.length))
        return;
      file = files[0];
    }
    if (!validateAccept(file.type, accept))
      return;
    handleFile(file, event);
  }, [handleFile, accept]);
  const handleFocus = React.useCallback((event) => {
    setState((x) => __spreadProps(__spreadValues({}, x), {
      focused: true
    }));
    onFocus && onFocus(event);
  }, [onFocus]);
  const handleBlur = React.useCallback((event) => {
    setState((x) => __spreadProps(__spreadValues({}, x), {
      focused: false
    }));
    onBlur && onBlur(event);
  }, [onBlur]);
  const reset = React.useCallback((event) => {
    event.preventDefault();
    setState(initialState);
    if (inputRef.current)
      inputRef.current.value = "";
    onReset && onReset();
  }, [inputRef, onReset]);
  React.useEffect(() => {
    if (!defaultValue)
      return;
    setState({
      previewUrl: defaultValue.url,
      name: defaultValue.name,
      type: defaultValue.type
    });
  }, []);
  React.useEffect(() => {
    if (!state2.file)
      return;
    const previewUrl = URL.createObjectURL(state2.file);
    setState((x) => __spreadProps(__spreadValues({}, x), {
      previewUrl
    }));
    return () => URL.revokeObjectURL(previewUrl);
  }, [state2.file]);
  return /* @__PURE__ */ React.createElement("div", {
    ref
  }, /* @__PURE__ */ React.createElement(VisuallyHidden, null, /* @__PURE__ */ React.createElement("input", __spreadValues({
    accept,
    "aria-invalid": hasError,
    autoFocus,
    disabled,
    name,
    ref: inputRef,
    required,
    tabIndex,
    type: "file",
    onBlur: handleBlur,
    onChange: handleChange,
    onFocus: handleFocus
  }, ids.content))), /* @__PURE__ */ React.createElement("label", __spreadProps(__spreadValues({}, ids.label), {
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop
  }), children(__spreadProps(__spreadValues({}, state2), {
    reset
  }))));
});
FileInput.displayName = "FileInput";
const HeadingContainer = styled.div`
  ${({
  textAlign,
  textTransform
}) => `
    ${textAlign ? `text-align: ${textAlign};` : ``}
    ${textTransform ? `text-transform: ${textTransform};` : ``}
  `}

  ${({
  level
}) => {
  switch (level) {
    case "1":
      return `
          font-size: ${tokens.fontSizes.headingOne};
          font-weight: ${tokens.fontWeights.semiBold};
          letter-spacing: ${tokens.letterSpacings["-0.02"]};
          line-height: 4rem;
        `;
    case "2":
      return `
          font-size: ${tokens.fontSizes.headingTwo};
          font-weight: ${tokens.fontWeights.semiBold};
          letter-spacing: ${tokens.letterSpacings["-0.02"]};
          line-height: 2.5rem;
        `;
    default:
      return ``;
  }
}}
  
  ${({
  responsive,
  level
}) => {
  if (responsive) {
    switch (level) {
      case "1":
        return `
          font-size: ${tokens.fontSizes.headingTwo};
          
          ${largerThan.sm`
            font-size: ${tokens.fontSizes.headingOne};
          `}
        `;
      case "2":
        return `
          font-size: ${tokens.fontSizes.extraLarge};
          letter-spacing: normal;
          
          ${largerThan.sm`
            font-size: ${tokens.fontSizes.headingTwo};
            letter-spacing: -0.02;
          `}
        `;
      default:
        return ``;
    }
  }
}}
  
  font-family: ${tokens.fonts["sans"]};
`;
const Heading = React.forwardRef(({
  align,
  children,
  as = "h1",
  id: id2,
  level = "2",
  responsive,
  transform
}, ref) => /* @__PURE__ */ React.createElement(HeadingContainer, __spreadValues({
  textAlign: align,
  textTransform: transform
}, {
  level,
  responsive,
  as,
  id: id2,
  ref
}), children));
const Portal = ({
  children,
  className,
  el = "div"
}) => {
  const [container] = React.useState(document.createElement(el));
  if (className)
    container.classList.add(className);
  React.useEffect(() => {
    document.body.appendChild(container);
    return () => {
      document.body.removeChild(container);
    };
  }, []);
  return ReactDOM.createPortal(children, container);
};
const Context = React.createContext(void 0);
const SkeletonGroup = ({
  children,
  loading
}) => {
  return /* @__PURE__ */ React.createElement(Context.Provider, {
    value: loading
  }, children);
};
const Container$7 = styled.div`
  ${({
  theme,
  active
}) => active && `
     background-color: ${tokens.colors[theme.mode].foregroundSecondary};
     border-radius: ${tokens.radii.medium};
     width: ${tokens.space.fit};
  `}
`;
const ContainerInner$1 = styled.span`
  display: block;
  ${({
  active
}) => active ? "visibility: hidden;" : ""}
`;
const Skeleton = ({
  as,
  children,
  loading
}) => {
  const groupLoading = React.useContext(Context);
  const active = loading != null ? loading : groupLoading;
  return /* @__PURE__ */ React.createElement(Container$7, __spreadValues({}, {
    active,
    as
  }), /* @__PURE__ */ React.createElement(ContainerInner$1, __spreadValues({}, {
    active
  }), children));
};
const Container$6 = styled.div`
  line-height: normal;
  align-items: center;
  display: flex;
  border-radius: ${tokens.radii["full"]};
  font-weight: ${tokens.fontWeights["medium"]};
  width: ${tokens.space["max"]};

  ${({
  hover
}) => hover && `
      transition-duration: ${tokens.transitionDuration["150"]};
      transition-property: color, border-color, background-color;
      transition-timing-function: ${tokens.transitionTimingFunction["inOut"]};
  `}

  ${({
  size
}) => {
  switch (size) {
    case "small":
      return `
          height: ${tokens.space["5"]};
          font-size: ${tokens.fontSizes["label"]};
        `;
    case "medium":
      return `
          height: ${tokens.space["6"]};
          font-size: ${tokens.fontSizes["small"]};
        `;
    default:
      return ``;
  }
}}

  ${({
  tone,
  theme
}) => {
  switch (tone) {
    case "accent":
      return `
          color: ${tokens.colors[theme.mode].accent};
          background-color: ${tokens.colors[theme.mode].accentTertiary};
        `;
    case "secondary":
      return `
          color: ${tokens.colors[theme.mode].textTertiary};
          background-color: ${tokens.colors[theme.mode].foregroundTertiary};
        `;
    case "blue":
      return `
          color: ${tokens.colors[theme.mode].blue};
          background-color: rgba(${tokens.accentsRaw[theme.mode].blue}, calc(${tokens.shades[theme.mode].accentSecondary} * 0.5));
        `;
    case "green":
      return `
          color: ${tokens.colors[theme.mode].green};
          background-color: rgba(${tokens.accentsRaw[theme.mode].green}, calc(${tokens.shades[theme.mode].accentSecondary} * 0.5));
        `;
    case "red":
      return `
          color: ${tokens.colors[theme.mode].red};
          background-color: rgba(${tokens.accentsRaw[theme.mode].red}, calc(${tokens.shades[theme.mode].accentSecondary} * 0.5));
        `;
    default:
      return ``;
  }
}}
  
  ${({
  hover,
  tone,
  theme
}) => {
  if (hover && tone === "accent")
    return `
        background-color: ${tokens.colors[theme.mode].accentTertiary};
      
        &:hover:active {
        background-color: ${tokens.colors[theme.mode].accentSecondary};
        }
        `;
  if (hover && tone === "secondary")
    return `
        color: ${tokens.colors[theme.mode].textSecondary};
        background-color: ${tokens.colors[theme.mode].foregroundTertiary};
      
        &:hover:active {
          color: ${tokens.colors[theme.mode].text};
          background-color: ${tokens.colors[theme.mode].foregroundSecondary};
        }
        `;
  if (hover && tone === "blue")
    return `
        &:hover:active {
          background-color: rgb(${tokens.colors[theme.mode].blue});
        }
        `;
  if (hover && tone === "green")
    return `
        &:hover:active {
          background-color: rgb(${tokens.colors[theme.mode].green});
        }
        `;
  if (hover && tone === "red")
    return `
        &:hover:active {
          background-color: rgb(${tokens.colors[theme.mode].red});
        }
        `;
}}
`;
const LabelContainer = styled.label`
  align-items: center;
  border-radius: ${tokens.radii["full"]};
  display: flex;
  height: ${tokens.space["full"]};
  padding: 0 ${tokens.space["2"]};

  ${({
  theme
}) => `
    box-shadow: 0 0 0 2px ${tokens.colors[theme.mode].background};
  `}
`;
const ChildContainer = styled.div`
  padding: 0 ${tokens.space["2"]};
`;
const Tag = ({
  as = "div",
  children,
  hover,
  label,
  size = "medium",
  tone = "secondary"
}) => {
  return /* @__PURE__ */ React.createElement(Container$6, __spreadValues({
    as
  }, {
    hover,
    size,
    tone
  }), label && /* @__PURE__ */ React.createElement(LabelContainer, null, /* @__PURE__ */ React.createElement("span", null, label)), /* @__PURE__ */ React.createElement(ChildContainer, {
    as
  }, children));
};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
var lodash = { exports: {} };
/**
 * @license
 * Lodash <https://lodash.com/>
 * Copyright OpenJS Foundation and other contributors <https://openjsf.org/>
 * Released under MIT license <https://lodash.com/license>
 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
 */
(function(module, exports) {
  (function() {
    var undefined$1;
    var VERSION = "4.17.21";
    var LARGE_ARRAY_SIZE = 200;
    var CORE_ERROR_TEXT = "Unsupported core-js use. Try https://npms.io/search?q=ponyfill.", FUNC_ERROR_TEXT = "Expected a function", INVALID_TEMPL_VAR_ERROR_TEXT = "Invalid `variable` option passed into `_.template`";
    var HASH_UNDEFINED = "__lodash_hash_undefined__";
    var MAX_MEMOIZE_SIZE = 500;
    var PLACEHOLDER = "__lodash_placeholder__";
    var CLONE_DEEP_FLAG = 1, CLONE_FLAT_FLAG = 2, CLONE_SYMBOLS_FLAG = 4;
    var COMPARE_PARTIAL_FLAG = 1, COMPARE_UNORDERED_FLAG = 2;
    var WRAP_BIND_FLAG = 1, WRAP_BIND_KEY_FLAG = 2, WRAP_CURRY_BOUND_FLAG = 4, WRAP_CURRY_FLAG = 8, WRAP_CURRY_RIGHT_FLAG = 16, WRAP_PARTIAL_FLAG = 32, WRAP_PARTIAL_RIGHT_FLAG = 64, WRAP_ARY_FLAG = 128, WRAP_REARG_FLAG = 256, WRAP_FLIP_FLAG = 512;
    var DEFAULT_TRUNC_LENGTH = 30, DEFAULT_TRUNC_OMISSION = "...";
    var HOT_COUNT = 800, HOT_SPAN = 16;
    var LAZY_FILTER_FLAG = 1, LAZY_MAP_FLAG = 2, LAZY_WHILE_FLAG = 3;
    var INFINITY2 = 1 / 0, MAX_SAFE_INTEGER = 9007199254740991, MAX_INTEGER = 17976931348623157e292, NAN = 0 / 0;
    var MAX_ARRAY_LENGTH = 4294967295, MAX_ARRAY_INDEX = MAX_ARRAY_LENGTH - 1, HALF_MAX_ARRAY_LENGTH = MAX_ARRAY_LENGTH >>> 1;
    var wrapFlags = [
      ["ary", WRAP_ARY_FLAG],
      ["bind", WRAP_BIND_FLAG],
      ["bindKey", WRAP_BIND_KEY_FLAG],
      ["curry", WRAP_CURRY_FLAG],
      ["curryRight", WRAP_CURRY_RIGHT_FLAG],
      ["flip", WRAP_FLIP_FLAG],
      ["partial", WRAP_PARTIAL_FLAG],
      ["partialRight", WRAP_PARTIAL_RIGHT_FLAG],
      ["rearg", WRAP_REARG_FLAG]
    ];
    var argsTag = "[object Arguments]", arrayTag = "[object Array]", asyncTag = "[object AsyncFunction]", boolTag = "[object Boolean]", dateTag = "[object Date]", domExcTag = "[object DOMException]", errorTag = "[object Error]", funcTag = "[object Function]", genTag = "[object GeneratorFunction]", mapTag = "[object Map]", numberTag = "[object Number]", nullTag2 = "[object Null]", objectTag = "[object Object]", promiseTag = "[object Promise]", proxyTag = "[object Proxy]", regexpTag = "[object RegExp]", setTag = "[object Set]", stringTag = "[object String]", symbolTag2 = "[object Symbol]", undefinedTag2 = "[object Undefined]", weakMapTag = "[object WeakMap]", weakSetTag = "[object WeakSet]";
    var arrayBufferTag = "[object ArrayBuffer]", dataViewTag = "[object DataView]", float32Tag = "[object Float32Array]", float64Tag = "[object Float64Array]", int8Tag = "[object Int8Array]", int16Tag = "[object Int16Array]", int32Tag = "[object Int32Array]", uint8Tag = "[object Uint8Array]", uint8ClampedTag = "[object Uint8ClampedArray]", uint16Tag = "[object Uint16Array]", uint32Tag = "[object Uint32Array]";
    var reEmptyStringLeading = /\b__p \+= '';/g, reEmptyStringMiddle = /\b(__p \+=) '' \+/g, reEmptyStringTrailing = /(__e\(.*?\)|\b__t\)) \+\n'';/g;
    var reEscapedHtml = /&(?:amp|lt|gt|quot|#39);/g, reUnescapedHtml = /[&<>"']/g, reHasEscapedHtml = RegExp(reEscapedHtml.source), reHasUnescapedHtml = RegExp(reUnescapedHtml.source);
    var reEscape = /<%-([\s\S]+?)%>/g, reEvaluate = /<%([\s\S]+?)%>/g, reInterpolate = /<%=([\s\S]+?)%>/g;
    var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/, reIsPlainProp = /^\w*$/, rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]|(?=(?:\.|\[\])(?:\.|\[\]|$))/g;
    var reRegExpChar = /[\\^$.*+?()[\]{}|]/g, reHasRegExpChar = RegExp(reRegExpChar.source);
    var reTrimStart = /^\s+/;
    var reWhitespace = /\s/;
    var reWrapComment = /\{(?:\n\/\* \[wrapped with .+\] \*\/)?\n?/, reWrapDetails = /\{\n\/\* \[wrapped with (.+)\] \*/, reSplitDetails = /,? & /;
    var reAsciiWord = /[^\x00-\x2f\x3a-\x40\x5b-\x60\x7b-\x7f]+/g;
    var reForbiddenIdentifierChars = /[()=,{}\[\]\/\s]/;
    var reEscapeChar = /\\(\\)?/g;
    var reEsTemplate = /\$\{([^\\}]*(?:\\.[^\\}]*)*)\}/g;
    var reFlags = /\w*$/;
    var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
    var reIsBinary = /^0b[01]+$/i;
    var reIsHostCtor = /^\[object .+?Constructor\]$/;
    var reIsOctal = /^0o[0-7]+$/i;
    var reIsUint = /^(?:0|[1-9]\d*)$/;
    var reLatin = /[\xc0-\xd6\xd8-\xf6\xf8-\xff\u0100-\u017f]/g;
    var reNoMatch = /($^)/;
    var reUnescapedString = /['\n\r\u2028\u2029\\]/g;
    var rsAstralRange = "\\ud800-\\udfff", rsComboMarksRange = "\\u0300-\\u036f", reComboHalfMarksRange = "\\ufe20-\\ufe2f", rsComboSymbolsRange = "\\u20d0-\\u20ff", rsComboRange = rsComboMarksRange + reComboHalfMarksRange + rsComboSymbolsRange, rsDingbatRange = "\\u2700-\\u27bf", rsLowerRange = "a-z\\xdf-\\xf6\\xf8-\\xff", rsMathOpRange = "\\xac\\xb1\\xd7\\xf7", rsNonCharRange = "\\x00-\\x2f\\x3a-\\x40\\x5b-\\x60\\x7b-\\xbf", rsPunctuationRange = "\\u2000-\\u206f", rsSpaceRange = " \\t\\x0b\\f\\xa0\\ufeff\\n\\r\\u2028\\u2029\\u1680\\u180e\\u2000\\u2001\\u2002\\u2003\\u2004\\u2005\\u2006\\u2007\\u2008\\u2009\\u200a\\u202f\\u205f\\u3000", rsUpperRange = "A-Z\\xc0-\\xd6\\xd8-\\xde", rsVarRange = "\\ufe0e\\ufe0f", rsBreakRange = rsMathOpRange + rsNonCharRange + rsPunctuationRange + rsSpaceRange;
    var rsApos = "['\u2019]", rsAstral = "[" + rsAstralRange + "]", rsBreak = "[" + rsBreakRange + "]", rsCombo = "[" + rsComboRange + "]", rsDigits = "\\d+", rsDingbat = "[" + rsDingbatRange + "]", rsLower = "[" + rsLowerRange + "]", rsMisc = "[^" + rsAstralRange + rsBreakRange + rsDigits + rsDingbatRange + rsLowerRange + rsUpperRange + "]", rsFitz = "\\ud83c[\\udffb-\\udfff]", rsModifier = "(?:" + rsCombo + "|" + rsFitz + ")", rsNonAstral = "[^" + rsAstralRange + "]", rsRegional = "(?:\\ud83c[\\udde6-\\uddff]){2}", rsSurrPair = "[\\ud800-\\udbff][\\udc00-\\udfff]", rsUpper = "[" + rsUpperRange + "]", rsZWJ = "\\u200d";
    var rsMiscLower = "(?:" + rsLower + "|" + rsMisc + ")", rsMiscUpper = "(?:" + rsUpper + "|" + rsMisc + ")", rsOptContrLower = "(?:" + rsApos + "(?:d|ll|m|re|s|t|ve))?", rsOptContrUpper = "(?:" + rsApos + "(?:D|LL|M|RE|S|T|VE))?", reOptMod = rsModifier + "?", rsOptVar = "[" + rsVarRange + "]?", rsOptJoin = "(?:" + rsZWJ + "(?:" + [rsNonAstral, rsRegional, rsSurrPair].join("|") + ")" + rsOptVar + reOptMod + ")*", rsOrdLower = "\\d*(?:1st|2nd|3rd|(?![123])\\dth)(?=\\b|[A-Z_])", rsOrdUpper = "\\d*(?:1ST|2ND|3RD|(?![123])\\dTH)(?=\\b|[a-z_])", rsSeq = rsOptVar + reOptMod + rsOptJoin, rsEmoji = "(?:" + [rsDingbat, rsRegional, rsSurrPair].join("|") + ")" + rsSeq, rsSymbol = "(?:" + [rsNonAstral + rsCombo + "?", rsCombo, rsRegional, rsSurrPair, rsAstral].join("|") + ")";
    var reApos = RegExp(rsApos, "g");
    var reComboMark = RegExp(rsCombo, "g");
    var reUnicode = RegExp(rsFitz + "(?=" + rsFitz + ")|" + rsSymbol + rsSeq, "g");
    var reUnicodeWord = RegExp([
      rsUpper + "?" + rsLower + "+" + rsOptContrLower + "(?=" + [rsBreak, rsUpper, "$"].join("|") + ")",
      rsMiscUpper + "+" + rsOptContrUpper + "(?=" + [rsBreak, rsUpper + rsMiscLower, "$"].join("|") + ")",
      rsUpper + "?" + rsMiscLower + "+" + rsOptContrLower,
      rsUpper + "+" + rsOptContrUpper,
      rsOrdUpper,
      rsOrdLower,
      rsDigits,
      rsEmoji
    ].join("|"), "g");
    var reHasUnicode = RegExp("[" + rsZWJ + rsAstralRange + rsComboRange + rsVarRange + "]");
    var reHasUnicodeWord = /[a-z][A-Z]|[A-Z]{2}[a-z]|[0-9][a-zA-Z]|[a-zA-Z][0-9]|[^a-zA-Z0-9 ]/;
    var contextProps = [
      "Array",
      "Buffer",
      "DataView",
      "Date",
      "Error",
      "Float32Array",
      "Float64Array",
      "Function",
      "Int8Array",
      "Int16Array",
      "Int32Array",
      "Map",
      "Math",
      "Object",
      "Promise",
      "RegExp",
      "Set",
      "String",
      "Symbol",
      "TypeError",
      "Uint8Array",
      "Uint8ClampedArray",
      "Uint16Array",
      "Uint32Array",
      "WeakMap",
      "_",
      "clearTimeout",
      "isFinite",
      "parseInt",
      "setTimeout"
    ];
    var templateCounter = -1;
    var typedArrayTags = {};
    typedArrayTags[float32Tag] = typedArrayTags[float64Tag] = typedArrayTags[int8Tag] = typedArrayTags[int16Tag] = typedArrayTags[int32Tag] = typedArrayTags[uint8Tag] = typedArrayTags[uint8ClampedTag] = typedArrayTags[uint16Tag] = typedArrayTags[uint32Tag] = true;
    typedArrayTags[argsTag] = typedArrayTags[arrayTag] = typedArrayTags[arrayBufferTag] = typedArrayTags[boolTag] = typedArrayTags[dataViewTag] = typedArrayTags[dateTag] = typedArrayTags[errorTag] = typedArrayTags[funcTag] = typedArrayTags[mapTag] = typedArrayTags[numberTag] = typedArrayTags[objectTag] = typedArrayTags[regexpTag] = typedArrayTags[setTag] = typedArrayTags[stringTag] = typedArrayTags[weakMapTag] = false;
    var cloneableTags = {};
    cloneableTags[argsTag] = cloneableTags[arrayTag] = cloneableTags[arrayBufferTag] = cloneableTags[dataViewTag] = cloneableTags[boolTag] = cloneableTags[dateTag] = cloneableTags[float32Tag] = cloneableTags[float64Tag] = cloneableTags[int8Tag] = cloneableTags[int16Tag] = cloneableTags[int32Tag] = cloneableTags[mapTag] = cloneableTags[numberTag] = cloneableTags[objectTag] = cloneableTags[regexpTag] = cloneableTags[setTag] = cloneableTags[stringTag] = cloneableTags[symbolTag2] = cloneableTags[uint8Tag] = cloneableTags[uint8ClampedTag] = cloneableTags[uint16Tag] = cloneableTags[uint32Tag] = true;
    cloneableTags[errorTag] = cloneableTags[funcTag] = cloneableTags[weakMapTag] = false;
    var deburredLetters = {
      "\xC0": "A",
      "\xC1": "A",
      "\xC2": "A",
      "\xC3": "A",
      "\xC4": "A",
      "\xC5": "A",
      "\xE0": "a",
      "\xE1": "a",
      "\xE2": "a",
      "\xE3": "a",
      "\xE4": "a",
      "\xE5": "a",
      "\xC7": "C",
      "\xE7": "c",
      "\xD0": "D",
      "\xF0": "d",
      "\xC8": "E",
      "\xC9": "E",
      "\xCA": "E",
      "\xCB": "E",
      "\xE8": "e",
      "\xE9": "e",
      "\xEA": "e",
      "\xEB": "e",
      "\xCC": "I",
      "\xCD": "I",
      "\xCE": "I",
      "\xCF": "I",
      "\xEC": "i",
      "\xED": "i",
      "\xEE": "i",
      "\xEF": "i",
      "\xD1": "N",
      "\xF1": "n",
      "\xD2": "O",
      "\xD3": "O",
      "\xD4": "O",
      "\xD5": "O",
      "\xD6": "O",
      "\xD8": "O",
      "\xF2": "o",
      "\xF3": "o",
      "\xF4": "o",
      "\xF5": "o",
      "\xF6": "o",
      "\xF8": "o",
      "\xD9": "U",
      "\xDA": "U",
      "\xDB": "U",
      "\xDC": "U",
      "\xF9": "u",
      "\xFA": "u",
      "\xFB": "u",
      "\xFC": "u",
      "\xDD": "Y",
      "\xFD": "y",
      "\xFF": "y",
      "\xC6": "Ae",
      "\xE6": "ae",
      "\xDE": "Th",
      "\xFE": "th",
      "\xDF": "ss",
      "\u0100": "A",
      "\u0102": "A",
      "\u0104": "A",
      "\u0101": "a",
      "\u0103": "a",
      "\u0105": "a",
      "\u0106": "C",
      "\u0108": "C",
      "\u010A": "C",
      "\u010C": "C",
      "\u0107": "c",
      "\u0109": "c",
      "\u010B": "c",
      "\u010D": "c",
      "\u010E": "D",
      "\u0110": "D",
      "\u010F": "d",
      "\u0111": "d",
      "\u0112": "E",
      "\u0114": "E",
      "\u0116": "E",
      "\u0118": "E",
      "\u011A": "E",
      "\u0113": "e",
      "\u0115": "e",
      "\u0117": "e",
      "\u0119": "e",
      "\u011B": "e",
      "\u011C": "G",
      "\u011E": "G",
      "\u0120": "G",
      "\u0122": "G",
      "\u011D": "g",
      "\u011F": "g",
      "\u0121": "g",
      "\u0123": "g",
      "\u0124": "H",
      "\u0126": "H",
      "\u0125": "h",
      "\u0127": "h",
      "\u0128": "I",
      "\u012A": "I",
      "\u012C": "I",
      "\u012E": "I",
      "\u0130": "I",
      "\u0129": "i",
      "\u012B": "i",
      "\u012D": "i",
      "\u012F": "i",
      "\u0131": "i",
      "\u0134": "J",
      "\u0135": "j",
      "\u0136": "K",
      "\u0137": "k",
      "\u0138": "k",
      "\u0139": "L",
      "\u013B": "L",
      "\u013D": "L",
      "\u013F": "L",
      "\u0141": "L",
      "\u013A": "l",
      "\u013C": "l",
      "\u013E": "l",
      "\u0140": "l",
      "\u0142": "l",
      "\u0143": "N",
      "\u0145": "N",
      "\u0147": "N",
      "\u014A": "N",
      "\u0144": "n",
      "\u0146": "n",
      "\u0148": "n",
      "\u014B": "n",
      "\u014C": "O",
      "\u014E": "O",
      "\u0150": "O",
      "\u014D": "o",
      "\u014F": "o",
      "\u0151": "o",
      "\u0154": "R",
      "\u0156": "R",
      "\u0158": "R",
      "\u0155": "r",
      "\u0157": "r",
      "\u0159": "r",
      "\u015A": "S",
      "\u015C": "S",
      "\u015E": "S",
      "\u0160": "S",
      "\u015B": "s",
      "\u015D": "s",
      "\u015F": "s",
      "\u0161": "s",
      "\u0162": "T",
      "\u0164": "T",
      "\u0166": "T",
      "\u0163": "t",
      "\u0165": "t",
      "\u0167": "t",
      "\u0168": "U",
      "\u016A": "U",
      "\u016C": "U",
      "\u016E": "U",
      "\u0170": "U",
      "\u0172": "U",
      "\u0169": "u",
      "\u016B": "u",
      "\u016D": "u",
      "\u016F": "u",
      "\u0171": "u",
      "\u0173": "u",
      "\u0174": "W",
      "\u0175": "w",
      "\u0176": "Y",
      "\u0177": "y",
      "\u0178": "Y",
      "\u0179": "Z",
      "\u017B": "Z",
      "\u017D": "Z",
      "\u017A": "z",
      "\u017C": "z",
      "\u017E": "z",
      "\u0132": "IJ",
      "\u0133": "ij",
      "\u0152": "Oe",
      "\u0153": "oe",
      "\u0149": "'n",
      "\u017F": "s"
    };
    var htmlEscapes = {
      "&": "&amp;",
      "<": "&lt;",
      ">": "&gt;",
      '"': "&quot;",
      "'": "&#39;"
    };
    var htmlUnescapes = {
      "&amp;": "&",
      "&lt;": "<",
      "&gt;": ">",
      "&quot;": '"',
      "&#39;": "'"
    };
    var stringEscapes = {
      "\\": "\\",
      "'": "'",
      "\n": "n",
      "\r": "r",
      "\u2028": "u2028",
      "\u2029": "u2029"
    };
    var freeParseFloat = parseFloat, freeParseInt = parseInt;
    var freeGlobal2 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
    var freeSelf2 = typeof self == "object" && self && self.Object === Object && self;
    var root2 = freeGlobal2 || freeSelf2 || Function("return this")();
    var freeExports = exports && !exports.nodeType && exports;
    var freeModule = freeExports && true && module && !module.nodeType && module;
    var moduleExports = freeModule && freeModule.exports === freeExports;
    var freeProcess = moduleExports && freeGlobal2.process;
    var nodeUtil = function() {
      try {
        var types = freeModule && freeModule.require && freeModule.require("util").types;
        if (types) {
          return types;
        }
        return freeProcess && freeProcess.binding && freeProcess.binding("util");
      } catch (e) {
      }
    }();
    var nodeIsArrayBuffer = nodeUtil && nodeUtil.isArrayBuffer, nodeIsDate = nodeUtil && nodeUtil.isDate, nodeIsMap = nodeUtil && nodeUtil.isMap, nodeIsRegExp = nodeUtil && nodeUtil.isRegExp, nodeIsSet = nodeUtil && nodeUtil.isSet, nodeIsTypedArray = nodeUtil && nodeUtil.isTypedArray;
    function apply(func, thisArg, args) {
      switch (args.length) {
        case 0:
          return func.call(thisArg);
        case 1:
          return func.call(thisArg, args[0]);
        case 2:
          return func.call(thisArg, args[0], args[1]);
        case 3:
          return func.call(thisArg, args[0], args[1], args[2]);
      }
      return func.apply(thisArg, args);
    }
    function arrayAggregator(array, setter, iteratee, accumulator) {
      var index2 = -1, length = array == null ? 0 : array.length;
      while (++index2 < length) {
        var value = array[index2];
        setter(accumulator, value, iteratee(value), array);
      }
      return accumulator;
    }
    function arrayEach(array, iteratee) {
      var index2 = -1, length = array == null ? 0 : array.length;
      while (++index2 < length) {
        if (iteratee(array[index2], index2, array) === false) {
          break;
        }
      }
      return array;
    }
    function arrayEachRight(array, iteratee) {
      var length = array == null ? 0 : array.length;
      while (length--) {
        if (iteratee(array[length], length, array) === false) {
          break;
        }
      }
      return array;
    }
    function arrayEvery(array, predicate) {
      var index2 = -1, length = array == null ? 0 : array.length;
      while (++index2 < length) {
        if (!predicate(array[index2], index2, array)) {
          return false;
        }
      }
      return true;
    }
    function arrayFilter(array, predicate) {
      var index2 = -1, length = array == null ? 0 : array.length, resIndex = 0, result = [];
      while (++index2 < length) {
        var value = array[index2];
        if (predicate(value, index2, array)) {
          result[resIndex++] = value;
        }
      }
      return result;
    }
    function arrayIncludes(array, value) {
      var length = array == null ? 0 : array.length;
      return !!length && baseIndexOf(array, value, 0) > -1;
    }
    function arrayIncludesWith(array, value, comparator) {
      var index2 = -1, length = array == null ? 0 : array.length;
      while (++index2 < length) {
        if (comparator(value, array[index2])) {
          return true;
        }
      }
      return false;
    }
    function arrayMap2(array, iteratee) {
      var index2 = -1, length = array == null ? 0 : array.length, result = Array(length);
      while (++index2 < length) {
        result[index2] = iteratee(array[index2], index2, array);
      }
      return result;
    }
    function arrayPush(array, values) {
      var index2 = -1, length = values.length, offset = array.length;
      while (++index2 < length) {
        array[offset + index2] = values[index2];
      }
      return array;
    }
    function arrayReduce(array, iteratee, accumulator, initAccum) {
      var index2 = -1, length = array == null ? 0 : array.length;
      if (initAccum && length) {
        accumulator = array[++index2];
      }
      while (++index2 < length) {
        accumulator = iteratee(accumulator, array[index2], index2, array);
      }
      return accumulator;
    }
    function arrayReduceRight(array, iteratee, accumulator, initAccum) {
      var length = array == null ? 0 : array.length;
      if (initAccum && length) {
        accumulator = array[--length];
      }
      while (length--) {
        accumulator = iteratee(accumulator, array[length], length, array);
      }
      return accumulator;
    }
    function arraySome(array, predicate) {
      var index2 = -1, length = array == null ? 0 : array.length;
      while (++index2 < length) {
        if (predicate(array[index2], index2, array)) {
          return true;
        }
      }
      return false;
    }
    var asciiSize = baseProperty("length");
    function asciiToArray(string) {
      return string.split("");
    }
    function asciiWords(string) {
      return string.match(reAsciiWord) || [];
    }
    function baseFindKey(collection, predicate, eachFunc) {
      var result;
      eachFunc(collection, function(value, key, collection2) {
        if (predicate(value, key, collection2)) {
          result = key;
          return false;
        }
      });
      return result;
    }
    function baseFindIndex(array, predicate, fromIndex, fromRight) {
      var length = array.length, index2 = fromIndex + (fromRight ? 1 : -1);
      while (fromRight ? index2-- : ++index2 < length) {
        if (predicate(array[index2], index2, array)) {
          return index2;
        }
      }
      return -1;
    }
    function baseIndexOf(array, value, fromIndex) {
      return value === value ? strictIndexOf(array, value, fromIndex) : baseFindIndex(array, baseIsNaN, fromIndex);
    }
    function baseIndexOfWith(array, value, fromIndex, comparator) {
      var index2 = fromIndex - 1, length = array.length;
      while (++index2 < length) {
        if (comparator(array[index2], value)) {
          return index2;
        }
      }
      return -1;
    }
    function baseIsNaN(value) {
      return value !== value;
    }
    function baseMean(array, iteratee) {
      var length = array == null ? 0 : array.length;
      return length ? baseSum(array, iteratee) / length : NAN;
    }
    function baseProperty(key) {
      return function(object) {
        return object == null ? undefined$1 : object[key];
      };
    }
    function basePropertyOf(object) {
      return function(key) {
        return object == null ? undefined$1 : object[key];
      };
    }
    function baseReduce(collection, iteratee, accumulator, initAccum, eachFunc) {
      eachFunc(collection, function(value, index2, collection2) {
        accumulator = initAccum ? (initAccum = false, value) : iteratee(accumulator, value, index2, collection2);
      });
      return accumulator;
    }
    function baseSortBy(array, comparer) {
      var length = array.length;
      array.sort(comparer);
      while (length--) {
        array[length] = array[length].value;
      }
      return array;
    }
    function baseSum(array, iteratee) {
      var result, index2 = -1, length = array.length;
      while (++index2 < length) {
        var current = iteratee(array[index2]);
        if (current !== undefined$1) {
          result = result === undefined$1 ? current : result + current;
        }
      }
      return result;
    }
    function baseTimes(n, iteratee) {
      var index2 = -1, result = Array(n);
      while (++index2 < n) {
        result[index2] = iteratee(index2);
      }
      return result;
    }
    function baseToPairs(object, props) {
      return arrayMap2(props, function(key) {
        return [key, object[key]];
      });
    }
    function baseTrim(string) {
      return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
    }
    function baseUnary(func) {
      return function(value) {
        return func(value);
      };
    }
    function baseValues(object, props) {
      return arrayMap2(props, function(key) {
        return object[key];
      });
    }
    function cacheHas(cache, key) {
      return cache.has(key);
    }
    function charsStartIndex(strSymbols, chrSymbols) {
      var index2 = -1, length = strSymbols.length;
      while (++index2 < length && baseIndexOf(chrSymbols, strSymbols[index2], 0) > -1) {
      }
      return index2;
    }
    function charsEndIndex(strSymbols, chrSymbols) {
      var index2 = strSymbols.length;
      while (index2-- && baseIndexOf(chrSymbols, strSymbols[index2], 0) > -1) {
      }
      return index2;
    }
    function countHolders(array, placeholder) {
      var length = array.length, result = 0;
      while (length--) {
        if (array[length] === placeholder) {
          ++result;
        }
      }
      return result;
    }
    var deburrLetter = basePropertyOf(deburredLetters);
    var escapeHtmlChar = basePropertyOf(htmlEscapes);
    function escapeStringChar(chr) {
      return "\\" + stringEscapes[chr];
    }
    function getValue(object, key) {
      return object == null ? undefined$1 : object[key];
    }
    function hasUnicode(string) {
      return reHasUnicode.test(string);
    }
    function hasUnicodeWord(string) {
      return reHasUnicodeWord.test(string);
    }
    function iteratorToArray(iterator) {
      var data, result = [];
      while (!(data = iterator.next()).done) {
        result.push(data.value);
      }
      return result;
    }
    function mapToArray(map) {
      var index2 = -1, result = Array(map.size);
      map.forEach(function(value, key) {
        result[++index2] = [key, value];
      });
      return result;
    }
    function overArg(func, transform) {
      return function(arg) {
        return func(transform(arg));
      };
    }
    function replaceHolders(array, placeholder) {
      var index2 = -1, length = array.length, resIndex = 0, result = [];
      while (++index2 < length) {
        var value = array[index2];
        if (value === placeholder || value === PLACEHOLDER) {
          array[index2] = PLACEHOLDER;
          result[resIndex++] = index2;
        }
      }
      return result;
    }
    function setToArray(set) {
      var index2 = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index2] = value;
      });
      return result;
    }
    function setToPairs(set) {
      var index2 = -1, result = Array(set.size);
      set.forEach(function(value) {
        result[++index2] = [value, value];
      });
      return result;
    }
    function strictIndexOf(array, value, fromIndex) {
      var index2 = fromIndex - 1, length = array.length;
      while (++index2 < length) {
        if (array[index2] === value) {
          return index2;
        }
      }
      return -1;
    }
    function strictLastIndexOf(array, value, fromIndex) {
      var index2 = fromIndex + 1;
      while (index2--) {
        if (array[index2] === value) {
          return index2;
        }
      }
      return index2;
    }
    function stringSize(string) {
      return hasUnicode(string) ? unicodeSize(string) : asciiSize(string);
    }
    function stringToArray(string) {
      return hasUnicode(string) ? unicodeToArray(string) : asciiToArray(string);
    }
    function trimmedEndIndex(string) {
      var index2 = string.length;
      while (index2-- && reWhitespace.test(string.charAt(index2))) {
      }
      return index2;
    }
    var unescapeHtmlChar = basePropertyOf(htmlUnescapes);
    function unicodeSize(string) {
      var result = reUnicode.lastIndex = 0;
      while (reUnicode.test(string)) {
        ++result;
      }
      return result;
    }
    function unicodeToArray(string) {
      return string.match(reUnicode) || [];
    }
    function unicodeWords(string) {
      return string.match(reUnicodeWord) || [];
    }
    var runInContext = function runInContext2(context) {
      context = context == null ? root2 : _.defaults(root2.Object(), context, _.pick(root2, contextProps));
      var Array2 = context.Array, Date = context.Date, Error3 = context.Error, Function2 = context.Function, Math2 = context.Math, Object2 = context.Object, RegExp2 = context.RegExp, String = context.String, TypeError2 = context.TypeError;
      var arrayProto = Array2.prototype, funcProto = Function2.prototype, objectProto2 = Object2.prototype;
      var coreJsData = context["__core-js_shared__"];
      var funcToString = funcProto.toString;
      var hasOwnProperty2 = objectProto2.hasOwnProperty;
      var idCounter2 = 0;
      var maskSrcKey = function() {
        var uid = /[^.]+$/.exec(coreJsData && coreJsData.keys && coreJsData.keys.IE_PROTO || "");
        return uid ? "Symbol(src)_1." + uid : "";
      }();
      var nativeObjectToString2 = objectProto2.toString;
      var objectCtorString = funcToString.call(Object2);
      var oldDash = root2._;
      var reIsNative = RegExp2("^" + funcToString.call(hasOwnProperty2).replace(reRegExpChar, "\\$&").replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, "$1.*?") + "$");
      var Buffer2 = moduleExports ? context.Buffer : undefined$1, Symbol2 = context.Symbol, Uint8Array2 = context.Uint8Array, allocUnsafe = Buffer2 ? Buffer2.allocUnsafe : undefined$1, getPrototype = overArg(Object2.getPrototypeOf, Object2), objectCreate = Object2.create, propertyIsEnumerable = objectProto2.propertyIsEnumerable, splice = arrayProto.splice, spreadableSymbol = Symbol2 ? Symbol2.isConcatSpreadable : undefined$1, symIterator = Symbol2 ? Symbol2.iterator : undefined$1, symToStringTag2 = Symbol2 ? Symbol2.toStringTag : undefined$1;
      var defineProperty = function() {
        try {
          var func = getNative(Object2, "defineProperty");
          func({}, "", {});
          return func;
        } catch (e) {
        }
      }();
      var ctxClearTimeout = context.clearTimeout !== root2.clearTimeout && context.clearTimeout, ctxNow = Date && Date.now !== root2.Date.now && Date.now, ctxSetTimeout = context.setTimeout !== root2.setTimeout && context.setTimeout;
      var nativeCeil = Math2.ceil, nativeFloor = Math2.floor, nativeGetSymbols = Object2.getOwnPropertySymbols, nativeIsBuffer = Buffer2 ? Buffer2.isBuffer : undefined$1, nativeIsFinite = context.isFinite, nativeJoin = arrayProto.join, nativeKeys = overArg(Object2.keys, Object2), nativeMax = Math2.max, nativeMin = Math2.min, nativeNow = Date.now, nativeParseInt = context.parseInt, nativeRandom = Math2.random, nativeReverse = arrayProto.reverse;
      var DataView = getNative(context, "DataView"), Map = getNative(context, "Map"), Promise2 = getNative(context, "Promise"), Set = getNative(context, "Set"), WeakMap = getNative(context, "WeakMap"), nativeCreate = getNative(Object2, "create");
      var metaMap = WeakMap && new WeakMap();
      var realNames = {};
      var dataViewCtorString = toSource(DataView), mapCtorString = toSource(Map), promiseCtorString = toSource(Promise2), setCtorString = toSource(Set), weakMapCtorString = toSource(WeakMap);
      var symbolProto2 = Symbol2 ? Symbol2.prototype : undefined$1, symbolValueOf = symbolProto2 ? symbolProto2.valueOf : undefined$1, symbolToString2 = symbolProto2 ? symbolProto2.toString : undefined$1;
      function lodash2(value) {
        if (isObjectLike2(value) && !isArray2(value) && !(value instanceof LazyWrapper)) {
          if (value instanceof LodashWrapper) {
            return value;
          }
          if (hasOwnProperty2.call(value, "__wrapped__")) {
            return wrapperClone(value);
          }
        }
        return new LodashWrapper(value);
      }
      var baseCreate = function() {
        function object() {
        }
        return function(proto) {
          if (!isObject(proto)) {
            return {};
          }
          if (objectCreate) {
            return objectCreate(proto);
          }
          object.prototype = proto;
          var result2 = new object();
          object.prototype = undefined$1;
          return result2;
        };
      }();
      function baseLodash() {
      }
      function LodashWrapper(value, chainAll) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__chain__ = !!chainAll;
        this.__index__ = 0;
        this.__values__ = undefined$1;
      }
      lodash2.templateSettings = {
        "escape": reEscape,
        "evaluate": reEvaluate,
        "interpolate": reInterpolate,
        "variable": "",
        "imports": {
          "_": lodash2
        }
      };
      lodash2.prototype = baseLodash.prototype;
      lodash2.prototype.constructor = lodash2;
      LodashWrapper.prototype = baseCreate(baseLodash.prototype);
      LodashWrapper.prototype.constructor = LodashWrapper;
      function LazyWrapper(value) {
        this.__wrapped__ = value;
        this.__actions__ = [];
        this.__dir__ = 1;
        this.__filtered__ = false;
        this.__iteratees__ = [];
        this.__takeCount__ = MAX_ARRAY_LENGTH;
        this.__views__ = [];
      }
      function lazyClone() {
        var result2 = new LazyWrapper(this.__wrapped__);
        result2.__actions__ = copyArray(this.__actions__);
        result2.__dir__ = this.__dir__;
        result2.__filtered__ = this.__filtered__;
        result2.__iteratees__ = copyArray(this.__iteratees__);
        result2.__takeCount__ = this.__takeCount__;
        result2.__views__ = copyArray(this.__views__);
        return result2;
      }
      function lazyReverse() {
        if (this.__filtered__) {
          var result2 = new LazyWrapper(this);
          result2.__dir__ = -1;
          result2.__filtered__ = true;
        } else {
          result2 = this.clone();
          result2.__dir__ *= -1;
        }
        return result2;
      }
      function lazyValue() {
        var array = this.__wrapped__.value(), dir = this.__dir__, isArr = isArray2(array), isRight = dir < 0, arrLength = isArr ? array.length : 0, view = getView(0, arrLength, this.__views__), start = view.start, end = view.end, length = end - start, index2 = isRight ? end : start - 1, iteratees = this.__iteratees__, iterLength = iteratees.length, resIndex = 0, takeCount = nativeMin(length, this.__takeCount__);
        if (!isArr || !isRight && arrLength == length && takeCount == length) {
          return baseWrapperValue(array, this.__actions__);
        }
        var result2 = [];
        outer:
          while (length-- && resIndex < takeCount) {
            index2 += dir;
            var iterIndex = -1, value = array[index2];
            while (++iterIndex < iterLength) {
              var data = iteratees[iterIndex], iteratee2 = data.iteratee, type = data.type, computed = iteratee2(value);
              if (type == LAZY_MAP_FLAG) {
                value = computed;
              } else if (!computed) {
                if (type == LAZY_FILTER_FLAG) {
                  continue outer;
                } else {
                  break outer;
                }
              }
            }
            result2[resIndex++] = value;
          }
        return result2;
      }
      LazyWrapper.prototype = baseCreate(baseLodash.prototype);
      LazyWrapper.prototype.constructor = LazyWrapper;
      function Hash(entries) {
        var index2 = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index2 < length) {
          var entry = entries[index2];
          this.set(entry[0], entry[1]);
        }
      }
      function hashClear() {
        this.__data__ = nativeCreate ? nativeCreate(null) : {};
        this.size = 0;
      }
      function hashDelete(key) {
        var result2 = this.has(key) && delete this.__data__[key];
        this.size -= result2 ? 1 : 0;
        return result2;
      }
      function hashGet(key) {
        var data = this.__data__;
        if (nativeCreate) {
          var result2 = data[key];
          return result2 === HASH_UNDEFINED ? undefined$1 : result2;
        }
        return hasOwnProperty2.call(data, key) ? data[key] : undefined$1;
      }
      function hashHas(key) {
        var data = this.__data__;
        return nativeCreate ? data[key] !== undefined$1 : hasOwnProperty2.call(data, key);
      }
      function hashSet(key, value) {
        var data = this.__data__;
        this.size += this.has(key) ? 0 : 1;
        data[key] = nativeCreate && value === undefined$1 ? HASH_UNDEFINED : value;
        return this;
      }
      Hash.prototype.clear = hashClear;
      Hash.prototype["delete"] = hashDelete;
      Hash.prototype.get = hashGet;
      Hash.prototype.has = hashHas;
      Hash.prototype.set = hashSet;
      function ListCache(entries) {
        var index2 = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index2 < length) {
          var entry = entries[index2];
          this.set(entry[0], entry[1]);
        }
      }
      function listCacheClear() {
        this.__data__ = [];
        this.size = 0;
      }
      function listCacheDelete(key) {
        var data = this.__data__, index2 = assocIndexOf(data, key);
        if (index2 < 0) {
          return false;
        }
        var lastIndex = data.length - 1;
        if (index2 == lastIndex) {
          data.pop();
        } else {
          splice.call(data, index2, 1);
        }
        --this.size;
        return true;
      }
      function listCacheGet(key) {
        var data = this.__data__, index2 = assocIndexOf(data, key);
        return index2 < 0 ? undefined$1 : data[index2][1];
      }
      function listCacheHas(key) {
        return assocIndexOf(this.__data__, key) > -1;
      }
      function listCacheSet(key, value) {
        var data = this.__data__, index2 = assocIndexOf(data, key);
        if (index2 < 0) {
          ++this.size;
          data.push([key, value]);
        } else {
          data[index2][1] = value;
        }
        return this;
      }
      ListCache.prototype.clear = listCacheClear;
      ListCache.prototype["delete"] = listCacheDelete;
      ListCache.prototype.get = listCacheGet;
      ListCache.prototype.has = listCacheHas;
      ListCache.prototype.set = listCacheSet;
      function MapCache(entries) {
        var index2 = -1, length = entries == null ? 0 : entries.length;
        this.clear();
        while (++index2 < length) {
          var entry = entries[index2];
          this.set(entry[0], entry[1]);
        }
      }
      function mapCacheClear() {
        this.size = 0;
        this.__data__ = {
          "hash": new Hash(),
          "map": new (Map || ListCache)(),
          "string": new Hash()
        };
      }
      function mapCacheDelete(key) {
        var result2 = getMapData(this, key)["delete"](key);
        this.size -= result2 ? 1 : 0;
        return result2;
      }
      function mapCacheGet(key) {
        return getMapData(this, key).get(key);
      }
      function mapCacheHas(key) {
        return getMapData(this, key).has(key);
      }
      function mapCacheSet(key, value) {
        var data = getMapData(this, key), size2 = data.size;
        data.set(key, value);
        this.size += data.size == size2 ? 0 : 1;
        return this;
      }
      MapCache.prototype.clear = mapCacheClear;
      MapCache.prototype["delete"] = mapCacheDelete;
      MapCache.prototype.get = mapCacheGet;
      MapCache.prototype.has = mapCacheHas;
      MapCache.prototype.set = mapCacheSet;
      function SetCache(values2) {
        var index2 = -1, length = values2 == null ? 0 : values2.length;
        this.__data__ = new MapCache();
        while (++index2 < length) {
          this.add(values2[index2]);
        }
      }
      function setCacheAdd(value) {
        this.__data__.set(value, HASH_UNDEFINED);
        return this;
      }
      function setCacheHas(value) {
        return this.__data__.has(value);
      }
      SetCache.prototype.add = SetCache.prototype.push = setCacheAdd;
      SetCache.prototype.has = setCacheHas;
      function Stack(entries) {
        var data = this.__data__ = new ListCache(entries);
        this.size = data.size;
      }
      function stackClear() {
        this.__data__ = new ListCache();
        this.size = 0;
      }
      function stackDelete(key) {
        var data = this.__data__, result2 = data["delete"](key);
        this.size = data.size;
        return result2;
      }
      function stackGet(key) {
        return this.__data__.get(key);
      }
      function stackHas(key) {
        return this.__data__.has(key);
      }
      function stackSet(key, value) {
        var data = this.__data__;
        if (data instanceof ListCache) {
          var pairs = data.__data__;
          if (!Map || pairs.length < LARGE_ARRAY_SIZE - 1) {
            pairs.push([key, value]);
            this.size = ++data.size;
            return this;
          }
          data = this.__data__ = new MapCache(pairs);
        }
        data.set(key, value);
        this.size = data.size;
        return this;
      }
      Stack.prototype.clear = stackClear;
      Stack.prototype["delete"] = stackDelete;
      Stack.prototype.get = stackGet;
      Stack.prototype.has = stackHas;
      Stack.prototype.set = stackSet;
      function arrayLikeKeys(value, inherited) {
        var isArr = isArray2(value), isArg = !isArr && isArguments(value), isBuff = !isArr && !isArg && isBuffer(value), isType = !isArr && !isArg && !isBuff && isTypedArray(value), skipIndexes = isArr || isArg || isBuff || isType, result2 = skipIndexes ? baseTimes(value.length, String) : [], length = result2.length;
        for (var key in value) {
          if ((inherited || hasOwnProperty2.call(value, key)) && !(skipIndexes && (key == "length" || isBuff && (key == "offset" || key == "parent") || isType && (key == "buffer" || key == "byteLength" || key == "byteOffset") || isIndex(key, length)))) {
            result2.push(key);
          }
        }
        return result2;
      }
      function arraySample(array) {
        var length = array.length;
        return length ? array[baseRandom(0, length - 1)] : undefined$1;
      }
      function arraySampleSize(array, n) {
        return shuffleSelf(copyArray(array), baseClamp(n, 0, array.length));
      }
      function arrayShuffle(array) {
        return shuffleSelf(copyArray(array));
      }
      function assignMergeValue(object, key, value) {
        if (value !== undefined$1 && !eq(object[key], value) || value === undefined$1 && !(key in object)) {
          baseAssignValue(object, key, value);
        }
      }
      function assignValue(object, key, value) {
        var objValue = object[key];
        if (!(hasOwnProperty2.call(object, key) && eq(objValue, value)) || value === undefined$1 && !(key in object)) {
          baseAssignValue(object, key, value);
        }
      }
      function assocIndexOf(array, key) {
        var length = array.length;
        while (length--) {
          if (eq(array[length][0], key)) {
            return length;
          }
        }
        return -1;
      }
      function baseAggregator(collection, setter, iteratee2, accumulator) {
        baseEach(collection, function(value, key, collection2) {
          setter(accumulator, value, iteratee2(value), collection2);
        });
        return accumulator;
      }
      function baseAssign(object, source) {
        return object && copyObject(source, keys(source), object);
      }
      function baseAssignIn(object, source) {
        return object && copyObject(source, keysIn(source), object);
      }
      function baseAssignValue(object, key, value) {
        if (key == "__proto__" && defineProperty) {
          defineProperty(object, key, {
            "configurable": true,
            "enumerable": true,
            "value": value,
            "writable": true
          });
        } else {
          object[key] = value;
        }
      }
      function baseAt(object, paths) {
        var index2 = -1, length = paths.length, result2 = Array2(length), skip = object == null;
        while (++index2 < length) {
          result2[index2] = skip ? undefined$1 : get(object, paths[index2]);
        }
        return result2;
      }
      function baseClamp(number, lower, upper) {
        if (number === number) {
          if (upper !== undefined$1) {
            number = number <= upper ? number : upper;
          }
          if (lower !== undefined$1) {
            number = number >= lower ? number : lower;
          }
        }
        return number;
      }
      function baseClone(value, bitmask, customizer, key, object, stack) {
        var result2, isDeep = bitmask & CLONE_DEEP_FLAG, isFlat = bitmask & CLONE_FLAT_FLAG, isFull = bitmask & CLONE_SYMBOLS_FLAG;
        if (customizer) {
          result2 = object ? customizer(value, key, object, stack) : customizer(value);
        }
        if (result2 !== undefined$1) {
          return result2;
        }
        if (!isObject(value)) {
          return value;
        }
        var isArr = isArray2(value);
        if (isArr) {
          result2 = initCloneArray(value);
          if (!isDeep) {
            return copyArray(value, result2);
          }
        } else {
          var tag = getTag(value), isFunc = tag == funcTag || tag == genTag;
          if (isBuffer(value)) {
            return cloneBuffer(value, isDeep);
          }
          if (tag == objectTag || tag == argsTag || isFunc && !object) {
            result2 = isFlat || isFunc ? {} : initCloneObject(value);
            if (!isDeep) {
              return isFlat ? copySymbolsIn(value, baseAssignIn(result2, value)) : copySymbols(value, baseAssign(result2, value));
            }
          } else {
            if (!cloneableTags[tag]) {
              return object ? value : {};
            }
            result2 = initCloneByTag(value, tag, isDeep);
          }
        }
        stack || (stack = new Stack());
        var stacked = stack.get(value);
        if (stacked) {
          return stacked;
        }
        stack.set(value, result2);
        if (isSet(value)) {
          value.forEach(function(subValue) {
            result2.add(baseClone(subValue, bitmask, customizer, subValue, value, stack));
          });
        } else if (isMap(value)) {
          value.forEach(function(subValue, key2) {
            result2.set(key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
          });
        }
        var keysFunc = isFull ? isFlat ? getAllKeysIn : getAllKeys : isFlat ? keysIn : keys;
        var props = isArr ? undefined$1 : keysFunc(value);
        arrayEach(props || value, function(subValue, key2) {
          if (props) {
            key2 = subValue;
            subValue = value[key2];
          }
          assignValue(result2, key2, baseClone(subValue, bitmask, customizer, key2, value, stack));
        });
        return result2;
      }
      function baseConforms(source) {
        var props = keys(source);
        return function(object) {
          return baseConformsTo(object, source, props);
        };
      }
      function baseConformsTo(object, source, props) {
        var length = props.length;
        if (object == null) {
          return !length;
        }
        object = Object2(object);
        while (length--) {
          var key = props[length], predicate = source[key], value = object[key];
          if (value === undefined$1 && !(key in object) || !predicate(value)) {
            return false;
          }
        }
        return true;
      }
      function baseDelay(func, wait, args) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        return setTimeout(function() {
          func.apply(undefined$1, args);
        }, wait);
      }
      function baseDifference(array, values2, iteratee2, comparator) {
        var index2 = -1, includes2 = arrayIncludes, isCommon = true, length = array.length, result2 = [], valuesLength = values2.length;
        if (!length) {
          return result2;
        }
        if (iteratee2) {
          values2 = arrayMap2(values2, baseUnary(iteratee2));
        }
        if (comparator) {
          includes2 = arrayIncludesWith;
          isCommon = false;
        } else if (values2.length >= LARGE_ARRAY_SIZE) {
          includes2 = cacheHas;
          isCommon = false;
          values2 = new SetCache(values2);
        }
        outer:
          while (++index2 < length) {
            var value = array[index2], computed = iteratee2 == null ? value : iteratee2(value);
            value = comparator || value !== 0 ? value : 0;
            if (isCommon && computed === computed) {
              var valuesIndex = valuesLength;
              while (valuesIndex--) {
                if (values2[valuesIndex] === computed) {
                  continue outer;
                }
              }
              result2.push(value);
            } else if (!includes2(values2, computed, comparator)) {
              result2.push(value);
            }
          }
        return result2;
      }
      var baseEach = createBaseEach(baseForOwn);
      var baseEachRight = createBaseEach(baseForOwnRight, true);
      function baseEvery(collection, predicate) {
        var result2 = true;
        baseEach(collection, function(value, index2, collection2) {
          result2 = !!predicate(value, index2, collection2);
          return result2;
        });
        return result2;
      }
      function baseExtremum(array, iteratee2, comparator) {
        var index2 = -1, length = array.length;
        while (++index2 < length) {
          var value = array[index2], current = iteratee2(value);
          if (current != null && (computed === undefined$1 ? current === current && !isSymbol2(current) : comparator(current, computed))) {
            var computed = current, result2 = value;
          }
        }
        return result2;
      }
      function baseFill(array, value, start, end) {
        var length = array.length;
        start = toInteger(start);
        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }
        end = end === undefined$1 || end > length ? length : toInteger(end);
        if (end < 0) {
          end += length;
        }
        end = start > end ? 0 : toLength(end);
        while (start < end) {
          array[start++] = value;
        }
        return array;
      }
      function baseFilter(collection, predicate) {
        var result2 = [];
        baseEach(collection, function(value, index2, collection2) {
          if (predicate(value, index2, collection2)) {
            result2.push(value);
          }
        });
        return result2;
      }
      function baseFlatten(array, depth, predicate, isStrict, result2) {
        var index2 = -1, length = array.length;
        predicate || (predicate = isFlattenable);
        result2 || (result2 = []);
        while (++index2 < length) {
          var value = array[index2];
          if (depth > 0 && predicate(value)) {
            if (depth > 1) {
              baseFlatten(value, depth - 1, predicate, isStrict, result2);
            } else {
              arrayPush(result2, value);
            }
          } else if (!isStrict) {
            result2[result2.length] = value;
          }
        }
        return result2;
      }
      var baseFor = createBaseFor();
      var baseForRight = createBaseFor(true);
      function baseForOwn(object, iteratee2) {
        return object && baseFor(object, iteratee2, keys);
      }
      function baseForOwnRight(object, iteratee2) {
        return object && baseForRight(object, iteratee2, keys);
      }
      function baseFunctions(object, props) {
        return arrayFilter(props, function(key) {
          return isFunction(object[key]);
        });
      }
      function baseGet(object, path) {
        path = castPath(path, object);
        var index2 = 0, length = path.length;
        while (object != null && index2 < length) {
          object = object[toKey(path[index2++])];
        }
        return index2 && index2 == length ? object : undefined$1;
      }
      function baseGetAllKeys(object, keysFunc, symbolsFunc) {
        var result2 = keysFunc(object);
        return isArray2(object) ? result2 : arrayPush(result2, symbolsFunc(object));
      }
      function baseGetTag2(value) {
        if (value == null) {
          return value === undefined$1 ? undefinedTag2 : nullTag2;
        }
        return symToStringTag2 && symToStringTag2 in Object2(value) ? getRawTag2(value) : objectToString2(value);
      }
      function baseGt(value, other) {
        return value > other;
      }
      function baseHas(object, key) {
        return object != null && hasOwnProperty2.call(object, key);
      }
      function baseHasIn(object, key) {
        return object != null && key in Object2(object);
      }
      function baseInRange(number, start, end) {
        return number >= nativeMin(start, end) && number < nativeMax(start, end);
      }
      function baseIntersection(arrays, iteratee2, comparator) {
        var includes2 = comparator ? arrayIncludesWith : arrayIncludes, length = arrays[0].length, othLength = arrays.length, othIndex = othLength, caches = Array2(othLength), maxLength = Infinity, result2 = [];
        while (othIndex--) {
          var array = arrays[othIndex];
          if (othIndex && iteratee2) {
            array = arrayMap2(array, baseUnary(iteratee2));
          }
          maxLength = nativeMin(array.length, maxLength);
          caches[othIndex] = !comparator && (iteratee2 || length >= 120 && array.length >= 120) ? new SetCache(othIndex && array) : undefined$1;
        }
        array = arrays[0];
        var index2 = -1, seen = caches[0];
        outer:
          while (++index2 < length && result2.length < maxLength) {
            var value = array[index2], computed = iteratee2 ? iteratee2(value) : value;
            value = comparator || value !== 0 ? value : 0;
            if (!(seen ? cacheHas(seen, computed) : includes2(result2, computed, comparator))) {
              othIndex = othLength;
              while (--othIndex) {
                var cache = caches[othIndex];
                if (!(cache ? cacheHas(cache, computed) : includes2(arrays[othIndex], computed, comparator))) {
                  continue outer;
                }
              }
              if (seen) {
                seen.push(computed);
              }
              result2.push(value);
            }
          }
        return result2;
      }
      function baseInverter(object, setter, iteratee2, accumulator) {
        baseForOwn(object, function(value, key, object2) {
          setter(accumulator, iteratee2(value), key, object2);
        });
        return accumulator;
      }
      function baseInvoke(object, path, args) {
        path = castPath(path, object);
        object = parent(object, path);
        var func = object == null ? object : object[toKey(last(path))];
        return func == null ? undefined$1 : apply(func, object, args);
      }
      function baseIsArguments(value) {
        return isObjectLike2(value) && baseGetTag2(value) == argsTag;
      }
      function baseIsArrayBuffer(value) {
        return isObjectLike2(value) && baseGetTag2(value) == arrayBufferTag;
      }
      function baseIsDate(value) {
        return isObjectLike2(value) && baseGetTag2(value) == dateTag;
      }
      function baseIsEqual(value, other, bitmask, customizer, stack) {
        if (value === other) {
          return true;
        }
        if (value == null || other == null || !isObjectLike2(value) && !isObjectLike2(other)) {
          return value !== value && other !== other;
        }
        return baseIsEqualDeep(value, other, bitmask, customizer, baseIsEqual, stack);
      }
      function baseIsEqualDeep(object, other, bitmask, customizer, equalFunc, stack) {
        var objIsArr = isArray2(object), othIsArr = isArray2(other), objTag = objIsArr ? arrayTag : getTag(object), othTag = othIsArr ? arrayTag : getTag(other);
        objTag = objTag == argsTag ? objectTag : objTag;
        othTag = othTag == argsTag ? objectTag : othTag;
        var objIsObj = objTag == objectTag, othIsObj = othTag == objectTag, isSameTag = objTag == othTag;
        if (isSameTag && isBuffer(object)) {
          if (!isBuffer(other)) {
            return false;
          }
          objIsArr = true;
          objIsObj = false;
        }
        if (isSameTag && !objIsObj) {
          stack || (stack = new Stack());
          return objIsArr || isTypedArray(object) ? equalArrays(object, other, bitmask, customizer, equalFunc, stack) : equalByTag(object, other, objTag, bitmask, customizer, equalFunc, stack);
        }
        if (!(bitmask & COMPARE_PARTIAL_FLAG)) {
          var objIsWrapped = objIsObj && hasOwnProperty2.call(object, "__wrapped__"), othIsWrapped = othIsObj && hasOwnProperty2.call(other, "__wrapped__");
          if (objIsWrapped || othIsWrapped) {
            var objUnwrapped = objIsWrapped ? object.value() : object, othUnwrapped = othIsWrapped ? other.value() : other;
            stack || (stack = new Stack());
            return equalFunc(objUnwrapped, othUnwrapped, bitmask, customizer, stack);
          }
        }
        if (!isSameTag) {
          return false;
        }
        stack || (stack = new Stack());
        return equalObjects(object, other, bitmask, customizer, equalFunc, stack);
      }
      function baseIsMap(value) {
        return isObjectLike2(value) && getTag(value) == mapTag;
      }
      function baseIsMatch(object, source, matchData, customizer) {
        var index2 = matchData.length, length = index2, noCustomizer = !customizer;
        if (object == null) {
          return !length;
        }
        object = Object2(object);
        while (index2--) {
          var data = matchData[index2];
          if (noCustomizer && data[2] ? data[1] !== object[data[0]] : !(data[0] in object)) {
            return false;
          }
        }
        while (++index2 < length) {
          data = matchData[index2];
          var key = data[0], objValue = object[key], srcValue = data[1];
          if (noCustomizer && data[2]) {
            if (objValue === undefined$1 && !(key in object)) {
              return false;
            }
          } else {
            var stack = new Stack();
            if (customizer) {
              var result2 = customizer(objValue, srcValue, key, object, source, stack);
            }
            if (!(result2 === undefined$1 ? baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG, customizer, stack) : result2)) {
              return false;
            }
          }
        }
        return true;
      }
      function baseIsNative(value) {
        if (!isObject(value) || isMasked(value)) {
          return false;
        }
        var pattern = isFunction(value) ? reIsNative : reIsHostCtor;
        return pattern.test(toSource(value));
      }
      function baseIsRegExp(value) {
        return isObjectLike2(value) && baseGetTag2(value) == regexpTag;
      }
      function baseIsSet(value) {
        return isObjectLike2(value) && getTag(value) == setTag;
      }
      function baseIsTypedArray(value) {
        return isObjectLike2(value) && isLength(value.length) && !!typedArrayTags[baseGetTag2(value)];
      }
      function baseIteratee(value) {
        if (typeof value == "function") {
          return value;
        }
        if (value == null) {
          return identity;
        }
        if (typeof value == "object") {
          return isArray2(value) ? baseMatchesProperty(value[0], value[1]) : baseMatches(value);
        }
        return property(value);
      }
      function baseKeys(object) {
        if (!isPrototype(object)) {
          return nativeKeys(object);
        }
        var result2 = [];
        for (var key in Object2(object)) {
          if (hasOwnProperty2.call(object, key) && key != "constructor") {
            result2.push(key);
          }
        }
        return result2;
      }
      function baseKeysIn(object) {
        if (!isObject(object)) {
          return nativeKeysIn(object);
        }
        var isProto = isPrototype(object), result2 = [];
        for (var key in object) {
          if (!(key == "constructor" && (isProto || !hasOwnProperty2.call(object, key)))) {
            result2.push(key);
          }
        }
        return result2;
      }
      function baseLt(value, other) {
        return value < other;
      }
      function baseMap(collection, iteratee2) {
        var index2 = -1, result2 = isArrayLike(collection) ? Array2(collection.length) : [];
        baseEach(collection, function(value, key, collection2) {
          result2[++index2] = iteratee2(value, key, collection2);
        });
        return result2;
      }
      function baseMatches(source) {
        var matchData = getMatchData(source);
        if (matchData.length == 1 && matchData[0][2]) {
          return matchesStrictComparable(matchData[0][0], matchData[0][1]);
        }
        return function(object) {
          return object === source || baseIsMatch(object, source, matchData);
        };
      }
      function baseMatchesProperty(path, srcValue) {
        if (isKey(path) && isStrictComparable(srcValue)) {
          return matchesStrictComparable(toKey(path), srcValue);
        }
        return function(object) {
          var objValue = get(object, path);
          return objValue === undefined$1 && objValue === srcValue ? hasIn(object, path) : baseIsEqual(srcValue, objValue, COMPARE_PARTIAL_FLAG | COMPARE_UNORDERED_FLAG);
        };
      }
      function baseMerge(object, source, srcIndex, customizer, stack) {
        if (object === source) {
          return;
        }
        baseFor(source, function(srcValue, key) {
          stack || (stack = new Stack());
          if (isObject(srcValue)) {
            baseMergeDeep(object, source, key, srcIndex, baseMerge, customizer, stack);
          } else {
            var newValue = customizer ? customizer(safeGet(object, key), srcValue, key + "", object, source, stack) : undefined$1;
            if (newValue === undefined$1) {
              newValue = srcValue;
            }
            assignMergeValue(object, key, newValue);
          }
        }, keysIn);
      }
      function baseMergeDeep(object, source, key, srcIndex, mergeFunc, customizer, stack) {
        var objValue = safeGet(object, key), srcValue = safeGet(source, key), stacked = stack.get(srcValue);
        if (stacked) {
          assignMergeValue(object, key, stacked);
          return;
        }
        var newValue = customizer ? customizer(objValue, srcValue, key + "", object, source, stack) : undefined$1;
        var isCommon = newValue === undefined$1;
        if (isCommon) {
          var isArr = isArray2(srcValue), isBuff = !isArr && isBuffer(srcValue), isTyped = !isArr && !isBuff && isTypedArray(srcValue);
          newValue = srcValue;
          if (isArr || isBuff || isTyped) {
            if (isArray2(objValue)) {
              newValue = objValue;
            } else if (isArrayLikeObject(objValue)) {
              newValue = copyArray(objValue);
            } else if (isBuff) {
              isCommon = false;
              newValue = cloneBuffer(srcValue, true);
            } else if (isTyped) {
              isCommon = false;
              newValue = cloneTypedArray(srcValue, true);
            } else {
              newValue = [];
            }
          } else if (isPlainObject(srcValue) || isArguments(srcValue)) {
            newValue = objValue;
            if (isArguments(objValue)) {
              newValue = toPlainObject(objValue);
            } else if (!isObject(objValue) || isFunction(objValue)) {
              newValue = initCloneObject(srcValue);
            }
          } else {
            isCommon = false;
          }
        }
        if (isCommon) {
          stack.set(srcValue, newValue);
          mergeFunc(newValue, srcValue, srcIndex, customizer, stack);
          stack["delete"](srcValue);
        }
        assignMergeValue(object, key, newValue);
      }
      function baseNth(array, n) {
        var length = array.length;
        if (!length) {
          return;
        }
        n += n < 0 ? length : 0;
        return isIndex(n, length) ? array[n] : undefined$1;
      }
      function baseOrderBy(collection, iteratees, orders) {
        if (iteratees.length) {
          iteratees = arrayMap2(iteratees, function(iteratee2) {
            if (isArray2(iteratee2)) {
              return function(value) {
                return baseGet(value, iteratee2.length === 1 ? iteratee2[0] : iteratee2);
              };
            }
            return iteratee2;
          });
        } else {
          iteratees = [identity];
        }
        var index2 = -1;
        iteratees = arrayMap2(iteratees, baseUnary(getIteratee()));
        var result2 = baseMap(collection, function(value, key, collection2) {
          var criteria = arrayMap2(iteratees, function(iteratee2) {
            return iteratee2(value);
          });
          return { "criteria": criteria, "index": ++index2, "value": value };
        });
        return baseSortBy(result2, function(object, other) {
          return compareMultiple(object, other, orders);
        });
      }
      function basePick(object, paths) {
        return basePickBy(object, paths, function(value, path) {
          return hasIn(object, path);
        });
      }
      function basePickBy(object, paths, predicate) {
        var index2 = -1, length = paths.length, result2 = {};
        while (++index2 < length) {
          var path = paths[index2], value = baseGet(object, path);
          if (predicate(value, path)) {
            baseSet(result2, castPath(path, object), value);
          }
        }
        return result2;
      }
      function basePropertyDeep(path) {
        return function(object) {
          return baseGet(object, path);
        };
      }
      function basePullAll(array, values2, iteratee2, comparator) {
        var indexOf2 = comparator ? baseIndexOfWith : baseIndexOf, index2 = -1, length = values2.length, seen = array;
        if (array === values2) {
          values2 = copyArray(values2);
        }
        if (iteratee2) {
          seen = arrayMap2(array, baseUnary(iteratee2));
        }
        while (++index2 < length) {
          var fromIndex = 0, value = values2[index2], computed = iteratee2 ? iteratee2(value) : value;
          while ((fromIndex = indexOf2(seen, computed, fromIndex, comparator)) > -1) {
            if (seen !== array) {
              splice.call(seen, fromIndex, 1);
            }
            splice.call(array, fromIndex, 1);
          }
        }
        return array;
      }
      function basePullAt(array, indexes) {
        var length = array ? indexes.length : 0, lastIndex = length - 1;
        while (length--) {
          var index2 = indexes[length];
          if (length == lastIndex || index2 !== previous) {
            var previous = index2;
            if (isIndex(index2)) {
              splice.call(array, index2, 1);
            } else {
              baseUnset(array, index2);
            }
          }
        }
        return array;
      }
      function baseRandom(lower, upper) {
        return lower + nativeFloor(nativeRandom() * (upper - lower + 1));
      }
      function baseRange(start, end, step, fromRight) {
        var index2 = -1, length = nativeMax(nativeCeil((end - start) / (step || 1)), 0), result2 = Array2(length);
        while (length--) {
          result2[fromRight ? length : ++index2] = start;
          start += step;
        }
        return result2;
      }
      function baseRepeat(string, n) {
        var result2 = "";
        if (!string || n < 1 || n > MAX_SAFE_INTEGER) {
          return result2;
        }
        do {
          if (n % 2) {
            result2 += string;
          }
          n = nativeFloor(n / 2);
          if (n) {
            string += string;
          }
        } while (n);
        return result2;
      }
      function baseRest(func, start) {
        return setToString(overRest(func, start, identity), func + "");
      }
      function baseSample(collection) {
        return arraySample(values(collection));
      }
      function baseSampleSize(collection, n) {
        var array = values(collection);
        return shuffleSelf(array, baseClamp(n, 0, array.length));
      }
      function baseSet(object, path, value, customizer) {
        if (!isObject(object)) {
          return object;
        }
        path = castPath(path, object);
        var index2 = -1, length = path.length, lastIndex = length - 1, nested = object;
        while (nested != null && ++index2 < length) {
          var key = toKey(path[index2]), newValue = value;
          if (key === "__proto__" || key === "constructor" || key === "prototype") {
            return object;
          }
          if (index2 != lastIndex) {
            var objValue = nested[key];
            newValue = customizer ? customizer(objValue, key, nested) : undefined$1;
            if (newValue === undefined$1) {
              newValue = isObject(objValue) ? objValue : isIndex(path[index2 + 1]) ? [] : {};
            }
          }
          assignValue(nested, key, newValue);
          nested = nested[key];
        }
        return object;
      }
      var baseSetData = !metaMap ? identity : function(func, data) {
        metaMap.set(func, data);
        return func;
      };
      var baseSetToString = !defineProperty ? identity : function(func, string) {
        return defineProperty(func, "toString", {
          "configurable": true,
          "enumerable": false,
          "value": constant(string),
          "writable": true
        });
      };
      function baseShuffle(collection) {
        return shuffleSelf(values(collection));
      }
      function baseSlice(array, start, end) {
        var index2 = -1, length = array.length;
        if (start < 0) {
          start = -start > length ? 0 : length + start;
        }
        end = end > length ? length : end;
        if (end < 0) {
          end += length;
        }
        length = start > end ? 0 : end - start >>> 0;
        start >>>= 0;
        var result2 = Array2(length);
        while (++index2 < length) {
          result2[index2] = array[index2 + start];
        }
        return result2;
      }
      function baseSome(collection, predicate) {
        var result2;
        baseEach(collection, function(value, index2, collection2) {
          result2 = predicate(value, index2, collection2);
          return !result2;
        });
        return !!result2;
      }
      function baseSortedIndex(array, value, retHighest) {
        var low = 0, high = array == null ? low : array.length;
        if (typeof value == "number" && value === value && high <= HALF_MAX_ARRAY_LENGTH) {
          while (low < high) {
            var mid = low + high >>> 1, computed = array[mid];
            if (computed !== null && !isSymbol2(computed) && (retHighest ? computed <= value : computed < value)) {
              low = mid + 1;
            } else {
              high = mid;
            }
          }
          return high;
        }
        return baseSortedIndexBy(array, value, identity, retHighest);
      }
      function baseSortedIndexBy(array, value, iteratee2, retHighest) {
        var low = 0, high = array == null ? 0 : array.length;
        if (high === 0) {
          return 0;
        }
        value = iteratee2(value);
        var valIsNaN = value !== value, valIsNull = value === null, valIsSymbol = isSymbol2(value), valIsUndefined = value === undefined$1;
        while (low < high) {
          var mid = nativeFloor((low + high) / 2), computed = iteratee2(array[mid]), othIsDefined = computed !== undefined$1, othIsNull = computed === null, othIsReflexive = computed === computed, othIsSymbol = isSymbol2(computed);
          if (valIsNaN) {
            var setLow = retHighest || othIsReflexive;
          } else if (valIsUndefined) {
            setLow = othIsReflexive && (retHighest || othIsDefined);
          } else if (valIsNull) {
            setLow = othIsReflexive && othIsDefined && (retHighest || !othIsNull);
          } else if (valIsSymbol) {
            setLow = othIsReflexive && othIsDefined && !othIsNull && (retHighest || !othIsSymbol);
          } else if (othIsNull || othIsSymbol) {
            setLow = false;
          } else {
            setLow = retHighest ? computed <= value : computed < value;
          }
          if (setLow) {
            low = mid + 1;
          } else {
            high = mid;
          }
        }
        return nativeMin(high, MAX_ARRAY_INDEX);
      }
      function baseSortedUniq(array, iteratee2) {
        var index2 = -1, length = array.length, resIndex = 0, result2 = [];
        while (++index2 < length) {
          var value = array[index2], computed = iteratee2 ? iteratee2(value) : value;
          if (!index2 || !eq(computed, seen)) {
            var seen = computed;
            result2[resIndex++] = value === 0 ? 0 : value;
          }
        }
        return result2;
      }
      function baseToNumber(value) {
        if (typeof value == "number") {
          return value;
        }
        if (isSymbol2(value)) {
          return NAN;
        }
        return +value;
      }
      function baseToString2(value) {
        if (typeof value == "string") {
          return value;
        }
        if (isArray2(value)) {
          return arrayMap2(value, baseToString2) + "";
        }
        if (isSymbol2(value)) {
          return symbolToString2 ? symbolToString2.call(value) : "";
        }
        var result2 = value + "";
        return result2 == "0" && 1 / value == -INFINITY2 ? "-0" : result2;
      }
      function baseUniq(array, iteratee2, comparator) {
        var index2 = -1, includes2 = arrayIncludes, length = array.length, isCommon = true, result2 = [], seen = result2;
        if (comparator) {
          isCommon = false;
          includes2 = arrayIncludesWith;
        } else if (length >= LARGE_ARRAY_SIZE) {
          var set2 = iteratee2 ? null : createSet(array);
          if (set2) {
            return setToArray(set2);
          }
          isCommon = false;
          includes2 = cacheHas;
          seen = new SetCache();
        } else {
          seen = iteratee2 ? [] : result2;
        }
        outer:
          while (++index2 < length) {
            var value = array[index2], computed = iteratee2 ? iteratee2(value) : value;
            value = comparator || value !== 0 ? value : 0;
            if (isCommon && computed === computed) {
              var seenIndex = seen.length;
              while (seenIndex--) {
                if (seen[seenIndex] === computed) {
                  continue outer;
                }
              }
              if (iteratee2) {
                seen.push(computed);
              }
              result2.push(value);
            } else if (!includes2(seen, computed, comparator)) {
              if (seen !== result2) {
                seen.push(computed);
              }
              result2.push(value);
            }
          }
        return result2;
      }
      function baseUnset(object, path) {
        path = castPath(path, object);
        object = parent(object, path);
        return object == null || delete object[toKey(last(path))];
      }
      function baseUpdate(object, path, updater, customizer) {
        return baseSet(object, path, updater(baseGet(object, path)), customizer);
      }
      function baseWhile(array, predicate, isDrop, fromRight) {
        var length = array.length, index2 = fromRight ? length : -1;
        while ((fromRight ? index2-- : ++index2 < length) && predicate(array[index2], index2, array)) {
        }
        return isDrop ? baseSlice(array, fromRight ? 0 : index2, fromRight ? index2 + 1 : length) : baseSlice(array, fromRight ? index2 + 1 : 0, fromRight ? length : index2);
      }
      function baseWrapperValue(value, actions) {
        var result2 = value;
        if (result2 instanceof LazyWrapper) {
          result2 = result2.value();
        }
        return arrayReduce(actions, function(result3, action) {
          return action.func.apply(action.thisArg, arrayPush([result3], action.args));
        }, result2);
      }
      function baseXor(arrays, iteratee2, comparator) {
        var length = arrays.length;
        if (length < 2) {
          return length ? baseUniq(arrays[0]) : [];
        }
        var index2 = -1, result2 = Array2(length);
        while (++index2 < length) {
          var array = arrays[index2], othIndex = -1;
          while (++othIndex < length) {
            if (othIndex != index2) {
              result2[index2] = baseDifference(result2[index2] || array, arrays[othIndex], iteratee2, comparator);
            }
          }
        }
        return baseUniq(baseFlatten(result2, 1), iteratee2, comparator);
      }
      function baseZipObject(props, values2, assignFunc) {
        var index2 = -1, length = props.length, valsLength = values2.length, result2 = {};
        while (++index2 < length) {
          var value = index2 < valsLength ? values2[index2] : undefined$1;
          assignFunc(result2, props[index2], value);
        }
        return result2;
      }
      function castArrayLikeObject(value) {
        return isArrayLikeObject(value) ? value : [];
      }
      function castFunction(value) {
        return typeof value == "function" ? value : identity;
      }
      function castPath(value, object) {
        if (isArray2(value)) {
          return value;
        }
        return isKey(value, object) ? [value] : stringToPath(toString2(value));
      }
      var castRest = baseRest;
      function castSlice(array, start, end) {
        var length = array.length;
        end = end === undefined$1 ? length : end;
        return !start && end >= length ? array : baseSlice(array, start, end);
      }
      var clearTimeout = ctxClearTimeout || function(id2) {
        return root2.clearTimeout(id2);
      };
      function cloneBuffer(buffer, isDeep) {
        if (isDeep) {
          return buffer.slice();
        }
        var length = buffer.length, result2 = allocUnsafe ? allocUnsafe(length) : new buffer.constructor(length);
        buffer.copy(result2);
        return result2;
      }
      function cloneArrayBuffer(arrayBuffer) {
        var result2 = new arrayBuffer.constructor(arrayBuffer.byteLength);
        new Uint8Array2(result2).set(new Uint8Array2(arrayBuffer));
        return result2;
      }
      function cloneDataView(dataView, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(dataView.buffer) : dataView.buffer;
        return new dataView.constructor(buffer, dataView.byteOffset, dataView.byteLength);
      }
      function cloneRegExp(regexp) {
        var result2 = new regexp.constructor(regexp.source, reFlags.exec(regexp));
        result2.lastIndex = regexp.lastIndex;
        return result2;
      }
      function cloneSymbol(symbol) {
        return symbolValueOf ? Object2(symbolValueOf.call(symbol)) : {};
      }
      function cloneTypedArray(typedArray, isDeep) {
        var buffer = isDeep ? cloneArrayBuffer(typedArray.buffer) : typedArray.buffer;
        return new typedArray.constructor(buffer, typedArray.byteOffset, typedArray.length);
      }
      function compareAscending(value, other) {
        if (value !== other) {
          var valIsDefined = value !== undefined$1, valIsNull = value === null, valIsReflexive = value === value, valIsSymbol = isSymbol2(value);
          var othIsDefined = other !== undefined$1, othIsNull = other === null, othIsReflexive = other === other, othIsSymbol = isSymbol2(other);
          if (!othIsNull && !othIsSymbol && !valIsSymbol && value > other || valIsSymbol && othIsDefined && othIsReflexive && !othIsNull && !othIsSymbol || valIsNull && othIsDefined && othIsReflexive || !valIsDefined && othIsReflexive || !valIsReflexive) {
            return 1;
          }
          if (!valIsNull && !valIsSymbol && !othIsSymbol && value < other || othIsSymbol && valIsDefined && valIsReflexive && !valIsNull && !valIsSymbol || othIsNull && valIsDefined && valIsReflexive || !othIsDefined && valIsReflexive || !othIsReflexive) {
            return -1;
          }
        }
        return 0;
      }
      function compareMultiple(object, other, orders) {
        var index2 = -1, objCriteria = object.criteria, othCriteria = other.criteria, length = objCriteria.length, ordersLength = orders.length;
        while (++index2 < length) {
          var result2 = compareAscending(objCriteria[index2], othCriteria[index2]);
          if (result2) {
            if (index2 >= ordersLength) {
              return result2;
            }
            var order = orders[index2];
            return result2 * (order == "desc" ? -1 : 1);
          }
        }
        return object.index - other.index;
      }
      function composeArgs(args, partials, holders, isCurried) {
        var argsIndex = -1, argsLength = args.length, holdersLength = holders.length, leftIndex = -1, leftLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(leftLength + rangeLength), isUncurried = !isCurried;
        while (++leftIndex < leftLength) {
          result2[leftIndex] = partials[leftIndex];
        }
        while (++argsIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result2[holders[argsIndex]] = args[argsIndex];
          }
        }
        while (rangeLength--) {
          result2[leftIndex++] = args[argsIndex++];
        }
        return result2;
      }
      function composeArgsRight(args, partials, holders, isCurried) {
        var argsIndex = -1, argsLength = args.length, holdersIndex = -1, holdersLength = holders.length, rightIndex = -1, rightLength = partials.length, rangeLength = nativeMax(argsLength - holdersLength, 0), result2 = Array2(rangeLength + rightLength), isUncurried = !isCurried;
        while (++argsIndex < rangeLength) {
          result2[argsIndex] = args[argsIndex];
        }
        var offset = argsIndex;
        while (++rightIndex < rightLength) {
          result2[offset + rightIndex] = partials[rightIndex];
        }
        while (++holdersIndex < holdersLength) {
          if (isUncurried || argsIndex < argsLength) {
            result2[offset + holders[holdersIndex]] = args[argsIndex++];
          }
        }
        return result2;
      }
      function copyArray(source, array) {
        var index2 = -1, length = source.length;
        array || (array = Array2(length));
        while (++index2 < length) {
          array[index2] = source[index2];
        }
        return array;
      }
      function copyObject(source, props, object, customizer) {
        var isNew = !object;
        object || (object = {});
        var index2 = -1, length = props.length;
        while (++index2 < length) {
          var key = props[index2];
          var newValue = customizer ? customizer(object[key], source[key], key, object, source) : undefined$1;
          if (newValue === undefined$1) {
            newValue = source[key];
          }
          if (isNew) {
            baseAssignValue(object, key, newValue);
          } else {
            assignValue(object, key, newValue);
          }
        }
        return object;
      }
      function copySymbols(source, object) {
        return copyObject(source, getSymbols(source), object);
      }
      function copySymbolsIn(source, object) {
        return copyObject(source, getSymbolsIn(source), object);
      }
      function createAggregator(setter, initializer) {
        return function(collection, iteratee2) {
          var func = isArray2(collection) ? arrayAggregator : baseAggregator, accumulator = initializer ? initializer() : {};
          return func(collection, setter, getIteratee(iteratee2, 2), accumulator);
        };
      }
      function createAssigner(assigner) {
        return baseRest(function(object, sources) {
          var index2 = -1, length = sources.length, customizer = length > 1 ? sources[length - 1] : undefined$1, guard = length > 2 ? sources[2] : undefined$1;
          customizer = assigner.length > 3 && typeof customizer == "function" ? (length--, customizer) : undefined$1;
          if (guard && isIterateeCall(sources[0], sources[1], guard)) {
            customizer = length < 3 ? undefined$1 : customizer;
            length = 1;
          }
          object = Object2(object);
          while (++index2 < length) {
            var source = sources[index2];
            if (source) {
              assigner(object, source, index2, customizer);
            }
          }
          return object;
        });
      }
      function createBaseEach(eachFunc, fromRight) {
        return function(collection, iteratee2) {
          if (collection == null) {
            return collection;
          }
          if (!isArrayLike(collection)) {
            return eachFunc(collection, iteratee2);
          }
          var length = collection.length, index2 = fromRight ? length : -1, iterable = Object2(collection);
          while (fromRight ? index2-- : ++index2 < length) {
            if (iteratee2(iterable[index2], index2, iterable) === false) {
              break;
            }
          }
          return collection;
        };
      }
      function createBaseFor(fromRight) {
        return function(object, iteratee2, keysFunc) {
          var index2 = -1, iterable = Object2(object), props = keysFunc(object), length = props.length;
          while (length--) {
            var key = props[fromRight ? length : ++index2];
            if (iteratee2(iterable[key], key, iterable) === false) {
              break;
            }
          }
          return object;
        };
      }
      function createBind(func, bitmask, thisArg) {
        var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
        function wrapper() {
          var fn = this && this !== root2 && this instanceof wrapper ? Ctor : func;
          return fn.apply(isBind ? thisArg : this, arguments);
        }
        return wrapper;
      }
      function createCaseFirst(methodName) {
        return function(string) {
          string = toString2(string);
          var strSymbols = hasUnicode(string) ? stringToArray(string) : undefined$1;
          var chr = strSymbols ? strSymbols[0] : string.charAt(0);
          var trailing = strSymbols ? castSlice(strSymbols, 1).join("") : string.slice(1);
          return chr[methodName]() + trailing;
        };
      }
      function createCompounder(callback) {
        return function(string) {
          return arrayReduce(words(deburr(string).replace(reApos, "")), callback, "");
        };
      }
      function createCtor(Ctor) {
        return function() {
          var args = arguments;
          switch (args.length) {
            case 0:
              return new Ctor();
            case 1:
              return new Ctor(args[0]);
            case 2:
              return new Ctor(args[0], args[1]);
            case 3:
              return new Ctor(args[0], args[1], args[2]);
            case 4:
              return new Ctor(args[0], args[1], args[2], args[3]);
            case 5:
              return new Ctor(args[0], args[1], args[2], args[3], args[4]);
            case 6:
              return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5]);
            case 7:
              return new Ctor(args[0], args[1], args[2], args[3], args[4], args[5], args[6]);
          }
          var thisBinding = baseCreate(Ctor.prototype), result2 = Ctor.apply(thisBinding, args);
          return isObject(result2) ? result2 : thisBinding;
        };
      }
      function createCurry(func, bitmask, arity) {
        var Ctor = createCtor(func);
        function wrapper() {
          var length = arguments.length, args = Array2(length), index2 = length, placeholder = getHolder(wrapper);
          while (index2--) {
            args[index2] = arguments[index2];
          }
          var holders = length < 3 && args[0] !== placeholder && args[length - 1] !== placeholder ? [] : replaceHolders(args, placeholder);
          length -= holders.length;
          if (length < arity) {
            return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, undefined$1, args, holders, undefined$1, undefined$1, arity - length);
          }
          var fn = this && this !== root2 && this instanceof wrapper ? Ctor : func;
          return apply(fn, this, args);
        }
        return wrapper;
      }
      function createFind(findIndexFunc) {
        return function(collection, predicate, fromIndex) {
          var iterable = Object2(collection);
          if (!isArrayLike(collection)) {
            var iteratee2 = getIteratee(predicate, 3);
            collection = keys(collection);
            predicate = function(key) {
              return iteratee2(iterable[key], key, iterable);
            };
          }
          var index2 = findIndexFunc(collection, predicate, fromIndex);
          return index2 > -1 ? iterable[iteratee2 ? collection[index2] : index2] : undefined$1;
        };
      }
      function createFlow(fromRight) {
        return flatRest(function(funcs) {
          var length = funcs.length, index2 = length, prereq = LodashWrapper.prototype.thru;
          if (fromRight) {
            funcs.reverse();
          }
          while (index2--) {
            var func = funcs[index2];
            if (typeof func != "function") {
              throw new TypeError2(FUNC_ERROR_TEXT);
            }
            if (prereq && !wrapper && getFuncName(func) == "wrapper") {
              var wrapper = new LodashWrapper([], true);
            }
          }
          index2 = wrapper ? index2 : length;
          while (++index2 < length) {
            func = funcs[index2];
            var funcName = getFuncName(func), data = funcName == "wrapper" ? getData(func) : undefined$1;
            if (data && isLaziable(data[0]) && data[1] == (WRAP_ARY_FLAG | WRAP_CURRY_FLAG | WRAP_PARTIAL_FLAG | WRAP_REARG_FLAG) && !data[4].length && data[9] == 1) {
              wrapper = wrapper[getFuncName(data[0])].apply(wrapper, data[3]);
            } else {
              wrapper = func.length == 1 && isLaziable(func) ? wrapper[funcName]() : wrapper.thru(func);
            }
          }
          return function() {
            var args = arguments, value = args[0];
            if (wrapper && args.length == 1 && isArray2(value)) {
              return wrapper.plant(value).value();
            }
            var index3 = 0, result2 = length ? funcs[index3].apply(this, args) : value;
            while (++index3 < length) {
              result2 = funcs[index3].call(this, result2);
            }
            return result2;
          };
        });
      }
      function createHybrid(func, bitmask, thisArg, partials, holders, partialsRight, holdersRight, argPos, ary2, arity) {
        var isAry = bitmask & WRAP_ARY_FLAG, isBind = bitmask & WRAP_BIND_FLAG, isBindKey = bitmask & WRAP_BIND_KEY_FLAG, isCurried = bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG), isFlip = bitmask & WRAP_FLIP_FLAG, Ctor = isBindKey ? undefined$1 : createCtor(func);
        function wrapper() {
          var length = arguments.length, args = Array2(length), index2 = length;
          while (index2--) {
            args[index2] = arguments[index2];
          }
          if (isCurried) {
            var placeholder = getHolder(wrapper), holdersCount = countHolders(args, placeholder);
          }
          if (partials) {
            args = composeArgs(args, partials, holders, isCurried);
          }
          if (partialsRight) {
            args = composeArgsRight(args, partialsRight, holdersRight, isCurried);
          }
          length -= holdersCount;
          if (isCurried && length < arity) {
            var newHolders = replaceHolders(args, placeholder);
            return createRecurry(func, bitmask, createHybrid, wrapper.placeholder, thisArg, args, newHolders, argPos, ary2, arity - length);
          }
          var thisBinding = isBind ? thisArg : this, fn = isBindKey ? thisBinding[func] : func;
          length = args.length;
          if (argPos) {
            args = reorder(args, argPos);
          } else if (isFlip && length > 1) {
            args.reverse();
          }
          if (isAry && ary2 < length) {
            args.length = ary2;
          }
          if (this && this !== root2 && this instanceof wrapper) {
            fn = Ctor || createCtor(fn);
          }
          return fn.apply(thisBinding, args);
        }
        return wrapper;
      }
      function createInverter(setter, toIteratee) {
        return function(object, iteratee2) {
          return baseInverter(object, setter, toIteratee(iteratee2), {});
        };
      }
      function createMathOperation(operator, defaultValue) {
        return function(value, other) {
          var result2;
          if (value === undefined$1 && other === undefined$1) {
            return defaultValue;
          }
          if (value !== undefined$1) {
            result2 = value;
          }
          if (other !== undefined$1) {
            if (result2 === undefined$1) {
              return other;
            }
            if (typeof value == "string" || typeof other == "string") {
              value = baseToString2(value);
              other = baseToString2(other);
            } else {
              value = baseToNumber(value);
              other = baseToNumber(other);
            }
            result2 = operator(value, other);
          }
          return result2;
        };
      }
      function createOver(arrayFunc) {
        return flatRest(function(iteratees) {
          iteratees = arrayMap2(iteratees, baseUnary(getIteratee()));
          return baseRest(function(args) {
            var thisArg = this;
            return arrayFunc(iteratees, function(iteratee2) {
              return apply(iteratee2, thisArg, args);
            });
          });
        });
      }
      function createPadding(length, chars) {
        chars = chars === undefined$1 ? " " : baseToString2(chars);
        var charsLength = chars.length;
        if (charsLength < 2) {
          return charsLength ? baseRepeat(chars, length) : chars;
        }
        var result2 = baseRepeat(chars, nativeCeil(length / stringSize(chars)));
        return hasUnicode(chars) ? castSlice(stringToArray(result2), 0, length).join("") : result2.slice(0, length);
      }
      function createPartial(func, bitmask, thisArg, partials) {
        var isBind = bitmask & WRAP_BIND_FLAG, Ctor = createCtor(func);
        function wrapper() {
          var argsIndex = -1, argsLength = arguments.length, leftIndex = -1, leftLength = partials.length, args = Array2(leftLength + argsLength), fn = this && this !== root2 && this instanceof wrapper ? Ctor : func;
          while (++leftIndex < leftLength) {
            args[leftIndex] = partials[leftIndex];
          }
          while (argsLength--) {
            args[leftIndex++] = arguments[++argsIndex];
          }
          return apply(fn, isBind ? thisArg : this, args);
        }
        return wrapper;
      }
      function createRange(fromRight) {
        return function(start, end, step) {
          if (step && typeof step != "number" && isIterateeCall(start, end, step)) {
            end = step = undefined$1;
          }
          start = toFinite(start);
          if (end === undefined$1) {
            end = start;
            start = 0;
          } else {
            end = toFinite(end);
          }
          step = step === undefined$1 ? start < end ? 1 : -1 : toFinite(step);
          return baseRange(start, end, step, fromRight);
        };
      }
      function createRelationalOperation(operator) {
        return function(value, other) {
          if (!(typeof value == "string" && typeof other == "string")) {
            value = toNumber(value);
            other = toNumber(other);
          }
          return operator(value, other);
        };
      }
      function createRecurry(func, bitmask, wrapFunc, placeholder, thisArg, partials, holders, argPos, ary2, arity) {
        var isCurry = bitmask & WRAP_CURRY_FLAG, newHolders = isCurry ? holders : undefined$1, newHoldersRight = isCurry ? undefined$1 : holders, newPartials = isCurry ? partials : undefined$1, newPartialsRight = isCurry ? undefined$1 : partials;
        bitmask |= isCurry ? WRAP_PARTIAL_FLAG : WRAP_PARTIAL_RIGHT_FLAG;
        bitmask &= ~(isCurry ? WRAP_PARTIAL_RIGHT_FLAG : WRAP_PARTIAL_FLAG);
        if (!(bitmask & WRAP_CURRY_BOUND_FLAG)) {
          bitmask &= ~(WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG);
        }
        var newData = [
          func,
          bitmask,
          thisArg,
          newPartials,
          newHolders,
          newPartialsRight,
          newHoldersRight,
          argPos,
          ary2,
          arity
        ];
        var result2 = wrapFunc.apply(undefined$1, newData);
        if (isLaziable(func)) {
          setData(result2, newData);
        }
        result2.placeholder = placeholder;
        return setWrapToString(result2, func, bitmask);
      }
      function createRound(methodName) {
        var func = Math2[methodName];
        return function(number, precision) {
          number = toNumber(number);
          precision = precision == null ? 0 : nativeMin(toInteger(precision), 292);
          if (precision && nativeIsFinite(number)) {
            var pair = (toString2(number) + "e").split("e"), value = func(pair[0] + "e" + (+pair[1] + precision));
            pair = (toString2(value) + "e").split("e");
            return +(pair[0] + "e" + (+pair[1] - precision));
          }
          return func(number);
        };
      }
      var createSet = !(Set && 1 / setToArray(new Set([, -0]))[1] == INFINITY2) ? noop : function(values2) {
        return new Set(values2);
      };
      function createToPairs(keysFunc) {
        return function(object) {
          var tag = getTag(object);
          if (tag == mapTag) {
            return mapToArray(object);
          }
          if (tag == setTag) {
            return setToPairs(object);
          }
          return baseToPairs(object, keysFunc(object));
        };
      }
      function createWrap(func, bitmask, thisArg, partials, holders, argPos, ary2, arity) {
        var isBindKey = bitmask & WRAP_BIND_KEY_FLAG;
        if (!isBindKey && typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        var length = partials ? partials.length : 0;
        if (!length) {
          bitmask &= ~(WRAP_PARTIAL_FLAG | WRAP_PARTIAL_RIGHT_FLAG);
          partials = holders = undefined$1;
        }
        ary2 = ary2 === undefined$1 ? ary2 : nativeMax(toInteger(ary2), 0);
        arity = arity === undefined$1 ? arity : toInteger(arity);
        length -= holders ? holders.length : 0;
        if (bitmask & WRAP_PARTIAL_RIGHT_FLAG) {
          var partialsRight = partials, holdersRight = holders;
          partials = holders = undefined$1;
        }
        var data = isBindKey ? undefined$1 : getData(func);
        var newData = [
          func,
          bitmask,
          thisArg,
          partials,
          holders,
          partialsRight,
          holdersRight,
          argPos,
          ary2,
          arity
        ];
        if (data) {
          mergeData(newData, data);
        }
        func = newData[0];
        bitmask = newData[1];
        thisArg = newData[2];
        partials = newData[3];
        holders = newData[4];
        arity = newData[9] = newData[9] === undefined$1 ? isBindKey ? 0 : func.length : nativeMax(newData[9] - length, 0);
        if (!arity && bitmask & (WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG)) {
          bitmask &= ~(WRAP_CURRY_FLAG | WRAP_CURRY_RIGHT_FLAG);
        }
        if (!bitmask || bitmask == WRAP_BIND_FLAG) {
          var result2 = createBind(func, bitmask, thisArg);
        } else if (bitmask == WRAP_CURRY_FLAG || bitmask == WRAP_CURRY_RIGHT_FLAG) {
          result2 = createCurry(func, bitmask, arity);
        } else if ((bitmask == WRAP_PARTIAL_FLAG || bitmask == (WRAP_BIND_FLAG | WRAP_PARTIAL_FLAG)) && !holders.length) {
          result2 = createPartial(func, bitmask, thisArg, partials);
        } else {
          result2 = createHybrid.apply(undefined$1, newData);
        }
        var setter = data ? baseSetData : setData;
        return setWrapToString(setter(result2, newData), func, bitmask);
      }
      function customDefaultsAssignIn(objValue, srcValue, key, object) {
        if (objValue === undefined$1 || eq(objValue, objectProto2[key]) && !hasOwnProperty2.call(object, key)) {
          return srcValue;
        }
        return objValue;
      }
      function customDefaultsMerge(objValue, srcValue, key, object, source, stack) {
        if (isObject(objValue) && isObject(srcValue)) {
          stack.set(srcValue, objValue);
          baseMerge(objValue, srcValue, undefined$1, customDefaultsMerge, stack);
          stack["delete"](srcValue);
        }
        return objValue;
      }
      function customOmitClone(value) {
        return isPlainObject(value) ? undefined$1 : value;
      }
      function equalArrays(array, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG, arrLength = array.length, othLength = other.length;
        if (arrLength != othLength && !(isPartial && othLength > arrLength)) {
          return false;
        }
        var arrStacked = stack.get(array);
        var othStacked = stack.get(other);
        if (arrStacked && othStacked) {
          return arrStacked == other && othStacked == array;
        }
        var index2 = -1, result2 = true, seen = bitmask & COMPARE_UNORDERED_FLAG ? new SetCache() : undefined$1;
        stack.set(array, other);
        stack.set(other, array);
        while (++index2 < arrLength) {
          var arrValue = array[index2], othValue = other[index2];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, arrValue, index2, other, array, stack) : customizer(arrValue, othValue, index2, array, other, stack);
          }
          if (compared !== undefined$1) {
            if (compared) {
              continue;
            }
            result2 = false;
            break;
          }
          if (seen) {
            if (!arraySome(other, function(othValue2, othIndex) {
              if (!cacheHas(seen, othIndex) && (arrValue === othValue2 || equalFunc(arrValue, othValue2, bitmask, customizer, stack))) {
                return seen.push(othIndex);
              }
            })) {
              result2 = false;
              break;
            }
          } else if (!(arrValue === othValue || equalFunc(arrValue, othValue, bitmask, customizer, stack))) {
            result2 = false;
            break;
          }
        }
        stack["delete"](array);
        stack["delete"](other);
        return result2;
      }
      function equalByTag(object, other, tag, bitmask, customizer, equalFunc, stack) {
        switch (tag) {
          case dataViewTag:
            if (object.byteLength != other.byteLength || object.byteOffset != other.byteOffset) {
              return false;
            }
            object = object.buffer;
            other = other.buffer;
          case arrayBufferTag:
            if (object.byteLength != other.byteLength || !equalFunc(new Uint8Array2(object), new Uint8Array2(other))) {
              return false;
            }
            return true;
          case boolTag:
          case dateTag:
          case numberTag:
            return eq(+object, +other);
          case errorTag:
            return object.name == other.name && object.message == other.message;
          case regexpTag:
          case stringTag:
            return object == other + "";
          case mapTag:
            var convert = mapToArray;
          case setTag:
            var isPartial = bitmask & COMPARE_PARTIAL_FLAG;
            convert || (convert = setToArray);
            if (object.size != other.size && !isPartial) {
              return false;
            }
            var stacked = stack.get(object);
            if (stacked) {
              return stacked == other;
            }
            bitmask |= COMPARE_UNORDERED_FLAG;
            stack.set(object, other);
            var result2 = equalArrays(convert(object), convert(other), bitmask, customizer, equalFunc, stack);
            stack["delete"](object);
            return result2;
          case symbolTag2:
            if (symbolValueOf) {
              return symbolValueOf.call(object) == symbolValueOf.call(other);
            }
        }
        return false;
      }
      function equalObjects(object, other, bitmask, customizer, equalFunc, stack) {
        var isPartial = bitmask & COMPARE_PARTIAL_FLAG, objProps = getAllKeys(object), objLength = objProps.length, othProps = getAllKeys(other), othLength = othProps.length;
        if (objLength != othLength && !isPartial) {
          return false;
        }
        var index2 = objLength;
        while (index2--) {
          var key = objProps[index2];
          if (!(isPartial ? key in other : hasOwnProperty2.call(other, key))) {
            return false;
          }
        }
        var objStacked = stack.get(object);
        var othStacked = stack.get(other);
        if (objStacked && othStacked) {
          return objStacked == other && othStacked == object;
        }
        var result2 = true;
        stack.set(object, other);
        stack.set(other, object);
        var skipCtor = isPartial;
        while (++index2 < objLength) {
          key = objProps[index2];
          var objValue = object[key], othValue = other[key];
          if (customizer) {
            var compared = isPartial ? customizer(othValue, objValue, key, other, object, stack) : customizer(objValue, othValue, key, object, other, stack);
          }
          if (!(compared === undefined$1 ? objValue === othValue || equalFunc(objValue, othValue, bitmask, customizer, stack) : compared)) {
            result2 = false;
            break;
          }
          skipCtor || (skipCtor = key == "constructor");
        }
        if (result2 && !skipCtor) {
          var objCtor = object.constructor, othCtor = other.constructor;
          if (objCtor != othCtor && ("constructor" in object && "constructor" in other) && !(typeof objCtor == "function" && objCtor instanceof objCtor && typeof othCtor == "function" && othCtor instanceof othCtor)) {
            result2 = false;
          }
        }
        stack["delete"](object);
        stack["delete"](other);
        return result2;
      }
      function flatRest(func) {
        return setToString(overRest(func, undefined$1, flatten), func + "");
      }
      function getAllKeys(object) {
        return baseGetAllKeys(object, keys, getSymbols);
      }
      function getAllKeysIn(object) {
        return baseGetAllKeys(object, keysIn, getSymbolsIn);
      }
      var getData = !metaMap ? noop : function(func) {
        return metaMap.get(func);
      };
      function getFuncName(func) {
        var result2 = func.name + "", array = realNames[result2], length = hasOwnProperty2.call(realNames, result2) ? array.length : 0;
        while (length--) {
          var data = array[length], otherFunc = data.func;
          if (otherFunc == null || otherFunc == func) {
            return data.name;
          }
        }
        return result2;
      }
      function getHolder(func) {
        var object = hasOwnProperty2.call(lodash2, "placeholder") ? lodash2 : func;
        return object.placeholder;
      }
      function getIteratee() {
        var result2 = lodash2.iteratee || iteratee;
        result2 = result2 === iteratee ? baseIteratee : result2;
        return arguments.length ? result2(arguments[0], arguments[1]) : result2;
      }
      function getMapData(map2, key) {
        var data = map2.__data__;
        return isKeyable(key) ? data[typeof key == "string" ? "string" : "hash"] : data.map;
      }
      function getMatchData(object) {
        var result2 = keys(object), length = result2.length;
        while (length--) {
          var key = result2[length], value = object[key];
          result2[length] = [key, value, isStrictComparable(value)];
        }
        return result2;
      }
      function getNative(object, key) {
        var value = getValue(object, key);
        return baseIsNative(value) ? value : undefined$1;
      }
      function getRawTag2(value) {
        var isOwn = hasOwnProperty2.call(value, symToStringTag2), tag = value[symToStringTag2];
        try {
          value[symToStringTag2] = undefined$1;
          var unmasked = true;
        } catch (e) {
        }
        var result2 = nativeObjectToString2.call(value);
        if (unmasked) {
          if (isOwn) {
            value[symToStringTag2] = tag;
          } else {
            delete value[symToStringTag2];
          }
        }
        return result2;
      }
      var getSymbols = !nativeGetSymbols ? stubArray : function(object) {
        if (object == null) {
          return [];
        }
        object = Object2(object);
        return arrayFilter(nativeGetSymbols(object), function(symbol) {
          return propertyIsEnumerable.call(object, symbol);
        });
      };
      var getSymbolsIn = !nativeGetSymbols ? stubArray : function(object) {
        var result2 = [];
        while (object) {
          arrayPush(result2, getSymbols(object));
          object = getPrototype(object);
        }
        return result2;
      };
      var getTag = baseGetTag2;
      if (DataView && getTag(new DataView(new ArrayBuffer(1))) != dataViewTag || Map && getTag(new Map()) != mapTag || Promise2 && getTag(Promise2.resolve()) != promiseTag || Set && getTag(new Set()) != setTag || WeakMap && getTag(new WeakMap()) != weakMapTag) {
        getTag = function(value) {
          var result2 = baseGetTag2(value), Ctor = result2 == objectTag ? value.constructor : undefined$1, ctorString = Ctor ? toSource(Ctor) : "";
          if (ctorString) {
            switch (ctorString) {
              case dataViewCtorString:
                return dataViewTag;
              case mapCtorString:
                return mapTag;
              case promiseCtorString:
                return promiseTag;
              case setCtorString:
                return setTag;
              case weakMapCtorString:
                return weakMapTag;
            }
          }
          return result2;
        };
      }
      function getView(start, end, transforms) {
        var index2 = -1, length = transforms.length;
        while (++index2 < length) {
          var data = transforms[index2], size2 = data.size;
          switch (data.type) {
            case "drop":
              start += size2;
              break;
            case "dropRight":
              end -= size2;
              break;
            case "take":
              end = nativeMin(end, start + size2);
              break;
            case "takeRight":
              start = nativeMax(start, end - size2);
              break;
          }
        }
        return { "start": start, "end": end };
      }
      function getWrapDetails(source) {
        var match = source.match(reWrapDetails);
        return match ? match[1].split(reSplitDetails) : [];
      }
      function hasPath(object, path, hasFunc) {
        path = castPath(path, object);
        var index2 = -1, length = path.length, result2 = false;
        while (++index2 < length) {
          var key = toKey(path[index2]);
          if (!(result2 = object != null && hasFunc(object, key))) {
            break;
          }
          object = object[key];
        }
        if (result2 || ++index2 != length) {
          return result2;
        }
        length = object == null ? 0 : object.length;
        return !!length && isLength(length) && isIndex(key, length) && (isArray2(object) || isArguments(object));
      }
      function initCloneArray(array) {
        var length = array.length, result2 = new array.constructor(length);
        if (length && typeof array[0] == "string" && hasOwnProperty2.call(array, "index")) {
          result2.index = array.index;
          result2.input = array.input;
        }
        return result2;
      }
      function initCloneObject(object) {
        return typeof object.constructor == "function" && !isPrototype(object) ? baseCreate(getPrototype(object)) : {};
      }
      function initCloneByTag(object, tag, isDeep) {
        var Ctor = object.constructor;
        switch (tag) {
          case arrayBufferTag:
            return cloneArrayBuffer(object);
          case boolTag:
          case dateTag:
            return new Ctor(+object);
          case dataViewTag:
            return cloneDataView(object, isDeep);
          case float32Tag:
          case float64Tag:
          case int8Tag:
          case int16Tag:
          case int32Tag:
          case uint8Tag:
          case uint8ClampedTag:
          case uint16Tag:
          case uint32Tag:
            return cloneTypedArray(object, isDeep);
          case mapTag:
            return new Ctor();
          case numberTag:
          case stringTag:
            return new Ctor(object);
          case regexpTag:
            return cloneRegExp(object);
          case setTag:
            return new Ctor();
          case symbolTag2:
            return cloneSymbol(object);
        }
      }
      function insertWrapDetails(source, details) {
        var length = details.length;
        if (!length) {
          return source;
        }
        var lastIndex = length - 1;
        details[lastIndex] = (length > 1 ? "& " : "") + details[lastIndex];
        details = details.join(length > 2 ? ", " : " ");
        return source.replace(reWrapComment, "{\n/* [wrapped with " + details + "] */\n");
      }
      function isFlattenable(value) {
        return isArray2(value) || isArguments(value) || !!(spreadableSymbol && value && value[spreadableSymbol]);
      }
      function isIndex(value, length) {
        var type = typeof value;
        length = length == null ? MAX_SAFE_INTEGER : length;
        return !!length && (type == "number" || type != "symbol" && reIsUint.test(value)) && (value > -1 && value % 1 == 0 && value < length);
      }
      function isIterateeCall(value, index2, object) {
        if (!isObject(object)) {
          return false;
        }
        var type = typeof index2;
        if (type == "number" ? isArrayLike(object) && isIndex(index2, object.length) : type == "string" && index2 in object) {
          return eq(object[index2], value);
        }
        return false;
      }
      function isKey(value, object) {
        if (isArray2(value)) {
          return false;
        }
        var type = typeof value;
        if (type == "number" || type == "symbol" || type == "boolean" || value == null || isSymbol2(value)) {
          return true;
        }
        return reIsPlainProp.test(value) || !reIsDeepProp.test(value) || object != null && value in Object2(object);
      }
      function isKeyable(value) {
        var type = typeof value;
        return type == "string" || type == "number" || type == "symbol" || type == "boolean" ? value !== "__proto__" : value === null;
      }
      function isLaziable(func) {
        var funcName = getFuncName(func), other = lodash2[funcName];
        if (typeof other != "function" || !(funcName in LazyWrapper.prototype)) {
          return false;
        }
        if (func === other) {
          return true;
        }
        var data = getData(other);
        return !!data && func === data[0];
      }
      function isMasked(func) {
        return !!maskSrcKey && maskSrcKey in func;
      }
      var isMaskable = coreJsData ? isFunction : stubFalse;
      function isPrototype(value) {
        var Ctor = value && value.constructor, proto = typeof Ctor == "function" && Ctor.prototype || objectProto2;
        return value === proto;
      }
      function isStrictComparable(value) {
        return value === value && !isObject(value);
      }
      function matchesStrictComparable(key, srcValue) {
        return function(object) {
          if (object == null) {
            return false;
          }
          return object[key] === srcValue && (srcValue !== undefined$1 || key in Object2(object));
        };
      }
      function memoizeCapped(func) {
        var result2 = memoize(func, function(key) {
          if (cache.size === MAX_MEMOIZE_SIZE) {
            cache.clear();
          }
          return key;
        });
        var cache = result2.cache;
        return result2;
      }
      function mergeData(data, source) {
        var bitmask = data[1], srcBitmask = source[1], newBitmask = bitmask | srcBitmask, isCommon = newBitmask < (WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG | WRAP_ARY_FLAG);
        var isCombo = srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_CURRY_FLAG || srcBitmask == WRAP_ARY_FLAG && bitmask == WRAP_REARG_FLAG && data[7].length <= source[8] || srcBitmask == (WRAP_ARY_FLAG | WRAP_REARG_FLAG) && source[7].length <= source[8] && bitmask == WRAP_CURRY_FLAG;
        if (!(isCommon || isCombo)) {
          return data;
        }
        if (srcBitmask & WRAP_BIND_FLAG) {
          data[2] = source[2];
          newBitmask |= bitmask & WRAP_BIND_FLAG ? 0 : WRAP_CURRY_BOUND_FLAG;
        }
        var value = source[3];
        if (value) {
          var partials = data[3];
          data[3] = partials ? composeArgs(partials, value, source[4]) : value;
          data[4] = partials ? replaceHolders(data[3], PLACEHOLDER) : source[4];
        }
        value = source[5];
        if (value) {
          partials = data[5];
          data[5] = partials ? composeArgsRight(partials, value, source[6]) : value;
          data[6] = partials ? replaceHolders(data[5], PLACEHOLDER) : source[6];
        }
        value = source[7];
        if (value) {
          data[7] = value;
        }
        if (srcBitmask & WRAP_ARY_FLAG) {
          data[8] = data[8] == null ? source[8] : nativeMin(data[8], source[8]);
        }
        if (data[9] == null) {
          data[9] = source[9];
        }
        data[0] = source[0];
        data[1] = newBitmask;
        return data;
      }
      function nativeKeysIn(object) {
        var result2 = [];
        if (object != null) {
          for (var key in Object2(object)) {
            result2.push(key);
          }
        }
        return result2;
      }
      function objectToString2(value) {
        return nativeObjectToString2.call(value);
      }
      function overRest(func, start, transform2) {
        start = nativeMax(start === undefined$1 ? func.length - 1 : start, 0);
        return function() {
          var args = arguments, index2 = -1, length = nativeMax(args.length - start, 0), array = Array2(length);
          while (++index2 < length) {
            array[index2] = args[start + index2];
          }
          index2 = -1;
          var otherArgs = Array2(start + 1);
          while (++index2 < start) {
            otherArgs[index2] = args[index2];
          }
          otherArgs[start] = transform2(array);
          return apply(func, this, otherArgs);
        };
      }
      function parent(object, path) {
        return path.length < 2 ? object : baseGet(object, baseSlice(path, 0, -1));
      }
      function reorder(array, indexes) {
        var arrLength = array.length, length = nativeMin(indexes.length, arrLength), oldArray = copyArray(array);
        while (length--) {
          var index2 = indexes[length];
          array[length] = isIndex(index2, arrLength) ? oldArray[index2] : undefined$1;
        }
        return array;
      }
      function safeGet(object, key) {
        if (key === "constructor" && typeof object[key] === "function") {
          return;
        }
        if (key == "__proto__") {
          return;
        }
        return object[key];
      }
      var setData = shortOut(baseSetData);
      var setTimeout = ctxSetTimeout || function(func, wait) {
        return root2.setTimeout(func, wait);
      };
      var setToString = shortOut(baseSetToString);
      function setWrapToString(wrapper, reference, bitmask) {
        var source = reference + "";
        return setToString(wrapper, insertWrapDetails(source, updateWrapDetails(getWrapDetails(source), bitmask)));
      }
      function shortOut(func) {
        var count = 0, lastCalled = 0;
        return function() {
          var stamp = nativeNow(), remaining = HOT_SPAN - (stamp - lastCalled);
          lastCalled = stamp;
          if (remaining > 0) {
            if (++count >= HOT_COUNT) {
              return arguments[0];
            }
          } else {
            count = 0;
          }
          return func.apply(undefined$1, arguments);
        };
      }
      function shuffleSelf(array, size2) {
        var index2 = -1, length = array.length, lastIndex = length - 1;
        size2 = size2 === undefined$1 ? length : size2;
        while (++index2 < size2) {
          var rand = baseRandom(index2, lastIndex), value = array[rand];
          array[rand] = array[index2];
          array[index2] = value;
        }
        array.length = size2;
        return array;
      }
      var stringToPath = memoizeCapped(function(string) {
        var result2 = [];
        if (string.charCodeAt(0) === 46) {
          result2.push("");
        }
        string.replace(rePropName, function(match, number, quote, subString) {
          result2.push(quote ? subString.replace(reEscapeChar, "$1") : number || match);
        });
        return result2;
      });
      function toKey(value) {
        if (typeof value == "string" || isSymbol2(value)) {
          return value;
        }
        var result2 = value + "";
        return result2 == "0" && 1 / value == -INFINITY2 ? "-0" : result2;
      }
      function toSource(func) {
        if (func != null) {
          try {
            return funcToString.call(func);
          } catch (e) {
          }
          try {
            return func + "";
          } catch (e) {
          }
        }
        return "";
      }
      function updateWrapDetails(details, bitmask) {
        arrayEach(wrapFlags, function(pair) {
          var value = "_." + pair[0];
          if (bitmask & pair[1] && !arrayIncludes(details, value)) {
            details.push(value);
          }
        });
        return details.sort();
      }
      function wrapperClone(wrapper) {
        if (wrapper instanceof LazyWrapper) {
          return wrapper.clone();
        }
        var result2 = new LodashWrapper(wrapper.__wrapped__, wrapper.__chain__);
        result2.__actions__ = copyArray(wrapper.__actions__);
        result2.__index__ = wrapper.__index__;
        result2.__values__ = wrapper.__values__;
        return result2;
      }
      function chunk(array, size2, guard) {
        if (guard ? isIterateeCall(array, size2, guard) : size2 === undefined$1) {
          size2 = 1;
        } else {
          size2 = nativeMax(toInteger(size2), 0);
        }
        var length = array == null ? 0 : array.length;
        if (!length || size2 < 1) {
          return [];
        }
        var index2 = 0, resIndex = 0, result2 = Array2(nativeCeil(length / size2));
        while (index2 < length) {
          result2[resIndex++] = baseSlice(array, index2, index2 += size2);
        }
        return result2;
      }
      function compact(array) {
        var index2 = -1, length = array == null ? 0 : array.length, resIndex = 0, result2 = [];
        while (++index2 < length) {
          var value = array[index2];
          if (value) {
            result2[resIndex++] = value;
          }
        }
        return result2;
      }
      function concat() {
        var length = arguments.length;
        if (!length) {
          return [];
        }
        var args = Array2(length - 1), array = arguments[0], index2 = length;
        while (index2--) {
          args[index2 - 1] = arguments[index2];
        }
        return arrayPush(isArray2(array) ? copyArray(array) : [array], baseFlatten(args, 1));
      }
      var difference = baseRest(function(array, values2) {
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true)) : [];
      });
      var differenceBy = baseRest(function(array, values2) {
        var iteratee2 = last(values2);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = undefined$1;
        }
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2)) : [];
      });
      var differenceWith = baseRest(function(array, values2) {
        var comparator = last(values2);
        if (isArrayLikeObject(comparator)) {
          comparator = undefined$1;
        }
        return isArrayLikeObject(array) ? baseDifference(array, baseFlatten(values2, 1, isArrayLikeObject, true), undefined$1, comparator) : [];
      });
      function drop(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined$1 ? 1 : toInteger(n);
        return baseSlice(array, n < 0 ? 0 : n, length);
      }
      function dropRight(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined$1 ? 1 : toInteger(n);
        n = length - n;
        return baseSlice(array, 0, n < 0 ? 0 : n);
      }
      function dropRightWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true, true) : [];
      }
      function dropWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), true) : [];
      }
      function fill(array, value, start, end) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        if (start && typeof start != "number" && isIterateeCall(array, value, start)) {
          start = 0;
          end = length;
        }
        return baseFill(array, value, start, end);
      }
      function findIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index2 = fromIndex == null ? 0 : toInteger(fromIndex);
        if (index2 < 0) {
          index2 = nativeMax(length + index2, 0);
        }
        return baseFindIndex(array, getIteratee(predicate, 3), index2);
      }
      function findLastIndex(array, predicate, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index2 = length - 1;
        if (fromIndex !== undefined$1) {
          index2 = toInteger(fromIndex);
          index2 = fromIndex < 0 ? nativeMax(length + index2, 0) : nativeMin(index2, length - 1);
        }
        return baseFindIndex(array, getIteratee(predicate, 3), index2, true);
      }
      function flatten(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, 1) : [];
      }
      function flattenDeep(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseFlatten(array, INFINITY2) : [];
      }
      function flattenDepth(array, depth) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        depth = depth === undefined$1 ? 1 : toInteger(depth);
        return baseFlatten(array, depth);
      }
      function fromPairs(pairs) {
        var index2 = -1, length = pairs == null ? 0 : pairs.length, result2 = {};
        while (++index2 < length) {
          var pair = pairs[index2];
          result2[pair[0]] = pair[1];
        }
        return result2;
      }
      function head(array) {
        return array && array.length ? array[0] : undefined$1;
      }
      function indexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index2 = fromIndex == null ? 0 : toInteger(fromIndex);
        if (index2 < 0) {
          index2 = nativeMax(length + index2, 0);
        }
        return baseIndexOf(array, value, index2);
      }
      function initial(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseSlice(array, 0, -1) : [];
      }
      var intersection = baseRest(function(arrays) {
        var mapped = arrayMap2(arrays, castArrayLikeObject);
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped) : [];
      });
      var intersectionBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays), mapped = arrayMap2(arrays, castArrayLikeObject);
        if (iteratee2 === last(mapped)) {
          iteratee2 = undefined$1;
        } else {
          mapped.pop();
        }
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, getIteratee(iteratee2, 2)) : [];
      });
      var intersectionWith = baseRest(function(arrays) {
        var comparator = last(arrays), mapped = arrayMap2(arrays, castArrayLikeObject);
        comparator = typeof comparator == "function" ? comparator : undefined$1;
        if (comparator) {
          mapped.pop();
        }
        return mapped.length && mapped[0] === arrays[0] ? baseIntersection(mapped, undefined$1, comparator) : [];
      });
      function join(array, separator) {
        return array == null ? "" : nativeJoin.call(array, separator);
      }
      function last(array) {
        var length = array == null ? 0 : array.length;
        return length ? array[length - 1] : undefined$1;
      }
      function lastIndexOf(array, value, fromIndex) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return -1;
        }
        var index2 = length;
        if (fromIndex !== undefined$1) {
          index2 = toInteger(fromIndex);
          index2 = index2 < 0 ? nativeMax(length + index2, 0) : nativeMin(index2, length - 1);
        }
        return value === value ? strictLastIndexOf(array, value, index2) : baseFindIndex(array, baseIsNaN, index2, true);
      }
      function nth(array, n) {
        return array && array.length ? baseNth(array, toInteger(n)) : undefined$1;
      }
      var pull = baseRest(pullAll);
      function pullAll(array, values2) {
        return array && array.length && values2 && values2.length ? basePullAll(array, values2) : array;
      }
      function pullAllBy(array, values2, iteratee2) {
        return array && array.length && values2 && values2.length ? basePullAll(array, values2, getIteratee(iteratee2, 2)) : array;
      }
      function pullAllWith(array, values2, comparator) {
        return array && array.length && values2 && values2.length ? basePullAll(array, values2, undefined$1, comparator) : array;
      }
      var pullAt = flatRest(function(array, indexes) {
        var length = array == null ? 0 : array.length, result2 = baseAt(array, indexes);
        basePullAt(array, arrayMap2(indexes, function(index2) {
          return isIndex(index2, length) ? +index2 : index2;
        }).sort(compareAscending));
        return result2;
      });
      function remove(array, predicate) {
        var result2 = [];
        if (!(array && array.length)) {
          return result2;
        }
        var index2 = -1, indexes = [], length = array.length;
        predicate = getIteratee(predicate, 3);
        while (++index2 < length) {
          var value = array[index2];
          if (predicate(value, index2, array)) {
            result2.push(value);
            indexes.push(index2);
          }
        }
        basePullAt(array, indexes);
        return result2;
      }
      function reverse(array) {
        return array == null ? array : nativeReverse.call(array);
      }
      function slice(array, start, end) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        if (end && typeof end != "number" && isIterateeCall(array, start, end)) {
          start = 0;
          end = length;
        } else {
          start = start == null ? 0 : toInteger(start);
          end = end === undefined$1 ? length : toInteger(end);
        }
        return baseSlice(array, start, end);
      }
      function sortedIndex(array, value) {
        return baseSortedIndex(array, value);
      }
      function sortedIndexBy(array, value, iteratee2) {
        return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2));
      }
      function sortedIndexOf(array, value) {
        var length = array == null ? 0 : array.length;
        if (length) {
          var index2 = baseSortedIndex(array, value);
          if (index2 < length && eq(array[index2], value)) {
            return index2;
          }
        }
        return -1;
      }
      function sortedLastIndex(array, value) {
        return baseSortedIndex(array, value, true);
      }
      function sortedLastIndexBy(array, value, iteratee2) {
        return baseSortedIndexBy(array, value, getIteratee(iteratee2, 2), true);
      }
      function sortedLastIndexOf(array, value) {
        var length = array == null ? 0 : array.length;
        if (length) {
          var index2 = baseSortedIndex(array, value, true) - 1;
          if (eq(array[index2], value)) {
            return index2;
          }
        }
        return -1;
      }
      function sortedUniq(array) {
        return array && array.length ? baseSortedUniq(array) : [];
      }
      function sortedUniqBy(array, iteratee2) {
        return array && array.length ? baseSortedUniq(array, getIteratee(iteratee2, 2)) : [];
      }
      function tail(array) {
        var length = array == null ? 0 : array.length;
        return length ? baseSlice(array, 1, length) : [];
      }
      function take(array, n, guard) {
        if (!(array && array.length)) {
          return [];
        }
        n = guard || n === undefined$1 ? 1 : toInteger(n);
        return baseSlice(array, 0, n < 0 ? 0 : n);
      }
      function takeRight(array, n, guard) {
        var length = array == null ? 0 : array.length;
        if (!length) {
          return [];
        }
        n = guard || n === undefined$1 ? 1 : toInteger(n);
        n = length - n;
        return baseSlice(array, n < 0 ? 0 : n, length);
      }
      function takeRightWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3), false, true) : [];
      }
      function takeWhile(array, predicate) {
        return array && array.length ? baseWhile(array, getIteratee(predicate, 3)) : [];
      }
      var union = baseRest(function(arrays) {
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true));
      });
      var unionBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = undefined$1;
        }
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), getIteratee(iteratee2, 2));
      });
      var unionWith = baseRest(function(arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == "function" ? comparator : undefined$1;
        return baseUniq(baseFlatten(arrays, 1, isArrayLikeObject, true), undefined$1, comparator);
      });
      function uniq(array) {
        return array && array.length ? baseUniq(array) : [];
      }
      function uniqBy(array, iteratee2) {
        return array && array.length ? baseUniq(array, getIteratee(iteratee2, 2)) : [];
      }
      function uniqWith(array, comparator) {
        comparator = typeof comparator == "function" ? comparator : undefined$1;
        return array && array.length ? baseUniq(array, undefined$1, comparator) : [];
      }
      function unzip(array) {
        if (!(array && array.length)) {
          return [];
        }
        var length = 0;
        array = arrayFilter(array, function(group) {
          if (isArrayLikeObject(group)) {
            length = nativeMax(group.length, length);
            return true;
          }
        });
        return baseTimes(length, function(index2) {
          return arrayMap2(array, baseProperty(index2));
        });
      }
      function unzipWith(array, iteratee2) {
        if (!(array && array.length)) {
          return [];
        }
        var result2 = unzip(array);
        if (iteratee2 == null) {
          return result2;
        }
        return arrayMap2(result2, function(group) {
          return apply(iteratee2, undefined$1, group);
        });
      }
      var without = baseRest(function(array, values2) {
        return isArrayLikeObject(array) ? baseDifference(array, values2) : [];
      });
      var xor = baseRest(function(arrays) {
        return baseXor(arrayFilter(arrays, isArrayLikeObject));
      });
      var xorBy = baseRest(function(arrays) {
        var iteratee2 = last(arrays);
        if (isArrayLikeObject(iteratee2)) {
          iteratee2 = undefined$1;
        }
        return baseXor(arrayFilter(arrays, isArrayLikeObject), getIteratee(iteratee2, 2));
      });
      var xorWith = baseRest(function(arrays) {
        var comparator = last(arrays);
        comparator = typeof comparator == "function" ? comparator : undefined$1;
        return baseXor(arrayFilter(arrays, isArrayLikeObject), undefined$1, comparator);
      });
      var zip = baseRest(unzip);
      function zipObject(props, values2) {
        return baseZipObject(props || [], values2 || [], assignValue);
      }
      function zipObjectDeep(props, values2) {
        return baseZipObject(props || [], values2 || [], baseSet);
      }
      var zipWith = baseRest(function(arrays) {
        var length = arrays.length, iteratee2 = length > 1 ? arrays[length - 1] : undefined$1;
        iteratee2 = typeof iteratee2 == "function" ? (arrays.pop(), iteratee2) : undefined$1;
        return unzipWith(arrays, iteratee2);
      });
      function chain(value) {
        var result2 = lodash2(value);
        result2.__chain__ = true;
        return result2;
      }
      function tap(value, interceptor) {
        interceptor(value);
        return value;
      }
      function thru(value, interceptor) {
        return interceptor(value);
      }
      var wrapperAt = flatRest(function(paths) {
        var length = paths.length, start = length ? paths[0] : 0, value = this.__wrapped__, interceptor = function(object) {
          return baseAt(object, paths);
        };
        if (length > 1 || this.__actions__.length || !(value instanceof LazyWrapper) || !isIndex(start)) {
          return this.thru(interceptor);
        }
        value = value.slice(start, +start + (length ? 1 : 0));
        value.__actions__.push({
          "func": thru,
          "args": [interceptor],
          "thisArg": undefined$1
        });
        return new LodashWrapper(value, this.__chain__).thru(function(array) {
          if (length && !array.length) {
            array.push(undefined$1);
          }
          return array;
        });
      });
      function wrapperChain() {
        return chain(this);
      }
      function wrapperCommit() {
        return new LodashWrapper(this.value(), this.__chain__);
      }
      function wrapperNext() {
        if (this.__values__ === undefined$1) {
          this.__values__ = toArray(this.value());
        }
        var done = this.__index__ >= this.__values__.length, value = done ? undefined$1 : this.__values__[this.__index__++];
        return { "done": done, "value": value };
      }
      function wrapperToIterator() {
        return this;
      }
      function wrapperPlant(value) {
        var result2, parent2 = this;
        while (parent2 instanceof baseLodash) {
          var clone2 = wrapperClone(parent2);
          clone2.__index__ = 0;
          clone2.__values__ = undefined$1;
          if (result2) {
            previous.__wrapped__ = clone2;
          } else {
            result2 = clone2;
          }
          var previous = clone2;
          parent2 = parent2.__wrapped__;
        }
        previous.__wrapped__ = value;
        return result2;
      }
      function wrapperReverse() {
        var value = this.__wrapped__;
        if (value instanceof LazyWrapper) {
          var wrapped = value;
          if (this.__actions__.length) {
            wrapped = new LazyWrapper(this);
          }
          wrapped = wrapped.reverse();
          wrapped.__actions__.push({
            "func": thru,
            "args": [reverse],
            "thisArg": undefined$1
          });
          return new LodashWrapper(wrapped, this.__chain__);
        }
        return this.thru(reverse);
      }
      function wrapperValue() {
        return baseWrapperValue(this.__wrapped__, this.__actions__);
      }
      var countBy = createAggregator(function(result2, value, key) {
        if (hasOwnProperty2.call(result2, key)) {
          ++result2[key];
        } else {
          baseAssignValue(result2, key, 1);
        }
      });
      function every(collection, predicate, guard) {
        var func = isArray2(collection) ? arrayEvery : baseEvery;
        if (guard && isIterateeCall(collection, predicate, guard)) {
          predicate = undefined$1;
        }
        return func(collection, getIteratee(predicate, 3));
      }
      function filter(collection, predicate) {
        var func = isArray2(collection) ? arrayFilter : baseFilter;
        return func(collection, getIteratee(predicate, 3));
      }
      var find = createFind(findIndex);
      var findLast = createFind(findLastIndex);
      function flatMap(collection, iteratee2) {
        return baseFlatten(map(collection, iteratee2), 1);
      }
      function flatMapDeep(collection, iteratee2) {
        return baseFlatten(map(collection, iteratee2), INFINITY2);
      }
      function flatMapDepth(collection, iteratee2, depth) {
        depth = depth === undefined$1 ? 1 : toInteger(depth);
        return baseFlatten(map(collection, iteratee2), depth);
      }
      function forEach(collection, iteratee2) {
        var func = isArray2(collection) ? arrayEach : baseEach;
        return func(collection, getIteratee(iteratee2, 3));
      }
      function forEachRight(collection, iteratee2) {
        var func = isArray2(collection) ? arrayEachRight : baseEachRight;
        return func(collection, getIteratee(iteratee2, 3));
      }
      var groupBy = createAggregator(function(result2, value, key) {
        if (hasOwnProperty2.call(result2, key)) {
          result2[key].push(value);
        } else {
          baseAssignValue(result2, key, [value]);
        }
      });
      function includes(collection, value, fromIndex, guard) {
        collection = isArrayLike(collection) ? collection : values(collection);
        fromIndex = fromIndex && !guard ? toInteger(fromIndex) : 0;
        var length = collection.length;
        if (fromIndex < 0) {
          fromIndex = nativeMax(length + fromIndex, 0);
        }
        return isString(collection) ? fromIndex <= length && collection.indexOf(value, fromIndex) > -1 : !!length && baseIndexOf(collection, value, fromIndex) > -1;
      }
      var invokeMap = baseRest(function(collection, path, args) {
        var index2 = -1, isFunc = typeof path == "function", result2 = isArrayLike(collection) ? Array2(collection.length) : [];
        baseEach(collection, function(value) {
          result2[++index2] = isFunc ? apply(path, value, args) : baseInvoke(value, path, args);
        });
        return result2;
      });
      var keyBy = createAggregator(function(result2, value, key) {
        baseAssignValue(result2, key, value);
      });
      function map(collection, iteratee2) {
        var func = isArray2(collection) ? arrayMap2 : baseMap;
        return func(collection, getIteratee(iteratee2, 3));
      }
      function orderBy(collection, iteratees, orders, guard) {
        if (collection == null) {
          return [];
        }
        if (!isArray2(iteratees)) {
          iteratees = iteratees == null ? [] : [iteratees];
        }
        orders = guard ? undefined$1 : orders;
        if (!isArray2(orders)) {
          orders = orders == null ? [] : [orders];
        }
        return baseOrderBy(collection, iteratees, orders);
      }
      var partition = createAggregator(function(result2, value, key) {
        result2[key ? 0 : 1].push(value);
      }, function() {
        return [[], []];
      });
      function reduce(collection, iteratee2, accumulator) {
        var func = isArray2(collection) ? arrayReduce : baseReduce, initAccum = arguments.length < 3;
        return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEach);
      }
      function reduceRight(collection, iteratee2, accumulator) {
        var func = isArray2(collection) ? arrayReduceRight : baseReduce, initAccum = arguments.length < 3;
        return func(collection, getIteratee(iteratee2, 4), accumulator, initAccum, baseEachRight);
      }
      function reject(collection, predicate) {
        var func = isArray2(collection) ? arrayFilter : baseFilter;
        return func(collection, negate(getIteratee(predicate, 3)));
      }
      function sample(collection) {
        var func = isArray2(collection) ? arraySample : baseSample;
        return func(collection);
      }
      function sampleSize(collection, n, guard) {
        if (guard ? isIterateeCall(collection, n, guard) : n === undefined$1) {
          n = 1;
        } else {
          n = toInteger(n);
        }
        var func = isArray2(collection) ? arraySampleSize : baseSampleSize;
        return func(collection, n);
      }
      function shuffle(collection) {
        var func = isArray2(collection) ? arrayShuffle : baseShuffle;
        return func(collection);
      }
      function size(collection) {
        if (collection == null) {
          return 0;
        }
        if (isArrayLike(collection)) {
          return isString(collection) ? stringSize(collection) : collection.length;
        }
        var tag = getTag(collection);
        if (tag == mapTag || tag == setTag) {
          return collection.size;
        }
        return baseKeys(collection).length;
      }
      function some(collection, predicate, guard) {
        var func = isArray2(collection) ? arraySome : baseSome;
        if (guard && isIterateeCall(collection, predicate, guard)) {
          predicate = undefined$1;
        }
        return func(collection, getIteratee(predicate, 3));
      }
      var sortBy = baseRest(function(collection, iteratees) {
        if (collection == null) {
          return [];
        }
        var length = iteratees.length;
        if (length > 1 && isIterateeCall(collection, iteratees[0], iteratees[1])) {
          iteratees = [];
        } else if (length > 2 && isIterateeCall(iteratees[0], iteratees[1], iteratees[2])) {
          iteratees = [iteratees[0]];
        }
        return baseOrderBy(collection, baseFlatten(iteratees, 1), []);
      });
      var now = ctxNow || function() {
        return root2.Date.now();
      };
      function after(n, func) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        n = toInteger(n);
        return function() {
          if (--n < 1) {
            return func.apply(this, arguments);
          }
        };
      }
      function ary(func, n, guard) {
        n = guard ? undefined$1 : n;
        n = func && n == null ? func.length : n;
        return createWrap(func, WRAP_ARY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, n);
      }
      function before(n, func) {
        var result2;
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        n = toInteger(n);
        return function() {
          if (--n > 0) {
            result2 = func.apply(this, arguments);
          }
          if (n <= 1) {
            func = undefined$1;
          }
          return result2;
        };
      }
      var bind = baseRest(function(func, thisArg, partials) {
        var bitmask = WRAP_BIND_FLAG;
        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bind));
          bitmask |= WRAP_PARTIAL_FLAG;
        }
        return createWrap(func, bitmask, thisArg, partials, holders);
      });
      var bindKey = baseRest(function(object, key, partials) {
        var bitmask = WRAP_BIND_FLAG | WRAP_BIND_KEY_FLAG;
        if (partials.length) {
          var holders = replaceHolders(partials, getHolder(bindKey));
          bitmask |= WRAP_PARTIAL_FLAG;
        }
        return createWrap(key, bitmask, object, partials, holders);
      });
      function curry(func, arity, guard) {
        arity = guard ? undefined$1 : arity;
        var result2 = createWrap(func, WRAP_CURRY_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
        result2.placeholder = curry.placeholder;
        return result2;
      }
      function curryRight(func, arity, guard) {
        arity = guard ? undefined$1 : arity;
        var result2 = createWrap(func, WRAP_CURRY_RIGHT_FLAG, undefined$1, undefined$1, undefined$1, undefined$1, undefined$1, arity);
        result2.placeholder = curryRight.placeholder;
        return result2;
      }
      function debounce(func, wait, options) {
        var lastArgs, lastThis, maxWait, result2, timerId, lastCallTime, lastInvokeTime = 0, leading = false, maxing = false, trailing = true;
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        wait = toNumber(wait) || 0;
        if (isObject(options)) {
          leading = !!options.leading;
          maxing = "maxWait" in options;
          maxWait = maxing ? nativeMax(toNumber(options.maxWait) || 0, wait) : maxWait;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        function invokeFunc(time) {
          var args = lastArgs, thisArg = lastThis;
          lastArgs = lastThis = undefined$1;
          lastInvokeTime = time;
          result2 = func.apply(thisArg, args);
          return result2;
        }
        function leadingEdge(time) {
          lastInvokeTime = time;
          timerId = setTimeout(timerExpired, wait);
          return leading ? invokeFunc(time) : result2;
        }
        function remainingWait(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime, timeWaiting = wait - timeSinceLastCall;
          return maxing ? nativeMin(timeWaiting, maxWait - timeSinceLastInvoke) : timeWaiting;
        }
        function shouldInvoke(time) {
          var timeSinceLastCall = time - lastCallTime, timeSinceLastInvoke = time - lastInvokeTime;
          return lastCallTime === undefined$1 || timeSinceLastCall >= wait || timeSinceLastCall < 0 || maxing && timeSinceLastInvoke >= maxWait;
        }
        function timerExpired() {
          var time = now();
          if (shouldInvoke(time)) {
            return trailingEdge(time);
          }
          timerId = setTimeout(timerExpired, remainingWait(time));
        }
        function trailingEdge(time) {
          timerId = undefined$1;
          if (trailing && lastArgs) {
            return invokeFunc(time);
          }
          lastArgs = lastThis = undefined$1;
          return result2;
        }
        function cancel() {
          if (timerId !== undefined$1) {
            clearTimeout(timerId);
          }
          lastInvokeTime = 0;
          lastArgs = lastCallTime = lastThis = timerId = undefined$1;
        }
        function flush() {
          return timerId === undefined$1 ? result2 : trailingEdge(now());
        }
        function debounced() {
          var time = now(), isInvoking = shouldInvoke(time);
          lastArgs = arguments;
          lastThis = this;
          lastCallTime = time;
          if (isInvoking) {
            if (timerId === undefined$1) {
              return leadingEdge(lastCallTime);
            }
            if (maxing) {
              clearTimeout(timerId);
              timerId = setTimeout(timerExpired, wait);
              return invokeFunc(lastCallTime);
            }
          }
          if (timerId === undefined$1) {
            timerId = setTimeout(timerExpired, wait);
          }
          return result2;
        }
        debounced.cancel = cancel;
        debounced.flush = flush;
        return debounced;
      }
      var defer = baseRest(function(func, args) {
        return baseDelay(func, 1, args);
      });
      var delay = baseRest(function(func, wait, args) {
        return baseDelay(func, toNumber(wait) || 0, args);
      });
      function flip(func) {
        return createWrap(func, WRAP_FLIP_FLAG);
      }
      function memoize(func, resolver) {
        if (typeof func != "function" || resolver != null && typeof resolver != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        var memoized = function() {
          var args = arguments, key = resolver ? resolver.apply(this, args) : args[0], cache = memoized.cache;
          if (cache.has(key)) {
            return cache.get(key);
          }
          var result2 = func.apply(this, args);
          memoized.cache = cache.set(key, result2) || cache;
          return result2;
        };
        memoized.cache = new (memoize.Cache || MapCache)();
        return memoized;
      }
      memoize.Cache = MapCache;
      function negate(predicate) {
        if (typeof predicate != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        return function() {
          var args = arguments;
          switch (args.length) {
            case 0:
              return !predicate.call(this);
            case 1:
              return !predicate.call(this, args[0]);
            case 2:
              return !predicate.call(this, args[0], args[1]);
            case 3:
              return !predicate.call(this, args[0], args[1], args[2]);
          }
          return !predicate.apply(this, args);
        };
      }
      function once(func) {
        return before(2, func);
      }
      var overArgs = castRest(function(func, transforms) {
        transforms = transforms.length == 1 && isArray2(transforms[0]) ? arrayMap2(transforms[0], baseUnary(getIteratee())) : arrayMap2(baseFlatten(transforms, 1), baseUnary(getIteratee()));
        var funcsLength = transforms.length;
        return baseRest(function(args) {
          var index2 = -1, length = nativeMin(args.length, funcsLength);
          while (++index2 < length) {
            args[index2] = transforms[index2].call(this, args[index2]);
          }
          return apply(func, this, args);
        });
      });
      var partial = baseRest(function(func, partials) {
        var holders = replaceHolders(partials, getHolder(partial));
        return createWrap(func, WRAP_PARTIAL_FLAG, undefined$1, partials, holders);
      });
      var partialRight = baseRest(function(func, partials) {
        var holders = replaceHolders(partials, getHolder(partialRight));
        return createWrap(func, WRAP_PARTIAL_RIGHT_FLAG, undefined$1, partials, holders);
      });
      var rearg = flatRest(function(func, indexes) {
        return createWrap(func, WRAP_REARG_FLAG, undefined$1, undefined$1, undefined$1, indexes);
      });
      function rest(func, start) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        start = start === undefined$1 ? start : toInteger(start);
        return baseRest(func, start);
      }
      function spread(func, start) {
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        start = start == null ? 0 : nativeMax(toInteger(start), 0);
        return baseRest(function(args) {
          var array = args[start], otherArgs = castSlice(args, 0, start);
          if (array) {
            arrayPush(otherArgs, array);
          }
          return apply(func, this, otherArgs);
        });
      }
      function throttle(func, wait, options) {
        var leading = true, trailing = true;
        if (typeof func != "function") {
          throw new TypeError2(FUNC_ERROR_TEXT);
        }
        if (isObject(options)) {
          leading = "leading" in options ? !!options.leading : leading;
          trailing = "trailing" in options ? !!options.trailing : trailing;
        }
        return debounce(func, wait, {
          "leading": leading,
          "maxWait": wait,
          "trailing": trailing
        });
      }
      function unary(func) {
        return ary(func, 1);
      }
      function wrap(value, wrapper) {
        return partial(castFunction(wrapper), value);
      }
      function castArray() {
        if (!arguments.length) {
          return [];
        }
        var value = arguments[0];
        return isArray2(value) ? value : [value];
      }
      function clone(value) {
        return baseClone(value, CLONE_SYMBOLS_FLAG);
      }
      function cloneWith(value, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined$1;
        return baseClone(value, CLONE_SYMBOLS_FLAG, customizer);
      }
      function cloneDeep(value) {
        return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG);
      }
      function cloneDeepWith(value, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined$1;
        return baseClone(value, CLONE_DEEP_FLAG | CLONE_SYMBOLS_FLAG, customizer);
      }
      function conformsTo(object, source) {
        return source == null || baseConformsTo(object, source, keys(source));
      }
      function eq(value, other) {
        return value === other || value !== value && other !== other;
      }
      var gt = createRelationalOperation(baseGt);
      var gte = createRelationalOperation(function(value, other) {
        return value >= other;
      });
      var isArguments = baseIsArguments(function() {
        return arguments;
      }()) ? baseIsArguments : function(value) {
        return isObjectLike2(value) && hasOwnProperty2.call(value, "callee") && !propertyIsEnumerable.call(value, "callee");
      };
      var isArray2 = Array2.isArray;
      var isArrayBuffer = nodeIsArrayBuffer ? baseUnary(nodeIsArrayBuffer) : baseIsArrayBuffer;
      function isArrayLike(value) {
        return value != null && isLength(value.length) && !isFunction(value);
      }
      function isArrayLikeObject(value) {
        return isObjectLike2(value) && isArrayLike(value);
      }
      function isBoolean(value) {
        return value === true || value === false || isObjectLike2(value) && baseGetTag2(value) == boolTag;
      }
      var isBuffer = nativeIsBuffer || stubFalse;
      var isDate = nodeIsDate ? baseUnary(nodeIsDate) : baseIsDate;
      function isElement(value) {
        return isObjectLike2(value) && value.nodeType === 1 && !isPlainObject(value);
      }
      function isEmpty(value) {
        if (value == null) {
          return true;
        }
        if (isArrayLike(value) && (isArray2(value) || typeof value == "string" || typeof value.splice == "function" || isBuffer(value) || isTypedArray(value) || isArguments(value))) {
          return !value.length;
        }
        var tag = getTag(value);
        if (tag == mapTag || tag == setTag) {
          return !value.size;
        }
        if (isPrototype(value)) {
          return !baseKeys(value).length;
        }
        for (var key in value) {
          if (hasOwnProperty2.call(value, key)) {
            return false;
          }
        }
        return true;
      }
      function isEqual(value, other) {
        return baseIsEqual(value, other);
      }
      function isEqualWith(value, other, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined$1;
        var result2 = customizer ? customizer(value, other) : undefined$1;
        return result2 === undefined$1 ? baseIsEqual(value, other, undefined$1, customizer) : !!result2;
      }
      function isError(value) {
        if (!isObjectLike2(value)) {
          return false;
        }
        var tag = baseGetTag2(value);
        return tag == errorTag || tag == domExcTag || typeof value.message == "string" && typeof value.name == "string" && !isPlainObject(value);
      }
      function isFinite(value) {
        return typeof value == "number" && nativeIsFinite(value);
      }
      function isFunction(value) {
        if (!isObject(value)) {
          return false;
        }
        var tag = baseGetTag2(value);
        return tag == funcTag || tag == genTag || tag == asyncTag || tag == proxyTag;
      }
      function isInteger(value) {
        return typeof value == "number" && value == toInteger(value);
      }
      function isLength(value) {
        return typeof value == "number" && value > -1 && value % 1 == 0 && value <= MAX_SAFE_INTEGER;
      }
      function isObject(value) {
        var type = typeof value;
        return value != null && (type == "object" || type == "function");
      }
      function isObjectLike2(value) {
        return value != null && typeof value == "object";
      }
      var isMap = nodeIsMap ? baseUnary(nodeIsMap) : baseIsMap;
      function isMatch(object, source) {
        return object === source || baseIsMatch(object, source, getMatchData(source));
      }
      function isMatchWith(object, source, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined$1;
        return baseIsMatch(object, source, getMatchData(source), customizer);
      }
      function isNaN(value) {
        return isNumber(value) && value != +value;
      }
      function isNative(value) {
        if (isMaskable(value)) {
          throw new Error3(CORE_ERROR_TEXT);
        }
        return baseIsNative(value);
      }
      function isNull(value) {
        return value === null;
      }
      function isNil(value) {
        return value == null;
      }
      function isNumber(value) {
        return typeof value == "number" || isObjectLike2(value) && baseGetTag2(value) == numberTag;
      }
      function isPlainObject(value) {
        if (!isObjectLike2(value) || baseGetTag2(value) != objectTag) {
          return false;
        }
        var proto = getPrototype(value);
        if (proto === null) {
          return true;
        }
        var Ctor = hasOwnProperty2.call(proto, "constructor") && proto.constructor;
        return typeof Ctor == "function" && Ctor instanceof Ctor && funcToString.call(Ctor) == objectCtorString;
      }
      var isRegExp = nodeIsRegExp ? baseUnary(nodeIsRegExp) : baseIsRegExp;
      function isSafeInteger(value) {
        return isInteger(value) && value >= -MAX_SAFE_INTEGER && value <= MAX_SAFE_INTEGER;
      }
      var isSet = nodeIsSet ? baseUnary(nodeIsSet) : baseIsSet;
      function isString(value) {
        return typeof value == "string" || !isArray2(value) && isObjectLike2(value) && baseGetTag2(value) == stringTag;
      }
      function isSymbol2(value) {
        return typeof value == "symbol" || isObjectLike2(value) && baseGetTag2(value) == symbolTag2;
      }
      var isTypedArray = nodeIsTypedArray ? baseUnary(nodeIsTypedArray) : baseIsTypedArray;
      function isUndefined(value) {
        return value === undefined$1;
      }
      function isWeakMap(value) {
        return isObjectLike2(value) && getTag(value) == weakMapTag;
      }
      function isWeakSet(value) {
        return isObjectLike2(value) && baseGetTag2(value) == weakSetTag;
      }
      var lt = createRelationalOperation(baseLt);
      var lte = createRelationalOperation(function(value, other) {
        return value <= other;
      });
      function toArray(value) {
        if (!value) {
          return [];
        }
        if (isArrayLike(value)) {
          return isString(value) ? stringToArray(value) : copyArray(value);
        }
        if (symIterator && value[symIterator]) {
          return iteratorToArray(value[symIterator]());
        }
        var tag = getTag(value), func = tag == mapTag ? mapToArray : tag == setTag ? setToArray : values;
        return func(value);
      }
      function toFinite(value) {
        if (!value) {
          return value === 0 ? value : 0;
        }
        value = toNumber(value);
        if (value === INFINITY2 || value === -INFINITY2) {
          var sign = value < 0 ? -1 : 1;
          return sign * MAX_INTEGER;
        }
        return value === value ? value : 0;
      }
      function toInteger(value) {
        var result2 = toFinite(value), remainder = result2 % 1;
        return result2 === result2 ? remainder ? result2 - remainder : result2 : 0;
      }
      function toLength(value) {
        return value ? baseClamp(toInteger(value), 0, MAX_ARRAY_LENGTH) : 0;
      }
      function toNumber(value) {
        if (typeof value == "number") {
          return value;
        }
        if (isSymbol2(value)) {
          return NAN;
        }
        if (isObject(value)) {
          var other = typeof value.valueOf == "function" ? value.valueOf() : value;
          value = isObject(other) ? other + "" : other;
        }
        if (typeof value != "string") {
          return value === 0 ? value : +value;
        }
        value = baseTrim(value);
        var isBinary = reIsBinary.test(value);
        return isBinary || reIsOctal.test(value) ? freeParseInt(value.slice(2), isBinary ? 2 : 8) : reIsBadHex.test(value) ? NAN : +value;
      }
      function toPlainObject(value) {
        return copyObject(value, keysIn(value));
      }
      function toSafeInteger(value) {
        return value ? baseClamp(toInteger(value), -MAX_SAFE_INTEGER, MAX_SAFE_INTEGER) : value === 0 ? value : 0;
      }
      function toString2(value) {
        return value == null ? "" : baseToString2(value);
      }
      var assign = createAssigner(function(object, source) {
        if (isPrototype(source) || isArrayLike(source)) {
          copyObject(source, keys(source), object);
          return;
        }
        for (var key in source) {
          if (hasOwnProperty2.call(source, key)) {
            assignValue(object, key, source[key]);
          }
        }
      });
      var assignIn = createAssigner(function(object, source) {
        copyObject(source, keysIn(source), object);
      });
      var assignInWith = createAssigner(function(object, source, srcIndex, customizer) {
        copyObject(source, keysIn(source), object, customizer);
      });
      var assignWith = createAssigner(function(object, source, srcIndex, customizer) {
        copyObject(source, keys(source), object, customizer);
      });
      var at = flatRest(baseAt);
      function create(prototype, properties) {
        var result2 = baseCreate(prototype);
        return properties == null ? result2 : baseAssign(result2, properties);
      }
      var defaults = baseRest(function(object, sources) {
        object = Object2(object);
        var index2 = -1;
        var length = sources.length;
        var guard = length > 2 ? sources[2] : undefined$1;
        if (guard && isIterateeCall(sources[0], sources[1], guard)) {
          length = 1;
        }
        while (++index2 < length) {
          var source = sources[index2];
          var props = keysIn(source);
          var propsIndex = -1;
          var propsLength = props.length;
          while (++propsIndex < propsLength) {
            var key = props[propsIndex];
            var value = object[key];
            if (value === undefined$1 || eq(value, objectProto2[key]) && !hasOwnProperty2.call(object, key)) {
              object[key] = source[key];
            }
          }
        }
        return object;
      });
      var defaultsDeep = baseRest(function(args) {
        args.push(undefined$1, customDefaultsMerge);
        return apply(mergeWith, undefined$1, args);
      });
      function findKey(object, predicate) {
        return baseFindKey(object, getIteratee(predicate, 3), baseForOwn);
      }
      function findLastKey(object, predicate) {
        return baseFindKey(object, getIteratee(predicate, 3), baseForOwnRight);
      }
      function forIn(object, iteratee2) {
        return object == null ? object : baseFor(object, getIteratee(iteratee2, 3), keysIn);
      }
      function forInRight(object, iteratee2) {
        return object == null ? object : baseForRight(object, getIteratee(iteratee2, 3), keysIn);
      }
      function forOwn(object, iteratee2) {
        return object && baseForOwn(object, getIteratee(iteratee2, 3));
      }
      function forOwnRight(object, iteratee2) {
        return object && baseForOwnRight(object, getIteratee(iteratee2, 3));
      }
      function functions(object) {
        return object == null ? [] : baseFunctions(object, keys(object));
      }
      function functionsIn(object) {
        return object == null ? [] : baseFunctions(object, keysIn(object));
      }
      function get(object, path, defaultValue) {
        var result2 = object == null ? undefined$1 : baseGet(object, path);
        return result2 === undefined$1 ? defaultValue : result2;
      }
      function has(object, path) {
        return object != null && hasPath(object, path, baseHas);
      }
      function hasIn(object, path) {
        return object != null && hasPath(object, path, baseHasIn);
      }
      var invert = createInverter(function(result2, value, key) {
        if (value != null && typeof value.toString != "function") {
          value = nativeObjectToString2.call(value);
        }
        result2[value] = key;
      }, constant(identity));
      var invertBy = createInverter(function(result2, value, key) {
        if (value != null && typeof value.toString != "function") {
          value = nativeObjectToString2.call(value);
        }
        if (hasOwnProperty2.call(result2, value)) {
          result2[value].push(key);
        } else {
          result2[value] = [key];
        }
      }, getIteratee);
      var invoke = baseRest(baseInvoke);
      function keys(object) {
        return isArrayLike(object) ? arrayLikeKeys(object) : baseKeys(object);
      }
      function keysIn(object) {
        return isArrayLike(object) ? arrayLikeKeys(object, true) : baseKeysIn(object);
      }
      function mapKeys(object, iteratee2) {
        var result2 = {};
        iteratee2 = getIteratee(iteratee2, 3);
        baseForOwn(object, function(value, key, object2) {
          baseAssignValue(result2, iteratee2(value, key, object2), value);
        });
        return result2;
      }
      function mapValues(object, iteratee2) {
        var result2 = {};
        iteratee2 = getIteratee(iteratee2, 3);
        baseForOwn(object, function(value, key, object2) {
          baseAssignValue(result2, key, iteratee2(value, key, object2));
        });
        return result2;
      }
      var merge = createAssigner(function(object, source, srcIndex) {
        baseMerge(object, source, srcIndex);
      });
      var mergeWith = createAssigner(function(object, source, srcIndex, customizer) {
        baseMerge(object, source, srcIndex, customizer);
      });
      var omit = flatRest(function(object, paths) {
        var result2 = {};
        if (object == null) {
          return result2;
        }
        var isDeep = false;
        paths = arrayMap2(paths, function(path) {
          path = castPath(path, object);
          isDeep || (isDeep = path.length > 1);
          return path;
        });
        copyObject(object, getAllKeysIn(object), result2);
        if (isDeep) {
          result2 = baseClone(result2, CLONE_DEEP_FLAG | CLONE_FLAT_FLAG | CLONE_SYMBOLS_FLAG, customOmitClone);
        }
        var length = paths.length;
        while (length--) {
          baseUnset(result2, paths[length]);
        }
        return result2;
      });
      function omitBy(object, predicate) {
        return pickBy(object, negate(getIteratee(predicate)));
      }
      var pick = flatRest(function(object, paths) {
        return object == null ? {} : basePick(object, paths);
      });
      function pickBy(object, predicate) {
        if (object == null) {
          return {};
        }
        var props = arrayMap2(getAllKeysIn(object), function(prop) {
          return [prop];
        });
        predicate = getIteratee(predicate);
        return basePickBy(object, props, function(value, path) {
          return predicate(value, path[0]);
        });
      }
      function result(object, path, defaultValue) {
        path = castPath(path, object);
        var index2 = -1, length = path.length;
        if (!length) {
          length = 1;
          object = undefined$1;
        }
        while (++index2 < length) {
          var value = object == null ? undefined$1 : object[toKey(path[index2])];
          if (value === undefined$1) {
            index2 = length;
            value = defaultValue;
          }
          object = isFunction(value) ? value.call(object) : value;
        }
        return object;
      }
      function set(object, path, value) {
        return object == null ? object : baseSet(object, path, value);
      }
      function setWith(object, path, value, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined$1;
        return object == null ? object : baseSet(object, path, value, customizer);
      }
      var toPairs = createToPairs(keys);
      var toPairsIn = createToPairs(keysIn);
      function transform(object, iteratee2, accumulator) {
        var isArr = isArray2(object), isArrLike = isArr || isBuffer(object) || isTypedArray(object);
        iteratee2 = getIteratee(iteratee2, 4);
        if (accumulator == null) {
          var Ctor = object && object.constructor;
          if (isArrLike) {
            accumulator = isArr ? new Ctor() : [];
          } else if (isObject(object)) {
            accumulator = isFunction(Ctor) ? baseCreate(getPrototype(object)) : {};
          } else {
            accumulator = {};
          }
        }
        (isArrLike ? arrayEach : baseForOwn)(object, function(value, index2, object2) {
          return iteratee2(accumulator, value, index2, object2);
        });
        return accumulator;
      }
      function unset(object, path) {
        return object == null ? true : baseUnset(object, path);
      }
      function update(object, path, updater) {
        return object == null ? object : baseUpdate(object, path, castFunction(updater));
      }
      function updateWith(object, path, updater, customizer) {
        customizer = typeof customizer == "function" ? customizer : undefined$1;
        return object == null ? object : baseUpdate(object, path, castFunction(updater), customizer);
      }
      function values(object) {
        return object == null ? [] : baseValues(object, keys(object));
      }
      function valuesIn(object) {
        return object == null ? [] : baseValues(object, keysIn(object));
      }
      function clamp(number, lower, upper) {
        if (upper === undefined$1) {
          upper = lower;
          lower = undefined$1;
        }
        if (upper !== undefined$1) {
          upper = toNumber(upper);
          upper = upper === upper ? upper : 0;
        }
        if (lower !== undefined$1) {
          lower = toNumber(lower);
          lower = lower === lower ? lower : 0;
        }
        return baseClamp(toNumber(number), lower, upper);
      }
      function inRange(number, start, end) {
        start = toFinite(start);
        if (end === undefined$1) {
          end = start;
          start = 0;
        } else {
          end = toFinite(end);
        }
        number = toNumber(number);
        return baseInRange(number, start, end);
      }
      function random(lower, upper, floating) {
        if (floating && typeof floating != "boolean" && isIterateeCall(lower, upper, floating)) {
          upper = floating = undefined$1;
        }
        if (floating === undefined$1) {
          if (typeof upper == "boolean") {
            floating = upper;
            upper = undefined$1;
          } else if (typeof lower == "boolean") {
            floating = lower;
            lower = undefined$1;
          }
        }
        if (lower === undefined$1 && upper === undefined$1) {
          lower = 0;
          upper = 1;
        } else {
          lower = toFinite(lower);
          if (upper === undefined$1) {
            upper = lower;
            lower = 0;
          } else {
            upper = toFinite(upper);
          }
        }
        if (lower > upper) {
          var temp = lower;
          lower = upper;
          upper = temp;
        }
        if (floating || lower % 1 || upper % 1) {
          var rand = nativeRandom();
          return nativeMin(lower + rand * (upper - lower + freeParseFloat("1e-" + ((rand + "").length - 1))), upper);
        }
        return baseRandom(lower, upper);
      }
      var camelCase = createCompounder(function(result2, word, index2) {
        word = word.toLowerCase();
        return result2 + (index2 ? capitalize(word) : word);
      });
      function capitalize(string) {
        return upperFirst(toString2(string).toLowerCase());
      }
      function deburr(string) {
        string = toString2(string);
        return string && string.replace(reLatin, deburrLetter).replace(reComboMark, "");
      }
      function endsWith(string, target, position) {
        string = toString2(string);
        target = baseToString2(target);
        var length = string.length;
        position = position === undefined$1 ? length : baseClamp(toInteger(position), 0, length);
        var end = position;
        position -= target.length;
        return position >= 0 && string.slice(position, end) == target;
      }
      function escape(string) {
        string = toString2(string);
        return string && reHasUnescapedHtml.test(string) ? string.replace(reUnescapedHtml, escapeHtmlChar) : string;
      }
      function escapeRegExp(string) {
        string = toString2(string);
        return string && reHasRegExpChar.test(string) ? string.replace(reRegExpChar, "\\$&") : string;
      }
      var kebabCase = createCompounder(function(result2, word, index2) {
        return result2 + (index2 ? "-" : "") + word.toLowerCase();
      });
      var lowerCase = createCompounder(function(result2, word, index2) {
        return result2 + (index2 ? " " : "") + word.toLowerCase();
      });
      var lowerFirst = createCaseFirst("toLowerCase");
      function pad(string, length, chars) {
        string = toString2(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        if (!length || strLength >= length) {
          return string;
        }
        var mid = (length - strLength) / 2;
        return createPadding(nativeFloor(mid), chars) + string + createPadding(nativeCeil(mid), chars);
      }
      function padEnd(string, length, chars) {
        string = toString2(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        return length && strLength < length ? string + createPadding(length - strLength, chars) : string;
      }
      function padStart(string, length, chars) {
        string = toString2(string);
        length = toInteger(length);
        var strLength = length ? stringSize(string) : 0;
        return length && strLength < length ? createPadding(length - strLength, chars) + string : string;
      }
      function parseInt2(string, radix, guard) {
        if (guard || radix == null) {
          radix = 0;
        } else if (radix) {
          radix = +radix;
        }
        return nativeParseInt(toString2(string).replace(reTrimStart, ""), radix || 0);
      }
      function repeat(string, n, guard) {
        if (guard ? isIterateeCall(string, n, guard) : n === undefined$1) {
          n = 1;
        } else {
          n = toInteger(n);
        }
        return baseRepeat(toString2(string), n);
      }
      function replace() {
        var args = arguments, string = toString2(args[0]);
        return args.length < 3 ? string : string.replace(args[1], args[2]);
      }
      var snakeCase = createCompounder(function(result2, word, index2) {
        return result2 + (index2 ? "_" : "") + word.toLowerCase();
      });
      function split(string, separator, limit) {
        if (limit && typeof limit != "number" && isIterateeCall(string, separator, limit)) {
          separator = limit = undefined$1;
        }
        limit = limit === undefined$1 ? MAX_ARRAY_LENGTH : limit >>> 0;
        if (!limit) {
          return [];
        }
        string = toString2(string);
        if (string && (typeof separator == "string" || separator != null && !isRegExp(separator))) {
          separator = baseToString2(separator);
          if (!separator && hasUnicode(string)) {
            return castSlice(stringToArray(string), 0, limit);
          }
        }
        return string.split(separator, limit);
      }
      var startCase = createCompounder(function(result2, word, index2) {
        return result2 + (index2 ? " " : "") + upperFirst(word);
      });
      function startsWith(string, target, position) {
        string = toString2(string);
        position = position == null ? 0 : baseClamp(toInteger(position), 0, string.length);
        target = baseToString2(target);
        return string.slice(position, position + target.length) == target;
      }
      function template(string, options, guard) {
        var settings = lodash2.templateSettings;
        if (guard && isIterateeCall(string, options, guard)) {
          options = undefined$1;
        }
        string = toString2(string);
        options = assignInWith({}, options, settings, customDefaultsAssignIn);
        var imports = assignInWith({}, options.imports, settings.imports, customDefaultsAssignIn), importsKeys = keys(imports), importsValues = baseValues(imports, importsKeys);
        var isEscaping, isEvaluating, index2 = 0, interpolate = options.interpolate || reNoMatch, source = "__p += '";
        var reDelimiters = RegExp2((options.escape || reNoMatch).source + "|" + interpolate.source + "|" + (interpolate === reInterpolate ? reEsTemplate : reNoMatch).source + "|" + (options.evaluate || reNoMatch).source + "|$", "g");
        var sourceURL = "//# sourceURL=" + (hasOwnProperty2.call(options, "sourceURL") ? (options.sourceURL + "").replace(/\s/g, " ") : "lodash.templateSources[" + ++templateCounter + "]") + "\n";
        string.replace(reDelimiters, function(match, escapeValue, interpolateValue, esTemplateValue, evaluateValue, offset) {
          interpolateValue || (interpolateValue = esTemplateValue);
          source += string.slice(index2, offset).replace(reUnescapedString, escapeStringChar);
          if (escapeValue) {
            isEscaping = true;
            source += "' +\n__e(" + escapeValue + ") +\n'";
          }
          if (evaluateValue) {
            isEvaluating = true;
            source += "';\n" + evaluateValue + ";\n__p += '";
          }
          if (interpolateValue) {
            source += "' +\n((__t = (" + interpolateValue + ")) == null ? '' : __t) +\n'";
          }
          index2 = offset + match.length;
          return match;
        });
        source += "';\n";
        var variable = hasOwnProperty2.call(options, "variable") && options.variable;
        if (!variable) {
          source = "with (obj) {\n" + source + "\n}\n";
        } else if (reForbiddenIdentifierChars.test(variable)) {
          throw new Error3(INVALID_TEMPL_VAR_ERROR_TEXT);
        }
        source = (isEvaluating ? source.replace(reEmptyStringLeading, "") : source).replace(reEmptyStringMiddle, "$1").replace(reEmptyStringTrailing, "$1;");
        source = "function(" + (variable || "obj") + ") {\n" + (variable ? "" : "obj || (obj = {});\n") + "var __t, __p = ''" + (isEscaping ? ", __e = _.escape" : "") + (isEvaluating ? ", __j = Array.prototype.join;\nfunction print() { __p += __j.call(arguments, '') }\n" : ";\n") + source + "return __p\n}";
        var result2 = attempt(function() {
          return Function2(importsKeys, sourceURL + "return " + source).apply(undefined$1, importsValues);
        });
        result2.source = source;
        if (isError(result2)) {
          throw result2;
        }
        return result2;
      }
      function toLower(value) {
        return toString2(value).toLowerCase();
      }
      function toUpper(value) {
        return toString2(value).toUpperCase();
      }
      function trim(string, chars, guard) {
        string = toString2(string);
        if (string && (guard || chars === undefined$1)) {
          return baseTrim(string);
        }
        if (!string || !(chars = baseToString2(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string), chrSymbols = stringToArray(chars), start = charsStartIndex(strSymbols, chrSymbols), end = charsEndIndex(strSymbols, chrSymbols) + 1;
        return castSlice(strSymbols, start, end).join("");
      }
      function trimEnd(string, chars, guard) {
        string = toString2(string);
        if (string && (guard || chars === undefined$1)) {
          return string.slice(0, trimmedEndIndex(string) + 1);
        }
        if (!string || !(chars = baseToString2(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string), end = charsEndIndex(strSymbols, stringToArray(chars)) + 1;
        return castSlice(strSymbols, 0, end).join("");
      }
      function trimStart(string, chars, guard) {
        string = toString2(string);
        if (string && (guard || chars === undefined$1)) {
          return string.replace(reTrimStart, "");
        }
        if (!string || !(chars = baseToString2(chars))) {
          return string;
        }
        var strSymbols = stringToArray(string), start = charsStartIndex(strSymbols, stringToArray(chars));
        return castSlice(strSymbols, start).join("");
      }
      function truncate(string, options) {
        var length = DEFAULT_TRUNC_LENGTH, omission = DEFAULT_TRUNC_OMISSION;
        if (isObject(options)) {
          var separator = "separator" in options ? options.separator : separator;
          length = "length" in options ? toInteger(options.length) : length;
          omission = "omission" in options ? baseToString2(options.omission) : omission;
        }
        string = toString2(string);
        var strLength = string.length;
        if (hasUnicode(string)) {
          var strSymbols = stringToArray(string);
          strLength = strSymbols.length;
        }
        if (length >= strLength) {
          return string;
        }
        var end = length - stringSize(omission);
        if (end < 1) {
          return omission;
        }
        var result2 = strSymbols ? castSlice(strSymbols, 0, end).join("") : string.slice(0, end);
        if (separator === undefined$1) {
          return result2 + omission;
        }
        if (strSymbols) {
          end += result2.length - end;
        }
        if (isRegExp(separator)) {
          if (string.slice(end).search(separator)) {
            var match, substring = result2;
            if (!separator.global) {
              separator = RegExp2(separator.source, toString2(reFlags.exec(separator)) + "g");
            }
            separator.lastIndex = 0;
            while (match = separator.exec(substring)) {
              var newEnd = match.index;
            }
            result2 = result2.slice(0, newEnd === undefined$1 ? end : newEnd);
          }
        } else if (string.indexOf(baseToString2(separator), end) != end) {
          var index2 = result2.lastIndexOf(separator);
          if (index2 > -1) {
            result2 = result2.slice(0, index2);
          }
        }
        return result2 + omission;
      }
      function unescape(string) {
        string = toString2(string);
        return string && reHasEscapedHtml.test(string) ? string.replace(reEscapedHtml, unescapeHtmlChar) : string;
      }
      var upperCase = createCompounder(function(result2, word, index2) {
        return result2 + (index2 ? " " : "") + word.toUpperCase();
      });
      var upperFirst = createCaseFirst("toUpperCase");
      function words(string, pattern, guard) {
        string = toString2(string);
        pattern = guard ? undefined$1 : pattern;
        if (pattern === undefined$1) {
          return hasUnicodeWord(string) ? unicodeWords(string) : asciiWords(string);
        }
        return string.match(pattern) || [];
      }
      var attempt = baseRest(function(func, args) {
        try {
          return apply(func, undefined$1, args);
        } catch (e) {
          return isError(e) ? e : new Error3(e);
        }
      });
      var bindAll = flatRest(function(object, methodNames) {
        arrayEach(methodNames, function(key) {
          key = toKey(key);
          baseAssignValue(object, key, bind(object[key], object));
        });
        return object;
      });
      function cond(pairs) {
        var length = pairs == null ? 0 : pairs.length, toIteratee = getIteratee();
        pairs = !length ? [] : arrayMap2(pairs, function(pair) {
          if (typeof pair[1] != "function") {
            throw new TypeError2(FUNC_ERROR_TEXT);
          }
          return [toIteratee(pair[0]), pair[1]];
        });
        return baseRest(function(args) {
          var index2 = -1;
          while (++index2 < length) {
            var pair = pairs[index2];
            if (apply(pair[0], this, args)) {
              return apply(pair[1], this, args);
            }
          }
        });
      }
      function conforms(source) {
        return baseConforms(baseClone(source, CLONE_DEEP_FLAG));
      }
      function constant(value) {
        return function() {
          return value;
        };
      }
      function defaultTo(value, defaultValue) {
        return value == null || value !== value ? defaultValue : value;
      }
      var flow = createFlow();
      var flowRight = createFlow(true);
      function identity(value) {
        return value;
      }
      function iteratee(func) {
        return baseIteratee(typeof func == "function" ? func : baseClone(func, CLONE_DEEP_FLAG));
      }
      function matches(source) {
        return baseMatches(baseClone(source, CLONE_DEEP_FLAG));
      }
      function matchesProperty(path, srcValue) {
        return baseMatchesProperty(path, baseClone(srcValue, CLONE_DEEP_FLAG));
      }
      var method = baseRest(function(path, args) {
        return function(object) {
          return baseInvoke(object, path, args);
        };
      });
      var methodOf = baseRest(function(object, args) {
        return function(path) {
          return baseInvoke(object, path, args);
        };
      });
      function mixin(object, source, options) {
        var props = keys(source), methodNames = baseFunctions(source, props);
        if (options == null && !(isObject(source) && (methodNames.length || !props.length))) {
          options = source;
          source = object;
          object = this;
          methodNames = baseFunctions(source, keys(source));
        }
        var chain2 = !(isObject(options) && "chain" in options) || !!options.chain, isFunc = isFunction(object);
        arrayEach(methodNames, function(methodName) {
          var func = source[methodName];
          object[methodName] = func;
          if (isFunc) {
            object.prototype[methodName] = function() {
              var chainAll = this.__chain__;
              if (chain2 || chainAll) {
                var result2 = object(this.__wrapped__), actions = result2.__actions__ = copyArray(this.__actions__);
                actions.push({ "func": func, "args": arguments, "thisArg": object });
                result2.__chain__ = chainAll;
                return result2;
              }
              return func.apply(object, arrayPush([this.value()], arguments));
            };
          }
        });
        return object;
      }
      function noConflict() {
        if (root2._ === this) {
          root2._ = oldDash;
        }
        return this;
      }
      function noop() {
      }
      function nthArg(n) {
        n = toInteger(n);
        return baseRest(function(args) {
          return baseNth(args, n);
        });
      }
      var over = createOver(arrayMap2);
      var overEvery = createOver(arrayEvery);
      var overSome = createOver(arraySome);
      function property(path) {
        return isKey(path) ? baseProperty(toKey(path)) : basePropertyDeep(path);
      }
      function propertyOf(object) {
        return function(path) {
          return object == null ? undefined$1 : baseGet(object, path);
        };
      }
      var range = createRange();
      var rangeRight = createRange(true);
      function stubArray() {
        return [];
      }
      function stubFalse() {
        return false;
      }
      function stubObject() {
        return {};
      }
      function stubString() {
        return "";
      }
      function stubTrue() {
        return true;
      }
      function times(n, iteratee2) {
        n = toInteger(n);
        if (n < 1 || n > MAX_SAFE_INTEGER) {
          return [];
        }
        var index2 = MAX_ARRAY_LENGTH, length = nativeMin(n, MAX_ARRAY_LENGTH);
        iteratee2 = getIteratee(iteratee2);
        n -= MAX_ARRAY_LENGTH;
        var result2 = baseTimes(length, iteratee2);
        while (++index2 < n) {
          iteratee2(index2);
        }
        return result2;
      }
      function toPath(value) {
        if (isArray2(value)) {
          return arrayMap2(value, toKey);
        }
        return isSymbol2(value) ? [value] : copyArray(stringToPath(toString2(value)));
      }
      function uniqueId2(prefix) {
        var id2 = ++idCounter2;
        return toString2(prefix) + id2;
      }
      var add = createMathOperation(function(augend, addend) {
        return augend + addend;
      }, 0);
      var ceil = createRound("ceil");
      var divide = createMathOperation(function(dividend, divisor) {
        return dividend / divisor;
      }, 1);
      var floor = createRound("floor");
      function max(array) {
        return array && array.length ? baseExtremum(array, identity, baseGt) : undefined$1;
      }
      function maxBy(array, iteratee2) {
        return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseGt) : undefined$1;
      }
      function mean(array) {
        return baseMean(array, identity);
      }
      function meanBy(array, iteratee2) {
        return baseMean(array, getIteratee(iteratee2, 2));
      }
      function min(array) {
        return array && array.length ? baseExtremum(array, identity, baseLt) : undefined$1;
      }
      function minBy(array, iteratee2) {
        return array && array.length ? baseExtremum(array, getIteratee(iteratee2, 2), baseLt) : undefined$1;
      }
      var multiply = createMathOperation(function(multiplier, multiplicand) {
        return multiplier * multiplicand;
      }, 1);
      var round = createRound("round");
      var subtract = createMathOperation(function(minuend, subtrahend) {
        return minuend - subtrahend;
      }, 0);
      function sum(array) {
        return array && array.length ? baseSum(array, identity) : 0;
      }
      function sumBy(array, iteratee2) {
        return array && array.length ? baseSum(array, getIteratee(iteratee2, 2)) : 0;
      }
      lodash2.after = after;
      lodash2.ary = ary;
      lodash2.assign = assign;
      lodash2.assignIn = assignIn;
      lodash2.assignInWith = assignInWith;
      lodash2.assignWith = assignWith;
      lodash2.at = at;
      lodash2.before = before;
      lodash2.bind = bind;
      lodash2.bindAll = bindAll;
      lodash2.bindKey = bindKey;
      lodash2.castArray = castArray;
      lodash2.chain = chain;
      lodash2.chunk = chunk;
      lodash2.compact = compact;
      lodash2.concat = concat;
      lodash2.cond = cond;
      lodash2.conforms = conforms;
      lodash2.constant = constant;
      lodash2.countBy = countBy;
      lodash2.create = create;
      lodash2.curry = curry;
      lodash2.curryRight = curryRight;
      lodash2.debounce = debounce;
      lodash2.defaults = defaults;
      lodash2.defaultsDeep = defaultsDeep;
      lodash2.defer = defer;
      lodash2.delay = delay;
      lodash2.difference = difference;
      lodash2.differenceBy = differenceBy;
      lodash2.differenceWith = differenceWith;
      lodash2.drop = drop;
      lodash2.dropRight = dropRight;
      lodash2.dropRightWhile = dropRightWhile;
      lodash2.dropWhile = dropWhile;
      lodash2.fill = fill;
      lodash2.filter = filter;
      lodash2.flatMap = flatMap;
      lodash2.flatMapDeep = flatMapDeep;
      lodash2.flatMapDepth = flatMapDepth;
      lodash2.flatten = flatten;
      lodash2.flattenDeep = flattenDeep;
      lodash2.flattenDepth = flattenDepth;
      lodash2.flip = flip;
      lodash2.flow = flow;
      lodash2.flowRight = flowRight;
      lodash2.fromPairs = fromPairs;
      lodash2.functions = functions;
      lodash2.functionsIn = functionsIn;
      lodash2.groupBy = groupBy;
      lodash2.initial = initial;
      lodash2.intersection = intersection;
      lodash2.intersectionBy = intersectionBy;
      lodash2.intersectionWith = intersectionWith;
      lodash2.invert = invert;
      lodash2.invertBy = invertBy;
      lodash2.invokeMap = invokeMap;
      lodash2.iteratee = iteratee;
      lodash2.keyBy = keyBy;
      lodash2.keys = keys;
      lodash2.keysIn = keysIn;
      lodash2.map = map;
      lodash2.mapKeys = mapKeys;
      lodash2.mapValues = mapValues;
      lodash2.matches = matches;
      lodash2.matchesProperty = matchesProperty;
      lodash2.memoize = memoize;
      lodash2.merge = merge;
      lodash2.mergeWith = mergeWith;
      lodash2.method = method;
      lodash2.methodOf = methodOf;
      lodash2.mixin = mixin;
      lodash2.negate = negate;
      lodash2.nthArg = nthArg;
      lodash2.omit = omit;
      lodash2.omitBy = omitBy;
      lodash2.once = once;
      lodash2.orderBy = orderBy;
      lodash2.over = over;
      lodash2.overArgs = overArgs;
      lodash2.overEvery = overEvery;
      lodash2.overSome = overSome;
      lodash2.partial = partial;
      lodash2.partialRight = partialRight;
      lodash2.partition = partition;
      lodash2.pick = pick;
      lodash2.pickBy = pickBy;
      lodash2.property = property;
      lodash2.propertyOf = propertyOf;
      lodash2.pull = pull;
      lodash2.pullAll = pullAll;
      lodash2.pullAllBy = pullAllBy;
      lodash2.pullAllWith = pullAllWith;
      lodash2.pullAt = pullAt;
      lodash2.range = range;
      lodash2.rangeRight = rangeRight;
      lodash2.rearg = rearg;
      lodash2.reject = reject;
      lodash2.remove = remove;
      lodash2.rest = rest;
      lodash2.reverse = reverse;
      lodash2.sampleSize = sampleSize;
      lodash2.set = set;
      lodash2.setWith = setWith;
      lodash2.shuffle = shuffle;
      lodash2.slice = slice;
      lodash2.sortBy = sortBy;
      lodash2.sortedUniq = sortedUniq;
      lodash2.sortedUniqBy = sortedUniqBy;
      lodash2.split = split;
      lodash2.spread = spread;
      lodash2.tail = tail;
      lodash2.take = take;
      lodash2.takeRight = takeRight;
      lodash2.takeRightWhile = takeRightWhile;
      lodash2.takeWhile = takeWhile;
      lodash2.tap = tap;
      lodash2.throttle = throttle;
      lodash2.thru = thru;
      lodash2.toArray = toArray;
      lodash2.toPairs = toPairs;
      lodash2.toPairsIn = toPairsIn;
      lodash2.toPath = toPath;
      lodash2.toPlainObject = toPlainObject;
      lodash2.transform = transform;
      lodash2.unary = unary;
      lodash2.union = union;
      lodash2.unionBy = unionBy;
      lodash2.unionWith = unionWith;
      lodash2.uniq = uniq;
      lodash2.uniqBy = uniqBy;
      lodash2.uniqWith = uniqWith;
      lodash2.unset = unset;
      lodash2.unzip = unzip;
      lodash2.unzipWith = unzipWith;
      lodash2.update = update;
      lodash2.updateWith = updateWith;
      lodash2.values = values;
      lodash2.valuesIn = valuesIn;
      lodash2.without = without;
      lodash2.words = words;
      lodash2.wrap = wrap;
      lodash2.xor = xor;
      lodash2.xorBy = xorBy;
      lodash2.xorWith = xorWith;
      lodash2.zip = zip;
      lodash2.zipObject = zipObject;
      lodash2.zipObjectDeep = zipObjectDeep;
      lodash2.zipWith = zipWith;
      lodash2.entries = toPairs;
      lodash2.entriesIn = toPairsIn;
      lodash2.extend = assignIn;
      lodash2.extendWith = assignInWith;
      mixin(lodash2, lodash2);
      lodash2.add = add;
      lodash2.attempt = attempt;
      lodash2.camelCase = camelCase;
      lodash2.capitalize = capitalize;
      lodash2.ceil = ceil;
      lodash2.clamp = clamp;
      lodash2.clone = clone;
      lodash2.cloneDeep = cloneDeep;
      lodash2.cloneDeepWith = cloneDeepWith;
      lodash2.cloneWith = cloneWith;
      lodash2.conformsTo = conformsTo;
      lodash2.deburr = deburr;
      lodash2.defaultTo = defaultTo;
      lodash2.divide = divide;
      lodash2.endsWith = endsWith;
      lodash2.eq = eq;
      lodash2.escape = escape;
      lodash2.escapeRegExp = escapeRegExp;
      lodash2.every = every;
      lodash2.find = find;
      lodash2.findIndex = findIndex;
      lodash2.findKey = findKey;
      lodash2.findLast = findLast;
      lodash2.findLastIndex = findLastIndex;
      lodash2.findLastKey = findLastKey;
      lodash2.floor = floor;
      lodash2.forEach = forEach;
      lodash2.forEachRight = forEachRight;
      lodash2.forIn = forIn;
      lodash2.forInRight = forInRight;
      lodash2.forOwn = forOwn;
      lodash2.forOwnRight = forOwnRight;
      lodash2.get = get;
      lodash2.gt = gt;
      lodash2.gte = gte;
      lodash2.has = has;
      lodash2.hasIn = hasIn;
      lodash2.head = head;
      lodash2.identity = identity;
      lodash2.includes = includes;
      lodash2.indexOf = indexOf;
      lodash2.inRange = inRange;
      lodash2.invoke = invoke;
      lodash2.isArguments = isArguments;
      lodash2.isArray = isArray2;
      lodash2.isArrayBuffer = isArrayBuffer;
      lodash2.isArrayLike = isArrayLike;
      lodash2.isArrayLikeObject = isArrayLikeObject;
      lodash2.isBoolean = isBoolean;
      lodash2.isBuffer = isBuffer;
      lodash2.isDate = isDate;
      lodash2.isElement = isElement;
      lodash2.isEmpty = isEmpty;
      lodash2.isEqual = isEqual;
      lodash2.isEqualWith = isEqualWith;
      lodash2.isError = isError;
      lodash2.isFinite = isFinite;
      lodash2.isFunction = isFunction;
      lodash2.isInteger = isInteger;
      lodash2.isLength = isLength;
      lodash2.isMap = isMap;
      lodash2.isMatch = isMatch;
      lodash2.isMatchWith = isMatchWith;
      lodash2.isNaN = isNaN;
      lodash2.isNative = isNative;
      lodash2.isNil = isNil;
      lodash2.isNull = isNull;
      lodash2.isNumber = isNumber;
      lodash2.isObject = isObject;
      lodash2.isObjectLike = isObjectLike2;
      lodash2.isPlainObject = isPlainObject;
      lodash2.isRegExp = isRegExp;
      lodash2.isSafeInteger = isSafeInteger;
      lodash2.isSet = isSet;
      lodash2.isString = isString;
      lodash2.isSymbol = isSymbol2;
      lodash2.isTypedArray = isTypedArray;
      lodash2.isUndefined = isUndefined;
      lodash2.isWeakMap = isWeakMap;
      lodash2.isWeakSet = isWeakSet;
      lodash2.join = join;
      lodash2.kebabCase = kebabCase;
      lodash2.last = last;
      lodash2.lastIndexOf = lastIndexOf;
      lodash2.lowerCase = lowerCase;
      lodash2.lowerFirst = lowerFirst;
      lodash2.lt = lt;
      lodash2.lte = lte;
      lodash2.max = max;
      lodash2.maxBy = maxBy;
      lodash2.mean = mean;
      lodash2.meanBy = meanBy;
      lodash2.min = min;
      lodash2.minBy = minBy;
      lodash2.stubArray = stubArray;
      lodash2.stubFalse = stubFalse;
      lodash2.stubObject = stubObject;
      lodash2.stubString = stubString;
      lodash2.stubTrue = stubTrue;
      lodash2.multiply = multiply;
      lodash2.nth = nth;
      lodash2.noConflict = noConflict;
      lodash2.noop = noop;
      lodash2.now = now;
      lodash2.pad = pad;
      lodash2.padEnd = padEnd;
      lodash2.padStart = padStart;
      lodash2.parseInt = parseInt2;
      lodash2.random = random;
      lodash2.reduce = reduce;
      lodash2.reduceRight = reduceRight;
      lodash2.repeat = repeat;
      lodash2.replace = replace;
      lodash2.result = result;
      lodash2.round = round;
      lodash2.runInContext = runInContext2;
      lodash2.sample = sample;
      lodash2.size = size;
      lodash2.snakeCase = snakeCase;
      lodash2.some = some;
      lodash2.sortedIndex = sortedIndex;
      lodash2.sortedIndexBy = sortedIndexBy;
      lodash2.sortedIndexOf = sortedIndexOf;
      lodash2.sortedLastIndex = sortedLastIndex;
      lodash2.sortedLastIndexBy = sortedLastIndexBy;
      lodash2.sortedLastIndexOf = sortedLastIndexOf;
      lodash2.startCase = startCase;
      lodash2.startsWith = startsWith;
      lodash2.subtract = subtract;
      lodash2.sum = sum;
      lodash2.sumBy = sumBy;
      lodash2.template = template;
      lodash2.times = times;
      lodash2.toFinite = toFinite;
      lodash2.toInteger = toInteger;
      lodash2.toLength = toLength;
      lodash2.toLower = toLower;
      lodash2.toNumber = toNumber;
      lodash2.toSafeInteger = toSafeInteger;
      lodash2.toString = toString2;
      lodash2.toUpper = toUpper;
      lodash2.trim = trim;
      lodash2.trimEnd = trimEnd;
      lodash2.trimStart = trimStart;
      lodash2.truncate = truncate;
      lodash2.unescape = unescape;
      lodash2.uniqueId = uniqueId2;
      lodash2.upperCase = upperCase;
      lodash2.upperFirst = upperFirst;
      lodash2.each = forEach;
      lodash2.eachRight = forEachRight;
      lodash2.first = head;
      mixin(lodash2, function() {
        var source = {};
        baseForOwn(lodash2, function(func, methodName) {
          if (!hasOwnProperty2.call(lodash2.prototype, methodName)) {
            source[methodName] = func;
          }
        });
        return source;
      }(), { "chain": false });
      lodash2.VERSION = VERSION;
      arrayEach(["bind", "bindKey", "curry", "curryRight", "partial", "partialRight"], function(methodName) {
        lodash2[methodName].placeholder = lodash2;
      });
      arrayEach(["drop", "take"], function(methodName, index2) {
        LazyWrapper.prototype[methodName] = function(n) {
          n = n === undefined$1 ? 1 : nativeMax(toInteger(n), 0);
          var result2 = this.__filtered__ && !index2 ? new LazyWrapper(this) : this.clone();
          if (result2.__filtered__) {
            result2.__takeCount__ = nativeMin(n, result2.__takeCount__);
          } else {
            result2.__views__.push({
              "size": nativeMin(n, MAX_ARRAY_LENGTH),
              "type": methodName + (result2.__dir__ < 0 ? "Right" : "")
            });
          }
          return result2;
        };
        LazyWrapper.prototype[methodName + "Right"] = function(n) {
          return this.reverse()[methodName](n).reverse();
        };
      });
      arrayEach(["filter", "map", "takeWhile"], function(methodName, index2) {
        var type = index2 + 1, isFilter = type == LAZY_FILTER_FLAG || type == LAZY_WHILE_FLAG;
        LazyWrapper.prototype[methodName] = function(iteratee2) {
          var result2 = this.clone();
          result2.__iteratees__.push({
            "iteratee": getIteratee(iteratee2, 3),
            "type": type
          });
          result2.__filtered__ = result2.__filtered__ || isFilter;
          return result2;
        };
      });
      arrayEach(["head", "last"], function(methodName, index2) {
        var takeName = "take" + (index2 ? "Right" : "");
        LazyWrapper.prototype[methodName] = function() {
          return this[takeName](1).value()[0];
        };
      });
      arrayEach(["initial", "tail"], function(methodName, index2) {
        var dropName = "drop" + (index2 ? "" : "Right");
        LazyWrapper.prototype[methodName] = function() {
          return this.__filtered__ ? new LazyWrapper(this) : this[dropName](1);
        };
      });
      LazyWrapper.prototype.compact = function() {
        return this.filter(identity);
      };
      LazyWrapper.prototype.find = function(predicate) {
        return this.filter(predicate).head();
      };
      LazyWrapper.prototype.findLast = function(predicate) {
        return this.reverse().find(predicate);
      };
      LazyWrapper.prototype.invokeMap = baseRest(function(path, args) {
        if (typeof path == "function") {
          return new LazyWrapper(this);
        }
        return this.map(function(value) {
          return baseInvoke(value, path, args);
        });
      });
      LazyWrapper.prototype.reject = function(predicate) {
        return this.filter(negate(getIteratee(predicate)));
      };
      LazyWrapper.prototype.slice = function(start, end) {
        start = toInteger(start);
        var result2 = this;
        if (result2.__filtered__ && (start > 0 || end < 0)) {
          return new LazyWrapper(result2);
        }
        if (start < 0) {
          result2 = result2.takeRight(-start);
        } else if (start) {
          result2 = result2.drop(start);
        }
        if (end !== undefined$1) {
          end = toInteger(end);
          result2 = end < 0 ? result2.dropRight(-end) : result2.take(end - start);
        }
        return result2;
      };
      LazyWrapper.prototype.takeRightWhile = function(predicate) {
        return this.reverse().takeWhile(predicate).reverse();
      };
      LazyWrapper.prototype.toArray = function() {
        return this.take(MAX_ARRAY_LENGTH);
      };
      baseForOwn(LazyWrapper.prototype, function(func, methodName) {
        var checkIteratee = /^(?:filter|find|map|reject)|While$/.test(methodName), isTaker = /^(?:head|last)$/.test(methodName), lodashFunc = lodash2[isTaker ? "take" + (methodName == "last" ? "Right" : "") : methodName], retUnwrapped = isTaker || /^find/.test(methodName);
        if (!lodashFunc) {
          return;
        }
        lodash2.prototype[methodName] = function() {
          var value = this.__wrapped__, args = isTaker ? [1] : arguments, isLazy = value instanceof LazyWrapper, iteratee2 = args[0], useLazy = isLazy || isArray2(value);
          var interceptor = function(value2) {
            var result3 = lodashFunc.apply(lodash2, arrayPush([value2], args));
            return isTaker && chainAll ? result3[0] : result3;
          };
          if (useLazy && checkIteratee && typeof iteratee2 == "function" && iteratee2.length != 1) {
            isLazy = useLazy = false;
          }
          var chainAll = this.__chain__, isHybrid = !!this.__actions__.length, isUnwrapped = retUnwrapped && !chainAll, onlyLazy = isLazy && !isHybrid;
          if (!retUnwrapped && useLazy) {
            value = onlyLazy ? value : new LazyWrapper(this);
            var result2 = func.apply(value, args);
            result2.__actions__.push({ "func": thru, "args": [interceptor], "thisArg": undefined$1 });
            return new LodashWrapper(result2, chainAll);
          }
          if (isUnwrapped && onlyLazy) {
            return func.apply(this, args);
          }
          result2 = this.thru(interceptor);
          return isUnwrapped ? isTaker ? result2.value()[0] : result2.value() : result2;
        };
      });
      arrayEach(["pop", "push", "shift", "sort", "splice", "unshift"], function(methodName) {
        var func = arrayProto[methodName], chainName = /^(?:push|sort|unshift)$/.test(methodName) ? "tap" : "thru", retUnwrapped = /^(?:pop|shift)$/.test(methodName);
        lodash2.prototype[methodName] = function() {
          var args = arguments;
          if (retUnwrapped && !this.__chain__) {
            var value = this.value();
            return func.apply(isArray2(value) ? value : [], args);
          }
          return this[chainName](function(value2) {
            return func.apply(isArray2(value2) ? value2 : [], args);
          });
        };
      });
      baseForOwn(LazyWrapper.prototype, function(func, methodName) {
        var lodashFunc = lodash2[methodName];
        if (lodashFunc) {
          var key = lodashFunc.name + "";
          if (!hasOwnProperty2.call(realNames, key)) {
            realNames[key] = [];
          }
          realNames[key].push({ "name": methodName, "func": lodashFunc });
        }
      });
      realNames[createHybrid(undefined$1, WRAP_BIND_KEY_FLAG).name] = [{
        "name": "wrapper",
        "func": undefined$1
      }];
      LazyWrapper.prototype.clone = lazyClone;
      LazyWrapper.prototype.reverse = lazyReverse;
      LazyWrapper.prototype.value = lazyValue;
      lodash2.prototype.at = wrapperAt;
      lodash2.prototype.chain = wrapperChain;
      lodash2.prototype.commit = wrapperCommit;
      lodash2.prototype.next = wrapperNext;
      lodash2.prototype.plant = wrapperPlant;
      lodash2.prototype.reverse = wrapperReverse;
      lodash2.prototype.toJSON = lodash2.prototype.valueOf = lodash2.prototype.value = wrapperValue;
      lodash2.prototype.first = lodash2.prototype.head;
      if (symIterator) {
        lodash2.prototype[symIterator] = wrapperToIterator;
      }
      return lodash2;
    };
    var _ = runInContext();
    if (freeModule) {
      (freeModule.exports = _)._ = _;
      freeExports._ = _;
    } else {
      root2._ = _;
    }
  }).call(commonjsGlobal);
})(lodash, lodash.exports);
const computeIdealSide = (side, referenceRect, floatingRect, padding, offset) => {
  const top = referenceRect.top - floatingRect.height - padding - offset;
  const left = referenceRect.left - floatingRect.width - padding - offset;
  const right = window.innerWidth - referenceRect.left - referenceRect.width - floatingRect.width - padding - offset;
  const bottom = window.innerHeight - referenceRect.top - referenceRect.height - floatingRect.height - padding - offset;
  if (side === "top" && top < 0 && bottom > top)
    return "bottom";
  if (side === "right" && right < 0 && left > right)
    return "left";
  if (side === "bottom" && bottom < 0 && top > bottom)
    return "top";
  if (side === "left" && left < 0 && right > left)
    return "right";
  return side;
};
const computeCoordRange = (referenceRect, floatingRect, padding) => ({
  minX: -referenceRect.x + padding,
  maxX: window.innerWidth - floatingRect.width - referenceRect.x - padding,
  minY: -referenceRect.y + padding,
  maxY: window.innerHeight - floatingRect.height - referenceRect.y - padding
});
const computeCoordsFromPlacement = (reference, floating, placement, padding, offset, flip = true, shift = true) => {
  const [side, alignment] = placement.split("-");
  const commonX = reference.width / 2 - floating.width / 2;
  const commonY = reference.height / 2 - floating.height / 2;
  const mainAxis = ["top", "bottom"].includes(side) ? "x" : "y";
  const length = mainAxis === "y" ? "height" : "width";
  const commonAlign = reference[length] / 2 - floating[length] / 2;
  const idealSide = flip ? computeIdealSide(side, reference, floating, padding, offset) : side;
  let coords;
  switch (idealSide) {
    case "top":
      coords = {
        x: commonX,
        y: -floating.height - offset
      };
      break;
    case "bottom":
      coords = {
        x: commonX,
        y: reference.height + offset
      };
      break;
    case "right":
      coords = {
        x: reference.width + offset,
        y: commonY
      };
      break;
    case "left":
      coords = {
        x: -floating.width - offset,
        y: commonY
      };
      break;
    default:
      coords = {
        x: reference.x,
        y: reference.y
      };
  }
  switch (alignment) {
    case "start":
      coords[mainAxis] -= commonAlign;
      break;
    case "end":
      coords[mainAxis] += commonAlign;
      break;
  }
  if (shift) {
    const coordsRange = computeCoordRange(reference, floating, padding);
    switch (mainAxis) {
      case "x":
        coords.x = lodash.exports.clamp(coords.x, coordsRange.minX, coordsRange.maxX);
        break;
      default:
        coords.y = lodash.exports.clamp(coords.y, coordsRange.minY, coordsRange.maxY);
        break;
    }
  }
  return __spreadProps(__spreadValues({}, coords), {
    side: idealSide
  });
};
const DynamicPopoverContainer = styled.div`
  position: relative;
  display: inline-block;
`;
const DynamicPopover = ({
  popover,
  children,
  placement = "top-center",
  offset = 10,
  padding = 20,
  flip = true,
  shift = true
}) => {
  const [open, setOpen] = React.useState(false);
  const [popoverProps, setPopoverProps] = React.useState({
    x: 0,
    y: 0,
    side: "top"
  });
  const containerRef = React.useRef(null);
  const floatingRef = React.useRef(null);
  const computePopoverProps = React.useCallback((container, floating) => {
    const fRect = floating.getBoundingClientRect();
    const rRect = container.getBoundingClientRect();
    const props = computeCoordsFromPlacement(rRect, fRect, placement, padding, offset, flip, shift);
    setPopoverProps(props);
  }, [placement, padding, offset, flip, shift, setPopoverProps]);
  const handleClickOutside = (e) => {
    if (containerRef.current && !containerRef.current.contains(e.target)) {
      setOpen(false);
    }
  };
  React.useEffect(() => {
    if (containerRef.current && floatingRef.current && open) {
      computePopoverProps(containerRef.current, floatingRef.current);
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open, computePopoverProps]);
  return /* @__PURE__ */ React.createElement(DynamicPopoverContainer, {
    "data-testid": "dynamicpopover",
    ref: containerRef
  }, React.isValidElement(children) && React.cloneElement(children, {
    open,
    onClick: () => setOpen((o) => !o)
  }), React.isValidElement(popover) && React.cloneElement(popover, __spreadValues({
    ref: floatingRef,
    open
  }, popoverProps)));
};
DynamicPopover.displayName = "DynamicPopover";
const Container$5 = styled.div`
  align-items: center;
  justify-content: center;
  display: flex;
  height: ${tokens.space.full};
  width: ${tokens.space.full};
`;
const Backdrop = ({
  children,
  surface,
  onDismiss,
  open
}) => {
  const boxRef = React.useRef(null);
  const Background = surface || BackdropSurface;
  const dismissClick = (e) => e.target === boxRef.current && onDismiss && onDismiss();
  return open ? /* @__PURE__ */ React.createElement(Portal, {
    className: "modal"
  }, /* @__PURE__ */ React.createElement(Background, {
    onClick: dismissClick
  }, /* @__PURE__ */ React.createElement(Container$5, {
    ref: boxRef
  }, children))) : null;
};
const Input$2 = styled.input`
  cursor: pointer;
  margin: ${tokens.space["1"]} 0;

  ${({
  theme,
  variant
}) => {
  switch (variant) {
    case "regular":
      return `
          width: ${tokens.space["7"]};
          height: ${tokens.space["7"]};
          font: inherit;
          border-radius: ${tokens.space["2"]};
          display: grid;
          place-content: center;
          transition: transform 150ms ease-in-out, filter 150ms ease-in-out;
          
          &:hover {
            transform: translateY(-1px);
            filter: contrast(0.7);
          }
          
          &:active {
            transform: translateY(0px);
            filter: contrast(1);
          }
          
          &::before {
            content: '';
            background-color: ${tokens.colors[theme.mode].accent};
            mask-image: ${`url('data:image/svg+xml; utf8, <svg width="${tokens.space["4"]}" height="${tokens.space["4"]}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12.625L10.125 20.125L22 3.875" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>')`};
            width: ${tokens.space["4"]};
            height: ${tokens.space["4"]};
            transform: scale(0);
            transition: transform 90ms ease-in-out;
          }
          
          &:checked::before {
            transform: scale(1);
          }
        `;
    case "switch":
      return `
          display: grid;
          place-content: center;
          transition: transform 150ms ease-in-out, filter 150ms ease-in-out;
          background-color: ${tokens.colors[theme.mode].accent};
          filter: grayscale(1) brightness(1.5);
          
          &:hover {
            transform: translateY(-1px);
            filter: contrast(0.7);
          }
          
          &:active {
            transform: translateY(0px);
            filter: grayscale(1) brightness(1.5);
          }
          
          &:checked:hover {
            filter: grayscale(0) brightness(1.05);
          }
          
          &:checked:active {
            filter: grayscale(0) brightness(1);
          }
          
          &::before {
            content: '';
            background-color: ${tokens.colors.base.white};
            border-radius: ${tokens.radii["full"]};
            transform: translateX(-50%);
            transition: transform 90ms ease-in-out;
          }
          
          &:checked::before {
            transform: translateX(50%);
          }
          
          &:checked {
            filter: grayscale(0) brightness(1);
          }
        `;
    default:
      return ``;
  }
}}

  ${({
  theme,
  color
}) => {
  switch (color) {
    case "grey":
      return `
          background-color: ${tokens.colors[theme.mode].grey};
        `;
    case "white":
      return `
          background-color: white;
        `;
    default:
      return ``;
  }
}}

  ${({
  variant,
  size
}) => {
  if (variant === "switch" && size) {
    switch (size) {
      case "small":
        return `
            width: ${tokens.space["7"]};
        `;
      case "medium":
        return `
        `;
      case "large":
        return `
        `;
      default:
        return ``;
    }
  }
}}
`;
const Checkbox = React.forwardRef((_a, ref) => {
  var _b = _a, {
    description,
    disabled,
    error,
    hideLabel,
    id: id2,
    label,
    labelSecondary,
    name,
    required,
    tabIndex,
    value,
    checked,
    width,
    onBlur,
    onChange,
    onFocus,
    variant = "regular",
    color = "grey",
    size = "small"
  } = _b, props = __objRest(_b, [
    "description",
    "disabled",
    "error",
    "hideLabel",
    "id",
    "label",
    "labelSecondary",
    "name",
    "required",
    "tabIndex",
    "value",
    "checked",
    "width",
    "onBlur",
    "onChange",
    "onFocus",
    "variant",
    "color",
    "size"
  ]);
  const defaultRef = React.useRef(null);
  const inputRef = ref || defaultRef;
  return /* @__PURE__ */ React.createElement(Field, {
    description,
    error,
    hideLabel,
    id: id2,
    inline: true,
    label,
    labelSecondary,
    required,
    width
  }, /* @__PURE__ */ React.createElement(Input$2, __spreadValues({
    "aria-invalid": error ? true : void 0,
    "data-testid": "checkbox",
    ref: inputRef,
    type: "checkbox"
  }, __spreadValues({
    color,
    variant,
    size,
    disabled,
    name,
    tabIndex,
    value,
    onBlur,
    onChange,
    onFocus,
    checked
  }, props))));
});
Checkbox.displayName = "Checkbox";
const NumberBox = styled.div`
  position: absolute;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: bold;

  ${({
  theme
}) => `
    color: ${tokens.colors[theme.mode].accent};
  `}

  ${({
  theme,
  disabled
}) => disabled && `
    color: ${tokens.colors[theme.mode].textPlaceholder};
  `}

  ${({
  size
}) => {
  switch (size) {
    case "small":
      return `
          height: ${tokens.space["16"]};
          width: ${tokens.space["16"]};
        `;
    case "large":
      return `
          font-size: ${tokens.fontSizes.extraLarge};
          margin-top: -${tokens.space["0.5"]};
          height: ${tokens.space["24"]};
          width: ${tokens.space["24"]};
        `;
    default:
      return ``;
  }
}}
`;
const Container$4 = styled.div`
  ${({
  theme
}) => `
    stroke: ${tokens.colors[theme.mode].accent};
  `}

  ${({
  theme,
  color
}) => `
    color: ${tokens.colors[theme.mode][color]};
  `}

  ${({
  theme,
  disabled
}) => disabled && `
    color: ${tokens.colors[theme.mode].foregroundSecondary};
  `}

  ${({
  size
}) => {
  switch (size) {
    case "small":
      return `
          height: ${tokens.space["16"]};
          width: ${tokens.space["16"]};
          stroke-width: ${tokens.space["1"]};
        `;
    case "large":
      return `
          height: ${tokens.space["24"]};
          width: ${tokens.space["24"]};
          stroke-width: ${tokens.space["1"]};
        `;
    default:
      return ``;
  }
}}
`;
const Circle = styled.circle`
  transition: all 1s linear, stroke-width 0.2s ease-in-out 1s;

  ${({
  finished
}) => finished && `stroke-width: 0;`}
`;
const CountdownCircle = React.forwardRef(({
  accessibilityLabel,
  color = "textSecondary",
  size = "small",
  countdownAmount,
  disabled,
  callback
}, ref) => {
  const [totalCount, setTotalCount] = React.useState(0);
  const [currentCount, setCurrentCount] = React.useState(0);
  React.useEffect(() => {
    setTotalCount(countdownAmount);
    if (!disabled) {
      setCurrentCount(countdownAmount);
      const countInterval = setInterval(() => {
        setCurrentCount((prevCount) => {
          if (prevCount === 1) {
            clearInterval(countInterval);
            callback && callback();
          }
          return prevCount - 1 ? prevCount - 1 : 0;
        });
      }, 1e3);
      return () => clearInterval(countInterval);
    }
  }, [callback, countdownAmount, disabled]);
  return /* @__PURE__ */ React.createElement("div", {
    "data-testid": "countdown-circle",
    style: {
      position: "relative"
    }
  }, /* @__PURE__ */ React.createElement(NumberBox, __spreadValues({}, {
    size,
    disabled
  }), disabled ? totalCount : currentCount), /* @__PURE__ */ React.createElement(Container$4, __spreadValues({}, {
    size,
    disabled,
    color,
    ref
  }), accessibilityLabel && /* @__PURE__ */ React.createElement(VisuallyHidden, null, accessibilityLabel), /* @__PURE__ */ React.createElement("svg", {
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ React.createElement(Circle, {
    cx: "12",
    cy: "12",
    fill: "none",
    finished: currentCount === 0,
    r: "9",
    strokeDasharray: `${48 * (currentCount / totalCount)}, 56`,
    strokeLinecap: "round"
  }), /* @__PURE__ */ React.createElement("circle", {
    cx: "12",
    cy: "12",
    fill: "none",
    opacity: disabled ? "1" : "0.25",
    r: "9",
    strokeLinecap: "round"
  }))));
});
CountdownCircle.displayName = "CountdownCircle";
const ReactComponent$K = (_c) => {
  var _d = _c, {
    title,
    titleId
  } = _d, props = __objRest(_d, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    d: "M11.2552 17.8659C11.6526 18.3095 12.3474 18.3095 12.7448 17.8659L22.5063 6.97001C23.0833 6.32597 22.6262 5.30274 21.7615 5.30274H2.2385C1.37381 5.30274 0.916704 6.32597 1.49369 6.97001L11.2552 17.8659Z",
    fill: "currentColor"
  }));
};
const DropdownMenuContainer = styled.div`
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${tokens.radii["medium"]};
  position: absolute;

  ${({
  labelAlign
}) => labelAlign && `
    & > button {
      justify-content: ${labelAlign};
    }
  `}

  ${({
  opened
}) => opened ? `
    visibility: visible;
    opacity: 1;
  ` : `
    z-index: 0;
    visibility: hidden;
    opacity: 0;
  `}

  ${({
  theme
}) => `
    padding: ${tokens.space["1.5"]};
    background-color: ${tokens.colors[theme.mode].groupBackground};
    box-shadow: ${tokens.boxShadows[theme.mode]["0.02"]};
    border-radius: ${tokens.radii["2xLarge"]};
  `}

  ${({
  theme,
  inner
}) => inner && `
    background-color: ${tokens.colors[theme.mode].grey};
    border-radius: ${tokens.radii.almostExtraLarge};
    border-top-radius: none;
    box-shadow: 0;
    border-width: ${tokens.space["px"]};
    border-top-width: 0;
    border-color: ${tokens.colors[theme.mode].borderSecondary};
    padding: 0 ${tokens.space["1.5"]};
    padding-top: ${tokens.space["2.5"]};
    padding-bottom: ${tokens.space["1.5"]};
    margin-top: -${tokens.space["2.5"]};
    transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6);
  `}

  ${({
  opened,
  inner
}) => {
  if (opened && !inner)
    return `
      z-index: 20;
      margin-top: ${tokens.space["1.5"]};
      transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear, z-index 0s linear 0.3s;
    `;
  if (!opened && !inner)
    return `
      transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear, z-index 0s linear 0s;
      `;
  if (opened && inner)
    return `
        transition: all 0.35s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear, z-index 0s linear 0.35s;
      `;
  if (!opened && inner)
    return `
        transition: all 0.35s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear, z-index 0s linear 0s;
      `;
}}

  ${({
  opened,
  shortThrow
}) => {
  if (!opened && shortThrow)
    return `
      margin-top: -${tokens.space["2.5"]};
    `;
  if (!opened && !shortThrow)
    return `
      margin-top: -${tokens.space["12"]};
    `;
}}

  ${({
  align
}) => align === "left" ? `
    left: 0;
  ` : `
    right: 0;
  `}
`;
const MenuButton = styled.button`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: ${tokens.space["4"]};
  width: ${tokens.space["full"]};
  height: ${tokens.space["12"]};
  padding: ${tokens.space["3"]};
  font-weight: ${tokens.fontWeights["semiBold"]};
  transition-duration: 0.15s;
  transition-property: color, transform, filter;
  transition-timing-function: ease-in-out;
  letter-spacing: -0.01em;

  &:active {
    transform: translateY(0px);
    filter: brightness(1);
  }

  ${({
  theme,
  color
}) => `
    color: ${tokens.colors[theme.mode][color || "accent"]};
  
    &:disabled {
      color: ${tokens.colors[theme.mode].textTertiary}
    }
  `}

  ${({
  theme,
  inner
}) => {
  if (inner)
    return `
      justify-content: center;
    
      &:hover {
        color: ${tokens.colors[theme.mode].accent};
      }
    `;
  if (!inner)
    return `
      justify-content: flex-start;
      
      &:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
      }
    `;
}}

  ${({
  theme,
  inner,
  hasColor
}) => {
  if (inner && !hasColor)
    return `
      color: ${tokens.colors[theme.mode].textSecondary};  
    `;
}}
`;
const DropdownMenu = ({
  items,
  setIsOpen,
  isOpen,
  width,
  inner,
  align,
  shortThrow,
  keepMenuOnTop,
  labelAlign
}) => {
  return /* @__PURE__ */ React.createElement(DropdownMenuContainer, __spreadProps(__spreadValues({}, {
    opened: isOpen,
    inner,
    align,
    shortThrow,
    labelAlign
  }), {
    style: {
      width: inner || width && parseInt(width) > 100 ? `${width}px` : "150px",
      zIndex: keepMenuOnTop ? 100 : void 0
    }
  }), items.map((item) => {
    if (React.isValidElement(item)) {
      return /* @__PURE__ */ React.createElement("div", {
        onClick: () => setIsOpen(false)
      }, item);
    }
    const {
      color,
      label,
      onClick,
      disabled
    } = item;
    return /* @__PURE__ */ React.createElement(MenuButton, __spreadProps(__spreadValues({}, {
      inner,
      hasColor: !!color,
      color,
      disabled
    }), {
      key: label,
      onClick: () => Promise.resolve(setIsOpen(false)).then(onClick)
    }), label);
  }));
};
const InnerMenuButton = styled.button`
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${tokens.space["4"]};
  border-width: ${tokens.space["px"]};
  font-weight: ${tokens.fontWeights["semiBold"]};
  cursor: pointer;
  position: relative;

  ${({
  theme
}) => `
    border-color: ${tokens.colors[theme.mode].borderSecondary};
  `}

  ${({
  size
}) => {
  switch (size) {
    case "small":
      return `
          padding: ${tokens.space["0.5"]} ${tokens.space["0.25"]};
        `;
    case "medium":
      return `
          padding: ${tokens.space["2.5"]} ${tokens.space["3.5"]};
        `;
    default:
      return ``;
  }
}}

  ${({
  theme,
  open
}) => {
  if (open)
    return `
      border-top-left-radius: ${tokens.radii["almostExtraLarge"]};
      border-top-right-radius: ${tokens.radii["almostExtraLarge"]};
      border-bottom-left-radius: none;
      border-bottom-right-radius: none;
      border-bottom-width: 0;
      background-color: ${tokens.colors[theme.mode].grey};
      color: ${tokens.colors[theme.mode].textTertiary};
      transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6), 0.3s color ease-in-out, 0.2s border-radius ease-in-out, 0s border-width 0.1s, 0s padding linear;
      
      &:hover {
        color: ${tokens.colors[theme.mode].accent};
      }
      `;
  if (!open)
    return `
      background-color: ${tokens.colors[theme.mode].background};
      color: ${tokens.colors[theme.mode].textSecondary};
      border-radius: ${tokens.radii["almostExtraLarge"]};
      box-shadow: ${tokens.boxShadows[theme.mode]["0.02"]};
      transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6), 0.15s color ease-in-out, 0s border-width 0.15s, 0.15s border-color ease-in-out, 0s padding linear;
      
      &:hover {
        border-color: ${tokens.colors[theme.mode].border};
      }
      `;
}}
`;
const Chevron$2 = styled(ReactComponent$K)`
  margin-left: ${tokens.space["1"]};
  width: ${tokens.space["3"]};
  margin-right: ${tokens.space["0.5"]};
  transition-duration: ${tokens.transitionDuration["200"]};
  transition-property: all;
  transition-timing-function: ${tokens.transitionTimingFunction["inOut"]};
  opacity: 0.3;
  transform: rotate(0deg);
  display: flex;

  & > svg {
    fill: currentColor;
  }
  fill: currentColor;

  ${({
  open
}) => open && `
      opacity: 1;
      transform: rotate(180deg);
  `}
`;
const ButtonWrapper = styled.div`
  z-index: 10;
  position: relative;
`;
const Dropdown = (_e) => {
  var _f = _e, {
    children,
    buttonProps,
    items = [],
    inner = false,
    chevron = true,
    align = "left",
    menuLabelAlign,
    shortThrow = false,
    keepMenuOnTop = false,
    size = "medium",
    label
  } = _f, props = __objRest(_f, [
    "children",
    "buttonProps",
    "items",
    "inner",
    "chevron",
    "align",
    "menuLabelAlign",
    "shortThrow",
    "keepMenuOnTop",
    "size",
    "label"
  ]);
  const dropdownRef = React.useRef();
  const [internalIsOpen, internalSetIsOpen] = React.useState(false);
  const [isOpen, setIsOpen] = props.setIsOpen ? [props.isOpen, props.setIsOpen] : [internalIsOpen, internalSetIsOpen];
  const handleClickOutside = (e) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false);
    }
  };
  React.useEffect(() => {
    if (isOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [dropdownRef, isOpen]);
  return /* @__PURE__ */ React.createElement("div", {
    "data-testid": "dropdown",
    ref: dropdownRef,
    style: {
      maxWidth: tokens.space.max,
      position: "relative"
    }
  }, !children && inner && /* @__PURE__ */ React.createElement(InnerMenuButton, __spreadProps(__spreadValues({}, {
    open: isOpen,
    size
  }), {
    onClick: () => setIsOpen(!isOpen)
  }), label, chevron && /* @__PURE__ */ React.createElement(Chevron$2, {
    open: isOpen
  })), !children && !inner && /* @__PURE__ */ React.createElement(ButtonWrapper, null, /* @__PURE__ */ React.createElement(Button, __spreadProps(__spreadValues({}, buttonProps), {
    pressed: isOpen,
    suffix: chevron && /* @__PURE__ */ React.createElement(Chevron$2, {
      open: isOpen
    }),
    onClick: () => setIsOpen(!isOpen)
  }), label)), React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, __spreadProps(__spreadValues({}, buttonProps), {
        zindex: 10,
        onClick: () => setIsOpen(!isOpen)
      }));
    }
  }), /* @__PURE__ */ React.createElement(DropdownMenu, __spreadValues({
    width: dropdownRef.current && dropdownRef.current.getBoundingClientRect().width.toFixed(2)
  }, {
    align,
    inner,
    isOpen,
    items,
    setIsOpen,
    shortThrow,
    keepMenuOnTop,
    labelAlign: menuLabelAlign
  })));
};
Dropdown.displayName = "Dropdown";
const Container$3 = styled.fieldset`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space["4"]};
`;
const ContainerInner = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space["1"]};
  padding: 0 ${tokens.space["4"]};
`;
const Row = styled.div`
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: ${tokens.space["3"]};
`;
const Description = styled.div`
  ${({
  theme
}) => `
    color: ${tokens.colors[theme.mode].textSecondary};
    font-size: ${tokens.fontSizes.base};
  `}
`;
const ChildrenContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: ${tokens.space["4"]};
`;
const FieldSet = ({
  children,
  description,
  disabled,
  form,
  legend,
  name,
  status
}) => {
  let statusText;
  let statusTone;
  switch (status) {
    case "complete": {
      statusText = "Complete";
      statusTone = "green";
      break;
    }
    case "required":
    case "pending": {
      statusText = status === "pending" ? "Pending" : "Required";
      statusTone = "accent";
      break;
    }
    case "optional": {
      statusText = "Optional";
      statusTone = "secondary";
      break;
    }
  }
  if (typeof status === "object") {
    statusText = status.name;
    statusTone = status.tone;
  }
  return /* @__PURE__ */ React.createElement(Container$3, {
    disabled,
    form,
    name
  }, /* @__PURE__ */ React.createElement(ContainerInner, null, /* @__PURE__ */ React.createElement(Row, null, /* @__PURE__ */ React.createElement(Heading, {
    as: "legend",
    level: "2",
    responsive: true
  }, legend), statusTone && statusText && /* @__PURE__ */ React.createElement(Tag, {
    tone: statusTone
  }, statusText)), /* @__PURE__ */ React.createElement(Description, null, description)), /* @__PURE__ */ React.createElement(ChildrenContainer, null, children));
};
const InputParent = styled.div`
  ${({
  theme
}) => `
    background-color: ${tokens.colors[theme.mode].backgroundSecondary};
    border-radius: ${tokens.radii["2xLarge"]};
    border-width: ${tokens.space["0.75"]};
    border-color: ${tokens.colors.base.transparent};
    color: ${tokens.colors[theme.mode].text};
    display: flex;
    transition-duration: ${tokens.transitionDuration["150"]};
    transition-property: color, border-color, background-color;
    transition-timing-function: ${tokens.transitionTimingFunction["inOut"]};
    
    &:focus-within {
      border-color: ${tokens.colors[theme.mode].accentSecondary};
    }
  `}

  ${({
  theme,
  disabled
}) => disabled && `
      border-color: ${tokens.colors[theme.mode].foregroundSecondary};
      background-color: ${tokens.colors[theme.mode].background};
  `}

  ${({
  theme,
  error
}) => error && `
      border-color: ${tokens.colors[theme.mode].red};
      cursor: default;
      
      &:focus-within {
        border-color: ${tokens.colors[theme.mode].red};
      }
  `}

  ${({
  suffix
}) => suffix && `
      height: ${tokens.space["16"]};
  `}

  ${({
  size
}) => {
  switch (size) {
    case "medium":
      return `
          height: ${tokens.space["14"]};
        `;
    case "large":
      return `
          height: ${tokens.space["16"]};
        `;
    case "extraLarge":
      return `
          height: ${tokens.space["18"]};
        `;
    default:
      return ``;
  }
}}
  ${({
  userStyles
}) => userStyles}
`;
const Prefix = styled.label`
  align-items: center;
  display: flex;
  height: ${tokens.space["full"]};
  line-height: normal;
  color: inherit;
  font-family: ${tokens.fonts["sans"]};
  font-weight: ${tokens.fontWeights["medium"]};
  padding-left: ${tokens.space["4"]};
  padding-right: ${tokens.space["2"]};
`;
const Suffix = styled.label`
  align-items: center;
  display: flex;
  height: ${tokens.space["full"]};
  line-height: normal;
  color: inherit;
  font-family: ${tokens.fonts["sans"]};
  font-weight: ${tokens.fontWeights["medium"]};
  padding-left: ${tokens.space["2"]};
  padding-right: ${tokens.space["2"]};
`;
const InputContainer = styled.div`
  overflow: hidden;
  position: relative;
  width: ${tokens.space["full"]};
`;
const InputComponent = styled.input`
  ${({
  theme
}) => `
    background-color: ${tokens.colors.base.transparent};
    position: relative;
    width: ${tokens.space["full"]};
    height: ${tokens.space["full"]};
    padding: 0 ${tokens.space["4"]};
    font-weight: ${tokens.fontWeights["medium"]};
    
    &::placeholder {
        color: ${tokens.colors[theme.mode].textPlaceholder};
        font-weight: ${tokens.fontWeights["bold"]};
    }
  `}

  ${({
  disabled
}) => disabled && `
        opacity ${tokens.opacity["50"]};
        cursor: not-allowed;
  `}

  ${({
  type
}) => type === "number" && `
        font-feature-settings: 'kern' 1,  'tnum' 1, 'calt' 0;
        font-variant-numeric: tabular-nums;
  `}

  ${({
  size
}) => {
  switch (size) {
    case "medium":
      return `
          font-size: ${tokens.fontSizes["base"]};
        `;
    case "large":
      return `
          font-size: ${tokens.fontSizes["large"]};
        `;
    case "extraLarge":
      return `
          font-size: ${tokens.fontSizes["headingThree"]};
          padding: 0 ${tokens.space["6"]};
        `;
    default:
      return ``;
  }
}}
`;
const Ghost = styled.div`
  border-color: ${tokens.colors.base.transparent};
  inset: 0;
  position: absolute;
  pointer-events: none;
  white-space: pre;
  line-height: normal;

  ${({
  type
}) => type === "number" && `
        font-feature-settings: 'kern' 1,  'tnum' 1, 'calt' 0;
        font-variant-numeric: tabular-nums;
  `}
`;
const Units = styled.span`
  ${({
  theme
}) => `
    color: ${tokens.colors[theme.mode].text};
  `}
`;
const MaxContainer = styled.div`
  display: flex;
  align-items: center;
  ${({
  suffix
}) => suffix && `padding-right: ${tokens.space["4"]};`}
`;
const MaxButton = styled.button`
  ${({
  theme
}) => `
      background-color: ${tokens.colors[theme.mode].foregroundSecondary};
      border-radius: ${tokens.radii["medium"]};
      color: ${tokens.colors[theme.mode].textSecondary};
      cursor: pointer;
      font-size: ${tokens.fontSizes["label"]};
      font-weight: ${tokens.fontWeights["semiBold"]};
      height: ${tokens.space["max"]};
      line-height: none;
      padding: ${tokens.space["2"]};
      text-transform: uppercase;
      transition-duration: ${tokens.transitionDuration["150"]};
      transition-property: color, border-color, background-color;
      transition-timing-function: ${tokens.transitionTimingFunction["inOut"]};
      visibility: hidden;
      
      &:hover {
        color: ${tokens.colors[theme.mode].text};
      }
      
      ${InputParent}:hover & {
        visibility: visible;
      }
      
      ${InputParent}:focus-within & {
        visibility: visible;
      }
  `}
`;
const Input$1 = React.forwardRef((_g, ref) => {
  var _h = _g, {
    autoFocus,
    autoComplete,
    autoCorrect,
    defaultValue,
    description,
    disabled,
    error,
    hideLabel,
    id: id2,
    inputMode,
    label,
    labelSecondary,
    name,
    placeholder,
    prefix,
    readOnly,
    required,
    spellCheck,
    suffix,
    tabIndex,
    type = "text",
    units,
    value,
    width,
    onBlur,
    onChange,
    onFocus,
    onKeyDown,
    size = "medium",
    parentStyles
  } = _h, props = __objRest(_h, [
    "autoFocus",
    "autoComplete",
    "autoCorrect",
    "defaultValue",
    "description",
    "disabled",
    "error",
    "hideLabel",
    "id",
    "inputMode",
    "label",
    "labelSecondary",
    "name",
    "placeholder",
    "prefix",
    "readOnly",
    "required",
    "spellCheck",
    "suffix",
    "tabIndex",
    "type",
    "units",
    "value",
    "width",
    "onBlur",
    "onChange",
    "onFocus",
    "onKeyDown",
    "size",
    "parentStyles"
  ]);
  const defaultRef = React.useRef(null);
  const inputRef = ref || defaultRef;
  const [state2, setState] = React.useState({
    ghostValue: value || defaultValue
  });
  const placeholderText = placeholder ? `${placeholder != null ? placeholder : ""}${units ? ` ${units}` : ""}` : void 0;
  const hasError = error ? true : void 0;
  const max = props.max;
  const inputType = type === "number" ? "number" : "text";
  const handleInput = React.useCallback((event) => {
    const value2 = event.target.value;
    setState((x) => __spreadProps(__spreadValues({}, x), {
      ghostValue: value2
    }));
  }, []);
  const handleKeyDown = React.useCallback((event) => {
    if (type === "number") {
      const key = event.key;
      const filteredKeys = ["E", "e", "+"];
      if (filteredKeys.includes(key))
        event.preventDefault();
    }
    onKeyDown && onKeyDown(event);
  }, [type, onKeyDown]);
  const handleWheel = React.useCallback((event) => {
    var _a;
    (_a = event.target) == null ? void 0 : _a.blur();
  }, []);
  const handleMax = React.useCallback(() => {
    if (onChange)
      onChange({
        target: {
          value: max
        }
      });
    else if (inputRef.current)
      inputRef.current.value = max;
    if (!units)
      return;
    setState((x) => __spreadProps(__spreadValues({}, x), {
      ghostValue: max
    }));
  }, [inputRef, max, units, onChange]);
  return /* @__PURE__ */ React.createElement(Field, {
    description,
    error,
    hideLabel,
    id: id2,
    label,
    labelSecondary,
    required,
    width
  }, (ids) => /* @__PURE__ */ React.createElement(InputParent, __spreadValues({}, {
    disabled,
    error: hasError,
    suffix: suffix !== void 0,
    size,
    userStyles: parentStyles
  }), prefix && /* @__PURE__ */ React.createElement(Prefix, __spreadValues({
    "aria-hidden": "true"
  }, ids == null ? void 0 : ids.label), prefix), /* @__PURE__ */ React.createElement(InputContainer, null, /* @__PURE__ */ React.createElement(InputComponent, __spreadValues(__spreadValues({
    "aria-invalid": hasError,
    autoComplete,
    autoCorrect,
    autoFocus,
    defaultValue,
    disabled,
    inputMode,
    name,
    placeholder: placeholderText,
    readOnly,
    ref: inputRef,
    size,
    spellCheck,
    tabIndex,
    type: inputType,
    value,
    onBlur,
    onChange,
    onFocus,
    onInput: handleInput,
    onKeyDown: type === "number" ? handleKeyDown : onKeyDown,
    onWheel: type === "number" ? handleWheel : void 0
  }, props), ids == null ? void 0 : ids.content)), units && state2.ghostValue && /* @__PURE__ */ React.createElement(Ghost, {
    "aria-hidden": "true",
    "data-testid": "ghost",
    type: inputType
  }, /* @__PURE__ */ React.createElement("span", {
    style: {
      visibility: "hidden"
    }
  }, state2.ghostValue, " "), /* @__PURE__ */ React.createElement(Units, null, units))), max && /* @__PURE__ */ React.createElement(MaxContainer, {
    suffix
  }, /* @__PURE__ */ React.createElement(MaxButton, {
    onClick: handleMax
  }, "Max")), suffix && /* @__PURE__ */ React.createElement(Suffix, __spreadValues({
    "aria-hidden": "true"
  }, ids == null ? void 0 : ids.label), suffix)));
});
Input$1.displayName = "Input";
const ReactComponent$J = (_i) => {
  var _j = _i, {
    title,
    titleId
  } = _j, props = __objRest(_j, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24ZM17.5605 10.9395L13.0605 6.4395C12.7776 6.16626 12.3987 6.01507 12.0054 6.01849C11.6121 6.02191 11.2359 6.17966 10.9578 6.45777C10.6797 6.73588 10.5219 7.1121 10.5185 7.5054C10.5151 7.89869 10.6663 8.2776 10.9395 8.5605L12.879 10.5H7.5C7.10218 10.5 6.72064 10.658 6.43934 10.9393C6.15804 11.2206 6 11.6022 6 12C6 12.3978 6.15804 12.7794 6.43934 13.0607C6.72064 13.342 7.10218 13.5 7.5 13.5H12.879L10.9395 15.4395C10.7962 15.5779 10.682 15.7434 10.6033 15.9264C10.5247 16.1094 10.4834 16.3062 10.4816 16.5054C10.4799 16.7046 10.5178 16.9021 10.5933 17.0864C10.6687 17.2708 10.7801 17.4383 10.9209 17.5791C11.0617 17.7199 11.2292 17.8313 11.4136 17.9067C11.5979 17.9822 11.7954 18.0201 11.9946 18.0184C12.1938 18.0166 12.3906 17.9753 12.5736 17.8967C12.7566 17.818 12.9221 17.7038 13.0605 17.5605L17.5605 13.0605C17.8417 12.7792 17.9997 12.3977 17.9997 12C17.9997 11.6023 17.8417 11.2208 17.5605 10.9395Z",
    fill: "currentColor"
  }));
};
const ReactComponent$I = (_k) => {
  var _l = _k, {
    title,
    titleId
  } = _l, props = __objRest(_l, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M14 5l7 7m0 0l-7 7m7-7H3"
  }));
};
const ReactComponent$H = (_m) => {
  var _n = _m, {
    title,
    titleId
  } = _n, props = __objRest(_n, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M5 10l7-7m0 0l7 7m-7-7v18"
  }));
};
const ReactComponent$G = (_o) => {
  var _p = _o, {
    title,
    titleId
  } = _p, props = __objRest(_p, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253"
  }));
};
const ReactComponent$F = (_q) => {
  var _r = _q, {
    title,
    titleId
  } = _r, props = __objRest(_r, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24ZM10.0605 7.9395C9.7776 7.66626 9.39869 7.51507 9.0054 7.51849C8.6121 7.52191 8.23588 7.67966 7.95777 7.95777C7.67966 8.23588 7.52191 8.6121 7.51849 9.0054C7.51507 9.39869 7.66626 9.7776 7.9395 10.0605L9.879 12L7.9395 13.9395C7.79624 14.0779 7.68196 14.2434 7.60335 14.4264C7.52473 14.6094 7.48336 14.8062 7.48162 15.0054C7.47989 15.2046 7.51785 15.4021 7.59327 15.5864C7.66869 15.7708 7.78007 15.9383 7.92091 16.0791C8.06175 16.2199 8.22922 16.3313 8.41357 16.4067C8.59791 16.4822 8.79543 16.5201 8.9946 16.5184C9.19377 16.5166 9.3906 16.4753 9.57361 16.3967C9.75661 16.318 9.92213 16.2038 10.0605 16.0605L12 14.121L13.9395 16.0605C14.2224 16.3337 14.6013 16.4849 14.9946 16.4815C15.3879 16.4781 15.7641 16.3203 16.0422 16.0422C16.3203 15.7641 16.4781 15.3879 16.4815 14.9946C16.4849 14.6013 16.3337 14.2224 16.0605 13.9395L14.121 12L16.0605 10.0605C16.3337 9.7776 16.4849 9.39869 16.4815 9.0054C16.4781 8.6121 16.3203 8.23588 16.0422 7.95777C15.7641 7.67966 15.3879 7.52191 14.9946 7.51849C14.6013 7.51507 14.2224 7.66626 13.9395 7.9395L12 9.879L10.0605 7.9395Z",
    fill: "currentColor"
  }));
};
const ReactComponent$E = (_s) => {
  var _t = _s, {
    title,
    titleId
  } = _t, props = __objRest(_t, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    d: "M2 12.625L10.125 20.125L22 3.875",
    stroke: "currentColor",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
};
const ReactComponent$D = (_u) => {
  var _v = _u, {
    title,
    titleId
  } = _v, props = __objRest(_v, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M19 9l-7 7-7-7"
  }));
};
const ReactComponent$C = (_w) => {
  var _x = _w, {
    title,
    titleId
  } = _x, props = __objRest(_x, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15 19l-7-7 7-7"
  }));
};
const ReactComponent$B = (_y) => {
  var _z = _y, {
    title,
    titleId
  } = _z, props = __objRest(_z, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M9 5l7 7-7 7"
  }));
};
const ReactComponent$A = (_A) => {
  var _B = _A, {
    title,
    titleId
  } = _B, props = __objRest(_B, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M5 15l7-7 7 7"
  }));
};
const ReactComponent$z = (_C) => {
  var _D = _C, {
    title,
    titleId
  } = _D, props = __objRest(_D, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M0.584985 0.610577C0.959663 0.235635 1.46777 0.0250036 1.99756 0.0250036C2.52736 0.0250036 3.03546 0.235635 3.41014 0.610577L11.9875 9.19658L20.5649 0.610577C20.7492 0.419556 20.9697 0.267192 21.2134 0.162374C21.4572 0.0575557 21.7194 0.00238315 21.9846 7.55141e-05C22.2499 -0.00223212 22.513 0.0483709 22.7586 0.148933C23.0041 0.249494 23.2272 0.398001 23.4148 0.585786C23.6024 0.773571 23.7508 0.996876 23.8512 1.24267C23.9517 1.48846 24.0022 1.75182 23.9999 2.01738C23.9976 2.28294 23.9425 2.54538 23.8378 2.78938C23.7331 3.03339 23.5809 3.25408 23.39 3.43858L14.8127 12.0246L23.39 20.6106C23.754 20.9878 23.9554 21.493 23.9508 22.0174C23.9463 22.5418 23.7361 23.0434 23.3657 23.4142C22.9953 23.785 22.4941 23.9954 21.9703 23.9999C21.4464 24.0045 20.9417 23.8029 20.5649 23.4386L11.9875 14.8526L3.41014 23.4386C3.03332 23.8029 2.52862 24.0045 2.00475 23.9999C1.48089 23.9954 0.979766 23.785 0.609323 23.4142C0.238879 23.0434 0.0287522 22.5418 0.0241999 22.0174C0.0196477 21.493 0.221035 20.9878 0.584985 20.6106L9.16235 12.0246L0.584985 3.43858C0.210419 3.06352 0 2.5549 0 2.02458C0 1.49425 0.210419 0.985632 0.584985 0.610577V0.610577Z",
    fill: "currentColor"
  }));
};
const ReactComponent$y = (_E) => {
  var _F = _E, {
    title,
    titleId
  } = _F, props = __objRest(_F, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M10 20l4-16m4 4l4 4-4 4M6 16l-4-4 4-4"
  }));
};
const ReactComponent$x = (_G) => {
  var _H = _G, {
    title,
    titleId
  } = _H, props = __objRest(_H, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
  }), /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  }));
};
const ReactComponent$w = (_I) => {
  var _J = _I, {
    title,
    titleId
  } = _J, props = __objRest(_J, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
  }));
};
const ReactComponent$v = (_K) => {
  var _L = _K, {
    title,
    titleId
  } = _L, props = __objRest(_L, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    d: "M6.85715 10.2857C6.85715 9.3764 7.21837 8.50433 7.86135 7.86135C8.50433 7.21837 9.3764 6.85715 10.2857 6.85715H20.5714C21.4807 6.85715 22.3528 7.21837 22.9958 7.86135C23.6388 8.50433 24 9.3764 24 10.2857V20.5714C24 21.4807 23.6388 22.3528 22.9958 22.9958C22.3528 23.6388 21.4807 24 20.5714 24H10.2857C9.3764 24 8.50433 23.6388 7.86135 22.9958C7.21837 22.3528 6.85715 21.4807 6.85715 20.5714V10.2857Z",
    fill: "currentColor"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M3.42857 0C2.51926 0 1.64719 0.361223 1.00421 1.00421C0.361223 1.64719 0 2.51926 0 3.42857V13.7143C0 14.6236 0.361223 15.4957 1.00421 16.1387C1.64719 16.7816 2.51926 17.1429 3.42857 17.1429V6.42857C3.42857 4.77172 4.77172 3.42857 6.42857 3.42857H17.1429C17.1429 2.51926 16.7816 1.64719 16.1387 1.00421C15.4957 0.361223 14.6236 0 13.7143 0H3.42857Z",
    fill: "currentColor"
  }));
};
const ReactComponent$u = (_M) => {
  var _N = _M, {
    title,
    titleId
  } = _N, props = __objRest(_N, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
  }));
};
const ReactComponent$t = (_O) => {
  var _P = _O, {
    title,
    titleId
  } = _P, props = __objRest(_P, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z"
  }));
};
const ReactComponent$s = (_Q) => {
  var _R = _Q, {
    title,
    titleId
  } = _R, props = __objRest(_R, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z"
  }));
};
const ReactComponent$r = (_S) => {
  var _T = _S, {
    title,
    titleId
  } = _T, props = __objRest(_T, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M6.41439 13.6844L12.0452 21.7082C12.1448 21.8501 12.3551 21.8501 12.4546 21.7081L18.0764 13.6884L12.4479 16.1153L12.25 16.2007L12.052 16.1153L6.41439 13.6844ZM6.12744 12.4717L12.25 15.1117L18.3441 12.4839L12.4655 2.37075C12.3693 2.20517 12.1302 2.20487 12.0336 2.3702L6.12744 12.4717Z",
    fill: "currentColor"
  }));
};
const ReactComponent$q = (_U) => {
  var _V = _U, {
    title,
    titleId
  } = _V, props = __objRest(_V, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    d: "M11.998 0V8.87185L19.4236 12.2225L11.998 0Z",
    fill: "currentColor",
    fillOpacity: 0.8
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M11.998 0L4.57143 12.2225L11.998 8.87185V0Z",
    fill: "currentColor",
    fillOpacity: 0.4
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M11.998 17.9717V24L19.4286 13.6188L11.998 17.9717Z",
    fill: "currentColor",
    fillOpacity: 0.8
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M11.998 24V17.9707L4.57143 13.6188L11.998 24Z",
    fill: "currentColor",
    fillOpacity: 0.4
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M11.998 16.5765L19.4236 12.2226L11.998 8.87386V16.5765Z",
    fill: "currentColor"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M4.57143 12.2226L11.998 16.5765V8.87386L4.57143 12.2226Z",
    fill: "currentColor",
    fillOpacity: 0.8
  }));
};
const ReactComponent$p = (_W) => {
  var _X = _W, {
    title,
    titleId
  } = _X, props = __objRest(_X, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    d: "M11.998 0V8.87185L19.4236 12.2225L11.998 0Z",
    fill: "currentColor",
    fillOpacity: 0.602
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M11.998 0L4.57143 12.2225L11.998 8.87185V0Z",
    fill: "currentColor"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M11.998 17.9717V24L19.4286 13.6188L11.998 17.9717Z",
    fill: "currentColor",
    fillOpacity: 0.602
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M11.998 24V17.9707L4.57143 13.6188L11.998 24Z",
    fill: "currentColor"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M11.998 16.5765L19.4236 12.2226L11.998 8.87386V16.5765Z",
    fill: "currentColor",
    fillOpacity: 0.2
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M4.57143 12.2226L11.998 16.5765V8.87386L4.57143 12.2226Z",
    fill: "currentColor",
    fillOpacity: 0.602
  }));
};
const ReactComponent$o = (_Y) => {
  var _Z = _Y, {
    title,
    titleId
  } = _Z, props = __objRest(_Z, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
  }));
};
const ReactComponent$n = (__) => {
  var _$ = __, {
    title,
    titleId
  } = _$, props = __objRest(_$, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M3 21v-4m0 0V5a2 2 0 012-2h6.5l1 1H21l-3 6 3 6h-8.5l-1-1H5a2 2 0 00-2 2zm9-13.5V9"
  }));
};
const ReactComponent$m = (_aa) => {
  var _ba = _aa, {
    title,
    titleId
  } = _ba, props = __objRest(_ba, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("rect", {
    width: 24,
    height: 24,
    fill: "url(#paint0_linear_2_3)"
  }), /* @__PURE__ */ React.createElement("defs", null, /* @__PURE__ */ React.createElement("linearGradient", {
    id: "paint0_linear_2_3",
    x1: 15.986,
    y1: 26.8444,
    x2: -7.34084,
    y2: -14.214,
    gradientUnits: "userSpaceOnUse"
  }, /* @__PURE__ */ React.createElement("stop", {
    stopColor: "#44BCF0"
  }), /* @__PURE__ */ React.createElement("stop", {
    offset: 0.378795,
    stopColor: "#7298F8"
  }), /* @__PURE__ */ React.createElement("stop", {
    offset: 1,
    stopColor: "#A099FF"
  }))));
};
const ReactComponent$l = (_ca) => {
  var _da = _ca, {
    title,
    titleId
  } = _da, props = __objRest(_da, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M4 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2V6zM14 6a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2V6zM4 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2H6a2 2 0 01-2-2v-2zM14 16a2 2 0 012-2h2a2 2 0 012 2v2a2 2 0 01-2 2h-2a2 2 0 01-2-2v-2z"
  }));
};
const ReactComponent$k = (_ea) => {
  var _fa = _ea, {
    title,
    titleId
  } = _fa, props = __objRest(_fa, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    d: "M4.85714 2C4.09938 2 3.37266 2.30102 2.83684 2.83684C2.30102 3.37266 2 4.09938 2 4.85714V7.71429C2 8.47205 2.30102 9.19877 2.83684 9.73459C3.37266 10.2704 4.09938 10.5714 4.85714 10.5714H7.71429C8.47205 10.5714 9.19877 10.2704 9.73459 9.73459C10.2704 9.19877 10.5714 8.47205 10.5714 7.71429V4.85714C10.5714 4.09938 10.2704 3.37266 9.73459 2.83684C9.19877 2.30102 8.47205 2 7.71429 2H4.85714ZM4.85714 13.4286C4.09938 13.4286 3.37266 13.7296 2.83684 14.2654C2.30102 14.8012 2 15.528 2 16.2857V19.1429C2 19.9006 2.30102 20.6273 2.83684 21.1632C3.37266 21.699 4.09938 22 4.85714 22H7.71429C8.47205 22 9.19877 21.699 9.73459 21.1632C10.2704 20.6273 10.5714 19.9006 10.5714 19.1429V16.2857C10.5714 15.528 10.2704 14.8012 9.73459 14.2654C9.19877 13.7296 8.47205 13.4286 7.71429 13.4286H4.85714ZM13.4286 4.85714C13.4286 4.09938 13.7296 3.37266 14.2654 2.83684C14.8012 2.30102 15.528 2 16.2857 2H19.1429C19.9006 2 20.6273 2.30102 21.1632 2.83684C21.699 3.37266 22 4.09938 22 4.85714V7.71429C22 8.47205 21.699 9.19877 21.1632 9.73459C20.6273 10.2704 19.9006 10.5714 19.1429 10.5714H16.2857C15.528 10.5714 14.8012 10.2704 14.2654 9.73459C13.7296 9.19877 13.4286 8.47205 13.4286 7.71429V4.85714ZM13.4286 16.2857C13.4286 15.528 13.7296 14.8012 14.2654 14.2654C14.8012 13.7296 15.528 13.4286 16.2857 13.4286H19.1429C19.9006 13.4286 20.6273 13.7296 21.1632 14.2654C21.699 14.8012 22 15.528 22 16.2857V19.1429C22 19.9006 21.699 20.6273 21.1632 21.1632C20.6273 21.699 19.9006 22 19.1429 22H16.2857C15.528 22 14.8012 21.699 14.2654 21.1632C13.7296 20.6273 13.4286 19.9006 13.4286 19.1429V16.2857Z",
    fill: "currentColor"
  }));
};
const ReactComponent$j = (_ga) => {
  var _ha = _ga, {
    title,
    titleId
  } = _ha, props = __objRest(_ha, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M7 11.5V14m0-2.5v-6a1.5 1.5 0 113 0m-3 6a1.5 1.5 0 00-3 0v2a7.5 7.5 0 0015 0v-5a1.5 1.5 0 00-3 0m-6-3V11m0-5.5v-1a1.5 1.5 0 013 0v1m0 0V11m0-5.5a1.5 1.5 0 013 0v3m0 0V11"
  }));
};
const ReactComponent$i = (_ia) => {
  var _ja = _ia, {
    title,
    titleId
  } = _ja, props = __objRest(_ja, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1"
  }));
};
const ReactComponent$h = (_ka) => {
  var _la = _ka, {
    title,
    titleId
  } = _la, props = __objRest(_la, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M4 6h16M4 10h16M4 14h16M4 18h16"
  }));
};
const ReactComponent$g = (_ma) => {
  var _na = _ma, {
    title,
    titleId
  } = _na, props = __objRest(_na, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
  }));
};
const ReactComponent$f = (_oa) => {
  var _pa = _oa, {
    title,
    titleId
  } = _pa, props = __objRest(_pa, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    d: "M4.00058 9.70969C4.23776 10.2167 4.82477 11.2188 4.82477 11.2188L11.611 0L4.98783 4.62508C4.59318 4.88836 4.2694 5.24473 4.04505 5.66275C3.7434 6.29338 3.58313 6.98229 3.57545 7.68131C3.56777 8.38033 3.71286 9.07259 4.00058 9.70969Z",
    fill: "#5298FF"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M1.31159 13.4038C1.38637 14.477 1.68956 15.5217 2.20086 16.4682C2.71216 17.4146 3.41976 18.2409 4.27629 18.8917L11.6021 24C11.6021 24 7.01863 17.3944 3.15267 10.8215C2.76128 10.1271 2.49816 9.36782 2.37592 8.58011C2.3218 8.22341 2.3218 7.86059 2.37592 7.50389C2.27512 7.69068 2.07945 8.07313 2.07945 8.07313C1.68745 8.87262 1.42049 9.72754 1.28787 10.608C1.21154 11.5388 1.21948 12.4745 1.31159 13.4038Z",
    fill: "#5298FF"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M20.0011 14.2903C19.7639 13.7833 19.1769 12.7812 19.1769 12.7812L12.3907 24L19.0138 19.3779C19.4085 19.1146 19.7322 18.7582 19.9566 18.3402C20.2587 17.7092 20.4192 17.0198 20.4269 16.3202C20.4346 15.6206 20.2892 14.9278 20.0011 14.2903Z",
    fill: "#5298FF"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M22.69 10.5962C22.6153 9.52304 22.3121 8.47827 21.8008 7.53183C21.2895 6.58539 20.5819 5.75911 19.7253 5.10834L12.3996 0C12.3996 0 16.98 6.60556 20.849 13.1785C21.2393 13.8731 21.5014 14.6324 21.6227 15.4199C21.6769 15.7766 21.6769 16.1394 21.6227 16.4961C21.7235 16.3093 21.9192 15.9269 21.9192 15.9269C22.3112 15.1274 22.5782 14.2725 22.7108 13.392C22.7881 12.4613 22.7812 11.5256 22.69 10.5962Z",
    fill: "#5298FF"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M4.04505 5.66275C4.2694 5.24473 4.59318 4.88836 4.98783 4.62508L11.611 0L4.82476 11.2217C4.82476 11.2217 4.23182 10.2196 4.00057 9.71266C3.7124 9.07515 3.56707 8.38236 3.57475 7.68278C3.58243 6.98321 3.74296 6.29378 4.04505 5.66275ZM1.31159 13.4038C1.38637 14.477 1.68956 15.5217 2.20086 16.4682C2.71216 17.4146 3.41976 18.2409 4.27629 18.8917L11.6021 24C11.6021 24 7.01863 17.3944 3.15267 10.8215C2.76128 10.1271 2.49816 9.36782 2.37592 8.58011C2.3218 8.22341 2.3218 7.86059 2.37592 7.50389C2.27512 7.69068 2.07945 8.07313 2.07945 8.07313C1.68745 8.87262 1.42049 9.72754 1.28787 10.608C1.21154 11.5388 1.21948 12.4745 1.31159 13.4038ZM19.9892 14.2933C19.752 13.7863 19.165 12.7842 19.165 12.7842L12.3907 24L19.0138 19.3779C19.4085 19.1146 19.7322 18.7582 19.9566 18.3402C20.2587 17.7092 20.4192 17.0198 20.4269 16.3202C20.4346 15.6206 20.2892 14.9278 20.0011 14.2903L19.9892 14.2933ZM22.6782 10.5991C22.6034 9.526 22.3002 8.48124 21.7889 7.53479C21.2776 6.58835 20.57 5.76208 19.7135 5.1113L12.3996 0C12.3996 0 16.98 6.60556 20.849 13.1785C21.2393 13.8731 21.5014 14.6324 21.6227 15.4199C21.6769 15.7766 21.6769 16.1394 21.6227 16.4961C21.7235 16.3093 21.9192 15.9269 21.9192 15.9269C22.3112 15.1274 22.5782 14.2725 22.7108 13.392C22.7881 12.4613 22.7812 11.5256 22.69 10.5962L22.6782 10.5991Z",
    fill: "#5298FF"
  }));
};
const ReactComponent$e = (_qa) => {
  var _ra = _qa, {
    title,
    titleId
  } = _ra, props = __objRest(_ra, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    d: "M1.5 3.1579H22.5",
    stroke: "currentColor",
    strokeLinecap: "round"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M1.5 12H22.5",
    stroke: "currentColor",
    strokeLinecap: "round"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M1.5 20.8421H22.5",
    stroke: "currentColor",
    strokeLinecap: "round"
  }));
};
const ReactComponent$d = (_sa) => {
  var _ta = _sa, {
    title,
    titleId
  } = _ta, props = __objRest(_ta, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
  }));
};
const ReactComponent$c = (_ua) => {
  var _va = _ua, {
    title,
    titleId
  } = _va, props = __objRest(_va, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z"
  }));
};
const ReactComponent$b = (_wa) => {
  var _xa = _wa, {
    title,
    titleId
  } = _xa, props = __objRest(_xa, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 4v16m8-8H4"
  }));
};
const ReactComponent$a = (_ya) => {
  var _za = _ya, {
    title,
    titleId
  } = _za, props = __objRest(_za, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 6v6m0 0v6m0-6h6m-6 0H6"
  }));
};
const ReactComponent$9 = (_Aa) => {
  var _Ba = _Aa, {
    title,
    titleId
  } = _Ba, props = __objRest(_Ba, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15"
  }));
};
const ReactComponent$8 = (_Ca) => {
  var _Da = _Ca, {
    title,
    titleId
  } = _Da, props = __objRest(_Da, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
  }));
};
const ReactComponent$7 = (_Ea) => {
  var _Fa = _Ea, {
    title,
    titleId
  } = _Fa, props = __objRest(_Fa, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    d: "M21 3.00006L15 9.00006L12 12.0001H3M15 3.00006H21H15ZM21 3.00006V9.00006V3.00006Z",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }), /* @__PURE__ */ React.createElement("path", {
    d: "M21 21.0001L15 15.0001M15 21.0001H21H15ZM21 21.0001V15.0001V21.0001Z",
    strokeLinecap: "round",
    strokeLinejoin: "round"
  }));
};
const ReactComponent$6 = (_Ga) => {
  var _Ha = _Ga, {
    title,
    titleId
  } = _Ha, props = __objRest(_Ha, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M12 3v1m0 16v1m9-9h-1M4 12H3m15.364 6.364l-.707-.707M6.343 6.343l-.707-.707m12.728 0l-.707.707M6.343 17.657l-.707.707M16 12a4 4 0 11-8 0 4 4 0 018 0z"
  }));
};
const ReactComponent$5 = (_Ia) => {
  var _Ja = _Ia, {
    title,
    titleId
  } = _Ja, props = __objRest(_Ja, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    width: "1em",
    height: "1em",
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M10 5C9.34339 5 8.69321 5.12933 8.08658 5.3806C7.47995 5.63188 6.92876 6.00017 6.46447 6.46447C6.00017 6.92876 5.63188 7.47995 5.3806 8.08658C5.12933 8.69321 5 9.34339 5 10C5 10.6566 5.12933 11.3068 5.3806 11.9134C5.63188 12.52 6.00017 13.0712 6.46447 13.5355C6.63214 13.7032 6.81114 13.8584 7 14C7 13.0807 7.18106 12.1705 7.53284 11.3212C7.88463 10.4719 8.40024 9.70026 9.05025 9.05025C9.70026 8.40024 10.4719 7.88463 11.3212 7.53284C12.1705 7.18106 13.0807 7 14 7C14 7 14 7 14 7C13.8589 6.81181 13.7038 6.63276 13.5355 6.46447C12.5979 5.52678 11.3261 5 10 5ZM16.5277 7.47231C16.1793 6.57251 15.6452 5.74574 14.9497 5.05025C13.637 3.7375 11.8565 3 10 3C9.08075 3 8.1705 3.18106 7.32122 3.53284C6.47194 3.88463 5.70026 4.40024 5.05025 5.05025C4.40024 5.70026 3.88463 6.47194 3.53284 7.32122C3.18106 8.1705 3 9.08075 3 10C3 10.9193 3.18106 11.8295 3.53284 12.6788C3.88463 13.5281 4.40024 14.2997 5.05025 14.9497C5.70026 15.5998 6.47194 16.1154 7.32122 16.4672C7.37137 16.4879 7.42174 16.5081 7.47231 16.5277C7.49189 16.5783 7.51207 16.6286 7.53284 16.6788C7.88463 17.5281 8.40024 18.2997 9.05025 18.9497C9.70026 19.5998 10.4719 20.1154 11.3212 20.4672C12.1705 20.8189 13.0807 21 14 21C15.8565 21 17.637 20.2625 18.9497 18.9497C20.2625 17.637 21 15.8565 21 14C21 12.1435 20.2625 10.363 18.9497 9.05025C18.2543 8.35477 17.4275 7.82074 16.5277 7.47231ZM12.0866 9.3806C12.6932 9.12933 13.3434 9 14 9C15.3261 9 16.5979 9.52678 17.5355 10.4645C18.4732 11.4021 19 12.6739 19 14C19 15.3261 18.4732 16.5979 17.5355 17.5355C16.5979 18.4732 15.3261 19 14 19C13.3434 19 12.6932 18.8707 12.0866 18.6194C11.48 18.3681 10.9288 17.9998 10.4645 17.5355C10.0002 17.0712 9.63188 16.52 9.3806 15.9134C9.12933 15.3068 9 14.6566 9 14C9 13.3434 9.12933 12.6932 9.3806 12.0866C9.63188 11.48 10.0002 10.9288 10.4645 10.4645C10.9288 10.0002 11.48 9.63188 12.0866 9.3806Z",
    fill: "currentColor"
  }));
};
const ReactComponent$4 = (_Ka) => {
  var _La = _Ka, {
    title,
    titleId
  } = _La, props = __objRest(_La, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M13 7h8m0 0v8m0-8l-8 8-4-4-6 6"
  }));
};
const ReactComponent$3 = (_Ma) => {
  var _Na = _Ma, {
    title,
    titleId
  } = _Na, props = __objRest(_Na, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12"
  }));
};
const ReactComponent$2 = (_Oa) => {
  var _Pa = _Oa, {
    title,
    titleId
  } = _Pa, props = __objRest(_Pa, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 10.4C12.7956 10.4 13.5587 10.0629 14.1213 9.46274C14.6839 8.86263 15 8.04869 15 7.2C15 6.35131 14.6839 5.53737 14.1213 4.93726C13.5587 4.33714 12.7956 4 12 4C11.2044 4 10.4413 4.33714 9.87868 4.93726C9.31607 5.53737 9 6.35131 9 7.2C9 8.04869 9.31607 8.86263 9.87868 9.46274C10.4413 10.0629 11.2044 10.4 12 10.4ZM5 20C5 19.0195 5.18106 18.0485 5.53284 17.1426C5.88463 16.2367 6.40024 15.4136 7.05025 14.7203C7.70026 14.0269 8.47194 13.4769 9.32122 13.1017C10.1705 12.7265 11.0807 12.5333 12 12.5333C12.9193 12.5333 13.8295 12.7265 14.6788 13.1017C15.5281 13.4769 16.2997 14.0269 16.9497 14.7203C17.5998 15.4136 18.1154 16.2367 18.4672 17.1426C18.8189 18.0485 19 19.0195 19 20H5Z",
    fill: "currentColor"
  }));
};
const ReactComponent$1 = (_Qa) => {
  var _Ra = _Qa, {
    title,
    titleId
  } = _Ra, props = __objRest(_Ra, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    viewBox: "0 0 24 24",
    fill: "none",
    xmlns: "http://www.w3.org/2000/svg",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    d: "M11 8C11 8.79565 10.6839 9.55871 10.1213 10.1213C9.55871 10.6839 8.79565 11 8 11C7.20435 11 6.44129 10.6839 5.87868 10.1213C5.31607 9.55871 5 8.79565 5 8C5 7.20435 5.31607 6.44129 5.87868 5.87868C6.44129 5.31607 7.20435 5 8 5C8.79565 5 9.55871 5.31607 10.1213 5.87868C10.6839 6.44129 11 7.20435 11 8ZM19 8C19 8.39397 18.9224 8.78407 18.7716 9.14805C18.6209 9.51203 18.3999 9.84274 18.1213 10.1213C17.8427 10.3999 17.512 10.6209 17.1481 10.7716C16.7841 10.9224 16.394 11 16 11C15.606 11 15.2159 10.9224 14.8519 10.7716C14.488 10.6209 14.1573 10.3999 13.8787 10.1213C13.6001 9.84274 13.3791 9.51203 13.2284 9.14805C13.0776 8.78407 13 8.39397 13 8C13 7.20435 13.3161 6.44129 13.8787 5.87868C14.4413 5.31607 15.2044 5 16 5C16.7956 5 17.5587 5.31607 18.1213 5.87868C18.6839 6.44129 19 7.20435 19 8ZM14.93 19C14.976 18.673 15 18.34 15 18C15.0023 16.4289 14.4737 14.903 13.5 13.67C14.2601 13.2312 15.1223 13.0001 16 13.0001C16.8776 13.0001 17.7399 13.2311 18.4999 13.67C19.26 14.1088 19.8912 14.74 20.3301 15.5C20.7689 16.2601 21 17.1223 21 18V19H14.93ZM8 13C9.32608 13 10.5979 13.5268 11.5355 14.4645C12.4732 15.4021 13 16.6739 13 18V19H3V18C3 16.6739 3.52678 15.4021 4.46447 14.4645C5.40215 13.5268 6.67392 13 8 13Z",
    fill: "currentColor"
  }));
};
const ReactComponent = (_Sa) => {
  var _Ta = _Sa, {
    title,
    titleId
  } = _Ta, props = __objRest(_Ta, [
    "title",
    "titleId"
  ]);
  return /* @__PURE__ */ React.createElement("svg", __spreadValues({
    xmlns: "http://www.w3.org/2000/svg",
    fill: "none",
    viewBox: "0 0 24 24",
    stroke: "currentColor",
    width: "1em",
    height: "1em",
    focusable: "false",
    shapeRendering: "geometricPrecision",
    "aria-labelledby": titleId
  }, props), title ? /* @__PURE__ */ React.createElement("title", {
    id: titleId
  }, title) : null, /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M3 10h18M7 15h1m4 0h1m-7 4h12a3 3 0 003-3V8a3 3 0 00-3-3H6a3 3 0 00-3 3v8a3 3 0 003 3z"
  }));
};
const Container$2 = styled.div`
  display: flex;
  flex-direction: row;
`;
const IconCloseContainer = styled(ReactComponent$z)`
  height: ${tokens.space["6"]};
  width: ${tokens.space["6"]};
  margin-top: -${tokens.space["6"]};
  opacity: ${tokens.opacity["30"]};
  cursor: pointer;
  padding: ${tokens.space["1.25"]};
  transition-propery: all;
  transition-duration: ${tokens.transitionDuration["150"]};
  transition-timing-function: ${tokens.transitionTimingFunction["inOut"]};

  &:hover {
    opacity: 0.5;
  }
`;
const Modal = (_Ua) => {
  var _Va = _Ua, {
    children,
    backdropSurface,
    onDismiss,
    open
  } = _Va, cardProps = __objRest(_Va, [
    "children",
    "backdropSurface",
    "onDismiss",
    "open"
  ]);
  return /* @__PURE__ */ React.createElement(Backdrop, __spreadValues({}, {
    open,
    onDismiss,
    surface: backdropSurface
  }), /* @__PURE__ */ React.createElement(Container$2, null, /* @__PURE__ */ React.createElement(Card, __spreadValues({}, cardProps), children), onDismiss && /* @__PURE__ */ React.createElement(IconCloseContainer, {
    "data-testid": "close-icon",
    onClick: onDismiss
  })));
};
const shortenAddress = (address = "", maxLength = 10, leftSlice = 5, rightSlice = 5) => {
  if (address.length < maxLength) {
    return address;
  }
  return `${address.slice(0, leftSlice)}...${address.slice(-rightSlice)}`;
};
const Container$1 = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  justify-content: space-between;
  border-radius: ${tokens.radii["full"]};
  transition-duration: ${tokens.transitionDuration["150"]};
  transition-property: color, border-color, background-color, transform, filter,
    box-shadow;
  transition-timing-function: ${tokens.transitionTimingFunction["inOut"]};
  position: relative;
  z-index: 10;
  padding: ${tokens.space["2"]} ${tokens.space["4"]} ${tokens.space["2"]}
    ${tokens.space["2.5"]};
  box-shadow: ${tokens.shadows["0.25"]};
  ${({
  theme
}) => `
    color: ${tokens.colors[theme.mode].foregroundSecondary};
    background-color: ${tokens.colors[theme.mode].groupBackground};
  `}

  ${({
  hasChevron
}) => hasChevron && `
      cursor: pointer;
      &:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
      }
  `}

  ${({
  open,
  theme
}) => open && `
      box-shadow: ${tokens.shadows["0"]};
      background-color: ${tokens.colors[theme.mode].foregroundSecondary};
  `}

  ${({
  size
}) => {
  switch (size) {
    case "small":
      return `
          max-width: ${tokens.space["48"]};
        `;
    case "medium":
      return `
          max-width: ${tokens.space["52"]};
        `;
    case "large":
      return `
          max-width: ${tokens.space["80"]};
        `;
    default:
      return ``;
  }
}}

  ${({
  size,
  hasChevron
}) => {
  if (size === "small" && hasChevron)
    return `
      max-width: ${tokens.space["52"]};
    `;
  if (size === "medium" && hasChevron)
    return `
      max-width: ${tokens.space["56"]};
    `;
  if (size === "large" && hasChevron)
    return `
      max-width: calc(${tokens.space["80"]} + ${tokens.space["4"]});
    `;
}}
`;
const Chevron$1 = styled.svg`
  margin-left: ${tokens.space["1"]};
  width: ${tokens.space["3"]};
  margin-right: ${tokens.space["0.5"]};
  transition-duration: ${tokens.transitionDuration["200"]};
  transition-property: all;
  transition-timing-function: ${tokens.transitionTimingFunction["inOut"]};
  opacity: 0.3;
  transform: rotate(0deg);
  display: flex;
  color: ${({
  theme
}) => tokens.colors[theme.mode].foreground};

  ${({
  $open
}) => $open && `
      opacity: 1;
      transform: rotate(180deg);
  `}
`;
const ProfileInnerContainer = styled.div`
  display: ${({
  size
}) => size === "small" ? "none" : "block"};
  margin: 0 ${tokens.space["1.5"]};
  min-width: ${tokens.space["none"]};
`;
const ReducedLineText = styled(Typography)`
  line-height: initial;
`;
const ProfileInner = ({
  size,
  avatar,
  avatarAs,
  address,
  ensName
}) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(Avatar, {
  as: avatarAs,
  label: "profile-avatar",
  placeholder: !avatar,
  src: avatar
}), /* @__PURE__ */ React.createElement(ProfileInnerContainer, {
  size
}, /* @__PURE__ */ React.createElement(ReducedLineText, {
  color: ensName ? "text" : "textTertiary",
  ellipsis: true,
  forwardedAs: "h3",
  variant: ensName && size === "large" ? "extraLarge" : "large",
  weight: "bold"
}, ensName || "No name set"), /* @__PURE__ */ React.createElement(ReducedLineText, {
  color: ensName ? "textTertiary" : "text",
  forwardedAs: "h4",
  variant: "small",
  weight: "bold"
}, shortenAddress(address, size === "large" ? 30 : 10, size === "large" ? 10 : 5, size === "large" ? 10 : 5))));
const Profile = ({
  size = "medium",
  avatar,
  avatarAs,
  dropdownItems,
  address,
  ensName,
  alignDropdown = "left"
}) => {
  const [isOpen, setIsOpen] = React.useState(false);
  if (dropdownItems) {
    return /* @__PURE__ */ React.createElement(Dropdown, __spreadValues({}, {
      items: dropdownItems,
      isOpen,
      setIsOpen,
      align: alignDropdown
    }), /* @__PURE__ */ React.createElement(Container$1, __spreadProps(__spreadValues({}, {
      size,
      hasChevron: true,
      open: isOpen
    }), {
      onClick: () => setIsOpen(!isOpen)
    }), /* @__PURE__ */ React.createElement(ProfileInner, __spreadValues({}, {
      size,
      avatar,
      avatarAs,
      address,
      ensName
    })), /* @__PURE__ */ React.createElement(Chevron$1, {
      $open: isOpen,
      as: ReactComponent$K
    })));
  }
  return /* @__PURE__ */ React.createElement(Container$1, __spreadProps(__spreadValues({}, {
    size,
    open: isOpen
  }), {
    "data-testid": "profile"
  }), /* @__PURE__ */ React.createElement(ProfileInner, __spreadValues({}, {
    size,
    avatar,
    avatarAs,
    address,
    ensName
  })));
};
const Input = styled.input`
  width: ${tokens.space["6"]};
  height: ${tokens.space["6"]};
  margin: ${tokens.space["2"]} 0;
  cursor: pointer;
  font: inherit;
  border-radius: 50%;
  display: grid;
  place-content: center;
  transition: transform 150ms ease-in-out, filter 150ms ease-in-out;

  &:hover {
    transform: translateY(-1px);
    filter: contrast(0.7);
  }

  &:active {
    transform: translateY(0px);
    filter: contrast(1);
  }

  &:checked::before {
    transform: scale(1);
  }

  ${({
  theme
}) => `
    background-color: ${tokens.colors[theme.mode].backgroundHide};
  
    &::before {
        content: '';
        width: ${tokens.space["4.5"]};
        height: ${tokens.space["4.5"]};
        border-radius: 50%;
        transform: scale(0);
        transition: transform 90ms ease-in-out;
        background-image: ${tokens.colors[theme.mode].gradients.blue};
        background-size: 100% 100%;
        background-position: center;
      }
  `}
`;
const RadioButton = React.forwardRef((_Wa, ref) => {
  var _Xa = _Wa, {
    description,
    disabled,
    error,
    hideLabel,
    id: id2,
    label,
    labelSecondary,
    name,
    required,
    tabIndex,
    value,
    checked,
    width,
    onBlur,
    onChange,
    onFocus
  } = _Xa, props = __objRest(_Xa, [
    "description",
    "disabled",
    "error",
    "hideLabel",
    "id",
    "label",
    "labelSecondary",
    "name",
    "required",
    "tabIndex",
    "value",
    "checked",
    "width",
    "onBlur",
    "onChange",
    "onFocus"
  ]);
  const defaultRef = React.useRef(null);
  const inputRef = ref || defaultRef;
  return /* @__PURE__ */ React.createElement(Field, {
    description,
    error,
    hideLabel,
    id: id2,
    inline: true,
    label,
    labelSecondary,
    required,
    width
  }, /* @__PURE__ */ React.createElement(Input, __spreadValues({
    "aria-invalid": error ? true : void 0,
    "data-testid": "radio",
    ref: inputRef,
    type: "radio"
  }, __spreadValues({
    disabled,
    name,
    tabIndex,
    value,
    onBlur,
    onChange,
    onFocus,
    checked
  }, props))));
});
RadioButton.displayName = "RadioButton";
const RadioButtonGroup = ({
  children,
  currentValue: _currentValue,
  onChange
}) => {
  const [currentValue, setCurrentValue] = React.useState(null);
  const [didSetDefault, setDidSetDefault] = React.useState(false);
  React.useEffect(() => {
    if (_currentValue) {
      setCurrentValue(_currentValue);
    }
  }, [_currentValue]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, React.Children.map(children, (child) => {
    if (child.props.checked && currentValue !== child.props.value && !didSetDefault) {
      setCurrentValue(child.props.value);
      setDidSetDefault(true);
    }
    return React.cloneElement(child, {
      checked: child.props.value === currentValue,
      onChange: () => {
        setCurrentValue(child.props.value);
        if (onChange) {
          onChange(child.props.value);
        }
      }
    });
  }));
};
var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal$1;
var freeGlobal = _freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root$1 = freeGlobal || freeSelf || Function("return this")();
var _root = root$1;
var root = _root;
var Symbol$4 = root.Symbol;
var _Symbol = Symbol$4;
function arrayMap$1(array, iteratee) {
  var index2 = -1, length = array == null ? 0 : array.length, result = Array(length);
  while (++index2 < length) {
    result[index2] = iteratee(array[index2], index2, array);
  }
  return result;
}
var _arrayMap = arrayMap$1;
var isArray$1 = Array.isArray;
var isArray_1 = isArray$1;
var Symbol$3 = _Symbol;
var objectProto$1 = Object.prototype;
var hasOwnProperty = objectProto$1.hasOwnProperty;
var nativeObjectToString$1 = objectProto$1.toString;
var symToStringTag$1 = Symbol$3 ? Symbol$3.toStringTag : void 0;
function getRawTag$1(value) {
  var isOwn = hasOwnProperty.call(value, symToStringTag$1), tag = value[symToStringTag$1];
  try {
    value[symToStringTag$1] = void 0;
    var unmasked = true;
  } catch (e) {
  }
  var result = nativeObjectToString$1.call(value);
  if (unmasked) {
    if (isOwn) {
      value[symToStringTag$1] = tag;
    } else {
      delete value[symToStringTag$1];
    }
  }
  return result;
}
var _getRawTag = getRawTag$1;
var objectProto = Object.prototype;
var nativeObjectToString = objectProto.toString;
function objectToString$1(value) {
  return nativeObjectToString.call(value);
}
var _objectToString = objectToString$1;
var Symbol$2 = _Symbol, getRawTag = _getRawTag, objectToString = _objectToString;
var nullTag = "[object Null]", undefinedTag = "[object Undefined]";
var symToStringTag = Symbol$2 ? Symbol$2.toStringTag : void 0;
function baseGetTag$1(value) {
  if (value == null) {
    return value === void 0 ? undefinedTag : nullTag;
  }
  return symToStringTag && symToStringTag in Object(value) ? getRawTag(value) : objectToString(value);
}
var _baseGetTag = baseGetTag$1;
function isObjectLike$1(value) {
  return value != null && typeof value == "object";
}
var isObjectLike_1 = isObjectLike$1;
var baseGetTag = _baseGetTag, isObjectLike = isObjectLike_1;
var symbolTag = "[object Symbol]";
function isSymbol$1(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
var isSymbol_1 = isSymbol$1;
var Symbol$1 = _Symbol, arrayMap = _arrayMap, isArray = isArray_1, isSymbol = isSymbol_1;
var INFINITY = 1 / 0;
var symbolProto = Symbol$1 ? Symbol$1.prototype : void 0, symbolToString = symbolProto ? symbolProto.toString : void 0;
function baseToString$1(value) {
  if (typeof value == "string") {
    return value;
  }
  if (isArray(value)) {
    return arrayMap(value, baseToString$1) + "";
  }
  if (isSymbol(value)) {
    return symbolToString ? symbolToString.call(value) : "";
  }
  var result = value + "";
  return result == "0" && 1 / value == -INFINITY ? "-0" : result;
}
var _baseToString = baseToString$1;
var baseToString = _baseToString;
function toString$1(value) {
  return value == null ? "" : baseToString(value);
}
var toString_1 = toString$1;
var toString = toString_1;
var idCounter = 0;
function uniqueId(prefix) {
  var id2 = ++idCounter;
  return toString(prefix) + id2;
}
var uniqueId_1 = uniqueId;
const SelectContainer = styled.div`
  ${({
  theme
}) => `
    background: ${tokens.colors[theme.mode].background};
    border-color: ${tokens.colors[theme.mode].backgroundHide};
    border-width: ${tokens.space["px"]};
    border-radius: ${tokens.radii["extraLarge"]};
    cursor: pointer;
    position: relative;
    padding: ${tokens.space["4"]};
    height: ${tokens.space["14"]};
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
  `}

  ${({
  disabled,
  theme
}) => disabled && `
    cursor: not-allowed;
    background: ${tokens.colors[theme.mode].backgroundTertiary};
  `}
`;
const OptionElementContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  gap: ${tokens.space["4"]};
`;
const Chevron = styled(ReactComponent$K)`
  margin-left: ${tokens.space["1"]};
  width: ${tokens.space["3"]};
  margin-right: ${tokens.space["0.5"]};
  transition-duration: ${tokens.transitionDuration["200"]};
  transition-property: all;
  transition-timing-function: ${tokens.transitionTimingFunction["inOut"]};
  opacity: 0.3;
  transform: rotate(0deg);
  display: flex;

  & > svg {
    fill: currentColor;
  }
  fill: currentColor;

  ${({
  open
}) => open && `
      opacity: 1;
      transform: rotate(180deg);
  `}

  ${({
  disabled
}) => disabled && `
      opacity: 0.1;
  `}
`;
const SelectOptionContainer = styled.div`
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  justify-content: space-between;
  margin-top: ${tokens.space["1.5"]};
  padding: ${tokens.space["1.5"]};
  position: absolute;
  visibility: hidden;
  opacity: 0;
  width: ${tokens.space["full"]};
  height: ${tokens.space["fit"]};
  border-radius: ${tokens.radii["medium"]};
  overflow: hidden;

  ${({
  theme
}) => `
    box-shadow: ${tokens.boxShadows[theme.mode]["0.02"]};
  `}

  ${({
  open
}) => open ? `
      z-index: 20;
      visibility: visible;
      margin-top: ${tokens.space["1.5"]};
      opacity ${tokens.opacity["100"]};
      transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), z-index 0s linear 0.3s;
  ` : `
      z-index: 0;
      visibility: hidden;
      margin-top: -${tokens.space["12"]};
      opacity: 0;
      transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), z-index 0s linear 0s;
  `}
`;
const SelectOption = styled.div`
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: ${tokens.space["3"]};
  width: ${tokens.space["full"]};
  height: ${tokens.space["9"]};
  padding: 0 ${tokens.space["2"]};
  justify-content: flex-start;
  transition-duration: ${tokens.transitionDuration["150"]};
  transition-property: all;
  transition-timing-function: ${tokens.transitionTimingFunction["inOut"]};
  border-radius: ${tokens.radii["medium"]};
  margin: ${tokens.space["0.5"]} 0;

  ${({
  theme
}) => `
    &:hover {
      background-color: ${tokens.colors[theme.mode].foregroundSecondaryHover};    
    }
    
    &::first-child {
      margin-top: ${tokens.space["0"]};
    }
    
    &::last-child {
      margin-bottom: ${tokens.space["0"]};
    }
  `}

  ${({
  theme,
  selected
}) => selected && `
      background-color: ${tokens.colors[theme.mode].foregroundSecondary};
  `}

  ${({
  theme,
  disabled
}) => disabled && `
      color: ${tokens.colors[theme.mode].textTertiary};
      cursor: not-allowed;
      
      &:hover {
        background-color: ${tokens.colors.base.transparent};
      }
  `}
`;
const Select = React.forwardRef(({
  description,
  disabled,
  error,
  hideLabel,
  id: _id,
  label,
  labelSecondary,
  required,
  tabIndex,
  width,
  onBlur,
  onChange,
  onFocus,
  options,
  selected: _selected
}, ref) => {
  const defaultRef = React.useRef(null);
  const inputRef = ref || defaultRef;
  const [id2] = React.useState(_id || uniqueId_1());
  const [selected, setSelected] = React.useState(null);
  const [menuOpen, setMenuOpen] = React.useState(false);
  const handleInputEvent = (e, type, value) => {
    if (disabled || value && value.disabled)
      return e.stopPropagation();
    if (type === "keyboard") {
      e = e;
      if (!menuOpen && ["ArrowDown", "ArrowUp", "Enter", " "].includes(e.key))
        return setMenuOpen(true);
      if (menuOpen && e.key === "Enter") {
        value && setSelected(value);
        setMenuOpen(false);
        return;
      }
    } else {
      e = e;
      if (e.type === "click" && e.button === 0) {
        value && setSelected(value);
        setMenuOpen(!menuOpen);
      }
    }
  };
  const handleClickOutside = (e) => {
    if (inputRef.current && !inputRef.current.contains(e.target)) {
      setMenuOpen(false);
    }
  };
  React.useEffect(() => {
    if (_selected !== selected && _selected !== void 0)
      setSelected(_selected);
  }, [_selected]);
  React.useEffect(() => {
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    } else {
      document.removeEventListener("mousedown", handleClickOutside);
    }
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [inputRef, menuOpen]);
  React.useEffect(() => {
    if (selected !== _selected && onChange)
      onChange(selected);
  }, [selected]);
  const OptionElement = ({
    option
  }) => option ? /* @__PURE__ */ React.createElement(React.Fragment, null, option.prefix && /* @__PURE__ */ React.createElement("div", null, option.prefix), option.label || option.value) : null;
  return /* @__PURE__ */ React.createElement(Field, {
    "data-testid": "select",
    description,
    error,
    hideLabel,
    id: id2,
    label,
    labelSecondary,
    required,
    width
  }, /* @__PURE__ */ React.createElement("div", __spreadValues({
    ref: inputRef,
    style: {
      position: "relative"
    }
  }, {
    onFocus,
    onBlur
  }), /* @__PURE__ */ React.createElement(SelectContainer, __spreadValues({
    "aria-controls": `listbox-${id2}`,
    "aria-expanded": "true",
    "aria-haspopup": "listbox",
    "aria-invalid": error ? true : void 0,
    id: `combo-${id2}`,
    role: "combobox",
    onClick: (e) => handleInputEvent(e, "mouse")
  }, {
    disabled,
    tabIndex,
    open: menuOpen
  }), /* @__PURE__ */ React.createElement(OptionElementContainer, {
    "data-testid": "selected"
  }, selected ? /* @__PURE__ */ React.createElement(OptionElement, {
    option: selected
  }) : /* @__PURE__ */ React.createElement("div", null)), /* @__PURE__ */ React.createElement(Chevron, __spreadValues({}, {
    open: menuOpen,
    disabled
  }))), /* @__PURE__ */ React.createElement(SelectOptionContainer, __spreadProps(__spreadValues({}, {
    open: menuOpen
  }), {
    id: `listbox-${id2}`,
    role: "listbox",
    tabIndex: -1
  }), (Array.isArray(options) ? options : [options]).map((option) => /* @__PURE__ */ React.createElement(SelectOption, __spreadProps(__spreadValues({}, {
    selected: option === selected,
    disabled: option.disabled
  }), {
    key: option.value,
    role: "option",
    onClick: (e) => handleInputEvent(e, "mouse", option),
    onKeyPress: (e) => handleInputEvent(e, "keyboard", option)
  }), /* @__PURE__ */ React.createElement(OptionElement, {
    option
  }))))));
});
const TextArea = styled.textarea`
  ${({
  theme
}) => `
      background-color: ${tokens.colors.base.transparent};
      border-color: ${tokens.colors[theme.mode].foregroundSecondary};
      border-radius: ${tokens.radii["2xLarge"]};
      border-width: ${tokens.space["0.5"]};
      color: ${tokens.colors[theme.mode].text};
      display: flex;
      font-family: ${tokens.fonts["sans"]};
      font-size: ${tokens.fontSizes["base"]};
      font-weight: ${tokens.fontWeights["medium"]};
      min-height: ${tokens.space["14"]};
      padding: ${tokens.space["4"]};
      transition-duration: ${tokens.transitionDuration["150"]};
      transition-property: color, border-color, background-color;
      transition-timing-function: ${tokens.transitionTimingFunction["inOut"]};
      width: ${tokens.space["full"]};
      resize: none;
      
      &:focus {
        border-color: ${tokens.colors[theme.mode].accent};
      }
  `}

  ${({
  theme,
  disabled
}) => disabled && `
      border-color: ${tokens.colors[theme.mode].foregroundSecondary};
      cursor: not-allowed;
  `}

  ${({
  theme,
  error
}) => error && `
      border-color: ${tokens.colors[theme.mode].red};
      cursor: default;
      
      &:focus-within {
        border-color: ${tokens.colors[theme.mode].red};
      }
  `}
`;
const Textarea = React.forwardRef(({
  autoCorrect,
  autoFocus,
  defaultValue,
  description,
  disabled,
  error,
  hideLabel,
  id: id2,
  label,
  labelSecondary,
  maxLength,
  name,
  placeholder,
  readOnly,
  required,
  rows = 5,
  spellCheck,
  tabIndex,
  value,
  width,
  onChange,
  onBlur,
  onFocus
}, ref) => {
  const defaultRef = React.useRef(null);
  const inputRef = ref || defaultRef;
  const hasError = error ? true : void 0;
  return /* @__PURE__ */ React.createElement(Field, {
    description,
    error,
    hideLabel,
    id: id2,
    label,
    labelSecondary,
    required,
    width
  }, /* @__PURE__ */ React.createElement(TextArea, __spreadValues({
    "aria-invalid": hasError,
    autoCorrect,
    autoFocus,
    defaultValue,
    maxLength,
    name,
    placeholder,
    readOnly,
    ref: inputRef,
    rows,
    spellCheck,
    tabIndex,
    value,
    onBlur,
    onChange,
    onFocus
  }, {
    disabled,
    error: hasError
  })));
});
Textarea.displayName = "Textarea";
const TooltipPopover = styled.div`
  position: absolute;
  border-width: 1px;
  border-style: solid;
  box-sizing: border-box;
  box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
  border-radius: ${tokens.space["3.5"]};
  padding: ${tokens.space["2.5"]} ${tokens.space["2.5"]} ${tokens.space["2.5"]}
    ${tokens.space["3.5"]};
  width: 230px;
  transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6);
  z-index: 20;
  ${({
  open
}) => open ? `
    opacity: 1;
    visibility: visible;
    ` : `
    opacity: 0;
    visibility: hidden;
    `}

  ${({
  side,
  open
}) => {
  if (open)
    return `transform: translate(0,0);`;
  if (side === "top")
    return `transform: translate(0, 3em);`;
  if (side === "right")
    return `transform: translate(-3em, 0);`;
  if (side === "bottom")
    return `transform: translate(0, -3em);`;
  return `transform: translate(3em, 0);`;
}}

  ${({
  x,
  y
}) => `
    left: ${x}px;
    top: ${y}px;
  `}

  ${({
  theme
}) => `
    border-color: ${tokens.colors[theme.mode].borderSecondary}
    background: ${tokens.colors[theme.mode].background};
  `}
`;
const Tooltip = (_Ya) => {
  var _Za = _Ya, {
    content
  } = _Za, props = __objRest(_Za, [
    "content"
  ]);
  const popover = /* @__PURE__ */ React.createElement(TooltipPopover, null, content);
  return DynamicPopover(__spreadValues({
    popover
  }, props));
};
Tooltip.displayName = "Tooltip";
const Title = styled(Typography)`
  font-size: ${tokens.fontSizes["headingTwo"]};
  font-weight: ${tokens.fontWeights["bold"]};
`;
const SubTitle = styled(Typography)`
  font-size: ${tokens.fontSizes["headingThree"]};
  font-weight: ${tokens.fontWeights["normal"]};
`;
const Container = styled.div`
  ${({
  center
}) => `
    flex-direction: ${center ? "column" : "row"};
    gap: ${tokens.space["2"]};
  `}
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const Dialog = (__a) => {
  var _$a = __a, {
    title,
    subtitle,
    trailing,
    leading,
    center,
    children
  } = _$a, cardProps = __objRest(_$a, [
    "title",
    "subtitle",
    "trailing",
    "leading",
    "center",
    "children"
  ]);
  return /* @__PURE__ */ React.createElement(Modal, __spreadValues({}, cardProps), /* @__PURE__ */ React.createElement("div", {
    style: {
      minWidth: 64
    }
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      marginBottom: 4
    }
  }, title && (typeof title !== "string" && title || /* @__PURE__ */ React.createElement(Title, null, title)), subtitle && (typeof subtitle !== "string" && subtitle || /* @__PURE__ */ React.createElement(SubTitle, null, subtitle))), children, (leading || trailing) && /* @__PURE__ */ React.createElement("div", {
    style: {
      marginTop: 4
    }
  }, /* @__PURE__ */ React.createElement(Container, __spreadValues({}, {
    center
  }), leading || !center && /* @__PURE__ */ React.createElement("div", {
    style: {
      flexGrow: 1
    }
  }), trailing || !center && /* @__PURE__ */ React.createElement("div", {
    style: {
      flexGrow: 1
    }
  })))));
};
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  Avatar,
  BackdropSurface,
  Button,
  Card,
  Field,
  FileInput,
  Heading,
  Portal,
  Skeleton,
  Spinner,
  Tag,
  Typography,
  VisuallyHidden,
  DynamicPopover,
  Backdrop,
  Checkbox,
  CountdownCircle,
  Dropdown,
  FieldSet,
  Input: Input$1,
  Modal,
  Profile,
  RadioButton,
  RadioButtonGroup,
  Select,
  SkeletonGroup,
  Textarea,
  Tooltip,
  TooltipPopover,
  Dialog,
  ArrowCircleSVG: ReactComponent$J,
  ArrowRightSVG: ReactComponent$I,
  ArrowUpSVG: ReactComponent$H,
  BookOpenSVG: ReactComponent$G,
  CancelCircleSVG: ReactComponent$F,
  CheckSVG: ReactComponent$E,
  ChevronDownSVG: ReactComponent$D,
  ChevronLeftSVG: ReactComponent$C,
  ChevronRightSVG: ReactComponent$B,
  ChevronUpSVG: ReactComponent$A,
  CloseSVG: ReactComponent$z,
  CodeSVG: ReactComponent$y,
  CogSVG: ReactComponent$x,
  CollectionSVG: ReactComponent$w,
  CopySVG: ReactComponent$v,
  DocumentsSVG: ReactComponent$u,
  DotsVerticalSVG: ReactComponent$t,
  DownIndicatorSVG: ReactComponent$K,
  DuplicateSVG: ReactComponent$s,
  EthSVG: ReactComponent$r,
  EthTransparentSVG: ReactComponent$q,
  EthTransparentInvertedSVG: ReactComponent$p,
  ExclamationSVG: ReactComponent$o,
  FlagSVG: ReactComponent$n,
  GradientSVG: ReactComponent$m,
  GridSVG: ReactComponent$l,
  GridSolidSVG: ReactComponent$k,
  HandSVG: ReactComponent$j,
  LinkSVG: ReactComponent$i,
  ListSVG: ReactComponent$h,
  LockClosedSVG: ReactComponent$g,
  LogoSVG: ReactComponent$f,
  MenuSVG: ReactComponent$e,
  MoonSVG: ReactComponent$d,
  PencilSVG: ReactComponent$c,
  PlusSVG: ReactComponent$b,
  PlusSmallSVG: ReactComponent$a,
  RefreshSVG: ReactComponent$9,
  SearchSVG: ReactComponent$8,
  SplitSVG: ReactComponent$7,
  SunSVG: ReactComponent$6,
  TokensSVG: ReactComponent$5,
  TrendingUpSVG: ReactComponent$4,
  UploadSVG: ReactComponent$3,
  UserSolidSVG: ReactComponent$2,
  UsersSolidSVG: ReactComponent$1,
  WalletSVG: ReactComponent
});
const GlobalStyle = createGlobalStyle`
  ${({
  theme
}) => `
    *, ::before, ::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: ${tokens.fonts["sans"]};
      border-color: ${tokens.colors[theme.mode].foregroundSecondary};
      border-style: ${tokens.borderStyles["solid"]};
      border-width: 0;
      color: ${tokens.colors.base.current};
      font-size: 100%;
      font-feature-settings: "ss01" on, "ss03" on;
      vertical-align: baseline;
    }
    
    [data-js-focus-visible] &:focus:not([data-focus-visible-added]) {
      outline: none;
    }
  
    html {
      font-size: ${tokens.fontSizes["root"]};
      color: ${tokens.colors[theme.mode].foreground};
      text-rendering: optimizeLegibility;
      background: radial-gradient(40.48% 67.6% at 50% 32.4%,#ecf4ff 0%,#f7f7ff 52.77%,#f7f7f7 100%),#ffffff;
    }
    
    body {
      line-height: ${tokens.lineHeights.none};
    }
    
    article, aside, details, div, figcaption, figure, footer, header, hgroup, menu, nav, section {
      display: block;
    }
    
    ul, ol {
      list-style: none;
    }
    
    quote, blockquote {
      quotes: none;
      
      &:before, &after {
        content: '';
      }
    }
    
    table {
      border-collapse: collapse;
      border-spacing: 0;s
    }
    
    field {
      display: block;
      appearance: none;
      outline: none;
      &:placeholder {
        color: ${tokens.colors[theme.mode].textTertiary};
        opacity: ${tokens.opacity["100"]};
      }
    }
    
    mark {
      background-color: ${tokens.colors.base.transparent};
      color: ${tokens.colors.base.inherit};
    }
    
    select {
      display: block;
        appearance: none;
        outline: none;
        &:placeholder {
          color: ${tokens.colors[theme.mode].textTertiary};
          opacity: ${tokens.opacity["100"]};
        }
        
        &:-ms-expand {
          display: none;
        }
    }
    
    input {
      display: block;
      appearance: none;
      outline: none;
      &:placeholder {
        color: ${tokens.colors[theme.mode].textTertiary};
        opacity: ${tokens.opacity["100"]};
      }
      &::-webkit-outer-spin-button {
        webkit-appearance: none;
      }
      &::-webkit-inner-spin-button {
        webkit-appearance: none;
      }
      &::-ms-clear {
        display: none;
      }
      &::-webkit-search-cancel-button {
        webkit-appearance: none;
      }
    }
    
    button {
      background: none;
    }
    
    a {
      text-decoration: none;
      color: ${tokens.colors.base.inherit};
    }
  
  `}
`;
export { ReactComponent$J as ArrowCircleSVG, ReactComponent$I as ArrowRightSVG, ReactComponent$H as ArrowUpSVG, Avatar, Backdrop, BackdropSurface, ReactComponent$G as BookOpenSVG, Button, ReactComponent$F as CancelCircleSVG, Card, ReactComponent$E as CheckSVG, Checkbox, ReactComponent$D as ChevronDownSVG, ReactComponent$C as ChevronLeftSVG, ReactComponent$B as ChevronRightSVG, ReactComponent$A as ChevronUpSVG, ReactComponent$z as CloseSVG, ReactComponent$y as CodeSVG, ReactComponent$x as CogSVG, ReactComponent$w as CollectionSVG, index as Components, ReactComponent$v as CopySVG, CountdownCircle, Dialog, ReactComponent$u as DocumentsSVG, ReactComponent$t as DotsVerticalSVG, ReactComponent$K as DownIndicatorSVG, Dropdown, ReactComponent$s as DuplicateSVG, DynamicPopover, ReactComponent$r as EthSVG, ReactComponent$p as EthTransparentInvertedSVG, ReactComponent$q as EthTransparentSVG, ReactComponent$o as ExclamationSVG, Field, FieldSet, FileInput, ReactComponent$n as FlagSVG, ReactComponent$m as GradientSVG, ReactComponent$l as GridSVG, ReactComponent$k as GridSolidSVG, ReactComponent$j as HandSVG, Heading, Input$1 as Input, ReactComponent$i as LinkSVG, ReactComponent$h as ListSVG, ReactComponent$g as LockClosedSVG, ReactComponent$f as LogoSVG, ReactComponent$e as MenuSVG, Modal, ReactComponent$d as MoonSVG, ReactComponent$c as PencilSVG, ReactComponent$b as PlusSVG, ReactComponent$a as PlusSmallSVG, Portal, Profile, RadioButton, RadioButtonGroup, ReactComponent$9 as RefreshSVG, ReactComponent$8 as SearchSVG, Select, Skeleton, SkeletonGroup, Spinner, ReactComponent$7 as SplitSVG, ReactComponent$6 as SunSVG, Tag, Textarea, GlobalStyle as ThorinGlobalStyles, ReactComponent$5 as TokensSVG, Tooltip, TooltipPopover, ReactComponent$4 as TrendingUpSVG, Typography, ReactComponent$3 as UploadSVG, ReactComponent$2 as UserSolidSVG, ReactComponent$1 as UsersSolidSVG, VisuallyHidden, ReactComponent as WalletSVG, largerThan, tokens };
