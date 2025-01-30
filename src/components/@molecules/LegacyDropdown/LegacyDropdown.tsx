import {
  Children,
  cloneElement,
  ComponentProps,
  isValidElement,
  ReactElement,
  useCallback,
  useEffect,
  useRef,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

import { AsProp, Button, Colors, DownChevronSVG } from '@ensdomains/thorin'

import { getTestId } from '@app/utils/utils'

type ButtonProps = ComponentProps<typeof Button>

type Align = 'left' | 'right'
type LabelAlign = 'flex-start' | 'flex-end' | 'center'
type Direction = 'down' | 'up'
type Size = 'small' | 'medium'

const Container = styled.div(
  () => css`
    max-width: max-content;
    position: relative;
  `,
)

type DropdownItemObject = {
  label: string
  onClick?: (value?: string) => void
  wrapper?: (children: React.ReactNode, key: React.Key) => JSX.Element
  as?: 'button' | 'a'
  icon?: AsProp
  value?: string
  color?: Colors
  disabled?: boolean
}

export type DropdownItem = DropdownItemObject | React.ReactElement<React.PropsWithRef<any>>

interface DropdownMenuContainerProps {
  $opened?: boolean
  $inner: boolean
  $shortThrow: boolean
  $align: Align
  $labelAlign?: LabelAlign
  $direction: Direction
}

const DropdownMenuContainer = styled.div<DropdownMenuContainerProps>(
  ({ theme, $opened, $inner, $shortThrow, $align, $labelAlign, $direction }) => css`
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    gap: ${theme.space['1']};
    position: absolute;

    ${$direction === 'up' &&
    css`
      bottom: 100%;
    `}

    ${$labelAlign &&
    css`
      & > button {
        justify-content: ${$labelAlign};
      }
    `}

    ${$opened
      ? css`
          visibility: visible;
          opacity: 1;
        `
      : css`
          z-index: 1;
          visibility: hidden;
          opacity: 0;
        `}

    padding: ${theme.space['1.5']};
    background-color: ${theme.colors.background};
    border-radius: ${theme.radii['2xLarge']};

    ${$inner
      ? css`
      border-radius: ${theme.radii.almostExtraLarge};
      border-${$direction === 'down' ? 'top' : 'bottom'}-left-radius: none;
      border-${$direction === 'down' ? 'top' : 'bottom'}-right-radius: none;
      border-width: ${theme.space.px};
      border-${$direction === 'down' ? 'top' : 'bottom'}-width: 0;
      border-color: ${theme.colors.border};
      padding: 0 ${theme.space['1.5']};
      padding-${$direction === 'down' ? 'top' : 'bottom'}: ${theme.space['2.5']};
      padding-${$direction === 'down' ? 'bottom' : 'top'}: ${theme.space['1.5']};
      margin-${$direction === 'down' ? 'top' : 'bottom'}: -${theme.space['2.5']};
      transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6);
    `
      : css`
          border: 1px solid ${theme.colors.border};
        `}

    ${() => {
      if ($opened) {
        return css`
          transition:
            all 0.35s cubic-bezier(1, 0, 0.22, 1.6),
            width 0s linear,
            z-index 0s linear 0.35s;
        `
      }
      return css`
        transition:
          all 0.35s cubic-bezier(1, 0, 0.22, 1.6),
          width 0s linear,
          z-index 0s linear 0s;
      `
    }}

    ${() => {
      if (!$opened && !$shortThrow) {
        return css`
          margin-${$direction === 'down' ? 'top' : 'bottom'}: calc(-1 * ${theme.space['12']});
        `
      }
      if (!$opened && $shortThrow) {
        return css`
          margin-${$direction === 'down' ? 'top' : 'bottom'}: calc(-1 * ${theme.space['2.5']});
        `
      }
      if ($opened && !$inner) {
        return css`
          z-index: 20;
          margin-${$direction === 'down' ? 'top' : 'bottom'}: ${theme.space['1.5']};
        `
      }
    }}

  ${$align === 'left'
      ? css`
          left: 0;
        `
      : css`
          right: 0;
        `}
  `,
)

interface MenuButtonProps {
  $inner: boolean
  $hasColor: boolean
  $color?: Colors
}

const MenuButton = styled.button<MenuButtonProps>(
  ({ theme, $inner, $hasColor, $color, disabled }) => css`
    align-items: center;
    cursor: pointer;
    display: flex;
    gap: ${theme.space['2']};
    width: ${theme.space.full};
    height: ${theme.space['12']};
    padding: ${theme.space['3']};
    border-radius: ${theme.radii.large};
    font-weight: ${theme.fontWeights.normal};
    transition-duration: 0.15s;
    transition-property: color, transform, filter;
    transition-timing-function: ease-in-out;

    &:active {
      transform: translateY(0);
      filter: brightness(1);
    }

    color: ${theme.colors[$color || 'textPrimary']};

    svg {
      width: ${theme.space['4']};
      height: ${theme.space['4']};
      color: ${theme.colors[$color || 'text']};
    }
    ${disabled &&
    css`
      color: ${theme.colors.grey};
      cursor: not-allowed;
    `}

    ${() => {
      if ($inner)
        return css`
          justify-content: center;

          &:hover {
            color: ${theme.colors.accent};
          }
        `

      if (!$inner)
        return css`
          justify-content: flex-start;

          &:hover {
            background: ${theme.colors.greySurface};
          }
        `
    }}

    ${() => {
      if ($inner && !$hasColor)
        return css`
          color: ${theme.colors.greyPrimary};
        `
    }}
  `,
)

