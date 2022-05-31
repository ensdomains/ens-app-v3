import { CheckSVG, CopySVG, tokens } from '@ensdomains/thorin'
import { memo } from 'react'
import styled, { css } from 'styled-components'

const IconWrapper = styled.div<{ $copied: boolean }>`
  position: relative;
  & > svg {
    display: block;
    transition: all 0.15s ease-in-out;
  }
  & > svg:first-child {
    position: absolute;
  }
  ${(props) =>
    props.$copied
      ? css`
          & > svg:first-child {
            opacity: 1;
            visibility: visible;
          }
          & > svg:last-child {
            opacity: 0;
            visibility: hidden;
          }
        `
      : css`
          & > svg:first-child {
            opacity: 0;
            visibility: hidden;
          }
          & > svg:last-child {
            opacity: 1;
            visibility: visible;
          }
        `}
`

type SVGProps = {
  checkStrokeWidth?: keyof typeof tokens.borderWidths
  size?: keyof typeof tokens.space
  color?: keyof typeof tokens.colors.light | keyof typeof tokens.colors.dark
}

const SVGWrapper = styled.svg<{
  $checkStrokeWidth: SVGProps['checkStrokeWidth']
  $size: SVGProps['size']
  $color: SVGProps['color']
}>`
  ${({ theme, $checkStrokeWidth, $size, $color }) => css`
    ${$checkStrokeWidth &&
    css`
      stroke-width: ${theme.borderWidths[$checkStrokeWidth]};
    `}
    ${$size &&
    css`
      width: ${theme.space[$size]};
      height: ${theme.space[$size]};
    `}
  ${$color &&
    css`
      color: ${theme.colors[$color]};
    `}
  `}
`

export const IconCopyAnimated = memo(
  ({
    copied = false,
    checkStrokeWidth = '1',
    size = '6',
    color,
  }: {
    copied?: boolean
  } & SVGProps) => {
    return (
      <IconWrapper $copied={copied}>
        <SVGWrapper
          {...{
            $checkStrokeWidth: checkStrokeWidth,
            $size: size,
            $color: color,
          }}
          as={CheckSVG}
        />
        <SVGWrapper
          {...{
            $size: size,
            $color: color,
          }}
          as={CopySVG}
        />
      </IconWrapper>
    )
  },
)
