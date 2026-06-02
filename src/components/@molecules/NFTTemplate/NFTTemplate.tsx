import { ReactNode, useMemo } from 'react'
import styled, { css } from 'styled-components'

import { useGetSegmentLength } from '../../../hooks/useGetSegmentLength'

type Props = {
  name: string
  backgroundImage: string | undefined | null
  isNormalised: boolean
}

const MAX_CHAR = 60
const bgProps = { width: '270', height: '270' }

const getEllipsis = (str: string) => {
  const len = str.length
  return `${str.substring(0, MAX_CHAR - 7)}...${str.substring(len - 7, len - 4)}.eth`
}

const getFontSize = (str: string) => {
  const canvas = document.createElement('canvas')
  canvas.width = 270
  canvas.height = 270
  const ctx = canvas.getContext('2d')!
  ctx.font =
    'normal normal bold 20px normal Satoshi, Noto Color Emoji, Apple Color Emoji, sans-serif'
  const fontMetrics = ctx.measureText(str)
  const fontSize = Math.floor(20 * (200 / fontMetrics.width))
  return fontSize < 34 ? fontSize : 32
}

const addSpan = (str: string, inx: number) => (
  <>
    <tspan x="32" dy="-1.2em">
      {str.substring(0, inx)}
    </tspan>
    <tspan x="32" dy="1.2em">
      {str.substring(inx, str.length)}
    </tspan>
  </>
)

const Text = styled.text(
  () => css`
    font-family: Satoshi, 'Noto Color Emoji', 'Apple Color Emoji', sans-serif;
    font-style: normal;
    font-variant-numeric: tabular-nums;
    font-weight: bold;
    font-variant-ligatures: none;
    font-feature-settings:
      'ss01' on,
      'ss03' on;
    line-height: 34px;
  `,
)

