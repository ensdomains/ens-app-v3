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
import styled, { keyframes, css, createGlobalStyle } from "styled-components";
import * as ReactDOM from "react-dom";
const Container$e = styled.div`
  ${({
  shape,
  theme
}) => {
  switch (shape) {
    case "circle":
      return `
          border-radius: ${theme.radii.full};
          &:after {
            border-radius: ${theme.radii.full};
          }
        `;
    case "square":
      return `
          border-radius: ${theme.radii["2xLarge"]}
          &:after {
            border-radius: ${theme.radii["2xLarge"]}
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
      box-shadow: ${theme.shadows["-px"]} ${theme.colors.foregroundTertiary};
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
      height: ${theme.space[size]};
      width: ${theme.space[size]};
      min-width: ${theme.space[size]};
      background-color: ${theme.colors.foregroundSecondary};
      
       
  `}
  
  overflow: hidden;
  position: relative;
`;
const Placeholder = styled.div`
  ${({
  theme
}) => `
    background: ${theme.colors.gradients.blue};
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
  return /* @__PURE__ */ React.createElement(Container$e, __spreadValues({}, {
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
const Container$d = styled.div`
  width: 100vw;
  height: 100vh;
  position: fixed;
  overflow: hidden;
  top: 0;
  ${({
  theme
}) => `
    backgroundColor: ${theme.shades.backgroundHideFallback};
    
    @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
    backdrop-filter: blur(30px);
    background-color: ${theme.shades.backgroundHide};
  }
  `}
`;
const BackdropSurface = (props) => /* @__PURE__ */ React__default.createElement(Container$d, __spreadValues({}, props));
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
const Container$c = styled.div`
  animation: ${rotate} 1.1s linear infinite;

  ${({
  theme,
  $color
}) => `
    color: ${theme.colors[$color]};
    stroke: ${theme.colors[$color]};
  `}

  ${({
  size,
  theme
}) => {
  switch (size) {
    case "small":
      return `
          height: ${theme.space["6"]};
          stroke-width: ${theme.space["1.25"]};
          width: ${theme.space["6"]};
        `;
    case "large":
      return `
          height: ${theme.space["16"]};
          stroke-width: ${theme.space["1"]};
          width: ${theme.space["16"]};
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
  return /* @__PURE__ */ React.createElement(Container$c, {
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
const Container$b = styled.div`
  ${({
  font,
  theme
}) => `
      font-family: ${theme.fonts[font]};
      letter-spacing: ${theme.letterSpacings["-0.01"]};
      letter-spacing: ${theme.letterSpacings["-0.015"]};
      line-height: ${theme.lineHeights.normal};
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
          font-size: ${theme.fontSizes["small"]};
          font-weight: ${theme.fontWeights["normal"]};
          letter-spacing: ${theme.letterSpacings["-0.01"]};
          line-height: ${theme.lineHeights.normal};
        `;
    case "large":
      return `
          font-size: ${theme.fontSizes["large"]};
          font-weight: ${theme.fontWeights["normal"]};
          letter-spacing: ${theme.letterSpacings["-0.02"]};
          line-height: ${theme.lineHeights["2"]};
        `;
    case "extraLarge":
      return `
          font-size: ${theme.fontSizes["extraLarge"]};
          font-weight: ${theme.fontWeights["medium"]};
          letter-spacing: ${theme.letterSpacings["-0.02"]};
          line-height: ${theme.lineHeights["2"]};
        `;
    case "label":
      return `
          color: ${theme.colors.text};
          font-size: ${theme.fontSizes["label"]};
          font-weight: ${theme.fontWeights["bold"]};
          letter-spacing: ${theme.letterSpacings["-0.01"]};
          text-transform: capitalize;
        `;
    case "labelHeading":
      return `
          color: ${theme.colors.text};
          font-size: ${theme.fontSizes["small"]};
          font-weight: ${theme.fontWeights["bold"]};
          letter-spacing: ${theme.letterSpacings["-0.01"]};
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
    color: ${theme.colors[color]};
  `}

  ${({
  size,
  theme
}) => size && `
      font-size: ${theme.fontSizes[size]};
  `}

  ${({
  weight,
  theme
}) => weight && `
      font-weight: ${theme.fontWeights[weight]};
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
  return /* @__PURE__ */ React.createElement(Container$b, __spreadProps(__spreadValues({
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
  side,
  theme
}) => center && `
  position: absolute;
  ${side}: ${size === "medium" ? theme.space["4"] : theme.space["5"]};
`;
const getAccentColour = (theme, tone, accent) => {
  if (tone === "accent") {
    return theme.colors[accent];
  }
  switch (accent) {
    case "accent":
      return theme.colors[tone];
    case "accentText":
      return theme.colors.white;
    case "accentGradient":
      return theme.colors.gradients[tone];
    case "accentSecondary":
      return `rgba(${theme.accentsRaw[tone]}, ${theme.shades[accent]})`;
    case "accentSecondaryHover":
      return `rgba(${theme.accentsRaw[tone]}, ${theme.shades[accent]})`;
    default:
      return ``;
  }
};
const ButtonElement = styled.button`
  align-items: center;
  cursor: pointer;
  display: flex;
  justify-content: center;
  transition-propery: all;
  ${({
  theme
}) => `
  gap: ${theme.space["4"]};
  transition-duration: ${theme.transitionDuration["150"]};
  transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
  letter-spacing: ${theme.letterSpacings["-0.01"]};
  `}

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
    
    box-shadow: ${theme.shadows["0.25"]} ${theme.colors.grey};
    
    &:disabled {
      background-color: ${theme.colors.grey};
      transform: translateY(0px);
      filter: brightness(1);
    }

    border-radius: ${theme.radii.extraLarge};
    font-size: ${theme.fontSizes.large};
    padding: ${theme.space["3.5"]} ${theme.space["4"]};
  `}

  ${({
  $size,
  theme
}) => {
  switch ($size) {
    case "extraSmall":
      return `
          border-radius: ${theme.radii.large};
          font-size: ${theme.fontSizes.small};
          padding: ${theme.space["2"]};
        `;
    case "small":
      return `
          border-radius: ${theme.radii.large};
          font-size: ${theme.fontSizes.small};
          height: ${theme.space["10"]};
          padding: 0 ${theme.space["4"]};
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
          color: ${getAccentColour(theme, $tone, "accentText")};
          background: ${getAccentColour(theme, $tone, "accent")};
        `;
    case "secondary":
      return `
          color: ${theme.colors.textSecondary};
          background: ${theme.colors.grey};
        `;
    case "action":
      return `
          color: ${getAccentColour(theme, $tone, "accentText")};
          background: ${getAccentColour(theme, $tone, "accentGradient")};
        `;
    case "transparent":
      return `
          color: ${theme.colors.textTertiary};
          
          &:hover {
              background-color: ${theme.colors.foregroundTertiary};
          }
          
          &:active {
              background-color: ${theme.colors.foregroundTertiary};
          }
        `;
    default:
      return ``;
  }
}}
  ${({
  $size,
  $shape,
  theme
}) => {
  switch ($shape) {
    case "circle":
      return `
          border-radius: ${theme.radii.full};
        `;
    case "square":
      return `border-radius: ${$size === "small" ? theme.radii["large"] : theme.radii["2xLarge"]};`;
    default:
      return ``;
  }
}}

  ${({
  $size,
  $center,
  theme
}) => {
  if ($size === "medium" && $center) {
    return `
        padding-left: ${theme.space["14"]};
        padding-right: ${theme.space["14"]};
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
        background-color: ${theme.colors.backgroundSecondary};
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
  ${({
  theme
}) => `
  color: inherit;
  font-size: inherit;
  font-weight: ${theme.fontWeights["semiBold"]};
  `}
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
const baseTheme = {
  borderStyles,
  borderWidths,
  colors: colors.base,
  fonts,
  fontSizes,
  fontWeights,
  letterSpacings,
  lineHeights,
  opacity,
  radii,
  shadows,
  space,
  breakpoints,
  transitionDuration,
  transitionTimingFunction
};
const lightTheme = __spreadProps(__spreadValues({}, baseTheme), {
  colors: __spreadValues(__spreadValues({}, baseTheme.colors), tokens.colors.light),
  shades: tokens.shades.light,
  boxShadows: tokens.boxShadows.light,
  accentsRaw: tokens.accentsRaw.light
});
const darkTheme = __spreadProps(__spreadValues({}, tokens), {
  colors: __spreadValues(__spreadValues({}, baseTheme.colors), tokens.colors.dark),
  shades: tokens.shades.dark,
  boxShadows: tokens.boxShadows.dark,
  accentsRaw: tokens.accentsRaw.dark
});
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
const Container$a = styled.div`
  ${({
  theme
}) => [`
  padding: ${theme.space["6"]};
  border-radius: ${theme.radii["2xLarge"]};
  background-color: ${theme.colors.background};
  `, largerThan.lg`
    border-radius: ${theme.radii["3xLarge"]};
  `]}

  ${({
  shadow,
  theme
}) => shadow && [`
      box-shadow: 0px 0px ${theme.radii["2xLarge"]} rgba(0,0,0,0.1);
      border-radius: ${theme.radii["2xLarge"]};
    `, largerThan.lg`
      box-shadow: 0px 0px ${theme.radii["3xLarge"]} rgba(0,0,0,0.1);
      border-radius: ${theme.radii["3xLarge"]};
    `]}
`;
const Card = ({
  children,
  shadow
}) => {
  return /* @__PURE__ */ React.createElement(Container$a, __spreadValues({}, {
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
    color: ${theme.colors.textTertiary};
    font-weight: ${theme.fontWeights["semiBold"]};
    margin-right: ${theme.space["4"]};
  `}
`;
const LabelContentContainer = styled.div`
  ${({
  theme
}) => `
    display: flex;
    align-items: flex-end;
    justify-conetn: space-between;
    padding-left: ${theme.space["4"]};
    padding-right: ${theme.space["4"]};
    padding-top: 0;
    padding-bottom: 0;
  `}
`;
const LabelContent = ({
  ids,
  label,
  labelSecondary,
  required
}) => /* @__PURE__ */ React.createElement(LabelContentContainer, null, /* @__PURE__ */ React.createElement(Label, __spreadValues({}, ids.label), label, " ", required && /* @__PURE__ */ React.createElement(VisuallyHidden, null, "(required)")), labelSecondary && labelSecondary);
const Container$9 = styled.div`
  ${({
  inline
}) => inline ? "align-items: center" : ""};
  display: flex;
  flex-direction: ${({
  inline
}) => inline ? "row" : "column"};
  ${({
  theme,
  width
}) => `
    gap: ${theme.space[2]};
    width: ${theme.space[width]};
  `}
`;
const ContainerInner$2 = styled.div`
  ${({
  theme
}) => `
    display: flex;
    flex-direction: column;
    gap: ${theme.space[2]};
  `}
`;
const Description$1 = styled.div`
  ${({
  theme
}) => `
    padding: 0 ${theme.space["4"]};
    color: ${theme.colors.textSecondary};
  `}
`;
const Error2 = styled.div`
  ${({
  theme
}) => `
    color: ${theme.colors.red};
    padding: 0 ${theme.space[4]};
  `}
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
  let content;
  if (typeof children === "function")
    content = /* @__PURE__ */ React.createElement(Context$1.Provider, {
      value: ids
    }, /* @__PURE__ */ React.createElement(Context$1.Consumer, null, (context) => children(context)));
  else if (children)
    content = React.cloneElement(children, ids.content);
  else
    content = children;
  return inline ? /* @__PURE__ */ React.createElement(Container$9, {
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
  })), description && /* @__PURE__ */ React.createElement(Description$1, null, description), error && /* @__PURE__ */ React.createElement(Error2, __spreadValues({
    "aria-live": "polite"
  }, ids.error), error))) : /* @__PURE__ */ React.createElement(Container$9, {
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
  })), content, description && /* @__PURE__ */ React.createElement(Description$1, __spreadValues({}, ids.description), description), error && /* @__PURE__ */ React.createElement(Error2, __spreadValues({
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
  level,
  theme
}) => {
  switch (level) {
    case "1":
      return `
          font-size: ${theme.fontSizes.headingOne};
          font-weight: ${theme.fontWeights.semiBold};
          letter-spacing: ${theme.letterSpacings["-0.02"]};
          line-height: 4rem;
        `;
    case "2":
      return `
          font-size: ${theme.fontSizes.headingTwo};
          font-weight: ${theme.fontWeights.semiBold};
          letter-spacing: ${theme.letterSpacings["-0.02"]};
          line-height: 2.5rem;
        `;
    default:
      return ``;
  }
}}
  
  ${({
  responsive,
  level,
  theme
}) => {
  if (responsive) {
    switch (level) {
      case "1":
        return [`
          font-size: ${theme.fontSizes.headingTwo};
          `, largerThan.sm`
            font-size: ${theme.fontSizes.headingOne};
          `];
      case "2":
        return [`
          font-size: ${theme.fontSizes.extraLarge};
          letter-spacing: normal;
          `, largerThan.sm`
            font-size: ${theme.fontSizes.headingTwo};
            letter-spacing: -0.02;
          `];
      default:
        return ``;
    }
  }
}}
  
  font-family: ${({
  theme
}) => theme.fonts["sans"]};
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
const Container$8 = styled.div`
  ${({
  theme,
  active
}) => active && `
     background-color: ${theme.colors.foregroundSecondary};
     border-radius: ${theme.radii.medium};
     width: ${theme.space.fit};
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
  return /* @__PURE__ */ React.createElement(Container$8, __spreadValues({}, {
    active,
    as
  }), /* @__PURE__ */ React.createElement(ContainerInner$1, __spreadValues({}, {
    active
  }), children));
};
const Container$7 = styled.div`
  ${({
  theme
}) => `
  line-height: normal;
  align-items: center;
  display: flex;
  border-radius: ${theme.radii["full"]};
  font-weight: ${theme.fontWeights["medium"]};
  width: ${theme.space["max"]};
  `}

  ${({
  hover,
  theme
}) => hover && `
      transition-duration: ${theme.transitionDuration["150"]};
      transition-property: color, border-color, background-color;
      transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
  `}

  ${({
  size,
  theme
}) => {
  switch (size) {
    case "small":
      return `
          height: ${theme.space["5"]};
          font-size: ${theme.fontSizes["label"]};
        `;
    case "medium":
      return `
          height: ${theme.space["6"]};
          font-size: ${theme.fontSizes["small"]};
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
          color: ${theme.colors.accent};
          background-color: ${theme.colors.accentTertiary};
        `;
    case "secondary":
      return `
          color: ${theme.colors.textTertiary};
          background-color: ${theme.colors.foregroundTertiary};
        `;
    case "blue":
      return `
          color: ${theme.colors.blue};
          background-color: rgba(${theme.accentsRaw.blue}, calc(${theme.shades.accentSecondary} * 0.5));
        `;
    case "green":
      return `
          color: ${theme.colors.green};
          background-color: rgba(${theme.accentsRaw.green}, calc(${theme.shades.accentSecondary} * 0.5));
        `;
    case "red":
      return `
          color: ${theme.colors.red};
          background-color: rgba(${theme.accentsRaw.red}, calc(${theme.shades.accentSecondary} * 0.5));
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
        background-color: ${theme.colors.accentTertiary};
      
        &:hover:active {
        background-color: ${theme.colors.accentSecondary};
        }
        `;
  if (hover && tone === "secondary")
    return `
        color: ${theme.colors.textSecondary};
        background-color: ${theme.colors.foregroundTertiary};
      
        &:hover:active {
          color: ${theme.colors.text};
          background-color: ${theme.colors.foregroundSecondary};
        }
        `;
  if (hover && tone === "blue")
    return `
        &:hover:active {
          background-color: ${theme.colors.blue};
        }
        `;
  if (hover && tone === "green")
    return `
        &:hover:active {
          background-color: ${theme.colors.green};
        }
        `;
  if (hover && tone === "red")
    return `
        &:hover:active {
          background-color: ${theme.colors.red};
        }
        `;
}}
`;
const LabelContainer = styled.label`
  ${({
  theme
}) => `
  align-items: center;
  border-radius: ${theme.radii["full"]};
  display: flex;
  height: ${theme.space["full"]};
  padding: 0 ${theme.space["2"]};
  box-shadow: 0 0 0 2px ${theme.colors.background};
  `}
`;
const ChildContainer = styled.div`
  ${({
  theme
}) => `
  padding: 0 ${theme.space["2"]};
  `}
`;
const Tag = ({
  as = "div",
  children,
  hover,
  label,
  size = "medium",
  tone = "secondary"
}) => {
  return /* @__PURE__ */ React.createElement(Container$7, __spreadValues({
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
function baseClamp$1(number, lower, upper) {
  if (number === number) {
    if (upper !== void 0) {
      number = number <= upper ? number : upper;
    }
    if (lower !== void 0) {
      number = number >= lower ? number : lower;
    }
  }
  return number;
}
var _baseClamp = baseClamp$1;
var reWhitespace = /\s/;
function trimmedEndIndex$1(string) {
  var index2 = string.length;
  while (index2-- && reWhitespace.test(string.charAt(index2))) {
  }
  return index2;
}
var _trimmedEndIndex = trimmedEndIndex$1;
var trimmedEndIndex = _trimmedEndIndex;
var reTrimStart = /^\s+/;
function baseTrim$1(string) {
  return string ? string.slice(0, trimmedEndIndex(string) + 1).replace(reTrimStart, "") : string;
}
var _baseTrim = baseTrim$1;
function isObject$1(value) {
  var type = typeof value;
  return value != null && (type == "object" || type == "function");
}
var isObject_1 = isObject$1;
var freeGlobal$1 = typeof commonjsGlobal == "object" && commonjsGlobal && commonjsGlobal.Object === Object && commonjsGlobal;
var _freeGlobal = freeGlobal$1;
var freeGlobal = _freeGlobal;
var freeSelf = typeof self == "object" && self && self.Object === Object && self;
var root$1 = freeGlobal || freeSelf || Function("return this")();
var _root = root$1;
var root = _root;
var Symbol$4 = root.Symbol;
var _Symbol = Symbol$4;
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
function isSymbol$2(value) {
  return typeof value == "symbol" || isObjectLike(value) && baseGetTag(value) == symbolTag;
}
var isSymbol_1 = isSymbol$2;
var baseTrim = _baseTrim, isObject = isObject_1, isSymbol$1 = isSymbol_1;
var NAN = 0 / 0;
var reIsBadHex = /^[-+]0x[0-9a-f]+$/i;
var reIsBinary = /^0b[01]+$/i;
var reIsOctal = /^0o[0-7]+$/i;
var freeParseInt = parseInt;
function toNumber$1(value) {
  if (typeof value == "number") {
    return value;
  }
  if (isSymbol$1(value)) {
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
var toNumber_1 = toNumber$1;
var baseClamp = _baseClamp, toNumber = toNumber_1;
function clamp(number, lower, upper) {
  if (upper === void 0) {
    upper = lower;
    lower = void 0;
  }
  if (upper !== void 0) {
    upper = toNumber(upper);
    upper = upper === upper ? upper : 0;
  }
  if (lower !== void 0) {
    lower = toNumber(lower);
    lower = lower === lower ? lower : 0;
  }
  return baseClamp(toNumber(number), lower, upper);
}
var clamp_1 = clamp;
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
        coords.x = clamp_1(coords.x, coordsRange.minX, coordsRange.maxX);
        break;
      default:
        coords.y = clamp_1(coords.y, coordsRange.minY, coordsRange.maxY);
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
const Container$6 = styled.div`
  ${({
  theme
}) => `
  align-items: center;
  justify-content: center;
  display: flex;
  height: ${theme.space.full};
  width: ${theme.space.full};
  `}
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
  }, /* @__PURE__ */ React.createElement(Container$6, {
    ref: boxRef
  }, children))) : null;
};
const Input$2 = styled.input`
  ${({
  theme
}) => `
  cursor: pointer;
  margin: ${theme.space["1"]} 0;
  `}

  ${({
  theme,
  variant
}) => {
  switch (variant) {
    case "regular":
      return `
          width: ${theme.space["7"]};
          height: ${theme.space["7"]};
          font: inherit;
          border-radius: ${theme.space["2"]};
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
            background-color: ${theme.colors.accent};
            mask-image: ${`url('data:image/svg+xml; utf8, <svg width="${theme.space["4"]}" height="${theme.space["4"]}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12.625L10.125 20.125L22 3.875" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>')`};
            width: ${theme.space["4"]};
            height: ${theme.space["4"]};
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
          background-color: ${theme.colors.accent};
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
            background-color: ${theme.colors.white};
            border-radius: ${theme.radii["full"]};
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
          background-color: ${theme.colors.grey};
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
  size,
  theme
}) => {
  if (variant === "switch" && size) {
    switch (size) {
      case "small":
        return `
            width: ${theme.space["7"]};
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
    color: ${theme.colors.accent};
  `}

  ${({
  theme,
  disabled
}) => disabled && `
    color: ${theme.colors.textPlaceholder};
  `}

  ${({
  size,
  theme
}) => {
  switch (size) {
    case "small":
      return `
          height: ${theme.space["16"]};
          width: ${theme.space["16"]};
        `;
    case "large":
      return `
          font-size: ${theme.fontSizes.extraLarge};
          margin-top: -${theme.space["0.5"]};
          height: ${theme.space["24"]};
          width: ${theme.space["24"]};
        `;
    default:
      return ``;
  }
}}
`;
const Container$5 = styled.div`
  ${({
  theme
}) => `
    stroke: ${theme.colors.accent};
  `}

  ${({
  theme,
  color
}) => `
    color: ${theme.colors[color]};
  `}

  ${({
  theme,
  disabled
}) => disabled && `
    color: ${theme.colors.foregroundSecondary};
  `}

  ${({
  size,
  theme
}) => {
  switch (size) {
    case "small":
      return `
          height: ${theme.space["16"]};
          width: ${theme.space["16"]};
          stroke-width: ${theme.space["1"]};
        `;
    case "large":
      return `
          height: ${theme.space["24"]};
          width: ${theme.space["24"]};
          stroke-width: ${theme.space["1"]};
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
  }), disabled ? totalCount : currentCount), /* @__PURE__ */ React.createElement(Container$5, __spreadValues({}, {
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
  ${({
  theme
}) => `
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  border-radius: ${theme.radii["medium"]};
  position: absolute;
  `}

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
    padding: ${theme.space["1.5"]};
    background-color: ${theme.colors.groupBackground};
    box-shadow: ${theme.boxShadows["0.02"]};
    border-radius: ${theme.radii["2xLarge"]};
  `}

  ${({
  theme,
  inner
}) => inner && `
    background-color: ${theme.colors.grey};
    border-radius: ${theme.radii.almostExtraLarge};
    border-top-radius: none;
    box-shadow: 0;
    border-width: ${theme.space["px"]};
    border-top-width: 0;
    border-color: ${theme.colors.borderSecondary};
    padding: 0 ${theme.space["1.5"]};
    padding-top: ${theme.space["2.5"]};
    padding-bottom: ${theme.space["1.5"]};
    margin-top: -${theme.space["2.5"]};
    transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6);
  `}

  ${({
  opened,
  inner,
  theme
}) => {
  if (opened && !inner)
    return `
      z-index: 20;
      margin-top: ${theme.space["1.5"]};
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
  shortThrow,
  theme
}) => {
  if (!opened && shortThrow)
    return `
      margin-top: -${theme.space["2.5"]};
    `;
  if (!opened && !shortThrow)
    return `
      margin-top: -${theme.space["12"]};
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
  ${({
  theme
}) => `
  align-items: center;
  cursor: pointer;
  display: flex;
  gap: ${theme.space["4"]};
  width: ${theme.space["full"]};
  height: ${theme.space["12"]};
  padding: ${theme.space["3"]};
  font-weight: ${theme.fontWeights["semiBold"]};
  transition-duration: 0.15s;
  transition-property: color, transform, filter;
  transition-timing-function: ease-in-out;
  letter-spacing: -0.01em;

  &:active {
    transform: translateY(0px);
    filter: brightness(1);
  }
  `}

  ${({
  theme,
  color
}) => `
    color: ${theme.colors[color || "accent"]};
  
    &:disabled {
      color: ${theme.colors.textTertiary}
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
        color: ${theme.colors.accent};
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
      color: ${theme.colors.textSecondary};  
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
  ${({
  theme
}) => `
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: ${theme.space["4"]};
  border-width: ${theme.space["px"]};
  font-weight: ${theme.fontWeights["semiBold"]};
  cursor: pointer;
  position: relative;
  `}

  ${({
  theme
}) => `
    border-color: ${theme.colors.borderSecondary};
  `}

  ${({
  size,
  theme
}) => {
  switch (size) {
    case "small":
      return `
          padding: ${theme.space["0.5"]} ${theme.space["0.25"]};
        `;
    case "medium":
      return `
          padding: ${theme.space["2.5"]} ${theme.space["3.5"]};
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
      border-top-left-radius: ${theme.radii["almostExtraLarge"]};
      border-top-right-radius: ${theme.radii["almostExtraLarge"]};
      border-bottom-left-radius: none;
      border-bottom-right-radius: none;
      border-bottom-width: 0;
      background-color: ${theme.colors.grey};
      color: ${theme.colors.textTertiary};
      transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6), 0.3s color ease-in-out, 0.2s border-radius ease-in-out, 0s border-width 0.1s, 0s padding linear;
      
      &:hover {
        color: ${theme.colors.accent};
      }
      `;
  if (!open)
    return `
      background-color: ${theme.colors.background};
      color: ${theme.colors.textSecondary};
      border-radius: ${theme.radii["almostExtraLarge"]};
      box-shadow: ${theme.boxShadows["0.02"]};
      transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6), 0.15s color ease-in-out, 0s border-width 0.15s, 0.15s border-color ease-in-out, 0s padding linear;
      
      &:hover {
        border-color: ${theme.colors.border};
      }
      `;
}}
`;
const Chevron$2 = styled(ReactComponent$K)`
  ${({
  theme
}) => `
  margin-left: ${theme.space["1"]};
  width: ${theme.space["3"]};
  margin-right: ${theme.space["0.5"]};
  transition-duration: ${theme.transitionDuration["200"]};
  transition-property: all;
  transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
  opacity: 0.3;
  transform: rotate(0deg);
  display: flex;
  `}

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
      maxWidth: "max-content",
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
const Container$4 = styled.fieldset`
  ${({
  theme
}) => `
  display: flex;
  flex-direction: column;
  gap: ${theme.space["4"]};
  `}
`;
const ContainerInner = styled.div`
  ${({
  theme
}) => `
  display: flex;
  flex-direction: column;
  gap: ${theme.space["1"]};
  padding: 0 ${theme.space["4"]};
  `}
`;
const Row = styled.div`
  ${({
  theme
}) => `
  display: flex;
  align-items: center;
  flex-direction: row;
  gap: ${theme.space["3"]};
  `}
`;
const Description = styled.div`
  ${({
  theme
}) => `
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSizes.base};
  `}
`;
const ChildrenContainer = styled.div`
  ${({
  theme
}) => `
  display: flex;
  flex-direction: column;
  gap: ${theme.space["4"]};
  `}
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
  return /* @__PURE__ */ React.createElement(Container$4, {
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
    background-color: ${theme.colors.backgroundSecondary};
    border-radius: ${theme.radii["2xLarge"]};
    border-width: ${theme.space["0.75"]};
    border-color: ${theme.colors.transparent};
    color: ${theme.colors.text};
    display: flex;
    transition-duration: ${theme.transitionDuration["150"]};
    transition-property: color, border-color, background-color;
    transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
    
    &:focus-within {
      border-color: ${theme.colors.accentSecondary};
    }
  `}

  ${({
  theme,
  disabled
}) => disabled && `
      border-color: ${theme.colors.foregroundSecondary};
      background-color: ${theme.colors.background};
  `}

  ${({
  theme,
  error
}) => error && `
      border-color: ${theme.colors.red};
      cursor: default;
      
      &:focus-within {
        border-color: ${theme.colors.red};
      }
  `}

  ${({
  suffix,
  theme
}) => suffix && `
      height: ${theme.space["16"]};
  `}

  ${({
  size,
  theme
}) => {
  switch (size) {
    case "medium":
      return `
          height: ${theme.space["14"]};
        `;
    case "large":
      return `
          height: ${theme.space["16"]};
        `;
    case "extraLarge":
      return `
          height: ${theme.space["18"]};
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
  ${({
  theme
}) => `
  align-items: center;
  display: flex;
  height: ${theme.space["full"]};
  line-height: normal;
  color: inherit;
  font-family: ${theme.fonts["sans"]};
  font-weight: ${theme.fontWeights["medium"]};
  padding-left: ${theme.space["4"]};
  padding-right: ${theme.space["2"]};
  `}
`;
const Suffix = styled.label`
  ${({
  theme
}) => `
  align-items: center;
  display: flex;
  height: ${theme.space["full"]};
  line-height: normal;
  color: inherit;
  font-family: ${theme.fonts["sans"]};
  font-weight: ${theme.fontWeights["medium"]};
  padding-left: ${theme.space["2"]};
  padding-right: ${theme.space["2"]};
  `}
`;
const InputContainer = styled.div`
  ${({
  theme
}) => `
  overflow: hidden;
  position: relative;
  width: ${theme.space["full"]};
  `}
`;
const InputComponent = styled.input`
  ${({
  theme
}) => `
    background-color: ${theme.colors.transparent};
    position: relative;
    width: ${theme.space["full"]};
    height: ${theme.space["full"]};
    padding: 0 ${theme.space["4"]};
    font-weight: ${theme.fontWeights["medium"]};
    
    &::placeholder {
        color: ${theme.colors.textPlaceholder};
        font-weight: ${theme.fontWeights["bold"]};
    }
  `}

  ${({
  disabled,
  theme
}) => disabled && `
        opacity ${theme.opacity["50"]};
        cursor: not-allowed;
  `}

  ${({
  type
}) => type === "number" && `
        font-feature-settings: 'kern' 1,  'tnum' 1, 'calt' 0;
        font-variant-numeric: tabular-nums;
  `}

  ${({
  size,
  theme
}) => {
  switch (size) {
    case "medium":
      return `
          font-size: ${theme.fontSizes["base"]};
        `;
    case "large":
      return `
          font-size: ${theme.fontSizes["large"]};
        `;
    case "extraLarge":
      return `
          font-size: ${theme.fontSizes["headingThree"]};
          padding: 0 ${theme.space["6"]};
        `;
    default:
      return ``;
  }
}}
`;
const Ghost = styled.div`
  border-color: ${({
  theme
}) => theme.colors.transparent};
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
    color: ${theme.colors.text};
  `}
`;
const MaxContainer = styled.div`
  display: flex;
  align-items: center;
  ${({
  suffix,
  theme
}) => suffix && `padding-right: ${theme.space["4"]};`}
`;
const MaxButton = styled.button`
  ${({
  theme
}) => `
      background-color: ${theme.colors.foregroundSecondary};
      border-radius: ${theme.radii["medium"]};
      color: ${theme.colors.textSecondary};
      cursor: pointer;
      font-size: ${theme.fontSizes["label"]};
      font-weight: ${theme.fontWeights["semiBold"]};
      height: ${theme.space["max"]};
      line-height: none;
      padding: ${theme.space["2"]};
      text-transform: uppercase;
      transition-duration: ${theme.transitionDuration["150"]};
      transition-property: color, border-color, background-color;
      transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
      visibility: hidden;
      
      &:hover {
        color: ${theme.colors.text};
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
const Container$3 = styled.div`
  display: flex;
  flex-direction: row;
`;
const IconCloseContainer = styled(ReactComponent$z)`
  ${({
  theme
}) => `
  height: ${theme.space["6"]};
  width: ${theme.space["6"]};
  margin-top: -${theme.space["6"]};
  opacity: ${theme.opacity["30"]};
  cursor: pointer;
  padding: ${theme.space["1.25"]};
  transition-propery: all;
  transition-duration: ${theme.transitionDuration["150"]};
  transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
  `}

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
  }), /* @__PURE__ */ React.createElement(Container$3, null, /* @__PURE__ */ React.createElement(Card, __spreadValues({}, cardProps), children), onDismiss && /* @__PURE__ */ React.createElement(IconCloseContainer, {
    "data-testid": "close-icon",
    onClick: onDismiss
  })));
};
const Container$2 = styled.div`
  ${({
  theme
}) => `
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  gap: ${theme.space["2"]};
  flex-gap: ${theme.space["2"]};
  `}
`;
const PageButton = styled.button`
  background-color: transparent;
  transition: all 0.15s ease-in-out;
  cursor: pointer;
  ${({
  $selected,
  theme
}) => $selected ? `
    background-color: ${theme.colors.background};
    cursor: default;
    pointer-events: none;
  ` : `
    &:hover {
      background-color: ${theme.colors.foregroundSecondary};
    }
  `}
  ${({
  theme
}) => `
  border-radius: ${theme.radii["extraLarge"]};
  border: 1px solid ${theme.colors.borderSecondary};
  min-width: ${theme.space["10"]};
  padding: ${theme.space["2"]};
  height: ${theme.space["10"]};
  font-size: ${theme.fontSizes["small"]};
  font-weight: ${theme.fontWeights["medium"]};
  color: ${theme.colors.text};
  `}
`;
const Dots = styled.p`
  ${({
  theme
}) => `
  font-size: ${theme.fontSizes["small"]};
  font-weight: ${theme.fontWeights["bold"]};
  color: ${theme.colors.textTertiary};
  `}
`;
const PageButtons = ({
  total,
  current,
  max = 5,
  alwaysShowFirst,
  alwaysShowLast,
  onChange
}) => {
  const maxPerSide = Math.floor(max / 2);
  const start = Math.min(Math.max(current - maxPerSide, 1), total - max + 1);
  const array = Array.from({
    length: max
  }, (_, i) => start + i);
  if (alwaysShowFirst && start > 1) {
    array[0] = -1;
    array.unshift(1);
  } else if (start > 1) {
    array.unshift(-1);
  }
  if (alwaysShowLast && total > current + maxPerSide) {
    array[array.length - 1] = -1 * total;
    array.push(total);
  } else if (total > current + maxPerSide) {
    array.push(-1 * total);
  }
  return /* @__PURE__ */ React.createElement(Container$2, {
    "data-testid": "pagebuttons"
  }, array.map((value) => 0 > value ? /* @__PURE__ */ React.createElement(Dots, {
    "data-testid": "pagebutton-dots",
    key: value
  }, "...") : /* @__PURE__ */ React.createElement(PageButton, {
    $selected: value === current,
    "data-testid": "pagebutton",
    key: value,
    onClick: () => onChange(value)
  }, value)));
};
const shortenAddress = (address = "", maxLength = 10, leftSlice = 5, rightSlice = 5) => {
  if (address.length < maxLength) {
    return address;
  }
  return `${address.slice(0, leftSlice)}...${address.slice(-rightSlice)}`;
};
const Container$1 = styled.div`
  ${({
  theme
}) => `
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-radius: ${theme.radii["full"]};
    transition-duration: ${theme.transitionDuration["150"]};
    transition-property: color, border-color, background-color, transform, filter,
      box-shadow;
    transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
    position: relative;
    z-index: 10;
    padding: ${theme.space["2"]} ${theme.space["4"]} ${theme.space["2"]}
      ${theme.space["2.5"]};
    box-shadow: ${theme.shadows["0.25"]};
    color: ${theme.colors.foregroundSecondary};
    background-color: ${theme.colors.groupBackground};
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
      box-shadow: ${theme.shadows["0"]};
      background-color: ${theme.colors.foregroundSecondary};
  `}

  ${({
  size,
  theme
}) => {
  switch (size) {
    case "small":
      return `
          max-width: ${theme.space["48"]};
        `;
    case "medium":
      return `
          max-width: ${theme.space["52"]};
        `;
    case "large":
      return `
          max-width: ${theme.space["80"]};
        `;
    default:
      return ``;
  }
}}

  ${({
  size,
  hasChevron,
  theme
}) => {
  if (size === "small" && hasChevron)
    return `
      max-width: ${theme.space["52"]};
    `;
  if (size === "medium" && hasChevron)
    return `
      max-width: ${theme.space["56"]};
    `;
  if (size === "large" && hasChevron)
    return `
      max-width: calc(${theme.space["80"]} + ${theme.space["4"]});
    `;
}}
`;
const Chevron$1 = styled.svg`
  ${({
  theme
}) => `
  margin-left: ${theme.space["1"]};
  width: ${theme.space["3"]};
  margin-right: ${theme.space["0.5"]};
  transition-duration: ${theme.transitionDuration["200"]};
  transition-property: all;
  transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
  opacity: 0.3;
  transform: rotate(0deg);
  display: flex;
  color: ${theme.colors.foreground};
  `}

  ${({
  $open
}) => $open && `
      opacity: 1;
      transform: rotate(180deg);
  `}
`;
const ProfileInnerContainer = styled.div`
  ${({
  theme,
  size
}) => `
  display: ${size === "small" ? "none" : "block"};
  margin: 0 ${theme.space["1.5"]};
  min-width: ${theme.space["none"]};
  `}
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
    width: ${theme.space["6"]};
    height: ${theme.space["6"]};
    margin: ${theme.space["2"]} 0;
    background-color: ${theme.colors.backgroundHide};
  
    &::before {
        content: '';
        width: ${theme.space["4.5"]};
        height: ${theme.space["4.5"]};
        border-radius: 50%;
        transform: scale(0);
        transition: transform 90ms ease-in-out;
        background-image: ${theme.colors.gradients.blue};
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
    background: ${theme.colors.background};
    border-color: ${theme.colors.backgroundHide};
    border-width: ${theme.space["px"]};
    border-radius: ${theme.radii["extraLarge"]};
    cursor: pointer;
    position: relative;
    padding: ${theme.space["4"]};
    height: ${theme.space["14"]};
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
    background: ${theme.colors.backgroundTertiary};
  `}
`;
const OptionElementContainer = styled.div`
  align-items: center;
  display: flex;
  flex-direction: row;
  flex-grow: 1;
  gap: ${({
  theme
}) => theme.space["4"]};
`;
const Chevron = styled(ReactComponent$K)`
  ${({
  theme
}) => `
    margin-left: ${theme.space["1"]};
    width: ${theme.space["3"]};
    margin-right: ${theme.space["0.5"]};
    transition-duration: ${theme.transitionDuration["200"]};
    transition-property: all;
    transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
    opacity: 0.3;
    transform: rotate(0deg);
    display: flex;

    & > svg {
      fill: currentColor;
    }
    fill: currentColor;
  `}

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
  ${({
  theme
}) => `
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    margin-top: ${theme.space["1.5"]};
    padding: ${theme.space["1.5"]};
    position: absolute;
    visibility: hidden;
    opacity: 0;
    width: ${theme.space["full"]};
    height: ${theme.space["fit"]};
    border-radius: ${theme.radii["medium"]};
    overflow: hidden;
    box-shadow: ${theme.boxShadows["0.02"]};
  `}

  ${({
  open,
  theme
}) => open ? `
      z-index: 20;
      visibility: visible;
      margin-top: ${theme.space["1.5"]};
      opacity ${theme.opacity["100"]};
      transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), z-index 0s linear 0.3s;
  ` : `
      z-index: 0;
      visibility: hidden;
      margin-top: -${theme.space["12"]};
      opacity: 0;
      transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6), z-index 0s linear 0s;
  `}
`;
const SelectOption = styled.div`
  ${({
  theme
}) => `
    align-items: center;
    cursor: pointer;
    display: flex;
    gap: ${theme.space["3"]};
    width: ${theme.space["full"]};
    height: ${theme.space["9"]};
    padding: 0 ${theme.space["2"]};
    justify-content: flex-start;
    transition-duration: ${theme.transitionDuration["150"]};
    transition-property: all;
    transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
    border-radius: ${theme.radii["medium"]};
    margin: ${theme.space["0.5"]} 0;

    &:hover {
      background-color: ${theme.colors.foregroundSecondaryHover};    
    }
    
    &::first-child {
      margin-top: ${theme.space["0"]};
    }
    
    &::last-child {
      margin-bottom: ${theme.space["0"]};
    }
  `}

  ${({
  theme,
  selected
}) => selected && `
      background-color: ${theme.colors.foregroundSecondary};
  `}

  ${({
  theme,
  disabled
}) => disabled && `
      color: ${theme.colors.textTertiary};
      cursor: not-allowed;
      
      &:hover {
        background-color: ${theme.colors.transparent};
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
      background-color: ${theme.colors.transparent};
      border-color: ${theme.colors.foregroundSecondary};
      border-radius: ${theme.radii["2xLarge"]};
      border-width: ${theme.space["0.5"]};
      color: ${theme.colors.text};
      display: flex;
      font-family: ${theme.fonts["sans"]};
      font-size: ${theme.fontSizes["base"]};
      font-weight: ${theme.fontWeights["medium"]};
      min-height: ${theme.space["14"]};
      padding: ${theme.space["4"]};
      transition-duration: ${theme.transitionDuration["150"]};
      transition-property: color, border-color, background-color;
      transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
      width: ${theme.space["full"]};
      resize: none;
      
      &:focus {
        border-color: ${theme.colors.accent};
      }
  `}

  ${({
  theme,
  disabled
}) => disabled && `
      border-color: ${theme.colors.foregroundSecondary};
      cursor: not-allowed;
  `}

  ${({
  theme,
  error
}) => error && `
      border-color: ${theme.colors.red};
      cursor: default;
      
      &:focus-within {
        border-color: ${theme.colors.red};
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
  ${({
  theme
}) => `
    position: absolute;
    border-width: 1px;
    border-style: solid;
    box-sizing: border-box;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
    border-radius: ${theme.space["3.5"]};
    padding: ${theme.space["2.5"]} ${theme.space["2.5"]} ${theme.space["2.5"]}
      ${theme.space["3.5"]};
    width: 230px;
    transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6);
    z-index: 20;
    border-color: ${theme.colors.borderSecondary}
    background: ${theme.colors.background};
  `}
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
  ${({
  theme
}) => `
    font-size: ${theme.fontSizes["headingTwo"]};
    font-weight: ${theme.fontWeights["bold"]};
  `}
`;
const SubTitle = styled(Typography)`
  ${({
  theme
}) => `
    font-size: ${theme.fontSizes["headingThree"]};
    font-weight: ${theme.fontWeights["normal"]};
  `}
`;
const Container = styled.div`
  ${({
  center,
  theme
}) => `
    flex-direction: ${center ? "column" : "row"};
    gap: ${theme.space["2"]};
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
  PageButtons,
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
      font-family: ${theme.fonts["sans"]};
      border-color: ${theme.colors.foregroundSecondary};
      border-style: ${theme.borderStyles["solid"]};
      border-width: 0;
      color: ${theme.colors.current};
      font-size: 100%;
      font-feature-settings: "ss01" on, "ss03" on;
      vertical-align: baseline;
    }
    
    [data-js-focus-visible] &:focus:not([data-focus-visible-added]) {
      outline: none;
    }
  
    html {
      font-size: ${theme.fontSizes["root"]};
      color: ${theme.colors.foreground};
      text-rendering: optimizeLegibility;
      background: radial-gradient(40.48% 67.6% at 50% 32.4%,#ecf4ff 0%,#f7f7ff 52.77%,#f7f7f7 100%),#ffffff;
    }
    
    body {
      line-height: ${theme.lineHeights.none};
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
        color: ${theme.colors.textTertiary};
        opacity: ${theme.opacity["100"]};
      }
    }
    
    mark {
      background-color: ${theme.colors.transparent};
      color: ${theme.colors.inherit};
    }
    
    select {
      display: block;
        appearance: none;
        outline: none;
        &:placeholder {
          color: ${theme.colors.textTertiary};
          opacity: ${theme.opacity["100"]};
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
        color: ${theme.colors.textTertiary};
        opacity: ${theme.opacity["100"]};
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
      color: ${theme.colors.inherit};
    }
  
  `}
`;
export { ReactComponent$J as ArrowCircleSVG, ReactComponent$I as ArrowRightSVG, ReactComponent$H as ArrowUpSVG, Avatar, Backdrop, BackdropSurface, ReactComponent$G as BookOpenSVG, Button, ReactComponent$F as CancelCircleSVG, Card, ReactComponent$E as CheckSVG, Checkbox, ReactComponent$D as ChevronDownSVG, ReactComponent$C as ChevronLeftSVG, ReactComponent$B as ChevronRightSVG, ReactComponent$A as ChevronUpSVG, ReactComponent$z as CloseSVG, ReactComponent$y as CodeSVG, ReactComponent$x as CogSVG, ReactComponent$w as CollectionSVG, index as Components, ReactComponent$v as CopySVG, CountdownCircle, Dialog, ReactComponent$u as DocumentsSVG, ReactComponent$t as DotsVerticalSVG, ReactComponent$K as DownIndicatorSVG, Dropdown, ReactComponent$s as DuplicateSVG, DynamicPopover, ReactComponent$r as EthSVG, ReactComponent$p as EthTransparentInvertedSVG, ReactComponent$q as EthTransparentSVG, ReactComponent$o as ExclamationSVG, Field, FieldSet, FileInput, ReactComponent$n as FlagSVG, ReactComponent$m as GradientSVG, ReactComponent$l as GridSVG, ReactComponent$k as GridSolidSVG, ReactComponent$j as HandSVG, Heading, Input$1 as Input, ReactComponent$i as LinkSVG, ReactComponent$h as ListSVG, ReactComponent$g as LockClosedSVG, ReactComponent$f as LogoSVG, ReactComponent$e as MenuSVG, Modal, ReactComponent$d as MoonSVG, PageButtons, ReactComponent$c as PencilSVG, ReactComponent$b as PlusSVG, ReactComponent$a as PlusSmallSVG, Portal, Profile, RadioButton, RadioButtonGroup, ReactComponent$9 as RefreshSVG, ReactComponent$8 as SearchSVG, Select, Skeleton, SkeletonGroup, Spinner, ReactComponent$7 as SplitSVG, ReactComponent$6 as SunSVG, Tag, Textarea, GlobalStyle as ThorinGlobalStyles, ReactComponent$5 as TokensSVG, Tooltip, TooltipPopover, ReactComponent$4 as TrendingUpSVG, Typography, ReactComponent$3 as UploadSVG, ReactComponent$2 as UserSolidSVG, ReactComponent$1 as UsersSolidSVG, VisuallyHidden, ReactComponent as WalletSVG, baseTheme, darkTheme, largerThan, lightTheme, tokens };
