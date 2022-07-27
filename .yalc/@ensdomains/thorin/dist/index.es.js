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
import { useEffect } from "react";
import styled, { css, keyframes, useTheme, createGlobalStyle } from "styled-components";
import * as ReactDOM from "react-dom";
import { useTransition } from "react-transition-state";
const Container$g = styled.div(({
  theme,
  $shape,
  $noBorder
}) => css`
    ${() => {
  switch ($shape) {
    case "circle":
      return css`
            border-radius: ${theme.radii.full};
            &:after {
              border-radius: ${theme.radii.full};
            }
          `;
    case "square":
      return css`
          border-radius: ${theme.radii["2xLarge"]}
          &:after {
            border-radius: ${theme.radii["2xLarge"]}
          }
        `;
    default:
      return css``;
  }
}}

    ${!$noBorder && css`
      &::after {
        box-shadow: ${theme.shadows["-px"]} ${theme.colors.foregroundTertiary};
        content: '';
        inset: 0;
        position: absolute;
      }
    `}

    background-color: ${theme.colors.foregroundSecondary};

    width: 100%;
    padding-bottom: 100%;

    > * {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    overflow: hidden;
    position: relative;
  `);
const Placeholder = styled.div(({
  theme
}) => css`
    background: ${theme.colors.gradients.blue};

    display: flex;
    align-items: center;
    justify-content: center;
    width: 100%;
    height: 100%;
  `);
const Img = styled.img(({
  $shown
}) => css`
    height: 100%;
    width: 100%;
    object-fit: cover;
    display: none;

    ${$shown && css`
      display: block;
    `}
  `);
const Avatar = (_a) => {
  var _b = _a, {
    label,
    noBorder = false,
    shape = "circle",
    src
  } = _b, props = __objRest(_b, [
    "label",
    "noBorder",
    "shape",
    "src"
  ]);
  const [showImage, setShowImage] = React.useState(!!src);
  React.useEffect(() => {
    setShowImage(false);
  }, [src]);
  return /* @__PURE__ */ React.createElement(Container$g, {
    $noBorder: !showImage || noBorder,
    $shape: shape
  }, !showImage && /* @__PURE__ */ React.createElement(Placeholder, {
    "aria-label": label
  }), /* @__PURE__ */ React.createElement(Img, __spreadProps(__spreadValues({}, props), {
    $shown: showImage,
    alt: label,
    decoding: "async",
    src,
    onError: () => setShowImage(false),
    onLoad: () => setShowImage(true)
  })));
};
Avatar.displayName = "Avatar";
const BackdropSurface = styled.div(({
  theme,
  $state,
  $empty
}) => css`
    width: 100vw;
    height: 100vh;
    position: fixed;
    overflow: hidden;
    z-index: 999;
    top: 0;
    left: 0;
    transition: ${theme.transitionDuration["300"]} all
      ${theme.transitionTimingFunction.popIn};

    ${!$empty && $state === "entered" ? css`
          background-color: rgba(
            0,
            0,
            0,
            ${theme.shades.backgroundHideFallback}
          );

          @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
            backdrop-filter: blur(16px);
            background-color: ${theme.colors.backgroundHide};
          }
        ` : css`
          background-color: rgba(0, 0, 0, 0);
          @supports (-webkit-backdrop-filter: none) or (backdrop-filter: none) {
            backdrop-filter: blur(0px);
          }
        `}
  `);
const VisuallyHidden = styled.div(() => css`
    border-width: 0;
    height: 1px;
    margin: -1px;
    overflow: hidden;
    padding: 0;
    position: absolute;
    white-space: nowrap;
    width: 1px;
  `);
const rotate = keyframes`
  100% {
    transform: rotate(1turn);
  }
`;
const Container$f = styled.div(({
  theme,
  $color,
  $size
}) => css`
    animation: ${rotate} 1.1s linear infinite;

    color: ${theme.colors[$color]};
    stroke: ${theme.colors[$color]};

    ${() => {
  switch ($size) {
    case "small":
      return css`
            height: ${theme.space["6"]};
            stroke-width: ${theme.space["1.25"]};
            width: ${theme.space["6"]};
          `;
    case "large":
      return css`
            height: ${theme.space["16"]};
            stroke-width: ${theme.space["1"]};
            width: ${theme.space["16"]};
          `;
    default:
      return ``;
  }
}}
  `);