type DropdownMenuProps = {
  /** An array of objects conforming to the DropdownItem interface. */
  items: DropdownItem[]
  /** If true, makes the menu visible. */
  isOpen?: boolean
  /** A mutation function for the isOpen variable. */
  setIsOpen: (isOpen: boolean) => void
  /** Sets the width in the number of pixels. Must be at least 150. */
  width?: string
  /** If true, renders a dropdown where the button and menu are merged. */
  inner: boolean
  /** Sets which side of the button to align the dropdown menu. */
  align: Align
  /** If true, decreases the distance of the dropdown animation. */
  shortThrow: boolean
  /** If true, sets the zIndex of the dropdown menu to 100. */
  keepMenuOnTop: boolean
  labelAlign?: LabelAlign
  direction: Direction
}

const DropdownChild = ({
  setIsOpen,
  item,
}: {
  setIsOpen: (isOpen: boolean) => void
  item: ReactElement<React.PropsWithRef<any>>
}) => {
  const ref = useRef<HTMLDivElement>(null)
  const Item = cloneElement(item, { ...item.props, ref })

  const handleClick = useCallback(() => {
    setIsOpen(false)
  }, [setIsOpen])

  useEffect(() => {
    const currentRef = ref.current
    currentRef?.addEventListener('click', handleClick)
    return () => {
      currentRef?.removeEventListener('click', handleClick)
    }
  }, [handleClick, item])

  return Item
}

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
  direction,
}: DropdownMenuProps) => {
  return (
    <DropdownMenuContainer
      {...{
        $opened: isOpen,
        $inner: inner,
        $align: align,
        $shortThrow: shortThrow,
        $labelAlign: labelAlign,
        $direction: direction,
      }}
      style={{
        width: inner || (width && parseInt(width) > 100) ? `${width}px` : '150px',
        zIndex: keepMenuOnTop ? 100 : undefined,
      }}
    >
      {items.map((item: DropdownItem) => {
        if (isValidElement(item)) {
          return DropdownChild({ item, setIsOpen })
        }
        const { color, value, icon, label, onClick, disabled, as, wrapper } =
          item as DropdownItemObject

        const props: React.ComponentProps<any> = {
          $inner: inner,
          $hasColor: !!color,
          $color: color,
          disabled,
          onClick: () => {
            setIsOpen(false)
            onClick?.(value)
          },
          as,
          children: (
            <>
              {icon}
              {label}
            </>
          ),
        }

        if (wrapper) {
          return wrapper(<MenuButton {...props} type="button" />, value || label)
        }

        return <MenuButton {...props} key={value || label} type="button" />
      })}
    </DropdownMenuContainer>
  )
}

interface InnerMenuButtonProps {
  $size: Size
  $open?: boolean
  $direction: Direction
}

const InnerMenuButton = styled.button<InnerMenuButtonProps>(
  ({ theme, $size, $open, $direction }) => css`
    z-index: 10;
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: ${theme.space['4']};
    border-width: ${theme.space.px};
    font-weight: ${theme.fontWeights.normal};
    cursor: pointer;
    position: relative;
    border-color: ${theme.colors.border};
    background-color: ${theme.colors.background};

    ${() => {
      switch ($size) {
        case 'small':
          return css`
            padding: ${theme.space['0.5']} ${theme.space['0.25']};
          `
        case 'medium':
          return css`
            padding: ${theme.space['2.5']} ${theme.space['3.5']};
          `
        default:
          return ``
      }
    }}

    ${() => {
      if ($open)
        return css`
          border-${$direction === 'down' ? 'top' : 'bottom'}-left-radius: ${
            theme.radii.almostExtraLarge
          };
          border-${$direction === 'down' ? 'top' : 'bottom'}-right-radius: ${
            theme.radii.almostExtraLarge
          };
          border-${$direction === 'down' ? 'bottom' : 'top'}-left-radius: none;
          border-${$direction === 'down' ? 'bottom' : 'top'}-right-radius: none;
          border-${$direction === 'down' ? 'bottom' : 'top'}-width: 0;
          color: ${theme.colors.grey};
          transition: 0.35s all cubic-bezier(1, 0, 0.22, 1.6),
            0.3s color ease-in-out, 0.2s border-radius ease-in-out,
            0s border-width 0.1s, 0s padding linear;

          &:hover {
            color: ${theme.colors.accent};
          }
        `
      if (!$open)
        return css`
          color: ${theme.colors.textSecondary};
          border-radius: ${theme.radii.almostExtraLarge};
          transition:
            0.35s all cubic-bezier(1, 0, 0.22, 1.6),
            0.15s color ease-in-out,
            0s border-width 0.15s,
            0.15s border-color ease-in-out,
            0s padding linear;

          &:hover {
            border-color: ${theme.colors.border};
          }
        `
    }}
  `,
)

