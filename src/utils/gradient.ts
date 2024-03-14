import { Hex, hexToBytes } from 'viem'
import { namehash } from 'viem/ens'

import { emptyAddress } from './constants'

// original: https://github.com/ourzora/zorb/blob/main/packages/zorb-web-component/src

type HSL = {
  h: number
  s: number
  l: number
}

const linear = (p: number) => p

const cubicInOut = (p: number) => {
  const m = p - 1
  const t = p * 2
  if (t < 1) return p * t * t
  return 1 + m * m * m * 4
}

const cubicIn = (p: number) => {
  return p * p * p
}

const quintIn = (p: number) => {
  return p * p * p * p * p
}

const bscale = (byte: number, max: number) => Math.round((byte / 255) * max)

// Util for keeping hue range in 0-360 positive
const clampHue = (h: number) => {
  if (h >= 0) {
    return h % 360.0
  }
  return 360 + (h % 360)
}

// scale byte in range min and max
const bScaleRange = (byte: number, min: number, max: number) => {
  return bscale(byte, max - min) + min
}

export const lerpHueFn = (optionNum: number, direction: number) => {
  const option = optionNum % 4
  const multiplier = direction ? 1 : -1
  switch (option) {
    case 0: {
      return (hue: number, pct: number) => {
        const endHue = hue + multiplier * 10
        return clampHue(linear(1.0 - pct) * hue + linear(pct) * endHue)
      }
    }
    case 1: {
      return (hue: number, pct: number) => {
        const endHue = hue + multiplier * 30
        return clampHue(linear(1.0 - pct) * hue + linear(pct) * endHue)
      }
    }
    case 2: {
      return (hue: number, pct: number) => {
        const endHue = hue + multiplier * 50
        const lerpPercent = cubicInOut(pct)
        return clampHue(linear(1.0 - lerpPercent) * hue + lerpPercent * endHue)
      }
    }
    case 3:
    default: {
      return (hue: number, pct: number) => {
        const endHue = hue + multiplier * 60 * bscale(optionNum, 1.0) + 30
        const lerpPercent = cubicInOut(pct)
        return clampHue((1.0 - lerpPercent) * hue + lerpPercent * endHue)
      }
    }
  }
}

const lerpLightnessFn = (optionNum: number) => {
  switch (optionNum) {
    case 0: {
      return (start: number, end: number, pct: number) => {
        const lerpPercent = quintIn(pct)
        return (1.0 - lerpPercent) * start + lerpPercent * end
      }
    }
    case 1:
    default: {
      return (start: number, end: number, pct: number) => {
        const lerpPercent = cubicIn(pct)
        return (1.0 - lerpPercent) * start + lerpPercent * end
      }
    }
  }
}

const lerpSaturationFn = (optionNum: number) => {
  switch (optionNum) {
    case 0: {
      return (start: number, end: number, pct: number) => {
        const lerpPercent = quintIn(pct)
        return (1.0 - lerpPercent) * start + lerpPercent * end
      }
    }
    case 1:
    default: {
      return (start: number, end: number, pct: number) => {
        const lerpPercent = linear(pct)
        return (1.0 - lerpPercent) * start + lerpPercent * end
      }
    }
  }
}

export const gradientForBytes = (address: Hex | '') => {
  const bytes = hexToBytes(address === '' ? emptyAddress : address).reverse()
  const hueShiftFn = lerpHueFn(bytes[3], bytes[6] % 2)
  const startHue = bscale(bytes[12], 360)
  const startLightness = bScaleRange(bytes[2], 32, 69.5)
  const endLightness = (97 + bScaleRange(bytes[8], 72, 97)) / 2
  const startSaturation = bScaleRange(bytes[7], 81, 97)
  const endSaturation = Math.min(startSaturation - 10, bScaleRange(bytes[10], 70, 92))

  const lightnessShiftFn = lerpLightnessFn(bytes[5] % 2)
  const saturationShiftFn = lerpSaturationFn(bytes[3] % 2)
  const inputs: HSL[] = [
    {
      h: hueShiftFn(startHue, 0),
      s: saturationShiftFn(startSaturation, endSaturation, 1),
      l: lightnessShiftFn(startLightness, endLightness, 1),
    },
    {
      h: hueShiftFn(startHue, 0.1),
      s: saturationShiftFn(startSaturation, endSaturation, 0.9),
      l: lightnessShiftFn(startLightness, endLightness, 0.9),
    },
    {
      h: hueShiftFn(startHue, 0.7),
      s: saturationShiftFn(startSaturation, endSaturation, 0.7),
      l: lightnessShiftFn(startLightness, endLightness, 0.7),
    },
    {
      h: hueShiftFn(startHue, 0.9),
      s: saturationShiftFn(startSaturation, endSaturation, 0.2),
      l: lightnessShiftFn(startLightness, endLightness, 0.2),
    },
    {
      h: hueShiftFn(startHue, 1),
      s: saturationShiftFn(startSaturation, endSaturation, 0),
      l: startLightness,
    },
  ]

  return inputs.map(
    (input: HSL) => `hsl(${Math.round(input.h)}, ${Math.round(input.s)}%, ${Math.round(input.l)}%)`,
  )
}