const Spinner = React.forwardRef((_c, ref) => {
  var _d = _c, {
    accessibilityLabel,
    size = "small",
    color = "text"
  } = _d, props = __objRest(_d, [
    "accessibilityLabel",
    "size",
    "color"
  ]);
  return /* @__PURE__ */ React.createElement(Container$f, __spreadValues({
    $color: color,
    $size: size,
    ref
  }, props), accessibilityLabel && /* @__PURE__ */ React.createElement(VisuallyHidden, null, accessibilityLabel), /* @__PURE__ */ React.createElement("svg", {
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
const Container$e = styled.div(({
  theme,
  $ellipsis,
  $variant,
  $size,
  $color,
  $weight,
  $font
}) => css`
    font-family: ${theme.fonts[$font]};
    letter-spacing: ${theme.letterSpacings["-0.01"]};
    letter-spacing: ${theme.letterSpacings["-0.015"]};
    line-height: ${theme.lineHeights.normal};

    ${$ellipsis && css`
      text-overflow: ellipsis;
      overflow: hidden;
      white-space: nowrap;
    `}

    ${() => {
  switch ($variant) {
    case "small":
      return css`
            font-size: ${theme.fontSizes["small"]};
            font-weight: ${theme.fontWeights["normal"]};
            letter-spacing: ${theme.letterSpacings["-0.01"]};
            line-height: ${theme.lineHeights.normal};
          `;
    case "large":
      return css`
            font-size: ${theme.fontSizes["large"]};
            font-weight: ${theme.fontWeights["normal"]};
            letter-spacing: ${theme.letterSpacings["-0.02"]};
            line-height: ${theme.lineHeights["2"]};
          `;
    case "extraLarge":
      return css`
            font-size: ${theme.fontSizes["extraLarge"]};
            font-weight: ${theme.fontWeights["medium"]};
            letter-spacing: ${theme.letterSpacings["-0.02"]};
            line-height: ${theme.lineHeights["2"]};
          `;
    case "label":
      return css`
            color: ${theme.colors.text};
            font-size: ${theme.fontSizes["label"]};
            font-weight: ${theme.fontWeights["bold"]};
            letter-spacing: ${theme.letterSpacings["-0.01"]};
            text-transform: capitalize;
          `;
    case "labelHeading":
      return css`
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

  ${$color && css`
      color: ${theme.colors[$color]};
    `}

  ${$size && css`
      font-size: ${theme.fontSizes[$size]};
    `}

  ${$weight && css`
      font-weight: ${theme.fontWeights[$weight]};
    `}
  `);
const Typography = React.forwardRef((_e, ref) => {
  var _f = _e, {
    as = "div",
    children,
    ellipsis,
    variant,
    className,
    weight,
    font = "sans",
    color,
    size
  } = _f, props = __objRest(_f, [
    "as",
    "children",
    "ellipsis",
    "variant",
    "className",
    "weight",
    "font",
    "color",
    "size"
  ]);
  return /* @__PURE__ */ React.createElement(Container$e, __spreadProps(__spreadValues({}, props), {
    $color: color,
    $ellipsis: ellipsis ? true : void 0,
    $font: font,
    $size: size,
    $variant: variant,
    $weight: weight,
    as,
    className,
    ref
  }), children);
});
Typography.displayName = "Typography";
const getCenterProps = ({
  center,
  size,
  side,
  theme
}) => center && css`
    position: absolute;
    ${side}: ${size === "medium" ? theme.space["4"] : theme.space["5"]};
  `;
const getAccentColour = (theme, tone, accent, type) => {
  if (tone === "accent") {
    return theme.colors[accent];
  }
  if (tone === "grey") {
    switch (accent) {
      case "accentText":
        return theme.colors.text;
      case "accentSecondary":
        return theme.colors.foregroundTertiary;
      default:
        return type === "secondary" ? theme.colors.textSecondary : theme.colors[tone];
    }
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
const ButtonElement = styled.button(({
  theme,
  disabled,
  $center,
  $pressed,
  $shadowless,
  $outlined,
  $size,
  $variant,
  $tone,
  $shape
}) => css`
    align-items: center;
    cursor: pointer;
    display: flex;
    justify-content: center;
    transition-property: all;

    gap: ${theme.space["4"]};
    transition-duration: ${theme.transitionDuration["150"]};
    transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
    letter-spacing: ${theme.letterSpacings["-0.01"]};
    width: 100%;

    &:hover {
      transform: translateY(-1px);
      filter: brightness(1.05);
    }

    &:active {
      transform: translateY(0px);
      filter: brightness(1);
    }

    ${disabled ? css`
          cursor: not-allowed;
        ` : ``};
    ${$center ? css`
          position: relative;
        ` : ``};
    ${$pressed ? css`
          filter: brightness(0.95);
        ` : ``};
    ${$shadowless ? css`
          box-shadow: none !important;
        ` : ``};

    ${$outlined ? css`
          border: ${theme.borderWidths.px} ${theme.borderStyles.solid}
            ${theme.colors.borderTertiary};
        ` : ``}

    box-shadow: ${theme.shadows["0.25"]} ${theme.colors.grey};

    border-radius: ${theme.radii.extraLarge};
    font-size: ${theme.fontSizes.large};
    padding: ${theme.space["3.5"]} ${theme.space["4"]};

    ${() => {
  switch ($size) {
    case "extraSmall":
      return css`
            border-radius: ${theme.radii.large};
            font-size: ${theme.fontSizes.small};
            padding: ${theme.space["2"]};
          `;
    case "small":
      return css`
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

    ${() => {
  switch ($variant) {
    case "primary":
      return css`
            color: ${getAccentColour(theme, $tone, "accentText")};
            background: ${getAccentColour(theme, $tone, "accent")};
          `;
    case "secondary":
      return css`
            color: ${getAccentColour(theme, $tone, "accent", "secondary")};
            background: ${getAccentColour(theme, $tone, "accentSecondary")};
          `;
    case "action":
      return css`
            color: ${getAccentColour(theme, $tone, "accentText")};
            background: ${getAccentColour(theme, $tone, "accentGradient")};
          `;
    case "transparent":
      return css`
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
    
  ${() => {
  switch ($shape) {
    case "circle":
      return css`
            border-radius: ${theme.radii.full};
          `;
    case "square":
      return css`
            border-radius: ${$size === "small" ? theme.radii["large"] : theme.radii["2xLarge"]};
          `;
    case "rounded":
      return css`
            border-radius: ${theme.radii.extraLarge};
          `;
    default:
      return ``;
  }
}}

  ${() => {
  if ($size === "medium" && $center) {
    return css`
          padding-left: ${theme.space["14"]};
          padding-right: ${theme.space["14"]};
        `;
  }
  return "";
}}

  ${() => {
  if ($shadowless && $pressed && $variant === "transparent") {
    return css`
          background-color: ${theme.colors.backgroundSecondary};
        `;
  }
  return "";
}}

    &:disabled {
      background-color: ${theme.colors.grey};
      ${$variant !== "transparent" && css`
        color: ${theme.colors.background};
      `}
      transform: translateY(0px);
      filter: brightness(1);
    }
  `);
const PrefixContainer = styled.div(() => css`
    ${getCenterProps}
  `);
const LoadingContainer = styled.div(() => css``);
const LabelContainer$1 = styled(Typography)(({
  theme
}) => css`
    color: inherit;
    font-size: inherit;
    font-weight: ${theme.fontWeights["semiBold"]};
  `);
const Button = React.forwardRef((_g, ref) => {
  var _h = _g, {
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
    type = "button",
    variant = "primary",
    zIndex,
    onClick,
    pressed = false,
    shadowless = false,
    outlined = false,
    as: asProp
  } = _h, props = __objRest(_h, [
    "center",
    "children",
    "disabled",
    "href",
    "prefix",
    "loading",
    "rel",
    "shape",
    "size",
    "suffix",
    "tabIndex",
    "target",
    "tone",
    "type",
    "variant",
    "zIndex",
    "onClick",
    "pressed",
    "shadowless",
    "outlined",
    "as"
  ]);
  const labelContent = /* @__PURE__ */ React.createElement(LabelContainer$1, {
    ellipsis: true
  }, children);
  let childContent;
  if (shape) {
    childContent = loading ? /* @__PURE__ */ React.createElement(Spinner, {
      color: "background"
    }) : labelContent;
  } else {
    childContent = /* @__PURE__ */ React.createElement(React.Fragment, null, prefix && /* @__PURE__ */ React.createElement(PrefixContainer, __spreadValues({}, {
      center,
      size,
      side: "left"
    }), prefix), labelContent, (loading || suffix) && /* @__PURE__ */ React.createElement(LoadingContainer, __spreadValues({}, {
      center,
      size,
      side: "right"
    }), loading ? /* @__PURE__ */ React.createElement(Spinner, {
      color: "background"
    }) : suffix));
  }
  return /* @__PURE__ */ React.createElement(ButtonElement, __spreadProps(__spreadValues({}, props), {
    $center: center,
    $outlined: outlined,
    $pressed: pressed,
    $shadowless: shadowless,
    $shape: shape,
    $size: size,
    $tone: tone,
    $variant: variant,
    as: asProp,
    disabled,
    href,
    position: zIndex && "relative",
    ref,
    rel,
    tabIndex,
    target,
    type,
    zIndex,
    onClick
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
const shadesRaw = {
  light: {
    background: "255, 255, 255",
    backgroundSecondary: "246, 246, 248",
    backgroundTertiary: "246, 246, 248",
    foreground: "0, 0, 0",
    groupBackground: "253, 253, 253"
  },
  dark: {
    background: "20, 20, 20",
    backgroundSecondary: "10, 10, 10",
    backgroundTertiary: "20, 20, 20",
    foreground: "255, 255, 255",
    groupBackground: "10, 10, 10"
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
    accentText: `rgb(${shadesRaw.light.background})`,
    accentGradient: gradients.light.blue,
    background: `rgb(${shadesRaw.light.background})`,
    backgroundHide: `rgba(${shadesRaw.light.foreground}, ${shades.light.backgroundHide})`,
    backgroundSecondary: `rgb(${shadesRaw.light.backgroundSecondary})`,
    backgroundTertiary: `rgb(${shadesRaw.light.backgroundTertiary})`,
    border: `rgb(${shadesRaw.light.foreground}, ${shades.light.border})`,
    borderSecondary: `rgb(${shadesRaw.light.foreground}, ${shades.light.borderSecondary})`,
    borderTertiary: `rgb(${shadesRaw.light.foreground}, ${shades.light.borderTertiary})`,
    foreground: `rgb(${shadesRaw.light.foreground})`,
    foregroundSecondary: `rgba(${shadesRaw.light.foreground}, ${shades.light.foregroundSecondary})`,
    foregroundSecondaryHover: `rgba(${shadesRaw.light.foreground}, ${shades.light.foregroundSecondaryHover})`,
    foregroundTertiary: `rgba(${shadesRaw.light.foreground}, ${shades.light.foregroundTertiary})`,
    groupBackground: `rgb(${shadesRaw.light.groupBackground})`,
    groupBorder: `rgb(${shadesRaw.light.foreground})`,
    gradients: gradients.light,
    text: `rgb(${shadesRaw.light.foreground}, ${shades.light.text})`,
    textPlaceholder: `rgb(${shadesRaw.light.foreground}, ${shades.light.textPlaceholder})`,
    textSecondary: `rgb(${shadesRaw.light.foreground}, ${shades.light.textSecondary})`,
    textTertiary: `rgb(${shadesRaw.light.foreground}, ${shades.light.textTertiary})`
  }, accents.light),
  dark: __spreadValues({
    accent: `${accents.dark.blue}`,
    accentSecondary: `rgba(${accentsRaw.dark.blue}, ${shades.dark.accentSecondary})`,
    accentSecondaryHover: `rgba(${accentsRaw.dark.blue}, ${shades.dark.accentSecondary})`,
    accentTertiary: `rgba(${accentsRaw.dark.blue}, calc(${shades.dark.accentSecondary} * 0.5))`,
    accentText: `rgb(${shadesRaw.dark.background})`,
    accentGradient: gradients.dark.blue,
    background: `rgb(${shadesRaw.dark.background})`,
    backgroundHide: `rgba(${shadesRaw.dark.foreground}, ${shades.dark.backgroundHide})`,
    backgroundSecondary: `rgb(${shadesRaw.dark.backgroundSecondary})`,
    backgroundTertiary: `rgb(${shadesRaw.dark.backgroundTertiary})`,
    border: `rgb(${shadesRaw.dark.foreground}, ${shades.dark.border})`,
    borderSecondary: `rgb(${shadesRaw.dark.foreground}, ${shades.dark.borderSecondary})`,
    borderTertiary: `rgb(${shadesRaw.dark.foreground}, ${shades.dark.borderTertiary})`,
    foreground: `rgb(${shadesRaw.dark.foreground})`,
    foregroundSecondary: `rgba(${shadesRaw.dark.foreground}, ${shades.dark.foregroundSecondary})`,
    foregroundSecondaryHover: `rgba(${shadesRaw.dark.foreground}, ${shades.dark.foregroundSecondaryHover})`,
    foregroundTertiary: `rgba(${shadesRaw.dark.foreground}, ${shades.dark.foregroundTertiary})`,
    groupBackground: `rgb(${shadesRaw.dark.groupBackground})`,
    groupBorder: `rgb(${shadesRaw.dark.foreground})`,
    gradients: gradients.dark,
    text: `rgb(${shadesRaw.dark.foreground}, ${shades.dark.text})`,
    textPlaceholder: `rgb(${shadesRaw.dark.foreground}, ${shades.dark.textPlaceholder})`,
    textSecondary: `rgb(${shadesRaw.dark.foreground}, ${shades.dark.textSecondary})`,
    textTertiary: `rgb(${shadesRaw.dark.foreground}, ${shades.dark.textTertiary})`
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
  inOut: "cubic-bezier(0.42, 0, 0.58, 1)",
  popIn: "cubic-bezier(0.15, 1.15, 0.6, 1)"
};
const breakpoints = {
  xs: 360,
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
  accentsRaw,
  shadesRaw
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
  accentsRaw: tokens.accentsRaw.light,
  shadesRaw: tokens.shadesRaw.light,
  mode: "light"
});
const darkTheme = __spreadProps(__spreadValues({}, tokens), {
  colors: __spreadValues(__spreadValues({}, baseTheme.colors), tokens.colors.dark),
  shades: tokens.shades.dark,
  boxShadows: tokens.boxShadows.dark,
  accentsRaw: tokens.accentsRaw.dark,
  shadesRaw: tokens.shadesRaw.dark,
  mode: "dark"
});
const breakpointTypes = {
  min: "min-width",
  max: "max-width"
};
const keys = Object.keys(breakpoints);
const typeKeys = Object.keys(breakpointTypes);
const mq = keys.reduce((acc, sizeLabel) => {
  acc[sizeLabel] = typeKeys.reduce((accumulator, typeLabel) => {
    accumulator[typeLabel] = (args) => {
      return css`
        @media (${breakpointTypes[typeLabel]}: ${breakpoints[sizeLabel]}px) {
          ${args};
        }
      `;
    };
    return accumulator;
  }, {});
  return acc;
}, {});
const Container$d = styled.div(({
  theme,
  $shadow
}) => css`
    padding: ${theme.space["6"]};
    border-radius: ${theme.radii["2xLarge"]};
    background-color: ${theme.colors.background};
    ${mq.lg.min(css`
      border-radius: ${theme.radii["3xLarge"]};
    `)}

    ${$shadow && theme.mode === "light" && css`
      box-shadow: 0px 0px ${theme.radii["2xLarge"]} rgba(0, 0, 0, 0.1);
      border-radius: ${theme.radii["2xLarge"]};
      ${mq.lg.min(css`
        box-shadow: 0px 0px ${theme.radii["3xLarge"]} rgba(0, 0, 0, 0.1);
        border-radius: ${theme.radii["3xLarge"]};
      `)}
    `}
  `);
const Card = (_i) => {
  var _j = _i, {
    children,
    shadow
  } = _j, props = __objRest(_j, [
    "children",
    "shadow"
  ]);
  return /* @__PURE__ */ React.createElement(Container$d, __spreadProps(__spreadValues({}, props), {
    $shadow: shadow
  }), children);
};
Card.displayName = "Card";
const useDocumentEvent = (ref, event, _callback, shouldCallback) => {
  const callback = (e) => {
    if (ref.current && !ref.current.contains(e.target))
      _callback();
  };
  useEffect(() => {
    if (shouldCallback)
      document.addEventListener(event, callback);
    else
      document.removeEventListener(event, callback);
    return () => {
      document.removeEventListener(event, callback);
    };
  }, [shouldCallback]);
};
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
        coords.x = Math.min(Math.max(coords.x, coordsRange.minX), coordsRange.maxX);
        break;
      default:
        coords.y = Math.min(Math.max(coords.y, coordsRange.minY), coordsRange.maxY);
        break;
    }
  }
  return __spreadProps(__spreadValues({}, coords), {
    side: idealSide
  });
};
const defaultAnimationFunc = (side, open = false) => {
  let translate = "";
  if (side === "top")
    translate = `translate(0, 3em)`;
  else if (side === "right")
    translate = `translate(-3em, 0)`;
  else if (side === "bottom")
    translate = `translate(0, -3em)`;
  else
    translate = `translate(3em, 0);`;
  if (open)
    return `
      transform: translate(0, 0);
      opacity: 1;
      visibility: visible;
    `;
  return `
    transform: ${translate};
    opacity: 0;
    visibility: hidden;
  `;
};
const Container$c = styled.div(() => css`
    position: relative;
    display: inline-block;
  `);
const PopoverContainer = styled.div(({
  $injectedCSS,
  $x,
  $y
}) => css`
    position: absolute;
    box-sizing: border-box;
    z-index: 20;
    visibility: hidden;
    opacity: 0;
    transition: all 0.35s cubic-bezier(1, 0, 0.22, 1.6);
    left: ${$x}px;
    top: ${$y}px;
    ${$injectedCSS && css`
      ${$injectedCSS}
    `}
  `);
const DynamicPopover = ({
  popover,
  children,
  placement = "top-center",
  offset = 10,
  padding = 20,
  flip = true,
  shift = true,
  animationFn: _animationFn,
  disabled = false,
  open = false,
  onDismiss
}) => {
  const animationFn = React.useMemo(() => {
    if (_animationFn) {
      return (side, open2) => _animationFn(side, open2);
    }
    return (side, open2) => defaultAnimationFunc(side, open2);
  }, [_animationFn]);
  const [popoverProps, setPopoverProps] = React.useState({
    $x: 0,
    $y: 0,
    $side: void 0,
    $open: open,
    $injectedCSS: ""
  });
  const containerRef = React.useRef(null);
  const floatingRef = React.useRef(null);
  const computePopoverProps = React.useCallback((container, floating) => {
    const fRect = floating.getBoundingClientRect();
    const rRect = container.getBoundingClientRect();
    return computeCoordsFromPlacement(rRect, fRect, placement, padding, offset, flip, shift);
  }, [placement, padding, offset, flip, shift]);
  React.useEffect(() => {
    if (containerRef.current && floatingRef.current && animationFn && computePopoverProps) {
      const isOpen = !!open && !disabled;
      const {
        x,
        y,
        side
      } = computePopoverProps(containerRef.current, floatingRef.current);
      const injectedCss = animationFn(side, isOpen);
      setPopoverProps({
        $x: x,
        $y: y,
        $side: side,
        $open: open,
        $injectedCSS: injectedCss
      });
    }
  }, [open, disabled, setPopoverProps, computePopoverProps, animationFn]);
  useDocumentEvent(containerRef, "click", () => onDismiss && onDismiss(), open);
  return /* @__PURE__ */ React.createElement(Container$c, {
    "data-testid": "dynamicpopover",
    ref: containerRef
  }, children, /* @__PURE__ */ React.createElement(PopoverContainer, __spreadProps(__spreadValues({
    "data-testid": "dynamicpopover-popover"
  }, popoverProps), {
    ref: floatingRef
  }), popover));
};
DynamicPopover.displayName = "DynamicPopover";
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
const Label = styled.label(({
  theme
}) => css`
    color: ${theme.colors.textTertiary};
    font-weight: ${theme.fontWeights["semiBold"]};
    display: flex;
  `);
const LabelSecondary = styled.span(({
  theme
}) => css`
    margin-left: ${theme.space["4"]};
  `);
const LabelContentContainer = styled.div(({
  theme,
  $inline
}) => css`
    display: flex;
    align-items: flex-end;
    padding-left: ${$inline ? "0" : theme.space["4"]};
    padding-right: ${$inline ? "0" : theme.space["4"]};
    padding-top: 0;
    padding-bottom: 0;
  `);
const RequiredWrapper = styled.span(({
  theme
}) => css`
    color: ${theme.colors.red};
    ::before {
      content: ' ';
      white-space: pre;
    }
  `);
const LabelContent = (_k) => {
  var _l = _k, {
    ids,
    label,
    labelSecondary,
    required,
    $inline
  } = _l, props = __objRest(_l, [
    "ids",
    "label",
    "labelSecondary",
    "required",
    "$inline"
  ]);
  return /* @__PURE__ */ React.createElement(LabelContentContainer, __spreadProps(__spreadValues({}, __spreadValues(__spreadValues({}, props), ids.label)), {
    $inline
  }), /* @__PURE__ */ React.createElement(Label, __spreadProps(__spreadValues({}, ids.label), {
    $inline
  }), label, " ", required && /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(RequiredWrapper, null, "*"), /* @__PURE__ */ React.createElement(VisuallyHidden, null, "required"))), labelSecondary && /* @__PURE__ */ React.createElement(LabelSecondary, null, labelSecondary));
};
const Container$b = styled.div(({
  theme,
  $inline,
  $width
}) => css`
    display: flex;
    flex-direction: ${$inline ? "row" : "column"};
    align-items: ${$inline ? "center" : "normal"};
    gap: ${$inline ? theme.space["2.5"] : theme.space["2"]};
    width: ${theme.space[$width]};
  `);
const ContainerInner$2 = styled.div(({
  theme
}) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[2]};
    flex: 1;
  `);
const Description$1 = styled.div(({
  theme,
  $inline
}) => css`
    padding: 0 ${$inline ? "0" : theme.space["4"]};
    color: ${theme.colors.textSecondary};
  `);
const Error2 = styled.div(({
  theme,
  $inline
}) => `
    color: ${theme.colors.red};
    padding: 0 ${$inline ? "0" : theme.space[4]};
`);
const Field = (_m) => {
  var _n = _m, {
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
  } = _n, props = __objRest(_n, [
    "children",
    "description",
    "error",
    "hideLabel",
    "id",
    "label",
    "labelSecondary",
    "required",
    "inline",
    "width"
  ]);
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
  return inline ? /* @__PURE__ */ React.createElement(Container$b, {
    $inline: inline,
    $width: width
  }, /* @__PURE__ */ React.createElement(ContainerInner$2, null, hideLabel ? /* @__PURE__ */ React.createElement(VisuallyHidden, null, /* @__PURE__ */ React.createElement(LabelContent, __spreadValues({}, __spreadProps(__spreadValues({}, props), {
    ids,
    label,
    labelSecondary,
    required
  })))) : /* @__PURE__ */ React.createElement(LabelContent, __spreadProps(__spreadValues({}, __spreadProps(__spreadValues({}, props), {
    ids,
    label,
    labelSecondary,
    required
  })), {
    $inline: inline
  })), description && /* @__PURE__ */ React.createElement(Description$1, {
    $inline: inline
  }, description), error && /* @__PURE__ */ React.createElement(Error2, __spreadProps(__spreadValues({
    "aria-live": "polite"
  }, ids.error), {
    $inline: inline
  }), error)), /* @__PURE__ */ React.createElement("div", null, content)) : /* @__PURE__ */ React.createElement(Container$b, {
    $width: width
  }, hideLabel ? /* @__PURE__ */ React.createElement(VisuallyHidden, null, /* @__PURE__ */ React.createElement(LabelContent, __spreadValues({}, __spreadProps(__spreadValues({}, props), {
    ids,
    label,
    labelSecondary,
    required
  })))) : /* @__PURE__ */ React.createElement(LabelContent, __spreadValues({}, __spreadProps(__spreadValues({}, props), {
    ids,
    label,
    labelSecondary,
    required
  }))), content, description && /* @__PURE__ */ React.createElement(Description$1, __spreadValues({}, ids.description), description), error && /* @__PURE__ */ React.createElement(Error2, __spreadValues({
    "aria-live": "polite"
  }, ids.error), error));
};
Field.displayName = "Field";
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
const FileInput = React.forwardRef((_o, ref) => {
  var _p = _o, {
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
  } = _p, props = __objRest(_p, [
    "accept",
    "autoFocus",
    "children",
    "defaultValue",
    "disabled",
    "error",
    "id",
    "maxSize",
    "name",
    "required",
    "tabIndex",
    "onBlur",
    "onChange",
    "onError",
    "onFocus",
    "onReset"
  ]);
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
  return /* @__PURE__ */ React.createElement("div", null, /* @__PURE__ */ React.createElement(VisuallyHidden, null, /* @__PURE__ */ React.createElement("input", __spreadProps(__spreadValues(__spreadValues({}, props), ids.content), {
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
  }))), /* @__PURE__ */ React.createElement("label", __spreadProps(__spreadValues({}, ids.label), {
    onDragLeave: handleDragLeave,
    onDragOver: handleDragOver,
    onDrop: handleDrop
  }), children(__spreadProps(__spreadValues({}, state2), {
    reset
  }))));
});
FileInput.displayName = "FileInput";
const HeadingContainer = styled.div(({
  theme,
  $textAlign,
  $textTransform,
  $level,
  $responsive,
  $color
}) => css`
    ${$textAlign ? css`
          text-align: ${$textAlign};
        ` : ``}
    ${$textTransform ? css`
          text-transform: ${$textTransform};
        ` : ``}

  ${() => {
  switch ($level) {
    case "1":
      return css`
            font-size: ${theme.fontSizes.headingOne};
            font-weight: ${theme.fontWeights.semiBold};
            letter-spacing: ${theme.letterSpacings["-0.02"]};
            line-height: 4rem;
          `;
    case "2":
      return css`
            font-size: ${theme.fontSizes.headingTwo};
            font-weight: ${theme.fontWeights.semiBold};
            letter-spacing: ${theme.letterSpacings["-0.02"]};
            line-height: 2.5rem;
          `;
    default:
      return ``;
  }
}}
  
  ${() => {
  if ($responsive) {
    switch ($level) {
      case "1":
        return css`
              font-size: ${theme.fontSizes.headingTwo};
              ${mq.lg.min(css`
                font-size: ${theme.fontSizes.headingOne};
              `)}
            `;
      case "2":
        return css`
              font-size: ${theme.fontSizes.extraLarge};
              letter-spacing: normal;
              ${mq.sm.min(css`
                font-size: ${theme.fontSizes.headingTwo};
                letter-spacing: -0.02;
              `)}
            `;
      default:
        return ``;
    }
  }
}}

  ${$color && css`
      color: ${theme.colors[$color]};
    `}
  
  font-family: ${theme.fonts["sans"]};
  `);
const Heading$1 = React.forwardRef((_q, ref) => {
  var _r = _q, {
    align,
    children,
    as = "h1",
    id: id2,
    level = "2",
    responsive,
    transform,
    color
  } = _r, props = __objRest(_r, [
    "align",
    "children",
    "as",
    "id",
    "level",
    "responsive",
    "transform",
    "color"
  ]);
  return /* @__PURE__ */ React.createElement(HeadingContainer, __spreadProps(__spreadValues({}, props), {
    $color: color,
    $level: level,
    $responsive: responsive,
    $textAlign: align,
    $textTransform: transform,
    as,
    id: id2,
    ref
  }), children);
});
Heading$1.displayName = "Heading";
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
Portal.displayName = "Portal";
const StyledScrollBox = styled.div(({
  theme,
  $showTop,
  $showBottom
}) => css`
    overflow: auto;
    position: relative;

    border-color: rgba(${theme.shadesRaw.foreground}, 0.05);
    transition: border-color 0.15s ease-in-out;

    /* stylelint-disable-next-line selector-pseudo-element-no-unknown */
    &::-webkit-scrollbar-track {
      background-color: transparent;
    }

    &::-webkit-scrollbar {
      width: ${theme.space["1.5"]};
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border: none;
      border-radius: ${theme.radii.full};
      border-right-style: inset;
      border-right-width: calc(100vw + 100vh);
      border-color: inherit;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    &:hover {
      border-color: rgba(${theme.shadesRaw.foreground}, 0.2);
    }

    &::before,
    &::after {
      content: '';
      position: sticky;
      left: 0;
      width: 100%;
      display: block;
      height: ${theme.space.px};
      background-color: rgba(${theme.shadesRaw.foreground}, 0);
      transition: background-color 0.15s ease-in-out;
    }

    &::before {
      top: 0;
      ${$showTop && css`
        background-color: rgba(${theme.shadesRaw.foreground}, 0.1);
      `}
    }
    &::after {
      bottom: 0;
      ${$showBottom && css`
        background-color: rgba(${theme.shadesRaw.foreground}, 0.1);
      `}
    }
  `);
const ScrollBox = (props) => {
  const ref = React.useRef(null);
  const [showTop, setShowTop] = React.useState(false);
  const [showBottom, setShowBottom] = React.useState(false);
  const setScrollValues = (scrollTop, scrollHeight, clientHeight) => {
    setShowTop(scrollTop > 16);
    setShowBottom(scrollHeight - scrollTop > clientHeight + 16);
  };
  const handleScroll = (event) => {
    const {
      scrollTop,
      scrollHeight,
      clientHeight
    } = event.currentTarget;
    setScrollValues(scrollTop, scrollHeight, clientHeight);
  };
  React.useEffect(() => {
    const _ref = ref.current;
    if (_ref) {
      const {
        scrollTop,
        scrollHeight,
        clientHeight
      } = _ref;
      setScrollValues(scrollTop, scrollHeight, clientHeight);
    }
  }, []);
  return /* @__PURE__ */ React.createElement(StyledScrollBox, __spreadValues({
    $showBottom: showBottom,
    $showTop: showTop,
    ref,
    onScroll: handleScroll
  }, props));
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
SkeletonGroup.displayName = "SkeletonGroup";
const Container$a = styled.div(({
  theme,
  $active
}) => css`
    ${$active && css`
      background-color: ${theme.colors.foregroundSecondary};
      border-radius: ${theme.radii.medium};
      width: ${theme.space.fit};
    `}
  `);
const ContainerInner$1 = styled.span(({
  $active
}) => css`
    display: block;
    ${$active ? css`
          visibility: hidden;
        ` : ``}
  `);
const Skeleton = (_s) => {
  var _t = _s, {
    as,
    children,
    loading
  } = _t, props = __objRest(_t, [
    "as",
    "children",
    "loading"
  ]);
  const groupLoading = React.useContext(Context);
  const active = loading != null ? loading : groupLoading;
  return /* @__PURE__ */ React.createElement(Container$a, __spreadProps(__spreadValues({}, props), {
    $active: active,
    as
  }), /* @__PURE__ */ React.createElement(ContainerInner$1, {
    $active: active
  }, children));
};
Skeleton.displayName = "Skeleton";
const Container$9 = styled.div(({
  theme,
  $hover,
  $size,
  $tone
}) => css`
    line-height: normal;
    align-items: center;
    display: flex;
    border-radius: ${theme.radii["full"]};
    font-weight: ${theme.fontWeights["medium"]};
    width: ${theme.space["max"]};

    ${$hover && css`
      transition-duration: ${theme.transitionDuration["150"]};
      transition-property: color, border-color, background-color;
      transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
    `}

    ${() => {
  switch ($size) {
    case "small":
      return css`
            height: ${theme.space["5"]};
            font-size: ${theme.fontSizes["label"]};
          `;
    case "medium":
      return css`
            height: ${theme.space["6"]};
            font-size: ${theme.fontSizes["small"]};
          `;
    default:
      return ``;
  }
}}

  ${() => {
  switch ($tone) {
    case "accent":
      return css`
            color: ${theme.colors.accent};
            background-color: ${theme.colors.accentTertiary};
          `;
    case "secondary":
      return css`
            color: ${theme.colors.textTertiary};
            background-color: ${theme.colors.foregroundTertiary};
          `;
    case "blue":
      return css`
            color: ${theme.colors.blue};
            background-color: rgba(
              ${theme.accentsRaw.blue},
              calc(${theme.shades.accentSecondary} * 0.5)
            );
          `;
    case "green":
      return css`
            color: ${theme.colors.green};
            background-color: rgba(
              ${theme.accentsRaw.green},
              calc(${theme.shades.accentSecondary} * 0.5)
            );
          `;
    case "red":
      return css`
            color: ${theme.colors.red};
            background-color: rgba(
              ${theme.accentsRaw.red},
              calc(${theme.shades.accentSecondary} * 0.5)
            );
          `;
    default:
      return ``;
  }
}}
  
  ${() => {
  if ($hover && $tone === "accent")
    return css`
          background-color: ${theme.colors.accentTertiary};

          &:hover,
          &:active {
            background-color: ${theme.colors.accentSecondary};
          }
        `;
  if ($hover && $tone === "secondary")
    return css`
          color: ${theme.colors.textSecondary};
          background-color: ${theme.colors.foregroundTertiary};

          &:hover,
          &:active {
            color: ${theme.colors.text};
            background-color: ${theme.colors.foregroundSecondary};
          }
        `;
  if ($hover && $tone === "blue")
    return css`
          &:hover,
          &:active {
            background-color: ${theme.colors.blue};
          }
        `;
  if ($hover && $tone === "green")
    return css`
          &:hover,
          &:active {
            background-color: ${theme.colors.green};
          }
        `;
  if ($hover && $tone === "red")
    return css`
          &:hover,
          &:active {
            background-color: ${theme.colors.red};
          }
        `;
}}
  `);
const LabelContainer = styled.label(({
  theme
}) => css`
    align-items: center;
    border-radius: ${theme.radii["full"]};
    display: flex;
    height: ${theme.space["full"]};
    padding: 0 ${theme.space["2"]};
    box-shadow: 0 0 0 2px ${theme.colors.background};
  `);
const ChildContainer = styled.div(({
  theme
}) => css`
    padding: 0 ${theme.space["2"]};
  `);
const Tag = (_u) => {
  var _v = _u, {
    as = "div",
    children,
    hover,
    label,
    size = "medium",
    tone = "secondary"
  } = _v, props = __objRest(_v, [
    "as",
    "children",
    "hover",
    "label",
    "size",
    "tone"
  ]);
  return /* @__PURE__ */ React.createElement(Container$9, __spreadProps(__spreadValues({}, props), {
    $hover: hover,
    $size: size,
    $tone: tone,
    as
  }), label && /* @__PURE__ */ React.createElement(LabelContainer, null, /* @__PURE__ */ React.createElement("span", null, label)), /* @__PURE__ */ React.createElement(ChildContainer, {
    as
  }, children));
};
Tag.displayName = "Tag";
const Backdrop = ({
  children,
  surface,
  onDismiss,
  noBackground = false,
  className = "modal",
  open
}) => {
  const [state2, toggle] = useTransition({
    timeout: {
      enter: 50,
      exit: 300
    },
    mountOnEnter: true,
    unmountOnExit: true
  });
  const boxRef = React.useRef(null);
  const Background = surface || BackdropSurface;
  const dismissClick = (e) => e.target === boxRef.current && onDismiss && onDismiss();
  React.useEffect(() => {
    toggle(open || false);
  }, [open]);
  return state2 !== "unmounted" ? /* @__PURE__ */ React.createElement(Portal, {
    className
  }, onDismiss && /* @__PURE__ */ React.createElement(Background, {
    $empty: noBackground,
    $state: state2,
    ref: boxRef,
    onClick: dismissClick
  }), children({
    state: state2
  })) : null;
};
Backdrop.displayName = "Backdrop";
const shortenAddress = (address = "", maxLength = 10, leftSlice = 5, rightSlice = 5) => {
  if (address.length < maxLength) {
    return address;
  }
  return `${address.slice(0, leftSlice)}...${address.slice(-rightSlice)}`;
};
const getTestId = (props, fallback) => {
  return props["data-testid"] ? String(props["data-testid"]) : fallback;
};
const valueForSizeAndTokens = (size) => (tokens2) => {
  const index2 = size === "small" ? 0 : size === "large" ? 2 : 1;
  return tokens2[index2];
};
const gradientWithFallback = (theme, color) => {
  if (Object.keys(theme.colors.gradients).includes(color)) {
    const gradient = color;
    return theme.colors.gradients[gradient];
  }
  return theme.colors[color];
};
const stylesForSwitch = (theme, {
  $size,
  $border,
  $color,
  $gradient
}) => {
  const valueForTokens = valueForSizeAndTokens($size);
  const containerWidth = valueForTokens([theme.space["12"], theme.space["12"], theme.space["20"]]);
  const containerHalfWidth = valueForTokens([theme.space["6"], theme.space["6"], theme.space["10"]]);
  const containerHeight = valueForTokens([theme.space["7"], theme.space["8"], theme.space["12"]]);
  const containerHalfHeight = valueForTokens([theme.space["3.5"], theme.space["4"], theme.space["6"]]);
  const containerBackground = $gradient ? gradientWithFallback(theme, $color) : theme.colors[$color];
  const switchSize = $border ? `calc(${containerHeight} - 2px)` : valueForTokens([theme.space["5"], theme.space["6"], theme.space["9"]]);
  const switchBorderWidth = $border ? valueForTokens(["1.25px", "1.25px", "1.75px"]) : "1px";
  const switchBorderColor = $border ? theme.colors.border : theme.colors.borderSecondary;
  const switchBoxSizing = $border ? "border-box" : "content-box";
  const switchBackgroundClip = $border ? "border-box" : "content-box";
  return css`
    box-sizing: border-box;
    background: ${theme.colors.foregroundSecondary};
    background-clip: content-box;
    width: ${containerWidth};
    height: ${containerHeight};
    border-radius: ${containerHalfHeight};
    border-width: 1px;
    border-style: solid;
    border-color: ${theme.colors.borderSecondary};
    transition: all 90ms ease-in-out;

    &:hover {
      transform: translateY(-1px);
      filter: brightness(1.05);
    }

    &:active {
      transform: translateY(0px);
      filter: brightness(1.1);
    }

    &:checked {
      background: ${containerBackground};
      background-clip: content-box;
      border-color: transparent;
    }

    &::before {
      content: '';
      border-width: ${switchBorderWidth};
      border-style: solid;
      border-color: ${switchBorderColor};
      background-color: ${theme.colors.background};
      background-clip: ${switchBackgroundClip};
      border-radius: ${theme.radii["full"]};
      transform: translateX(-${containerHalfWidth})
        translateX(${containerHalfHeight});
      transition: all 90ms ease-in-out;
      box-sizing: ${switchBoxSizing};
      width: ${switchSize};
      height: ${switchSize};
    }

    &:checked::before {
      transform: translateX(${containerHalfWidth})
        translateX(-${containerHalfHeight});
      border-color: ${$border ? switchBorderColor : "transparent"};
    }

    ${$border && css`
      &::after {
        content: '';
        display: block;
        position: absolute;
        background-color: ${switchBorderColor};
        width: ${valueForTokens(["1.5px", "1.5px", "2px"])};
        border-radius: 2px;
        height: ${valueForTokens(["9px", "10px", "16px"])};
        left: 50%;
        top: 50%;
        transform: translateX(-${containerHalfWidth})
          translateX(${containerHalfHeight}) translate(-50%, -50%);
        transition: all 90ms ease-in-out;
        z-index: 1;
      }

      &:checked::after {
        transform: translateX(${containerHalfWidth})
          translateX(-${containerHalfHeight}) translate(-50%, -50%);
      }
    `}
  `;
};
const stylesForCheckbox = (theme, {
  $background,
  $size,
  $color,
  $border
}) => {
  const valueForTokens = valueForSizeAndTokens($size);
  const checkboxSize = valueForTokens([theme.space["7"], theme.space["8"], theme.space["12"]]);
  const checkboxBorderColor = $border ? theme.colors.borderSecondary : "transparent";
  const checkboxMarkSize = valueForTokens([theme.space["3.5"], theme.space["4"], theme.space["6"]]);
  return css`
    width: ${checkboxSize};
    height: ${checkboxSize};
    border-width: 1px;
    border-color: ${checkboxBorderColor};
    border-radius: ${theme.space["2"]};
    background-color: ${theme.colors[$background]};
    background-clip: content-box;

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
      background-color: ${theme.colors[$color]};
      mask-image: ${`url('data:image/svg+xml; utf8, <svg width="${checkboxMarkSize}" height="${checkboxMarkSize}" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg"><path d="M2 12.625L10.125 20.125L22 3.875" stroke="currentColor" stroke-width="4" stroke-linecap="round" stroke-linejoin="round" /></svg>')`};
      width: ${checkboxMarkSize};
      height: ${checkboxMarkSize};
      transform: scale(0);
      transition: all 90ms ease-in-out;
    }

    &:checked::before {
      transform: scale(1);
    }
  `;
};
const Input$2 = styled.input((_w) => {
  var _x = _w, {
    theme
  } = _x, props = __objRest(_x, [
    "theme"
  ]);
  return css`
    font: inherit;
    display: grid;
    position: relative;
    place-content: center;
    transition: transform 150ms ease-in-out, filter 150ms ease-in-out;
    cursor: pointer;
    margin: ${theme.space["1"]} 0;

    ${() => {
    if (props.$variant === "switch")
      return stylesForSwitch(theme, props);
    return stylesForCheckbox(theme, props);
  }}
  `;
});
const Checkbox = React.forwardRef((_y, ref) => {
  var _z = _y, {
    description,
    disabled,
    error,
    hideLabel,
    id: id2,
    label,
    labelSecondary,
    inline = true,
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
    color = "blue",
    gradient = false,
    background = "grey",
    size = "small",
    border = false
  } = _z, props = __objRest(_z, [
    "description",
    "disabled",
    "error",
    "hideLabel",
    "id",
    "label",
    "labelSecondary",
    "inline",
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
    "gradient",
    "background",
    "size",
    "border"
  ]);
  const defaultRef = React.useRef(null);
  const inputRef = ref || defaultRef;
  return /* @__PURE__ */ React.createElement(Field, {
    description,
    error,
    hideLabel,
    id: id2,
    inline,
    label,
    labelSecondary,
    required,
    width
  }, /* @__PURE__ */ React.createElement(Input$2, __spreadProps(__spreadValues({}, __spreadProps(__spreadValues({}, props), {
    "data-testid": getTestId(props, "checkbox"),
    "aria-invalid": error ? true : void 0,
    type: "checkbox"
  })), {
    $background: background,
    $border: border,
    $color: color,
    $gradient: gradient,
    $size: size,
    $variant: variant,
    checked,
    disabled,
    name,
    ref: inputRef,
    tabIndex,
    value,
    onBlur,
    onChange,
    onFocus
  })));
});
Checkbox.displayName = "Checkbox";
const CountDownContainer = styled.div(() => css`
    position: relative;
  `);
const NumberBox = styled.div(({
  theme,
  $disabled,
  $size
}) => css`
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    font-weight: bold;

    color: ${theme.colors.accent};

    ${$disabled && css`
      color: ${theme.colors.textPlaceholder};
    `}

    ${() => {
  switch ($size) {
    case "small":
      return css`
            height: ${theme.space["16"]};
            width: ${theme.space["16"]};
          `;
    case "large":
      return css`
            font-size: ${theme.fontSizes.extraLarge};
            margin-top: -${theme.space["0.5"]};
            height: ${theme.space["24"]};
            width: ${theme.space["24"]};
          `;
    default:
      return ``;
  }
}}
  `);
const Container$8 = styled.div(({
  theme,
  $disabled,
  $size,
  $color
}) => css`
    stroke: ${theme.colors.accent};

    color: ${theme.colors[$color]};

    ${$disabled && css`
      color: ${theme.colors.foregroundSecondary};
    `}

    ${() => {
  switch ($size) {
    case "small":
      return css`
            height: ${theme.space["16"]};
            width: ${theme.space["16"]};
            stroke-width: ${theme.space["1"]};
          `;
    case "large":
      return css`
            height: ${theme.space["24"]};
            width: ${theme.space["24"]};
            stroke-width: ${theme.space["1"]};
          `;
    default:
      return ``;
  }
}}
  `);
const Circle = styled.circle(({
  $finished
}) => css`
    transition: all 1s linear, stroke-width 0.2s ease-in-out 1s;

    ${$finished && css`
      stroke-width: 0;
    `}
  `);
const CountdownCircle = React.forwardRef((_A, ref) => {
  var _B = _A, {
    accessibilityLabel,
    color = "textSecondary",
    size = "small",
    countdownAmount,
    disabled,
    callback
  } = _B, props = __objRest(_B, [
    "accessibilityLabel",
    "color",
    "size",
    "countdownAmount",
    "disabled",
    "callback"
  ]);
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
  return /* @__PURE__ */ React.createElement(CountDownContainer, __spreadValues({}, __spreadProps(__spreadValues({}, props), {
    "data-testid": getTestId(props, "countdown-circle")
  })), /* @__PURE__ */ React.createElement(NumberBox, __spreadValues({}, {
    $size: size,
    $disabled: disabled
  }), disabled ? totalCount : currentCount), /* @__PURE__ */ React.createElement(Container$8, {
    $color: color,
    $disabled: disabled,
    $size: size,
    ref
  }, accessibilityLabel && /* @__PURE__ */ React.createElement(VisuallyHidden, null, accessibilityLabel), /* @__PURE__ */ React.createElement("svg", {
    viewBox: "0 0 24 24",
    xmlns: "http://www.w3.org/2000/svg"
  }, /* @__PURE__ */ React.createElement(Circle, {
    $finished: currentCount === 0,
    cx: "12",
    cy: "12",
    fill: "none",
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
const ReactComponent$L = (_C) => {
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
    d: "M11.2552 17.8659C11.6526 18.3095 12.3474 18.3095 12.7448 17.8659L22.5063 6.97001C23.0833 6.32597 22.6262 5.30274 21.7615 5.30274H2.2385C1.37381 5.30274 0.916704 6.32597 1.49369 6.97001L11.2552 17.8659Z",
    fill: "currentColor"
  }));
};
const Container$7 = styled.div(() => css`
    max-width: max-content;
    position: relative;
  `);
const DropdownMenuContainer = styled.div(({
  theme,
  $opened,
  $inner,
  $shortThrow,
  $align,
  $labelAlign,
  $direction
}) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    position: absolute;

    ${$direction === "up" && css`
      bottom: 100%;
    `}

    ${$labelAlign && css`
      & > button {
        justify-content: ${$labelAlign};
      }
    `}

    ${$opened ? css`
          visibility: visible;
          opacity: 1;
        ` : css`
          z-index: 1;
          visibility: hidden;
          opacity: 0;
        `}

    padding: ${theme.space["1.5"]};
    background-color: ${theme.colors.groupBackground};
    box-shadow: ${theme.boxShadows["0.02"]};
    border-radius: ${theme.radii["2xLarge"]};

    ${$inner && css`
      background-color: ${theme.colors.grey};
      border-radius: ${theme.radii.almostExtraLarge};
      border-${$direction === "down" ? "top" : "bottom"}-left-radius: none;
      border-${$direction === "down" ? "top" : "bottom"}-right-radius: none;
      box-shadow: 0;
      border-width: ${theme.space["px"]};
      border-${$direction === "down" ? "top" : "bottom"}-width: 0;
      border-color: ${theme.colors.borderSecondary};
      padding: 0 ${theme.space["1.5"]};
      padding-${$direction === "down" ? "top" : "bottom"}: ${theme.space["2.5"]};
      padding-${$direction === "down" ? "bottom" : "top"}: ${theme.space["1.5"]};
      margin-${$direction === "down" ? "top" : "bottom"}: -${theme.space["2.5"]};
      transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6);
    `}

    ${() => {
  if ($opened) {
    return css`
          transition: all 0.35s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear,
            z-index 0s linear 0.35s;
        `;
  }
  return css`
        transition: all 0.35s cubic-bezier(1, 0, 0.22, 1.6), width 0s linear,
          z-index 0s linear 0s;
      `;
}}

    ${() => {
  if (!$opened && !$shortThrow) {
    return css`
          margin-${$direction === "down" ? "top" : "bottom"}: calc(-1 * ${theme.space["12"]});
        `;
  }
  if (!$opened && $shortThrow) {
    return css`
          margin-${$direction === "down" ? "top" : "bottom"}: calc(-1 * ${theme.space["2.5"]});
        `;
  }
  if ($opened && !$inner) {
    return css`
          z-index: 20;
          margin-${$direction === "down" ? "top" : "bottom"}: ${theme.space["1.5"]};
        `;
  }
}}

  ${$align === "left" ? css`
          left: 0;
        ` : css`
          right: 0;
        `}
  `);
const MenuButton = styled.button(({
  theme,
  $inner,
  $hasColor,
  $color,
  disabled
}) => css`
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

    color: ${theme.colors[$color || "accent"]};

    ${disabled && css`
      color: ${theme.colors.textTertiary};
      cursor: not-allowed;
    `}

    ${() => {
  if ($inner)
    return css`
          justify-content: center;

          &:hover {
            color: ${theme.colors.accent};
          }
        `;
  if (!$inner)
    return css`
          justify-content: flex-start;

          &:hover {
            transform: translateY(-1px);
            filter: brightness(1.05);
          }
        `;
}}

    ${() => {
  if ($inner && !$hasColor)
    return css`
          color: ${theme.colors.textSecondary};
        `;
}}
  `);
const DropdownChild = ({
  setIsOpen,
  item
}) => {
  const ref = React.useRef(null);
  const Item = React.cloneElement(item, __spreadProps(__spreadValues({}, item.props), {
    ref
  }));
  const handleClick = React.useCallback(() => {
    setIsOpen(false);
  }, [setIsOpen]);
  React.useEffect(() => {
    const currentRef = ref.current;
    currentRef == null ? void 0 : currentRef.addEventListener("click", handleClick);
    return () => {
      currentRef == null ? void 0 : currentRef.removeEventListener("click", handleClick);
    };
  }, [handleClick, item]);
  return Item;
};
const DropdownMenu = ({
  items,
  setIsOpen,
  isOpen,
  width,
  inner,
  align,
  shortThrow,
  keepMenuOnTop,
  labelAlign,
  direction
}) => {
  return /* @__PURE__ */ React.createElement(DropdownMenuContainer, __spreadProps(__spreadValues({}, {
    $opened: isOpen,
    $inner: inner,
    $align: align,
    $shortThrow: shortThrow,
    $labelAlign: labelAlign,
    $direction: direction
  }), {
    style: {
      width: inner || width && parseInt(width) > 100 ? `${width}px` : "150px",
      zIndex: keepMenuOnTop ? 100 : void 0
    }
  }), items.map((item) => {
    if (React.isValidElement(item)) {
      return DropdownChild({
        item,
        setIsOpen
      });
    }
    const {
      color,
      value,
      label,
      onClick,
      disabled,
      as,
      wrapper
    } = item;
    const props = {
      $inner: inner,
      $hasColor: !!color,
      $color: color,
      disabled,
      onClick: () => {
        setIsOpen(false);
        onClick == null ? void 0 : onClick(value);
      },
      as,
      children: label
    };
    if (wrapper) {
      return wrapper(/* @__PURE__ */ React.createElement(MenuButton, __spreadValues({}, props)), value || label);
    }
    return /* @__PURE__ */ React.createElement(MenuButton, __spreadProps(__spreadValues({}, props), {
      key: value || label
    }));
  }));
};
const InnerMenuButton = styled.button(({
  theme,
  $size,
  $open,
  $direction
}) => css`
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space["4"]};
    border-width: ${theme.space["px"]};
    font-weight: ${theme.fontWeights["semiBold"]};
    cursor: pointer;
    position: relative;
    border-color: ${theme.colors.borderSecondary};

    ${() => {
  switch ($size) {
    case "small":
      return css`
            padding: ${theme.space["0.5"]} ${theme.space["0.25"]};
          `;
    case "medium":
      return css`
            padding: ${theme.space["2.5"]} ${theme.space["3.5"]};
          `;
    default:
      return ``;
  }
}}

    ${() => {
  if ($open)
    return css`
          border-${$direction === "down" ? "top" : "bottom"}-left-radius: ${theme.radii["almostExtraLarge"]};
          border-${$direction === "down" ? "top" : "bottom"}-right-radius: ${theme.radii["almostExtraLarge"]};
          border-${$direction === "down" ? "bottom" : "top"}-left-radius: none;
          border-${$direction === "down" ? "bottom" : "top"}-right-radius: none;
          border-${$direction === "down" ? "bottom" : "top"}-width: 0;
          background-color: ${theme.colors.grey};
          color: ${theme.colors.textTertiary};
          transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6),
            0.3s color ease-in-out, 0.2s border-radius ease-in-out,
            0s border-width 0.1s, 0s padding linear;

          &:hover {
            color: ${theme.colors.accent};
          }
        `;
  if (!$open)
    return css`
          background-color: ${theme.colors.background};
          color: ${theme.colors.textSecondary};
          border-radius: ${theme.radii["almostExtraLarge"]};
          box-shadow: ${theme.boxShadows["0.02"]};
          transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6),
            0.15s color ease-in-out, 0s border-width 0.15s,
            0.15s border-color ease-in-out, 0s padding linear;

          &:hover {
            border-color: ${theme.colors.border};
          }
        `;
}}
  `);
const Chevron$2 = styled(ReactComponent$L)(({
  theme,
  $open,
  $direction
}) => css`
    margin-left: ${theme.space["1"]};
    width: ${theme.space["3"]};
    margin-right: ${theme.space["0.5"]};
    transition-duration: ${theme.transitionDuration["200"]};
    transition-property: all;
    transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
    opacity: 0.3;
    transform: rotate(${$direction === "down" ? "0deg" : "180deg"});
    display: flex;

    & > svg {
      fill: currentColor;
    }
    fill: currentColor;

    ${$open && css`
      opacity: 1;
      transform: rotate(${$direction === "down" ? "180deg" : "0deg"});
    `}
  `);
const ButtonWrapper = styled.div(() => css`
    z-index: 10;
    position: relative;
  `);
const Dropdown = (_E) => {
  var _F = _E, {
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
    label,
    direction = "down",
    isOpen: _isOpen,
    setIsOpen: _setIsOpen
  } = _F, props = __objRest(_F, [
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
    "label",
    "direction",
    "isOpen",
    "setIsOpen"
  ]);
  const dropdownRef = React.useRef();
  const [internalIsOpen, internalSetIsOpen] = React.useState(false);
  const [isOpen, setIsOpen] = _setIsOpen ? [_isOpen, _setIsOpen] : [internalIsOpen, internalSetIsOpen];
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
  return /* @__PURE__ */ React.createElement(Container$7, __spreadValues({
    ref: dropdownRef
  }, __spreadProps(__spreadValues({}, props), {
    "data-testid": getTestId(props, "dropdown")
  })), !children && inner && /* @__PURE__ */ React.createElement(InnerMenuButton, {
    $direction: direction,
    $open: isOpen,
    $size: size,
    onClick: () => setIsOpen(!isOpen)
  }, label, chevron && /* @__PURE__ */ React.createElement(Chevron$2, {
    $direction: direction,
    $open: isOpen
  })), !children && !inner && /* @__PURE__ */ React.createElement(ButtonWrapper, null, /* @__PURE__ */ React.createElement(Button, __spreadProps(__spreadValues({}, buttonProps), {
    pressed: isOpen,
    suffix: chevron && /* @__PURE__ */ React.createElement(Chevron$2, {
      $direction: direction,
      $open: isOpen
    }),
    onClick: () => setIsOpen(!isOpen)
  }), label)), React.Children.map(children, (child) => {
    if (React.isValidElement(child)) {
      return React.cloneElement(child, __spreadProps(__spreadValues({}, buttonProps), {
        zindex: 10,
        onClick: () => setIsOpen(!isOpen)
      }));
    }
  }), /* @__PURE__ */ React.createElement(DropdownMenu, {
    align,
    direction,
    inner,
    isOpen,
    items,
    keepMenuOnTop,
    labelAlign: menuLabelAlign,
    setIsOpen,
    shortThrow,
    width: dropdownRef.current && dropdownRef.current.getBoundingClientRect().width.toFixed(2)
  }));
};
Dropdown.displayName = "Dropdown";
const Container$6 = styled.fieldset(({
  theme
}) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space["4"]};
  `);
const ContainerInner = styled.div(({
  theme
}) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space["1"]};
    padding: 0 ${theme.space["4"]};
  `);
const Row = styled.div(({
  theme
}) => css`
    display: flex;
    align-items: center;
    flex-direction: row;
    gap: ${theme.space["3"]};
  `);
const Description = styled.div(({
  theme
}) => css`
    color: ${theme.colors.textSecondary};
    font-size: ${theme.fontSizes.base};
  `);
const ChildrenContainer = styled.div(({
  theme
}) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space["4"]};
  `);
const FieldSet = (_G) => {
  var _H = _G, {
    children,
    description,
    disabled,
    form,
    legend,
    name,
    status
  } = _H, props = __objRest(_H, [
    "children",
    "description",
    "disabled",
    "form",
    "legend",
    "name",
    "status"
  ]);
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
  return /* @__PURE__ */ React.createElement(Container$6, __spreadProps(__spreadValues({}, props), {
    disabled,
    form,
    name
  }), /* @__PURE__ */ React.createElement(ContainerInner, null, /* @__PURE__ */ React.createElement(Row, null, /* @__PURE__ */ React.createElement(Heading$1, {
    as: "legend",
    level: "2",
    responsive: true
  }, legend), statusTone && statusText && /* @__PURE__ */ React.createElement(Tag, {
    tone: statusTone
  }, statusText)), /* @__PURE__ */ React.createElement(Description, null, description)), /* @__PURE__ */ React.createElement(ChildrenContainer, null, children));
};
FieldSet.displayName = "FieldSet";
const InputParent = styled.div(({
  theme,
  $size,
  $disabled,
  $error,
  $suffix,
  $userStyles
}) => css`
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

    ${$disabled && css`
      border-color: ${theme.colors.foregroundSecondary};
      background-color: ${theme.colors.background};
    `}

    ${$error && css`
      border-color: ${theme.colors.red};
      cursor: default;

      &:focus-within {
        border-color: ${theme.colors.red};
      }
    `}

  ${$suffix && css`
      height: ${theme.space["16"]};
    `}

  ${() => {
  switch ($size) {
    case "medium":
      return css`
            height: ${theme.space["14"]};
          `;
    case "large":
      return css`
            height: ${theme.space["16"]};
          `;
    case "extraLarge":
      return css`
            height: ${theme.space["18"]};
          `;
    default:
      return ``;
  }
}}
  ${$userStyles}
  `);
const Prefix = styled.label(({
  theme
}) => css`
    align-items: center;
    display: flex;
    height: ${theme.space["full"]};
    line-height: normal;
    color: inherit;
    font-family: ${theme.fonts["sans"]};
    font-weight: ${theme.fontWeights["medium"]};
    padding-left: ${theme.space["4"]};
    padding-right: ${theme.space["2"]};
  `);
const Suffix = styled.label(({
  theme
}) => css`
    align-items: center;
    display: flex;
    height: ${theme.space["full"]};
    line-height: normal;
    color: inherit;
    font-family: ${theme.fonts["sans"]};
    font-weight: ${theme.fontWeights["medium"]};
    padding-left: ${theme.space["2"]};
    padding-right: ${theme.space["2"]};
  `);
const InputContainer = styled.div(({
  theme
}) => css`
    overflow: hidden;
    position: relative;
    width: ${theme.space["full"]};
  `);
const InputComponent = styled.input(({
  theme,
  disabled,
  type,
  $size
}) => css`
    background-color: ${theme.colors.transparent};
    position: relative;
    width: ${theme.space["full"]};
    height: ${theme.space["full"]};
    padding: 0 ${theme.space["4"]};
    font-weight: ${theme.fontWeights["medium"]};

    &::placeholder {
      color: ${theme.colors.textPlaceholder};
      font-weight: ${theme.fontWeights["medium"]};
    }

    ${disabled && css`
      opacity: ${theme.opacity["50"]};
      cursor: not-allowed;
    `}

    ${type === "number" && css`
      font-feature-settings: 'kern' 1, 'tnum' 1, 'calt' 0;
      font-variant-numeric: tabular-nums;
    `}

  ${() => {
  switch ($size) {
    case "medium":
      return css`
            font-size: ${theme.fontSizes["base"]};
          `;
    case "large":
      return css`
            font-size: ${theme.fontSizes["large"]};
          `;
    case "extraLarge":
      return css`
            font-size: ${theme.fontSizes["headingThree"]};
            padding: 0 ${theme.space["6"]};
          `;
    default:
      return ``;
  }
}}
  `);
const Ghost = styled.div(({
  theme,
  $type,
  $size
}) => css`
    inset: 0;
    position: absolute;
    pointer-events: none;
    white-space: pre;
    line-height: normal;
    display: flex;
    align-items: center;

    padding: 0 ${theme.space["4"]};
    border-color: ${theme.colors.transparent};

    ${$type === "number" && css`
      font-feature-settings: 'kern' 1, 'tnum' 1, 'calt' 0;
      font-variant-numeric: tabular-nums;
    `}

    ${() => {
  switch ($size) {
    case "medium":
      return css`
            font-size: ${theme.fontSizes["base"]};
          `;
    case "large":
      return css`
            font-size: ${theme.fontSizes["large"]};
          `;
    case "extraLarge":
      return css`
            font-size: ${theme.fontSizes["headingThree"]};
            padding: 0 ${theme.space["6"]};
          `;
    default:
      return ``;
  }
}}
  `);
const Units = styled.span(({
  theme
}) => css`
    color: ${theme.colors.text};
    font-weight: ${theme.fontWeights["medium"]};
  `);
const Input$1 = React.forwardRef((_I, ref) => {
  var _J = _I, {
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
  } = _J, props = __objRest(_J, [
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
    $disabled: disabled,
    $error: hasError,
    $suffix: suffix !== void 0,
    $size: size,
    $userStyles: parentStyles
  }), prefix && /* @__PURE__ */ React.createElement(Prefix, __spreadValues({
    "aria-hidden": "true"
  }, ids == null ? void 0 : ids.label), prefix), /* @__PURE__ */ React.createElement(InputContainer, null, /* @__PURE__ */ React.createElement(InputComponent, __spreadProps(__spreadValues({
    ref: inputRef
  }, __spreadProps(__spreadValues(__spreadValues({}, props), ids == null ? void 0 : ids.content), {
    "aria-invalid": hasError,
    onInput: handleInput,
    onKeyDown: type === "number" ? handleKeyDown : onKeyDown,
    onWheel: type === "number" ? handleWheel : void 0
  })), {
    $size: size,
    autoComplete,
    autoCorrect,
    autoFocus,
    defaultValue,
    disabled,
    inputMode,
    name,
    placeholder: placeholderText,
    readOnly,
    spellCheck,
    tabIndex,
    type: inputType,
    value,
    onBlur,
    onChange,
    onFocus
  })), units && state2.ghostValue && /* @__PURE__ */ React.createElement(Ghost, {
    $size: size,
    $type: inputType,
    "aria-hidden": "true",
    "data-testid": "ghost"
  }, /* @__PURE__ */ React.createElement("span", {
    style: {
      visibility: "hidden"
    }
  }, state2.ghostValue, " "), /* @__PURE__ */ React.createElement(Units, null, units))), suffix && /* @__PURE__ */ React.createElement(Suffix, __spreadValues({
    "aria-hidden": "true"
  }, ids == null ? void 0 : ids.label), suffix)));
});
Input$1.displayName = "Input";
const Container$5 = styled.div(({
  theme,
  $state
}) => css`
    width: 95%;

    position: fixed;
    left: 2.5%;
    z-index: 9999;
    bottom: ${theme.space["4"]};

    display: flex;
    flex-direction: row;

    ${mq.sm.min(css`
      width: min-content;

      top: 50%;
      left: 50%;
      transform: translate(-50%, -50%);
      bottom: initial;
    `)}

    transition: ${theme.transitionDuration["300"]} all
      ${theme.transitionTimingFunction.popIn};

    ${$state === "entered" ? css`
          opacity: 1;
          transform: translateY(0px);
        ` : css`
          opacity: 0;
          transform: translateY(128px);
        `}
  `);
const Modal = (_K) => {
  var _L = _K, {
    children,
    backdropSurface,
    onDismiss,
    open
  } = _L, props = __objRest(_L, [
    "children",
    "backdropSurface",
    "onDismiss",
    "open"
  ]);
  return /* @__PURE__ */ React.createElement(Backdrop, {
    open,
    surface: backdropSurface,
    onDismiss
  }, ({
    state: state2
  }) => /* @__PURE__ */ React.createElement(Container$5, __spreadValues({
    $state: state2
  }, props), children));
};
Modal.displayName = "Modal";
const Container$4 = styled.div(({
  theme
}) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space["2"]};
    flex-gap: ${theme.space["2"]};
  `);
const PageButton = styled.button(({
  theme,
  $selected
}) => css`
    background-color: transparent;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
    ${$selected ? css`
          background-color: ${theme.colors.background};
          cursor: default;
          pointer-events: none;
        ` : css`
          &:hover {
            background-color: ${theme.colors.foregroundSecondary};
          }
        `}

    border-radius: ${theme.radii["extraLarge"]};
    border: 1px solid ${theme.colors.borderSecondary};
    min-width: ${theme.space["10"]};
    padding: ${theme.space["2"]};
    height: ${theme.space["10"]};
    font-size: ${theme.fontSizes["small"]};
    font-weight: ${theme.fontWeights["medium"]};
    color: ${theme.colors.text};
  `);
const Dots = styled.p(({
  theme
}) => css`
    font-size: ${theme.fontSizes["small"]};
    font-weight: ${theme.fontWeights["bold"]};
    color: ${theme.colors.textTertiary};
  `);
const PageButtons = (_M) => {
  var _N = _M, {
    total,
    current,
    max = 5,
    alwaysShowFirst,
    alwaysShowLast,
    onChange
  } = _N, props = __objRest(_N, [
    "total",
    "current",
    "max",
    "alwaysShowFirst",
    "alwaysShowLast",
    "onChange"
  ]);
  const maxPerSide = Math.floor(max / 2);
  const start = Math.max(Math.min(Math.max(current - maxPerSide, 1), total - max + 1), 1);
  const array = Array.from({
    length: max
  }, (_, i) => start + i).filter((x) => x <= total);
  if (total > max) {
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
  }
  return /* @__PURE__ */ React.createElement(Container$4, __spreadValues({}, __spreadProps(__spreadValues({}, props), {
    "data-testid": getTestId(props, "pagebuttons")
  })), array.map((value) => 0 > value ? /* @__PURE__ */ React.createElement(Dots, {
    "data-testid": "pagebutton-dots",
    key: value
  }, "...") : /* @__PURE__ */ React.createElement(PageButton, {
    $selected: value === current,
    "data-testid": "pagebutton",
    key: value,
    onClick: () => onChange(value)
  }, value)));
};
const Container$3 = styled.div(({
  theme,
  $size,
  $hasChevron,
  $open
}) => css`
    align-items: center;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    border-radius: ${theme.radii["full"]};
    transition-duration: ${theme.transitionDuration["150"]};
    transition-property: color, border-color, background-color, transform,
      filter, box-shadow;
    transition-timing-function: ${theme.transitionTimingFunction["inOut"]};
    position: relative;
    z-index: 10;
    padding: ${theme.space["2"]} ${theme.space["4"]} ${theme.space["2"]}
      ${theme.space["2.5"]};
    box-shadow: ${theme.shadows["0.25"]};
    color: ${theme.colors.foregroundSecondary};
    background-color: ${theme.colors.groupBackground};

    ${$hasChevron && css`
      cursor: pointer;
      &:hover {
        transform: translateY(-1px);
        filter: brightness(1.05);
      }
    `}

    ${$open && css`
      box-shadow: ${theme.shadows["0"]};
      background-color: ${theme.colors.foregroundSecondary};
    `}

  ${() => {
  switch ($size) {
    case "small":
      return css`
            max-width: ${theme.space["48"]};
          `;
    case "medium":
      return css`
            max-width: ${theme.space["52"]};
          `;
    case "large":
      return css`
            max-width: ${theme.space["80"]};
          `;
    default:
      return ``;
  }
}}

  ${() => {
  if ($size === "small" && $hasChevron)
    return css`
          max-width: ${theme.space["52"]};
        `;
  if ($size === "medium" && $hasChevron)
    return css`
          max-width: ${theme.space["56"]};
        `;
  if ($size === "large" && $hasChevron)
    return css`
          max-width: calc(${theme.space["80"]} + ${theme.space["4"]});
        `;
}}
  `);
const AvatarContainer = styled.div(({
  theme
}) => css`
    width: ${theme.space["12"]};
  `);
const Chevron$1 = styled.svg(({
  theme,
  $open
}) => css`
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

    ${$open && css`
      opacity: 1;
      transform: rotate(180deg);
    `}
  `);
const ProfileInnerContainer = styled.div(({
  theme,
  $size
}) => css`
    display: ${$size === "small" ? "none" : "block"};
    margin: 0 ${theme.space["1.5"]};
    min-width: ${theme.space["none"]};
  `);
const ReducedLineText = styled(Typography)(() => css`
    line-height: initial;
  `);
const ProfileInner = ({
  size,
  avatar,
  address,
  ensName
}) => /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement(AvatarContainer, null, /* @__PURE__ */ React.createElement(Avatar, {
  label: "profile-avatar",
  src: avatar
})), /* @__PURE__ */ React.createElement(ProfileInnerContainer, {
  $size: size
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
const Profile = (_O) => {
  var _P = _O, {
    size = "medium",
    avatar,
    dropdownItems,
    address,
    ensName,
    alignDropdown = "left"
  } = _P, props = __objRest(_P, [
    "size",
    "avatar",
    "dropdownItems",
    "address",
    "ensName",
    "alignDropdown"
  ]);
  const [isOpen, setIsOpen] = React.useState(false);
  if (dropdownItems) {
    return /* @__PURE__ */ React.createElement(Dropdown, __spreadValues({}, {
      items: dropdownItems,
      isOpen,
      setIsOpen,
      align: alignDropdown
    }), /* @__PURE__ */ React.createElement(Container$3, __spreadProps(__spreadValues({}, props), {
      $hasChevron: true,
      $open: isOpen,
      $size: size,
      onClick: () => setIsOpen(!isOpen)
    }), /* @__PURE__ */ React.createElement(ProfileInner, __spreadValues({}, {
      size,
      avatar,
      address,
      ensName
    })), /* @__PURE__ */ React.createElement(Chevron$1, {
      $open: isOpen,
      as: ReactComponent$L
    })));
  }
  return /* @__PURE__ */ React.createElement(Container$3, __spreadProps(__spreadValues({}, __spreadProps(__spreadValues({}, props), {
    "data-testid": getTestId(props, "profile")
  })), {
    $open: isOpen,
    $size: size
  }), /* @__PURE__ */ React.createElement(ProfileInner, __spreadValues({}, {
    size,
    avatar,
    address,
    ensName
  })));
};
Profile.displayName = "Profile";
const Input = styled.input(({
  theme
}) => css`
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

    &:checked::before {
      transform: scale(1);
    }
  `);
const RadioButton = React.forwardRef((_Q, ref) => {
  var _R = _Q, {
    description,
    disabled,
    error,
    inline = true,
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
  } = _R, props = __objRest(_R, [
    "description",
    "disabled",
    "error",
    "inline",
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
    inline,
    label,
    labelSecondary,
    required,
    width
  }, /* @__PURE__ */ React.createElement(Input, __spreadProps(__spreadValues({}, __spreadProps(__spreadValues({}, props), {
    "aria-invalid": error ? true : void 0,
    "aria-selected": checked ? true : void 0,
    "data-testid": getTestId(props, "radio"),
    type: "radio",
    role: "radio"
  })), {
    checked,
    disabled,
    name,
    ref: inputRef,
    tabIndex,
    value,
    onBlur,
    onChange,
    onFocus
  })));
});
RadioButton.displayName = "RadioButton";
const createSyntheticEvent = (event) => {
  let isDefaultPrevented = false;
  let isPropagationStopped = false;
  const preventDefault = () => {
    isDefaultPrevented = true;
    event.preventDefault();
  };
  const stopPropagation = () => {
    isPropagationStopped = true;
    event.stopPropagation();
  };
  return {
    nativeEvent: event,
    currentTarget: event.currentTarget,
    target: event.target,
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    defaultPrevented: event.defaultPrevented,
    eventPhase: event.eventPhase,
    isTrusted: event.isTrusted,
    preventDefault,
    isDefaultPrevented: () => isDefaultPrevented,
    stopPropagation,
    isPropagationStopped: () => isPropagationStopped,
    persist: () => {
    },
    timeStamp: event.timeStamp,
    type: event.type
  };
};
const Container$2 = styled.div(({
  theme,
  $inline
}) => css`
    display: flex;
    flex-direction: ${$inline ? "row" : "column"};
    gap: ${theme.space["2"]};
    justify-content: flex-start;
    flex-wrap: ${$inline ? "wrap" : "nowrap"};
  `);
const RadioButtonGroup = React.forwardRef((_S, ref) => {
  var _T = _S, {
    value: _value,
    children,
    inline = false,
    onChange,
    onBlur
  } = _T, props = __objRest(_T, [
    "value",
    "children",
    "inline",
    "onChange",
    "onBlur"
  ]);
  const defaultRef = React.useRef(null);
  const rootRef = ref || defaultRef;
  const checkedRef = React.useRef(null);
  const [didSetDefault, setDidSetDefault] = React.useState(false);
  const [value, setValue] = React.useState(_value);
  React.useEffect(() => {
    if (_value && _value != value)
      setValue(_value);
  }, [_value]);
  const handleChange = (e) => {
    setValue(e.target.value);
    if (onChange)
      onChange(e);
  };
  const handleFocus = () => {
    if (checkedRef.current) {
      checkedRef.current.focus();
    }
  };
  const handleBlur = (e) => {
    if (onBlur)
      onBlur(e);
  };
  const generateChangeEvent = (value2, name = "radiogroup") => {
    if (onChange && value2) {
      const target = document.createElement("input");
      target.value = value2;
      target.name = name;
      const event = new Event("change", {
        bubbles: true
      });
      Object.defineProperty(event, "target", {
        writable: false,
        value: target
      });
      const syntheticEvent = createSyntheticEvent(event);
      onChange(syntheticEvent);
    }
  };
  return /* @__PURE__ */ React.createElement(Container$2, __spreadProps(__spreadValues({
    $inline: inline
  }, props), {
    "data-testid": getTestId(props, "radiogroup"),
    ref: rootRef,
    role: "radiogroup",
    onFocus: handleFocus
  }), React.Children.map(children, (child) => {
    if (child.props.checked && !didSetDefault) {
      setDidSetDefault(true);
      if (value !== child.props.value) {
        setValue(child.props.value);
        setDidSetDefault(true);
        generateChangeEvent(child.props.value, child.props.name);
      }
    }
    const isChecked = child.props.value === value;
    return React.cloneElement(child, {
      ref: isChecked ? checkedRef : void 0,
      checked: isChecked,
      onChange: handleChange,
      onBlur: handleBlur
    });
  }));
});
RadioButtonGroup.displayName = "RadioButtonGroup";
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
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
const CREATE_OPTION_VALUE = "CREATE_OPTION_VALUE";
const SelectContainer = styled.div(({
  theme,
  $disabled,
  $size
}) => css`
    background: ${theme.colors.background};
    border-color: ${theme.colors.backgroundHide};
    border-width: ${theme.space["px"]};
    cursor: pointer;
    position: relative;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    z-index: 10;
    ${$size === "medium" ? css`
          border-radius: ${theme.radii["extraLarge"]};
          padding: ${theme.space["4"]};
          height: ${theme.space["14"]};
        ` : css`
          border-radius: ${theme.radii["almostExtraLarge"]};
          padding: ${theme.space["2"]};
          height: ${theme.space["10"]};
        `}

    ${$disabled && css`
      cursor: not-allowed;
      background: ${theme.colors.backgroundTertiary};
    `}
  `);
const OptionElementContainer = styled.div(({
  theme
}) => css`
    align-items: center;
    display: flex;
    flex-direction: row;
    flex-grow: 1;
    gap: ${theme.space["4"]};
  `);
const Chevron = styled(ReactComponent$L)(({
  theme,
  $open,
  $disabled
}) => css`
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

    ${$open && css`
      opacity: 1;
      transform: rotate(180deg);
    `}

    ${$disabled && css`
      opacity: 0.1;
    `}
  `);
const SelectOptionContainer = styled.div(({
  theme,
  $open
}) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: space-between;
    position: absolute;
    visibility: hidden;
    opacity: 0;
    overflow: hidden;

    margin-top: ${theme.space["1.5"]};
    padding: ${theme.space["1.5"]};
    width: ${theme.space["full"]};
    height: ${theme.space["fit"]};
    border-radius: ${theme.radii["medium"]};
    box-shadow: ${theme.boxShadows["0.02"]};
    background: ${theme.colors.background};

    ${$open ? css`
          z-index: 20;
          visibility: visible;
          margin-top: ${theme.space["1.5"]};
          opacity: ${theme.opacity["100"]};
          transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6),
            z-index 0s linear 0.3s;
        ` : css`
          z-index: 0;
          visibility: hidden;
          margin-top: -${theme.space["12"]};
          opacity: 0;
          transition: all 0.3s cubic-bezier(1, 0, 0.22, 1.6),
            z-index 0s linear 0s;
        `}
  `);
const SelectOption = styled.div(({
  theme,
  $selected,
  $disabled,
  $highlighted
}) => css`
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

    &:first-child {
      margin-top: ${theme.space["0"]};
    }

    &:last-child {
      margin-bottom: ${theme.space["0"]};
    }

    ${() => {
  if ($selected)
    return css`
          background-color: ${theme.colors.foregroundSecondary};
        `;
  else if ($highlighted)
    return css`
          background-color: ${theme.colors.foregroundSecondaryHover};
        `;
}}

    ${$disabled && css`
      color: ${theme.colors.textTertiary};
      cursor: not-allowed;

      &:hover {
        background-color: ${theme.colors.transparent};
      }
    `}
  `);
const ClearIconContainer = styled.div(({
  theme,
  $size
}) => css`
    gap: 10px;
    display: flex;
    justify-content: center;
    align-items: center;
    width: ${$size === "medium" ? theme.space["14"] : theme.space["10"]};
    height: ${$size === "medium" ? theme.space["14"] : theme.space["10"]};
    svg {
      display: block;
      path {
        color: ${theme.colors.textSecondary};
      }
    }
  `);
const NoResultsContainer = styled.div(({
  theme
}) => css`
    align-items: center;
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
    font-style: italic;

    &:first-child {
      margin-top: ${theme.space["0"]};
    }

    &:last-child {
      margin-bottom: ${theme.space["0"]};
    }
  `);
const createOptionsReducer = (searchTerm) => (results, option) => {
  if (option.label) {
    const label = option.label.trim().toLowerCase();
    if (label.indexOf(searchTerm) !== -1)
      results.options.push(option);
    if (label === searchTerm)
      results.exactMatch = true;
  }
  return results;
};
var ReservedKeys;
(function(ReservedKeys2) {
  ReservedKeys2["ArrowUp"] = "ArrowUp";
  ReservedKeys2["ArrowDown"] = "ArrowDown";
  ReservedKeys2["Enter"] = "Enter";
})(ReservedKeys || (ReservedKeys = {}));
const Select = React.forwardRef((_U, ref) => {
  var _V = _U, {
    description,
    disabled,
    autocomplete = false,
    createable = false,
    createablePrefix = "Add ",
    error,
    hideLabel,
    inline,
    id: _id,
    label,
    labelSecondary,
    required,
    tabIndex = -1,
    width,
    onBlur,
    onChange,
    onFocus,
    onCreate,
    options,
    emptyListMessage = "No results",
    name,
    value: _value,
    size = "medium"
  } = _V, props = __objRest(_V, [
    "description",
    "disabled",
    "autocomplete",
    "createable",
    "createablePrefix",
    "error",
    "hideLabel",
    "inline",
    "id",
    "label",
    "labelSecondary",
    "required",
    "tabIndex",
    "width",
    "onBlur",
    "onChange",
    "onFocus",
    "onCreate",
    "options",
    "emptyListMessage",
    "name",
    "value",
    "size"
  ]);
  const defaultRef = React.useRef(null);
  const inputRef = ref || defaultRef;
  const displayRef = React.useRef(null);
  const searchInputRef = React.useRef(null);
  const [inputValue, setInputValue] = React.useState("");
  const [queryValue, setQueryValue] = React.useState("");
  const isCreateable = createable && queryValue !== "";
  const isAutocomplete = createable || autocomplete;
  const [id2] = React.useState(_id || uniqueId_1());
  const [value, setValue] = React.useState("");
  React.useEffect(() => {
    if (_value !== value && _value !== void 0)
      setValue(_value);
  }, [_value]);
  const selectedOption = (options == null ? void 0 : options.find((o) => o.value === value)) || null;
  const changeSelectedOption = (option, event) => {
    if (option == null ? void 0 : option.disabled)
      return;
    if ((option == null ? void 0 : option.value) === CREATE_OPTION_VALUE) {
      onCreate && onCreate(queryValue);
    } else if (option == null ? void 0 : option.value) {
      setValue(option == null ? void 0 : option.value);
      if (event) {
        const nativeEvent = event.nativeEvent || event;
        const clonedEvent = new nativeEvent.constructor(nativeEvent.type, nativeEvent);
        Object.defineProperties(clonedEvent, {
          target: {
            writable: true,
            value: {
              value: option.value,
              name
            }
          },
          currentTarget: {
            writable: true,
            value: {
              value: option.value,
              name
            }
          }
        });
        onChange && onChange(clonedEvent);
      }
    }
  };
  const visibleOptions = React.useMemo(() => {
    if (!isAutocomplete || queryValue === "")
      return options;
    const searchTerm = queryValue.trim().toLowerCase();
    const {
      options: baseOptions,
      exactMatch
    } = (Array.isArray(options) ? options : [options]).reduce(createOptionsReducer(searchTerm), {
      options: [],
      exactMatch: false
    });
    return [...baseOptions, ...isCreateable && !exactMatch ? [{
      label: `${createablePrefix}"${queryValue}"`,
      value: CREATE_OPTION_VALUE
    }] : []];
  }, [options, isCreateable, isAutocomplete, queryValue, createablePrefix]);
  const [highlightedIndex, setHighlightedIndex] = React.useState(-1);
  const changeHighlightIndex = React.useCallback((index2) => {
    const option = visibleOptions[index2];
    if (option && !option.disabled && option.value !== CREATE_OPTION_VALUE) {
      setHighlightedIndex(index2);
      setInputValue(option.label || "");
      return;
    }
    setInputValue(queryValue);
    setHighlightedIndex(index2);
  }, [visibleOptions, queryValue, setInputValue, setHighlightedIndex]);
  const incrementHighlightIndex = (direction) => {
    var _a;
    let nextIndex = highlightedIndex;
    do {
      if (direction === "previous")
        nextIndex--;
      else
        nextIndex++;
      if (nextIndex < 0) {
        return changeHighlightIndex(-1);
      }
      if (visibleOptions[nextIndex] && !((_a = visibleOptions[nextIndex]) == null ? void 0 : _a.disabled))
        return changeHighlightIndex(nextIndex);
    } while (visibleOptions[nextIndex]);
  };
  const selectHighlightedIndex = (event) => {
    const option = options[highlightedIndex];
    option && changeSelectedOption(option, event);
    handleReset();
  };
  const [menuOpen, setMenuOpen] = React.useState(false);
  const isOpen = !disabled && menuOpen;
  useEffect(() => {
    if (!menuOpen)
      handleReset();
  }, [menuOpen]);
  const handleReset = () => {
    setQueryValue("");
    setInputValue("");
    setHighlightedIndex(-1);
  };
  const handleSelectContainerClick = (e) => {
    e.stopPropagation();
    e.preventDefault();
    if (isAutocomplete && !menuOpen)
      setMenuOpen(true);
    !isAutocomplete && setMenuOpen(!menuOpen);
  };
  const handleKeydown = (e) => {
    if (!menuOpen) {
      e.stopPropagation();
      e.preventDefault();
      return setMenuOpen(true);
    }
    if (!(e.key in ReservedKeys))
      return;
    e.preventDefault();
    e.stopPropagation();
    if (e.key === ReservedKeys.ArrowUp)
      incrementHighlightIndex("previous");
    else if (e.key === ReservedKeys.ArrowDown)
      incrementHighlightIndex("next");
    if (e.key === ReservedKeys.Enter) {
      selectHighlightedIndex(e);
      setMenuOpen(false);
    }
  };
  const handleInputChange = (e) => {
    const newValue = e.currentTarget.value;
    setQueryValue(newValue);
    setInputValue(newValue);
    setHighlightedIndex(-1);
  };
  const handleInputClear = (e) => {
    e.stopPropagation();
    setQueryValue("");
    setInputValue("");
    setHighlightedIndex(-1);
  };
  const handleOptionsListMouseLeave = () => {
    changeHighlightIndex(-1);
  };
  const handleOptionClick = (option) => (e) => {
    e.stopPropagation();
    changeSelectedOption(option, e);
    setMenuOpen(false);
  };
  const handleOptionMouseover = (e) => {
    const index2 = Number(e.currentTarget.getAttribute("data-option-index"));
    if (!isNaN(index2))
      changeHighlightIndex(index2);
  };
  useDocumentEvent(displayRef, "click", () => setMenuOpen(false), menuOpen);
  const OptionElement = ({
    option
  }) => option ? /* @__PURE__ */ React.createElement(React.Fragment, null, option.prefix && /* @__PURE__ */ React.createElement("div", null, option.prefix), option.label || option.value) : null;
  return /* @__PURE__ */ React.createElement(Field, {
    "data-testid": "select",
    description,
    error,
    hideLabel,
    id: id2,
    inline,
    label,
    labelSecondary,
    required,
    width
  }, /* @__PURE__ */ React.createElement("div", {
    style: {
      position: "relative"
    }
  }, /* @__PURE__ */ React.createElement(SelectContainer, __spreadProps(__spreadValues({}, __spreadProps(__spreadValues({}, props), {
    "aria-controls": `listbox-${id2}`,
    "aria-expanded": "true",
    "aria-haspopup": "listbox",
    "aria-invalid": error ? true : void 0,
    "data-testid": "select-container",
    role: "combobox",
    onClick: handleSelectContainerClick,
    onKeyDown: handleKeydown
  })), {
    $disabled: disabled,
    $size: size,
    id: `combo-${id2}`,
    ref: displayRef,
    tabIndex,
    onBlur,
    onFocus
  }), /* @__PURE__ */ React.createElement(OptionElementContainer, {
    "data-testid": "selected"
  }, isAutocomplete && isOpen ? /* @__PURE__ */ React.createElement(React.Fragment, null, /* @__PURE__ */ React.createElement("input", {
    autoCapitalize: "none",
    autoComplete: "off",
    autoFocus: true,
    "data-testid": "select-input",
    placeholder: selectedOption == null ? void 0 : selectedOption.label,
    ref: searchInputRef,
    spellCheck: "false",
    style: {
      flex: "1",
      height: "100%"
    },
    value: inputValue,
    onChange: handleInputChange,
    onKeyDown: (e) => handleKeydown(e)
  }), /* @__PURE__ */ React.createElement(ClearIconContainer, {
    $size: size,
    onClick: handleInputClear
  }, /* @__PURE__ */ React.createElement(ReactComponent$A, null))) : /* @__PURE__ */ React.createElement(OptionElement, {
    option: selectedOption
  })), /* @__PURE__ */ React.createElement(Chevron, {
    $disabled: disabled,
    $open: isOpen
  }), /* @__PURE__ */ React.createElement(VisuallyHidden, null, /* @__PURE__ */ React.createElement("input", {
    "aria-hidden": true,
    name,
    ref: inputRef,
    tabIndex: -1,
    value,
    onChange: (e) => {
      const newValue = e.target.value;
      const option = options == null ? void 0 : options.find((o) => o.value === newValue);
      if (option) {
        setValue(option.value);
        onChange && onChange(e);
      }
    },
    onFocus: () => {
      var _a;
      searchInputRef.current ? searchInputRef.current.focus() : (_a = displayRef.current) == null ? void 0 : _a.focus();
    }
  }))), /* @__PURE__ */ React.createElement(SelectOptionContainer, {
    $open: isOpen,
    id: `listbox-${id2}`,
    role: "listbox",
    tabIndex: -1,
    onMouseLeave: handleOptionsListMouseLeave
  }, visibleOptions.length === 0 && /* @__PURE__ */ React.createElement(NoResultsContainer, null, emptyListMessage), visibleOptions.map((option, index2) => /* @__PURE__ */ React.createElement(SelectOption, __spreadProps(__spreadValues({}, {
    $selected: (option == null ? void 0 : option.value) === value,
    $disabled: option.disabled,
    $highlighted: index2 === highlightedIndex
  }), {
    "data-option-index": index2,
    key: option.value,
    role: "option",
    onClick: handleOptionClick(option),
    onMouseOver: handleOptionMouseover
  }), /* @__PURE__ */ React.createElement(OptionElement, {
    option
  }))))));
});
Select.displayName = "Select";
const TextArea = styled.textarea(({
  theme,
  disabled,
  $error
}) => css`
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

    ${disabled && css`
      border-color: ${theme.colors.foregroundSecondary};
      cursor: not-allowed;
    `}

    ${$error && css`
      border-color: ${theme.colors.red};
      cursor: default;

      &:focus-within {
        border-color: ${theme.colors.red};
      }
    `}
  `);
const Textarea = React.forwardRef((_W, ref) => {
  var _X = _W, {
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
  } = _X, props = __objRest(_X, [
    "autoCorrect",
    "autoFocus",
    "defaultValue",
    "description",
    "disabled",
    "error",
    "hideLabel",
    "id",
    "label",
    "labelSecondary",
    "maxLength",
    "name",
    "placeholder",
    "readOnly",
    "required",
    "rows",
    "spellCheck",
    "tabIndex",
    "value",
    "width",
    "onChange",
    "onBlur",
    "onFocus"
  ]);
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
  }, /* @__PURE__ */ React.createElement(TextArea, __spreadProps(__spreadValues({}, __spreadProps(__spreadValues({}, props), {
    "aria-invalid": hasError
  })), {
    $error: hasError,
    autoCorrect,
    autoFocus,
    defaultValue,
    disabled,
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
  })));
});
Textarea.displayName = "Textarea";
const TooltipPopover = styled.div(({
  theme
}) => css`
    border-width: 1px;
    border-style: solid;
    box-sizing: border-box;
    box-shadow: 0px 3px 8px rgba(0, 0, 0, 0.02);
    width: 230px;

    border-radius: ${theme.space["3.5"]};
    padding: ${theme.space["2.5"]} ${theme.space["2.5"]} ${theme.space["2.5"]}
      ${theme.space["3.5"]};
    border-color: ${theme.colors.borderSecondary};
    background: ${theme.colors.background};
  `);
const Tooltip = (_Y) => {
  var _Z = _Y, {
    content
  } = _Z, props = __objRest(_Z, [
    "content"
  ]);
  const popover = /* @__PURE__ */ React.createElement(TooltipPopover, null, content);
  return DynamicPopover(__spreadValues({
    popover
  }, props));
};
Tooltip.displayName = "Tooltip";
const IconCloseContainer$1 = styled.div(({
  theme
}) => css`
    position: absolute;
    top: ${theme.space["2.5"]};
    right: ${theme.space["2.5"]};
    height: ${theme.space["8"]};
    width: ${theme.space["8"]};
    opacity: ${theme.opacity["50"]};
    cursor: pointer;
    transition-property: all;
    transition-duration: ${theme.transitionDuration["150"]};
    transition-timing-function: ${theme.transitionTimingFunction["inOut"]};

    &:hover {
      opacity: ${theme.opacity["70"]};
    }
  `);
const StyledCard = styled.div(({
  theme
}) => css`
    padding: ${theme.space["3.5"]};
    border-radius: ${theme.radii["3xLarge"]};
    background-color: ${theme.colors.background};
    position: relative;
    width: 100%;
    ${mq.sm.min(css`
      width: initial;
    `)}
  `);
const Title$1 = styled(Typography)(({
  theme
}) => css`
    font-size: ${theme.fontSizes["headingThree"]};
    font-weight: ${theme.fontWeights["bold"]};
  `);
const SubTitle = styled(Typography)(({
  theme
}) => css`
    font-size: ${theme.fontSizes["base"]};
    font-weight: ${theme.fontWeights["medium"]};
    color: ${theme.colors.textSecondary};
    text-align: center;
  `);
const Container$1 = styled.div(({
  theme,
  $center
}) => css`
    display: flex;
    align-items: center;
    justify-content: stretch;
    flex-direction: ${$center ? "column" : "row"};
    gap: ${theme.space["2"]};
    width: ${theme.space.full};
    max-width: ${theme.space["96"]};
  `);
const TitleContainer = styled.div(({
  theme,
  $hasSteps
}) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    ${!$hasSteps && css`
      margin-top: ${theme.space["1.5"]};
    `}
  `);
const ContentWrapper = styled.div(({
  theme
}) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space["5"]};
    ${mq.sm.min(css`
      min-width: ${theme.space["64"]};
    `)}
  `);
const StepContainer = styled.div(({
  theme
}) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space["2"]};
  `);
const StepItem = styled.div(({
  theme,
  $type
}) => css`
    border-radius: ${theme.radii.full};
    width: ${theme.space["3.5"]};
    height: ${theme.space["3.5"]};
    ${$type === "notStarted" && css`
      border: ${theme.borderWidths["0.5"]} ${theme.borderStyles.solid}
        ${theme.colors.borderSecondary};
    `}
    ${$type === "inProgress" && css`
      border: ${theme.borderWidths["0.5"]} ${theme.borderStyles.solid}
        ${theme.colors.accent};
    `}
    ${$type === "completed" && css`
      background-color: ${theme.colors.accent};
    `}
  `);
const Heading = ({
  currentStep,
  stepCount,
  stepStatus,
  title,
  subtitle
}) => {
  const calcStepType = React.useCallback((step) => {
    if (step === currentStep) {
      return stepStatus || "inProgress";
    }
    if (step < (currentStep || 0)) {
      return "completed";
    }
    return "notStarted";
  }, [currentStep, stepStatus]);
  return /* @__PURE__ */ React.createElement(React.Fragment, null, stepCount && /* @__PURE__ */ React.createElement(StepContainer, {
    "data-testid": "step-container"
  }, Array.from({
    length: stepCount
  }, (_, i) => /* @__PURE__ */ React.createElement(StepItem, {
    $type: calcStepType(i),
    "data-testid": `step-item-${i}-${calcStepType(i)}`,
    key: i
  }))), /* @__PURE__ */ React.createElement(TitleContainer, {
    $hasSteps: !!stepCount
  }, title && (typeof title !== "string" && title || /* @__PURE__ */ React.createElement(Title$1, null, title)), subtitle && (typeof subtitle !== "string" && subtitle || /* @__PURE__ */ React.createElement(SubTitle, null, subtitle))));
};
const Footer = ({
  leading,
  trailing,
  center
}) => /* @__PURE__ */ React.createElement(Container$1, __spreadValues({}, {
  $center: center
}), leading || !center && /* @__PURE__ */ React.createElement("div", {
  style: {
    flexGrow: 1
  }
}), trailing || !center && /* @__PURE__ */ React.createElement("div", {
  style: {
    flexGrow: 1
  }
}));
const ModalWithTitle = (__) => {
  var _$ = __, {
    open,
    onDismiss,
    title,
    subtitle,
    children,
    currentStep,
    stepCount,
    stepStatus
  } = _$, props = __objRest(_$, [
    "open",
    "onDismiss",
    "title",
    "subtitle",
    "children",
    "currentStep",
    "stepCount",
    "stepStatus"
  ]);
  return /* @__PURE__ */ React.createElement(Modal, __spreadValues({}, __spreadProps(__spreadValues({}, props), {
    open,
    onDismiss
  })), /* @__PURE__ */ React.createElement(StyledCard, null, /* @__PURE__ */ React.createElement(ContentWrapper, null, /* @__PURE__ */ React.createElement(Heading, __spreadValues({}, {
    title,
    subtitle,
    currentStep,
    stepCount,
    stepStatus
  })), children)));
};
const Dialog = (_aa) => {
  var _ba = _aa, {
    children,
    onDismiss,
    open,
    variant = "closable"
  } = _ba, props = __objRest(_ba, [
    "children",
    "onDismiss",
    "open",
    "variant"
  ]);
  if (variant === "actionable") {
    const _a = props, {
      trailing,
      leading,
      title,
      subtitle,
      center
    } = _a, actionProps = __objRest(_a, [
      "trailing",
      "leading",
      "title",
      "subtitle",
      "center"
    ]);
    return /* @__PURE__ */ React.createElement(ModalWithTitle, __spreadProps(__spreadValues({}, actionProps), {
      open,
      subtitle,
      title,
      onDismiss
    }), children, (leading || trailing) && /* @__PURE__ */ React.createElement(Footer, __spreadValues({}, {
      leading,
      trailing,
      center
    })));
  } else if (variant === "closable") {
    const _b = props, {
      title,
      subtitle
    } = _b, closableProps = __objRest(_b, [
      "title",
      "subtitle"
    ]);
    return /* @__PURE__ */ React.createElement(ModalWithTitle, __spreadProps(__spreadValues({}, closableProps), {
      open,
      subtitle,
      title,
      onDismiss
    }), children, onDismiss && /* @__PURE__ */ React.createElement(IconCloseContainer$1, {
      as: ReactComponent$o,
      "data-testid": "close-icon",
      onClick: onDismiss
    }));
  }
  return /* @__PURE__ */ React.createElement(Modal, __spreadValues({}, {
    onDismiss,
    open
  }), /* @__PURE__ */ React.createElement(StyledCard, null, /* @__PURE__ */ React.createElement(ContentWrapper, null, children)));
};
Dialog.displayName = "Dialog";
Dialog.Footer = Footer;
Dialog.Heading = Heading;
const IconCloseContainer = styled.div(({
  theme
}) => css`
    position: absolute;
    top: ${theme.space["2.5"]};
    right: ${theme.space["2.5"]};
    height: ${theme.space["8"]};
    width: ${theme.space["8"]};
    opacity: ${theme.opacity["50"]};
    cursor: pointer;
    transition-property: all;
    transition-duration: ${theme.transitionDuration["150"]};
    transition-timing-function: ${theme.transitionTimingFunction["inOut"]};

    &:hover {
      opacity: ${theme.opacity["70"]};
    }
  `);
const Container = styled.div(({
  theme,
  $state,
  $top,
  $left,
  $right,
  $bottom,
  $mobile,
  $popped
}) => css`
    position: fixed;
    z-index: 10000;

    width: 92.5%;
    left: 3.75%;
    top: calc(100vh / 100 * 2.5);

    ${$popped && css`
      width: 95%;
      left: 2.5%;
      touch-action: none;
    `}

    ${!$mobile && css`
      max-width: ${theme.space["112"]};
      top: unset;
      left: unset;

      ${$top && `top: ${theme.space[$top]};`}
      ${$left && `left: ${theme.space[$left]};`}
      ${$right && `right: ${theme.space[$right]};`}
      ${$bottom && `bottom: ${theme.space[$bottom]};`}
    `}

    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    padding: ${theme.space["4.5"]};

    background: rgba(${theme.shadesRaw.background}, 0.8);
    box-shadow: ${theme.boxShadows["0.02"]};
    border: ${theme.borderWidths.px} solid ${theme.colors.foregroundSecondary};
    backdrop-filter: blur(16px);
    border-radius: ${theme.radii["2xLarge"]};

    transition: ${theme.transitionDuration["300"]} all
      ${theme.transitionTimingFunction.popIn};

    ${$state === "entered" ? css`
          opacity: 1;
          transform: translateY(0px);
        ` : css`
          opacity: 0;
          transform: translateY(-64px);
        `}
  `);
const Title = styled(Typography)(({
  theme
}) => css`
    line-height: ${theme.lineHeights.normal};
  `);
const DraggableContainer = styled.div(({
  theme
}) => css`
    width: 100%;
    display: flex;
    align-items: center;
    justify-content: center;
    padding-top: ${theme.space["3"]};
    margin-bottom: calc(-1 * ${theme.space["2"]});
  `);
const DraggableLine = styled.div(({
  theme
}) => css`
    width: ${theme.space["8"]};
    height: ${theme.space["1"]};
    border-radius: ${theme.radii["full"]};
    background: ${theme.colors.border};
  `);
const Draggable = () => /* @__PURE__ */ React.createElement(DraggableContainer, null, /* @__PURE__ */ React.createElement(DraggableLine, null));
const DesktopToast = (_ca) => {
  var _da = _ca, {
    onClose,
    title,
    description,
    top = "4",
    left,
    right = "4",
    bottom,
    state: state2,
    children
  } = _da, props = __objRest(_da, [
    "onClose",
    "title",
    "description",
    "top",
    "left",
    "right",
    "bottom",
    "state",
    "children"
  ]);
  return /* @__PURE__ */ React.createElement(Container, __spreadProps(__spreadValues({}, __spreadProps(__spreadValues({}, props), {
    "data-testid": getTestId(props, "toast-desktop")
  })), {
    $bottom: bottom,
    $left: left,
    $mobile: false,
    $right: right,
    $state: state2,
    $top: top
  }), /* @__PURE__ */ React.createElement(IconCloseContainer, {
    as: ReactComponent$o,
    "data-testid": "close-icon",
    onClick: () => onClose()
  }), /* @__PURE__ */ React.createElement(Title, {
    variant: "large",
    weight: "bold"
  }, title), /* @__PURE__ */ React.createElement(Typography, null, description), children && /* @__PURE__ */ React.createElement(ActionWrapper, null, children));
};
const ActionWrapper = styled.div(({
  theme
}) => css`
    margin-top: ${theme.space["3"]};
    width: 100%;
  `);
const TouchToast = (_ea) => {
  var _fa = _ea, {
    onClose,
    open,
    title,
    description,
    left,
    right = "4",
    bottom,
    state: state2,
    children,
    popped,
    setPopped
  } = _fa, props = __objRest(_fa, [
    "onClose",
    "open",
    "title",
    "description",
    "left",
    "right",
    "bottom",
    "state",
    "children",
    "popped",
    "setPopped"
  ]);
  const {
    space: space2
  } = useTheme();
  const ref = React.useRef(null);
  const [calcTop, setCalcTop] = React.useState(0.025 * window.innerHeight);
  const [touches, setTouches] = React.useState([]);
  React.useEffect(() => {
    if (open) {
      setCalcTop(0.025 * window.innerHeight);
    }
  }, [open]);
  React.useEffect(() => {
    var _a;
    const originalTop = 0.025 * window.innerHeight;
    if (touches.length && !popped) {
      let didEnd = false;
      let lastTouch = touches[touches.length - 1];
      if (lastTouch === void 0) {
        lastTouch = touches[touches.length - 2] || 0;
        didEnd = true;
      }
      const fontSize = parseInt(getComputedStyle(document.documentElement).fontSize);
      const difference = touches[0] - lastTouch;
      if (didEnd) {
        if (parseFloat(space2["8"]) * fontSize > (((_a = ref.current) == null ? void 0 : _a.offsetHeight) || 0) - difference) {
          onClose();
        } else {
          setCalcTop(originalTop);
          setTouches([]);
        }
      } else {
        if (difference * -1 > parseFloat(space2["32"]) * fontSize) {
          setCalcTop(originalTop * 2);
          setPopped(true);
        } else if (difference > 0) {
          setCalcTop(originalTop - difference);
        } else {
          const parabolised = 0.25 * (difference ^ 2);
          setCalcTop(originalTop - parabolised);
        }
      }
    }
  }, [touches]);
  const onTouchStart = React.useCallback((e) => {
    var _a;
    e.preventDefault();
    setTouches([(_a = e.targetTouches.item(0)) == null ? void 0 : _a.pageY]);
  }, []);
  const onTouchMove = React.useCallback((e) => {
    e.preventDefault();
    setTouches((touches2) => {
      var _a;
      return [...touches2, (_a = e.targetTouches.item(0)) == null ? void 0 : _a.pageY];
    });
  }, []);
  React.useEffect(() => {
    const componentRef = ref.current;
    componentRef == null ? void 0 : componentRef.addEventListener("touchstart", onTouchStart, {
      passive: false,
      capture: false
    });
    componentRef == null ? void 0 : componentRef.addEventListener("touchmove", onTouchMove, {
      passive: false,
      capture: false
    });
    return () => {
      componentRef == null ? void 0 : componentRef.removeEventListener("touchstart", onTouchStart, {
        capture: false
      });
      componentRef == null ? void 0 : componentRef.removeEventListener("touchmove", onTouchMove, {
        capture: false
      });
    };
  }, []);
  React.useEffect(() => {
    const componentRef = ref.current;
    if (popped) {
      componentRef == null ? void 0 : componentRef.removeEventListener("touchstart", onTouchStart, {
        capture: false
      });
      componentRef == null ? void 0 : componentRef.removeEventListener("touchmove", onTouchMove, {
        capture: false
      });
    }
  }, [popped]);
  return /* @__PURE__ */ React.createElement(Container, __spreadProps(__spreadValues({}, __spreadProps(__spreadValues({}, props), {
    "data-testid": getTestId(props, "toast-touch"),
    style: {
      top: `${calcTop}px`
    },
    onClick: () => setPopped(true),
    onTouchEnd: () => setTouches((touches2) => [...touches2, void 0])
  })), {
    $bottom: bottom,
    $left: left,
    $mobile: true,
    $popped: popped,
    $right: right,
    $state: state2,
    ref
  }), /* @__PURE__ */ React.createElement(Title, {
    variant: "large",
    weight: "bold"
  }, title), /* @__PURE__ */ React.createElement(Typography, null, description), popped && /* @__PURE__ */ React.createElement(React.Fragment, null, children && /* @__PURE__ */ React.createElement(ActionWrapper, null, children), /* @__PURE__ */ React.createElement(IconCloseContainer, {
    as: ReactComponent$o,
    "data-testid": "close-icon",
    onClick: (e) => {
      e.stopPropagation();
      onClose();
    }
  })), !popped && /* @__PURE__ */ React.createElement(Draggable, null));
};
const Toast = (_ga) => {
  var _ha = _ga, {
    onClose,
    open,
    msToShow = 8e3,
    variant = "desktop"
  } = _ha, props = __objRest(_ha, [
    "onClose",
    "open",
    "msToShow",
    "variant"
  ]);
  const [popped, setPopped] = React.useState(false);
  const currentTimeout = React.useRef();
  React.useEffect(() => {
    if (open) {
      setPopped(false);
      currentTimeout.current = setTimeout(() => onClose(), msToShow || 8e3);
      return () => {
        clearTimeout(currentTimeout.current);
        onClose();
      };
    }
  }, [open]);
  React.useEffect(() => {
    if (popped) {
      clearTimeout(currentTimeout.current);
    }
  }, [popped]);
  return /* @__PURE__ */ React.createElement(Backdrop, {
    className: "toast",
    noBackground: true,
    open,
    onDismiss: variant === "touch" && popped ? () => onClose() : void 0
  }, ({
    state: state2
  }) => variant === "touch" ? /* @__PURE__ */ React.createElement(TouchToast, __spreadProps(__spreadValues({}, props), {
    open,
    popped,
    setPopped,
    state: state2,
    onClose
  })) : /* @__PURE__ */ React.createElement(DesktopToast, __spreadProps(__spreadValues({}, props), {
    open,
    state: state2,
    onClose
  })));
};
Toast.displayName = "Toast";
const ReactComponent$K = (_ia) => {
  var _ja = _ia, {
    title,
    titleId
  } = _ja, props = __objRest(_ja, [
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
const ReactComponent$J = (_ka) => {
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
    d: "M14 5l7 7m0 0l-7 7m7-7H3"
  }));
};
const ReactComponent$I = (_ma) => {
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
    d: "M5 10l7-7m0 0l7 7m-7-7v18"
  }));
};
const ReactComponent$H = (_oa) => {
  var _pa = _oa, {
    title,
    titleId
  } = _pa, props = __objRest(_pa, [
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
const ReactComponent$G = (_qa) => {
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
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M12 24C15.1826 24 18.2348 22.7357 20.4853 20.4853C22.7357 18.2348 24 15.1826 24 12C24 8.8174 22.7357 5.76516 20.4853 3.51472C18.2348 1.26428 15.1826 0 12 0C8.8174 0 5.76516 1.26428 3.51472 3.51472C1.26428 5.76516 0 8.8174 0 12C0 15.1826 1.26428 18.2348 3.51472 20.4853C5.76516 22.7357 8.8174 24 12 24ZM10.0605 7.9395C9.7776 7.66626 9.39869 7.51507 9.0054 7.51849C8.6121 7.52191 8.23588 7.67966 7.95777 7.95777C7.67966 8.23588 7.52191 8.6121 7.51849 9.0054C7.51507 9.39869 7.66626 9.7776 7.9395 10.0605L9.879 12L7.9395 13.9395C7.79624 14.0779 7.68196 14.2434 7.60335 14.4264C7.52473 14.6094 7.48336 14.8062 7.48162 15.0054C7.47989 15.2046 7.51785 15.4021 7.59327 15.5864C7.66869 15.7708 7.78007 15.9383 7.92091 16.0791C8.06175 16.2199 8.22922 16.3313 8.41357 16.4067C8.59791 16.4822 8.79543 16.5201 8.9946 16.5184C9.19377 16.5166 9.3906 16.4753 9.57361 16.3967C9.75661 16.318 9.92213 16.2038 10.0605 16.0605L12 14.121L13.9395 16.0605C14.2224 16.3337 14.6013 16.4849 14.9946 16.4815C15.3879 16.4781 15.7641 16.3203 16.0422 16.0422C16.3203 15.7641 16.4781 15.3879 16.4815 14.9946C16.4849 14.6013 16.3337 14.2224 16.0605 13.9395L14.121 12L16.0605 10.0605C16.3337 9.7776 16.4849 9.39869 16.4815 9.0054C16.4781 8.6121 16.3203 8.23588 16.0422 7.95777C15.7641 7.67966 15.3879 7.52191 14.9946 7.51849C14.6013 7.51507 14.2224 7.66626 13.9395 7.9395L12 9.879L10.0605 7.9395Z",
    fill: "currentColor"
  }));
};
const ReactComponent$F = (_sa) => {
  var _ta = _sa, {
    title,
    titleId
  } = _ta, props = __objRest(_ta, [
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
const ReactComponent$E = (_ua) => {
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
    d: "M19 9l-7 7-7-7"
  }));
};
const ReactComponent$D = (_wa) => {
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
    d: "M15 19l-7-7 7-7"
  }));
};
const ReactComponent$C = (_ya) => {
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
    d: "M9 5l7 7-7 7"
  }));
};
const ReactComponent$B = (_Aa) => {
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
    d: "M5 15l7-7 7 7"
  }));
};
const ReactComponent$A = (_Ca) => {
  var _Da = _Ca, {
    title,
    titleId
  } = _Da, props = __objRest(_Da, [
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
const ReactComponent$z = (_Ea) => {
  var _Fa = _Ea, {
    title,
    titleId
  } = _Fa, props = __objRest(_Fa, [
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
const ReactComponent$y = (_Ga) => {
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
    d: "M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
  }), /* @__PURE__ */ React.createElement("path", {
    strokeLinecap: "round",
    strokeLinejoin: "round",
    d: "M15 12a3 3 0 11-6 0 3 3 0 016 0z"
  }));
};
const ReactComponent$x = (_Ia) => {
  var _Ja = _Ia, {
    title,
    titleId
  } = _Ja, props = __objRest(_Ja, [
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
const ReactComponent$w = (_Ka) => {
  var _La = _Ka, {
    title,
    titleId
  } = _La, props = __objRest(_La, [
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
const ReactComponent$v = (_Ma) => {
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
    d: "M7 21h10a2 2 0 002-2V9.414a1 1 0 00-.293-.707l-5.414-5.414A1 1 0 0012.586 3H7a2 2 0 00-2 2v14a2 2 0 002 2z"
  }));
};
const ReactComponent$u = (_Oa) => {
  var _Pa = _Oa, {
    title,
    titleId
  } = _Pa, props = __objRest(_Pa, [
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
const ReactComponent$t = (_Qa) => {
  var _Ra = _Qa, {
    title,
    titleId
  } = _Ra, props = __objRest(_Ra, [
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
const ReactComponent$s = (_Sa) => {
  var _Ta = _Sa, {
    title,
    titleId
  } = _Ta, props = __objRest(_Ta, [
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
const ReactComponent$r = (_Ua) => {
  var _Va = _Ua, {
    title,
    titleId
  } = _Va, props = __objRest(_Va, [
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
const ReactComponent$q = (_Wa) => {
  var _Xa = _Wa, {
    title,
    titleId
  } = _Xa, props = __objRest(_Xa, [
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
const ReactComponent$p = (_Ya) => {
  var _Za = _Ya, {
    title,
    titleId
  } = _Za, props = __objRest(_Za, [
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
const ReactComponent$o = (__a) => {
  var _$a = __a, {
    title,
    titleId
  } = _$a, props = __objRest(_$a, [
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
    rx: 12,
    fill: "currentColor",
    fillOpacity: 0.15
  }), /* @__PURE__ */ React.createElement("path", {
    fillRule: "evenodd",
    clipRule: "evenodd",
    d: "M7.15726 7.17299C7.31622 7.01408 7.53178 6.92481 7.75654 6.92481C7.9813 6.92481 8.19686 7.01408 8.35581 7.17299L11.9947 10.8119L15.6336 7.17299C15.7118 7.09203 15.8053 7.02746 15.9087 6.98303C16.0121 6.93861 16.1234 6.91523 16.2359 6.91425C16.3485 6.91327 16.4601 6.93472 16.5642 6.97734C16.6684 7.01995 16.7631 7.08289 16.8426 7.16248C16.9222 7.24207 16.9852 7.33671 17.0278 7.44088C17.0704 7.54505 17.0919 7.65666 17.0909 7.76921C17.0899 7.88176 17.0665 7.99299 17.0221 8.0964C16.9777 8.19982 16.9131 8.29335 16.8321 8.37154L13.1932 12.0104L16.8321 15.6493C16.9865 15.8092 17.072 16.0233 17.07 16.2455C17.0681 16.4678 16.979 16.6804 16.8218 16.8375C16.6647 16.9947 16.4521 17.0838 16.2298 17.0858C16.0076 17.0877 15.7934 17.0023 15.6336 16.8479L11.9947 13.209L8.35581 16.8479C8.19595 17.0023 7.98184 17.0877 7.75959 17.0858C7.53734 17.0838 7.32475 16.9947 7.16759 16.8375C7.01043 16.6804 6.92129 16.4678 6.91935 16.2455C6.91742 16.0233 7.00286 15.8092 7.15726 15.6493L10.7961 12.0104L7.15726 8.37154C6.99836 8.21258 6.90909 7.99702 6.90909 7.77226C6.90909 7.5475 6.99836 7.33194 7.15726 7.17299V7.17299Z",
    fill: "currentColor"
  }));
};
const ReactComponent$n = (_ab) => {
  var _bb = _ab, {
    title,
    titleId
  } = _bb, props = __objRest(_bb, [
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
const ReactComponent$m = (_cb) => {
  var _db = _cb, {
    title,
    titleId
  } = _db, props = __objRest(_db, [
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
const ReactComponent$l = (_eb) => {
  var _fb = _eb, {
    title,
    titleId
  } = _fb, props = __objRest(_fb, [
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
const ReactComponent$k = (_gb) => {
  var _hb = _gb, {
    title,
    titleId
  } = _hb, props = __objRest(_hb, [
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
const ReactComponent$j = (_ib) => {
  var _jb = _ib, {
    title,
    titleId
  } = _jb, props = __objRest(_jb, [
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
const ReactComponent$i = (_kb) => {
  var _lb = _kb, {
    title,
    titleId
  } = _lb, props = __objRest(_lb, [
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
const ReactComponent$h = (_mb) => {
  var _nb = _mb, {
    title,
    titleId
  } = _nb, props = __objRest(_nb, [
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
const ReactComponent$g = (_ob) => {
  var _pb = _ob, {
    title,
    titleId
  } = _pb, props = __objRest(_pb, [
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
const ReactComponent$f = (_qb) => {
  var _rb = _qb, {
    title,
    titleId
  } = _rb, props = __objRest(_rb, [
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
const ReactComponent$e = (_sb) => {
  var _tb = _sb, {
    title,
    titleId
  } = _tb, props = __objRest(_tb, [
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
const ReactComponent$d = (_ub) => {
  var _vb = _ub, {
    title,
    titleId
  } = _vb, props = __objRest(_vb, [
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
const ReactComponent$c = (_wb) => {
  var _xb = _wb, {
    title,
    titleId
  } = _xb, props = __objRest(_xb, [
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
const ReactComponent$b = (_yb) => {
  var _zb = _yb, {
    title,
    titleId
  } = _zb, props = __objRest(_zb, [
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
const ReactComponent$a = (_Ab) => {
  var _Bb = _Ab, {
    title,
    titleId
  } = _Bb, props = __objRest(_Bb, [
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
const ReactComponent$9 = (_Cb) => {
  var _Db = _Cb, {
    title,
    titleId
  } = _Db, props = __objRest(_Db, [
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
const ReactComponent$8 = (_Eb) => {
  var _Fb = _Eb, {
    title,
    titleId
  } = _Fb, props = __objRest(_Fb, [
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
const ReactComponent$7 = (_Gb) => {
  var _Hb = _Gb, {
    title,
    titleId
  } = _Hb, props = __objRest(_Hb, [
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
const ReactComponent$6 = (_Ib) => {
  var _Jb = _Ib, {
    title,
    titleId
  } = _Jb, props = __objRest(_Jb, [
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
const ReactComponent$5 = (_Kb) => {
  var _Lb = _Kb, {
    title,
    titleId
  } = _Lb, props = __objRest(_Lb, [
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
const ReactComponent$4 = (_Mb) => {
  var _Nb = _Mb, {
    title,
    titleId
  } = _Nb, props = __objRest(_Nb, [
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
const ReactComponent$3 = (_Ob) => {
  var _Pb = _Ob, {
    title,
    titleId
  } = _Pb, props = __objRest(_Pb, [
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
const ReactComponent$2 = (_Qb) => {
  var _Rb = _Qb, {
    title,
    titleId
  } = _Rb, props = __objRest(_Rb, [
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
const ReactComponent$1 = (_Sb) => {
  var _Tb = _Sb, {
    title,
    titleId
  } = _Tb, props = __objRest(_Tb, [
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
const ReactComponent = (_Ub) => {
  var _Vb = _Ub, {
    title,
    titleId
  } = _Vb, props = __objRest(_Vb, [
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
var index = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  Avatar,
  BackdropSurface,
  Button,
  Card,
  DynamicPopover,
  Field,
  FileInput,
  Heading: Heading$1,
  Portal,
  ScrollBox,
  Skeleton,
  Spinner,
  Tag,
  Typography,
  VisuallyHidden,
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
  Dialog,
  Toast,
  ArrowCircleSVG: ReactComponent$K,
  ArrowRightSVG: ReactComponent$J,
  ArrowUpSVG: ReactComponent$I,
  BookOpenSVG: ReactComponent$H,
  CancelCircleSVG: ReactComponent$G,
  CheckSVG: ReactComponent$F,
  ChevronDownSVG: ReactComponent$E,
  ChevronLeftSVG: ReactComponent$D,
  ChevronRightSVG: ReactComponent$C,
  ChevronUpSVG: ReactComponent$B,
  CloseSVG: ReactComponent$A,
  CodeSVG: ReactComponent$z,
  CogSVG: ReactComponent$y,
  CollectionSVG: ReactComponent$x,
  CopySVG: ReactComponent$w,
  DocumentsSVG: ReactComponent$v,
  DotsVerticalSVG: ReactComponent$u,
  DownIndicatorSVG: ReactComponent$L,
  DuplicateSVG: ReactComponent$t,
  EthSVG: ReactComponent$s,
  EthTransparentSVG: ReactComponent$r,
  EthTransparentInvertedSVG: ReactComponent$q,
  ExclamationSVG: ReactComponent$p,
  ExitSVG: ReactComponent$o,
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
const GlobalStyle = createGlobalStyle(({
  theme
}) => css`
    *,
    ::before,
    ::after {
      box-sizing: border-box;
      margin: 0;
      padding: 0;
      font-family: ${theme.fonts["sans"]};
      border-color: ${theme.colors.foregroundSecondary};
      border-style: ${theme.borderStyles["solid"]};
      border-width: 0;
      color: ${theme.colors.current};
      font-size: 100%;
      font-feature-settings: 'ss01' on, 'ss03' on;
      vertical-align: baseline;
    }

    [data-js-focus-visible] &:focus:not([data-focus-visible-added]) {
      outline: none;
    }

    html {
      font-size: ${theme.fontSizes["root"]};
      color: ${theme.colors.foreground};
      text-rendering: optimizeLegibility;
      background: radial-gradient(
          40.48% 67.6% at 50% 32.4%,
          #ecf4ff 0%,
          #f7f7ff 52.77%,
          #f7f7f7 100%
        ),
        #ffffff;
    }

    body {
      line-height: ${theme.lineHeights.none};
    }

    article,
    aside,
    details,
    div,
    figcaption,
    figure,
    footer,
    header,
    hgroup,
    menu,
    nav,
    section {
      display: block;
    }

    ul,
    ol {
      list-style: none;
    }

    blockquote {
      quotes: none;

      &::before,
      &::after {
        content: '';
      }
    }

    table {
      border-collapse: collapse;
      border-spacing: 0;
    }

    fieldset {
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
  `);
export { ReactComponent$K as ArrowCircleSVG, ReactComponent$J as ArrowRightSVG, ReactComponent$I as ArrowUpSVG, Avatar, Backdrop, BackdropSurface, ReactComponent$H as BookOpenSVG, Button, ReactComponent$G as CancelCircleSVG, Card, ReactComponent$F as CheckSVG, Checkbox, ReactComponent$E as ChevronDownSVG, ReactComponent$D as ChevronLeftSVG, ReactComponent$C as ChevronRightSVG, ReactComponent$B as ChevronUpSVG, ReactComponent$A as CloseSVG, ReactComponent$z as CodeSVG, ReactComponent$y as CogSVG, ReactComponent$x as CollectionSVG, index as Components, ReactComponent$w as CopySVG, CountdownCircle, Dialog, ReactComponent$v as DocumentsSVG, ReactComponent$u as DotsVerticalSVG, ReactComponent$L as DownIndicatorSVG, Dropdown, ReactComponent$t as DuplicateSVG, DynamicPopover, ReactComponent$s as EthSVG, ReactComponent$q as EthTransparentInvertedSVG, ReactComponent$r as EthTransparentSVG, ReactComponent$p as ExclamationSVG, ReactComponent$o as ExitSVG, Field, FieldSet, FileInput, ReactComponent$n as FlagSVG, ReactComponent$m as GradientSVG, ReactComponent$l as GridSVG, ReactComponent$k as GridSolidSVG, ReactComponent$j as HandSVG, Heading$1 as Heading, Input$1 as Input, ReactComponent$i as LinkSVG, ReactComponent$h as ListSVG, ReactComponent$g as LockClosedSVG, ReactComponent$f as LogoSVG, ReactComponent$e as MenuSVG, Modal, ReactComponent$d as MoonSVG, PageButtons, ReactComponent$c as PencilSVG, ReactComponent$b as PlusSVG, ReactComponent$a as PlusSmallSVG, Portal, Profile, RadioButton, RadioButtonGroup, ReactComponent$9 as RefreshSVG, ScrollBox, ReactComponent$8 as SearchSVG, Select, Skeleton, SkeletonGroup, Spinner, ReactComponent$7 as SplitSVG, ReactComponent$6 as SunSVG, Tag, Textarea, GlobalStyle as ThorinGlobalStyles, Toast, ReactComponent$5 as TokensSVG, Tooltip, ReactComponent$4 as TrendingUpSVG, Typography, ReactComponent$3 as UploadSVG, ReactComponent$2 as UserSolidSVG, ReactComponent$1 as UsersSolidSVG, VisuallyHidden, ReactComponent as WalletSVG, baseTheme, darkTheme, lightTheme, mq, tokens };