const Chevron = styled((props) => <DownChevronSVG {...props} />)<{
  $open?: boolean
  $direction: Direction
}>(
  ({ theme, $open, $direction }) => css`
    margin-left: ${theme.space['1']};
    width: ${theme.space['3']};
    margin-right: ${theme.space['0.5']};
    transition-duration: ${theme.transitionDuration['200']};
    transition-property: all;
    transition-timing-function: ${theme.transitionTimingFunction.inOut};
    transform: rotate(${$direction === 'down' ? '0deg' : '180deg'});
    display: flex;

    & > svg {
      fill: currentColor;
    }
    fill: currentColor;

    ${$open &&
    css`
      transform: rotate(${$direction === 'down' ? '180deg' : '0deg'});
    `}
  `,
)

type NativeDivProps = React.HTMLAttributes<HTMLDivElement>

type Props = {
  children?: React.ReactNode
  buttonProps?: ButtonProps
  inner?: boolean
  chevron?: boolean
  align?: Align
  shortThrow?: boolean
  keepMenuOnTop?: boolean
  items: DropdownItem[]
  size?: Size
  label?: React.ReactNode
  menuLabelAlign?: LabelAlign
  isOpen?: boolean
  direction?: Direction
  inheritContentWidth?: boolean
} & NativeDivProps

type PropsWithIsOpen = {
  isOpen: boolean
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
}

type PropsWithoutIsOpen = {
  isOpen?: never
  setIsOpen?: never
}

const ButtonWrapper = styled.div(
  () => css`
    z-index: 10;
    position: relative;
  `,
)

const ChevronSuffix =
  ({ direction, isOpen }: { direction: Direction; isOpen?: boolean }) =>
  () => <Chevron $direction={direction} $open={isOpen} />

export const LegacyDropdown = ({
  children,
  buttonProps,
  items = [],
  inner = false,
  chevron = true,
  align = 'left',
  menuLabelAlign,
  shortThrow = false,
  keepMenuOnTop = false,
  size = 'medium',
  label,
  direction = 'down',
  isOpen: _isOpen,
  setIsOpen: _setIsOpen,
  inheritContentWidth = false,
  ...props
}: Props & (PropsWithIsOpen | PropsWithoutIsOpen)) => {
  const dropdownRef = useRef<any>()
  const [internalIsOpen, internalSetIsOpen] = useState(false)
  const [isOpen, setIsOpen] = _setIsOpen
    ? [_isOpen, _setIsOpen]
    : [internalIsOpen, internalSetIsOpen]

  const handleClickOutside = (e: any) => {
    if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
      setIsOpen(false)
    }
  }

  useEffect(() => {
    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside)
    } else {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    return () => {
      document.removeEventListener('mousedown', handleClickOutside)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dropdownRef, isOpen])

  return (
    // eslint-disable-next-line @typescript-eslint/naming-convention
    <Container ref={dropdownRef} {...{ ...props, 'data-testid': getTestId(props, 'dropdown') }}>
      {!children && inner && (
        <InnerMenuButton
          $direction={direction}
          $open={isOpen}
          $size={size}
          type="button"
          onClick={() => setIsOpen(!isOpen)}
        >
          {label}
          {chevron && <Chevron $direction={direction} $open={isOpen} />}
        </InnerMenuButton>
      )}

      {!children && !inner && (
        <ButtonWrapper>
          <Button
            {...buttonProps}
            pressed={isOpen}
            suffix={chevron ? ChevronSuffix({ direction, isOpen }) : undefined}
            onClick={() => setIsOpen(!isOpen)}
          >
            {label}
          </Button>
        </ButtonWrapper>
      )}

      {Children.map(children, (child) => {
        if (!isValidElement(child)) return null
        return cloneElement(child as any, {
          ...buttonProps,
          zindex: '10',
          pressed: isOpen ? 'true' : undefined,
          onClick: () => setIsOpen(!isOpen),
        })
      })}

      <DropdownMenu
        align={align}
        direction={direction}
        inner={inner}
        isOpen={isOpen}
        items={items}
        keepMenuOnTop={keepMenuOnTop}
        labelAlign={menuLabelAlign}
        setIsOpen={setIsOpen}
        shortThrow={shortThrow}
        width={
          (inner || inheritContentWidth) &&
          dropdownRef.current &&
          dropdownRef.current.getBoundingClientRect().width.toFixed(2)
        }
      />
    </Container>
  )
}