export const zorbImageSVG = (input: string, type: 'name' | 'address' | 'hash') => {
  const bytes: Hex = type === 'name' ? namehash(input) : (input as Hex)
  const gradientInfo = gradientForBytes(bytes)
  return `
  <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 110 110">
    <defs>
      <linearGradient id="gzr" x1="106.975" y1="136.156" x2="-12.9815" y2="13.5347" gradientUnits="userSpaceOnUse">
        gradientTransform="translate(131.638 129.835) rotate(-141.194) scale(185.582)">
        <stop offset="0.1562" stop-color="${gradientInfo[0]}" />
        <stop offset="0.3958" stop-color="${gradientInfo[1]}" />
        <stop offset="0.7292" stop-color="${gradientInfo[2]}" />
        <stop offset="0.9063" stop-color="${gradientInfo[3]}" />
        <stop offset="1" stop-color="${gradientInfo[4]}" />
      </linearGradient>
    </defs>
    <path
      d="M110 55C110 24.6244 85.3756 0 55 0C24.6244 0 0 24.6244 0 55C0 85.3756 24.6244 110 55 110C85.3756 110 110 85.3756 110 55Z"
      fill="url(#gzr)" />
  </svg>
    `
}

type EnsOutlineColours = {
  bg: string
  fg: string
  accent: string
}

const makeEnsOutlineIcon = ({ bg, fg, accent }: EnsOutlineColours) => `
<svg viewBox="0 0 2048 2048" fill="none" xmlns="http://www.w3.org/2000/svg">
  <rect width="2048" height="2048" fill="${bg}" />
  <path d="M579.269 668.355c12.569-23.334 30.709-43.227 52.82-57.924l371.071-258.175-380.208 626.405s-33.22-55.935-46.176-84.238c-16.145-35.586-24.287-74.257-23.857-113.308.43-39.051 9.424-77.535 26.35-112.76ZM426.123 1100.47c4.189 59.9 21.176 118.22 49.822 171.05 28.646 52.84 68.29 98.96 116.279 135.28l410.436 285.16s-256.793-368.73-473.388-735.638c-21.929-38.765-36.67-81.146-43.519-125.117-3.032-19.91-3.032-40.165 0-60.076-5.648 10.429-16.61 31.777-16.61 31.777-21.962 44.626-36.919 92.348-44.349 141.5-4.277 51.954-3.832 104.184 1.329 156.064Zm1046.437 49.65c-13.29-28.3-46.18-84.24-46.18-84.24l-379.54 626.08 371.07-258.02c22.11-14.69 40.25-34.58 52.82-57.92 16.93-35.22 25.92-73.71 26.35-112.76.43-39.05-7.71-77.72-23.86-113.31l-.66.17Zm150.65-206.213c-4.19-59.9-21.17-118.223-49.82-171.053-28.65-52.831-68.29-98.954-116.28-135.281l-409.77-285.317s256.63 368.727 473.39 735.634c21.87 38.78 36.55 81.16 43.35 125.12 3.03 19.91 3.03 40.16 0 60.07 5.65-10.43 16.61-31.78 16.61-31.78 21.96-44.62 36.92-92.34 44.35-141.5 4.33-51.95 3.94-104.177-1.16-156.057l-.67.164Z" fill="${accent}" stroke="${fg}" stroke-width="16" stroke-dasharray="48" />
</svg>
`

export const makeBase64Svg = (svg: string) => {
  return `data:image/svg+xml;base64,${btoa(svg)}`
}

export const zorbImageDataURI = (
  input: string,
  type: 'name' | 'address' | 'hash',
  colours: EnsOutlineColours,
) => {
  // root icon
  if (type === 'name' && input === '[root]') {
    return makeBase64Svg(makeEnsOutlineIcon(colours))
  }
  return makeBase64Svg(zorbImageSVG(input, type))
}