const NFTTemplate = ({ name, backgroundImage, isNormalised }: Props) => {
  const { getSegmentLength } = useGetSegmentLength()

  const elementData = useMemo(() => {
    const labels = name.split('.')
    const isSubdomain = labels.length > 2

    let subdomainText
    let domain
    let subdomain
    let domainFontSize
    let subdomainFontSize
    if (isSubdomain && !name.includes('...')) {
      subdomain = `${labels.slice(0, labels.length - 2).join('.')}.`
      domain = labels.slice(-2).join('.')
      if (getSegmentLength(subdomain) > MAX_CHAR) {
        subdomain = getEllipsis(subdomain)
      }
      subdomainFontSize = getFontSize(subdomain)
      subdomainText = (
        <text x="32.5" y="200" fontSize={`${subdomainFontSize}px`} fill="white">
          {subdomain}
        </text>
      )
    } else {
      domain = name
    }
    let charSegmentLength = getSegmentLength(domain)
    if (charSegmentLength > MAX_CHAR) {
      domain = getEllipsis(domain)
      domainFontSize = getFontSize(domain)
      charSegmentLength = MAX_CHAR
    } else {
      domainFontSize = getFontSize(domain)
    }
    if (charSegmentLength > 25) {
      domain = addSpan(domain, charSegmentLength / 2)
      domainFontSize *= 2
    }
    return { domainFontSize, subdomainText, isSubdomain, domain }
  }, [name, getSegmentLength])
  const { domainFontSize, subdomainText, isSubdomain, domain } = elementData

  let background: ReactNode

  if (backgroundImage) {
    background = (
      <>
        <defs>
          <pattern
            id="backImg"
            data-testid="nft-back-img"
            patternUnits="userSpaceOnUse"
            x="0"
            y="0"
            {...bgProps}
          >
            <image href={backgroundImage} {...bgProps} />
          </pattern>
        </defs>
        <rect {...bgProps} fill="url(#backImg)" />
        <rect {...bgProps} fill="#000" fillOpacity=".12" />
      </>
    )
  } else if (isNormalised) {
    background = <rect fill="url(#paint0_linear)" {...bgProps} />
  } else {
    background = <rect fill="url(#paint1_linear)" {...bgProps} />
  }

  return (
    <svg viewBox="0 0 270 270" display="block" fill="none" xmlns="http://www.w3.org/2000/svg">
      {background}
      <defs>
        <filter
          id="dropShadow"
          colorInterpolationFilters="sRGB"
          filterUnits="userSpaceOnUse"
          height="270"
          width="270"
        >
          <feDropShadow
            dx="0"
            dy="1"
            stdDeviation="2"
            floodOpacity="0.225"
            width="200%"
            height="200%"
          />
        </filter>
      </defs>
      {/* SimpleX brand mark — swapped in for the ENS four-diamond glyph.
          Source: SocialSimplex.svg (single-path 0..34 viewBox). Translated
          to the same upper-left corner as the original ENS mark and scaled
          to a comparable footprint. White fill + drop-shadow to read on
          both the blue/red gradient backgrounds. */}
      <g transform="translate(33 33) scale(1.4)" filter="url(#dropShadow)">
        <path
          fill="white"
          fillRule="evenodd"
          clipRule="evenodd"
          d="M3.02972 8.59396L8.62219 14.186L14.3703 8.43848L17.1668 11.2346L11.4182 16.982L17.0112 22.5742L14.1371 25.448L8.5441 19.8557L2.79651 25.6035L0 22.8074L5.74813 17.0597L0.155656 11.4678L3.02972 8.59396Z M14.0922 25.5L16.9434 22.6486L16.9423 22.6478L22.6464 16.9456L17.0512 11.3519L17.0518 11.3514L14.2542 8.55418L8.65961 2.95973L11.5114 0.108337L17.106 5.70288L22.8095 0L25.607 2.79722L19.903 8.5L25.4981 14.0943L31.2022 8.39169L33.9997 11.1889L28.2957 16.8914L33.8914 22.4861L31.0396 25.3375L25.4439 19.7428L19.7404 25.4454L25.3361 31.0403L22.4843 33.8917L16.8887 28.2968L11.1862 34L8.38867 31.2028L14.0922 25.5Z"
        />
      </g>
      {!isNormalised && (
        <>
          <rect x="200" y="34" width="40" height="40" rx="20" fill="white" fillOpacity="0.2" />
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M217.472 44.4655C218.581 42.5115 221.42 42.5115 222.528 44.4655L230.623 58.7184C231.711 60.6351 230.314 63 228.096 63H211.905C209.686 63 208.289 60.6351 209.377 58.7184L217.472 44.4655ZM221.451 58.6911C221.451 59.0722 221.298 59.4376 221.026 59.7071C220.754 59.9765 220.385 60.1279 220 60.1279C219.615 60.1279 219.246 59.9765 218.974 59.7071C218.702 59.4376 218.549 59.0722 218.549 58.6911C218.549 58.31 218.702 57.9446 218.974 57.6751C219.246 57.4057 219.615 57.2543 220 57.2543C220.385 57.2543 220.754 57.4057 221.026 57.6751C221.298 57.9446 221.451 58.31 221.451 58.6911V58.6911ZM220 47.1968C219.615 47.1968 219.246 47.3482 218.974 47.6177C218.702 47.8871 218.549 48.2526 218.549 48.6336V52.944C218.549 53.325 218.702 53.6905 218.974 53.9599C219.246 54.2294 219.615 54.3807 220 54.3807C220.385 54.3807 220.754 54.2294 221.026 53.9599C221.298 53.6905 221.451 53.325 221.451 52.944V48.6336C221.451 48.2526 221.298 47.8871 221.026 47.6177C220.754 47.3482 220.385 47.1968 220 47.1968Z"
            fill="white"
          />
          <path
            opacity="0.6"
            d="M36.791 196V183.947H34.411V196H36.791ZM41.6133 191.189C41.6133 190.22 42.1913 189.455 43.1773 189.455C44.2653 189.455 44.7243 190.186 44.7243 191.121V196H46.9853V190.73C46.9853 188.894 46.0333 187.415 43.9593 187.415C43.0583 187.415 42.0553 187.806 41.5453 188.673V187.636H39.3523V196H41.6133V191.189ZM56.9874 187.636H54.6074L52.6184 193.246L50.5444 187.636H48.0624L51.4794 196H53.7404L56.9874 187.636ZM57.6689 193.722C57.6689 195.031 58.7569 196.238 60.5419 196.238C61.7829 196.238 62.5819 195.66 63.0069 194.997C63.0069 195.32 63.0409 195.779 63.0919 196H65.1659C65.1149 195.711 65.0639 195.116 65.0639 194.674V190.56C65.0639 188.877 64.0779 187.381 61.4259 187.381C59.1819 187.381 57.9749 188.826 57.8389 190.135L59.8449 190.56C59.9129 189.829 60.4569 189.2 61.4429 189.2C62.3949 189.2 62.8539 189.693 62.8539 190.288C62.8539 190.577 62.7009 190.815 62.2249 190.883L60.1679 191.189C58.7739 191.393 57.6689 192.226 57.6689 193.722ZM61.0179 194.555C60.2869 194.555 59.9299 194.079 59.9299 193.586C59.9299 192.94 60.3889 192.617 60.9669 192.532L62.8539 192.243V192.617C62.8539 194.096 61.9699 194.555 61.0179 194.555ZM69.5703 196V183.692H67.3093V196H69.5703ZM74.1358 196V187.636H71.8748V196H74.1358ZM71.6028 184.899C71.6028 185.647 72.2318 186.276 72.9968 186.276C73.7788 186.276 74.3908 185.647 74.3908 184.899C74.3908 184.117 73.7788 183.488 72.9968 183.488C72.2318 183.488 71.6028 184.117 71.6028 184.899ZM84.5322 183.692H82.3052V188.469C82.0672 188.027 81.3872 187.432 79.9422 187.432C77.5792 187.432 75.9302 189.353 75.9302 191.801C75.9302 194.334 77.6302 196.204 80.0102 196.204C81.1322 196.204 81.9822 195.694 82.3562 195.031C82.3562 195.422 82.4072 195.83 82.4412 196H84.6002C84.5662 195.66 84.5322 195.048 84.5322 194.487V183.692ZM78.2082 191.801C78.2082 190.305 79.1262 189.455 80.2822 189.455C81.4382 189.455 82.3392 190.288 82.3392 191.784C82.3392 193.297 81.4382 194.181 80.2822 194.181C79.0922 194.181 78.2082 193.297 78.2082 191.801ZM93.1445 191.189C93.1445 190.22 93.7225 189.455 94.7085 189.455C95.7965 189.455 96.2555 190.186 96.2555 191.121V196H98.5165V190.73C98.5165 188.894 97.5645 187.415 95.4905 187.415C94.5895 187.415 93.5865 187.806 93.0765 188.673V187.636H90.8835V196H93.1445V191.189ZM100.252 193.722C100.252 195.031 101.34 196.238 103.125 196.238C104.366 196.238 105.165 195.66 105.59 194.997C105.59 195.32 105.624 195.779 105.675 196H107.749C107.698 195.711 107.647 195.116 107.647 194.674V190.56C107.647 188.877 106.661 187.381 104.009 187.381C101.765 187.381 100.558 188.826 100.422 190.135L102.428 190.56C102.496 189.829 103.04 189.2 104.026 189.2C104.978 189.2 105.437 189.693 105.437 190.288C105.437 190.577 105.284 190.815 104.808 190.883L102.751 191.189C101.357 191.393 100.252 192.226 100.252 193.722ZM103.601 194.555C102.87 194.555 102.513 194.079 102.513 193.586C102.513 192.94 102.972 192.617 103.55 192.532L105.437 192.243V192.617C105.437 194.096 104.553 194.555 103.601 194.555ZM112.153 196V191.104C112.153 190.186 112.731 189.455 113.717 189.455C114.737 189.455 115.196 190.135 115.196 191.036V196H117.44V191.104C117.44 190.203 118.018 189.455 118.987 189.455C120.024 189.455 120.466 190.135 120.466 191.036V196H122.659V190.577C122.659 188.333 121.18 187.398 119.633 187.398C118.528 187.398 117.644 187.772 116.981 188.792C116.556 187.891 115.638 187.398 114.499 187.398C113.581 187.398 112.51 187.84 112.051 188.656V187.636H109.892V196H112.153ZM126.669 190.866C126.72 190.101 127.366 189.217 128.539 189.217C129.831 189.217 130.375 190.033 130.409 190.866H126.669ZM130.63 193.042C130.358 193.79 129.78 194.317 128.726 194.317C127.604 194.317 126.669 193.518 126.618 192.413H132.602C132.602 192.379 132.636 192.039 132.636 191.716C132.636 189.03 131.089 187.381 128.505 187.381C126.363 187.381 124.391 189.115 124.391 191.784C124.391 194.606 126.414 196.255 128.709 196.255C130.766 196.255 132.092 195.048 132.517 193.603L130.63 193.042Z"
            fill="white"
          />
        </>
      )}
      {subdomainText}
      <Text
        x="32.5"
        y="231"
        style={{ fontSize: `${domainFontSize}px` }}
        opacity={isSubdomain ? 0.4 : 1}
        fill="white"
        filter="url(#dropShadow)"
      >
        {domain}
      </Text>
      <defs>
        <linearGradient
          id="paint0_linear"
          x1="190.5"
          y1="302"
          x2="-64"
          y2="-172.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#44BCF0" />
          <stop offset="0.428185" stopColor="#628BF3" />
          <stop offset="1" stopColor="#A099FF" />
        </linearGradient>
        <linearGradient
          id="paint1_linear"
          x1="0"
          y1="0"
          x2="269.553"
          y2="285.527"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#EB9E9E" />
          <stop offset="1" stopColor="#992222" />
        </linearGradient>
      </defs>
    </svg>
  )
}

export default NFTTemplate
