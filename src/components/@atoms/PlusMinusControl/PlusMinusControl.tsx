import {
  ChangeEventHandler,
  FocusEvent,
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  ReactElement,
  useCallback,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'

import { Box, BoxProps, cssVars } from '@ensdomains/thorin'

import MinusIcon from '@app/assets/Minus.svg'
import PlusIcon from '@app/assets/Plus.svg'
import { useDefaultRef } from '@app/hooks/useDefaultRef'
import { createChangeEvent } from '@app/utils/syntheticEvent'

import { labelContainer, labelInput, labelLabel } from './style.css'

const Container = ({ $highlighted, ...props }: BoxProps & { $highlighted?: boolean }) => (
  <Box
    {...props}
    width="$full"
    padding={$highlighted ? '$4' : '$1'}
    border={`1px solid ${cssVars.color.border}`}
    borderRadius="$full"
    display="flex"
    alignItems="center"
    gap="$4"
  />
)

const Button = ({ disabled, children, ...props }: BoxProps) => (
  <Box
    {...props}
    as="button"
    type="button"
    wh="$11"
    borderRadius="$full"
    cursor={disabled ? 'not-allowed' : 'pointer'}
    backgroundColor={disabled ? '$greyBright' : '$accent'}
    display="flex"
    justifyContent="center"
    alignItems="center"
    transition="background-color 150ms ease-in-out"
  >
    <Box
      as={children as ReactElement}
      color="$background"
      display="block"
      pointerEvents="none"
      transform="scale(0.67)"
    />
  </Box>
)

const LabelContainer = (props: BoxProps) => (
  <Box
    {...props}
    className={labelContainer}
    position="relative"
    flex={1}
    height="$11"
    borderRadius="$full"
    backgroundColor={{ base: 'transparent', hover: '$accentSurface' }}
    transition="background-color 150ms ease-in-out"
    overflow="hidden"
  />
)

const Label = ({ $highlighted, ...props }: BoxProps & { $highlighted?: boolean }) => (
  <Box
    {...props}
    as="label"
    className={labelLabel}
    position="absolute"
    top="$0"
    left="$0"
    width="$full"
    height="$11"
    display="block"
    whiteSpace="nowrap"
    textOverflow="ellipsis"
    overflow="hidden"
    fontStyle="normal"
    fontWeight="$bold"
    fontSize={$highlighted ? '$headingTwo' : '$large'}
    lineHeight="$headingTwo"
    textAlign="center"
    color={$highlighted ? '$accent' : '$text'}
    pointerEvents="none"
    transition="opacity 150ms ease-in-out"
  />
)

const LabelInput = forwardRef<HTMLElement, InputProps & { $highlighted?: boolean }>(
  ({ $highlighted, ...props }, ref) => (
    <Box
      {...props}
      as="input"
      ref={ref}
      type="number"
      className={labelInput}
      width="$full"
      height="$full"
      textAlign="center"
      fontStyle="normal"
      fontWeight="$bold"
      fontSize={$highlighted ? '$headingTwo' : '$large'}
      lineHeight={$highlighted ? '$headingTwo' : '$large'}
      color={$highlighted ? '$accent' : '$text'}
      transition="opacity 150ms ease-in-out"
      backgroundColor="$accentSurface"
    />
  ),
)

type InputProps = InputHTMLAttributes<HTMLInputElement>
type Props = {
  highlighted?: boolean
  value?: number
  minValue?: number
  maxValue?: number
  defaultValue?: number
  unit?: string
  name?: string
  onChange?: ChangeEventHandler<HTMLInputElement>
} & Omit<InputProps, 'value' | 'defaultValue' | 'min' | 'max'>

export const PlusMinusControl = forwardRef(
  (
    {
      value,
      defaultValue,
      minValue = 1,
      // maxValue is needed to prevent exceeding NUMBER.MAX_SAFE_INTEGER
      maxValue = Number.MAX_SAFE_INTEGER - 1,
      name = 'plus-minus-control',
      unit = 'years',
      onChange,
      onBlur,
      highlighted,
      ...props
    }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const { t } = useTranslation('common')
    const inputRef = useDefaultRef<HTMLInputElement>(ref)

    const getDefaultValue = useCallback(() => {
      return value || defaultValue || minValue
    }, [value, defaultValue, minValue])

    const normalizeValue = useCallback(
      (val: number) => {
        if (Number.isNaN(val)) return getDefaultValue()
        if (val < minValue) return minValue
        if (val > maxValue) return maxValue
        return val
      },
      [minValue, maxValue, getDefaultValue],
    )

    const isValidValue = useCallback(
      (val: number) => {
        if (Number.isNaN(val)) return false
        if (val < minValue) return false
        if (val > maxValue) return false
        return true
      },
      [minValue, maxValue],
    )

    const [inputValue, setInputValue] = useState<string>(getDefaultValue().toFixed(0))
    const [focused, setFocused] = useState(false)

    const minusDisabled = typeof value === 'number' && value <= minValue
    const plusDisabled = typeof value === 'number' && value >= maxValue

    const incrementHandler = (inc: number) => () => {
      const newValue = (value || 0) + inc
      const normalizedValue = normalizeValue(newValue)
      if (normalizedValue === value) return
      setInputValue(normalizedValue.toFixed(0))
      const newEvent = createChangeEvent(normalizedValue, name)
      onChange?.(newEvent)
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      setInputValue(e.target.value)

      const newValue = parseInt(e.target.value)
      if (!isValidValue(newValue)) return
      onChange?.(e)
    }

    const handleBlur = (e: FocusEvent<HTMLInputElement>) => {
      const normalizedValue = normalizeValue(parseInt(e.target.value))
      setInputValue(normalizedValue.toFixed(0))

      if (normalizedValue !== value) {
        const newEvent = createChangeEvent(normalizedValue, name)
        onChange?.(newEvent)
      }

      setFocused(false)
      onBlur?.(e)
    }

    return (
      <Container $highlighted={highlighted}>
        <Button
          type="button"
          onClick={incrementHandler(-1)}
          data-testid="plus-minus-control-minus"
          disabled={focused || minusDisabled}
        >
          <MinusIcon />
        </Button>
        <LabelContainer>
          <LabelInput
            data-testid="plus-minus-control-input"
            $highlighted={highlighted}
            type="number"
            {...props}
            ref={inputRef}
            value={inputValue}
            onChange={handleChange}
            min={minValue}
            max={maxValue}
            inputMode="numeric"
            pattern="[0-9]*"
            onKeyDown={(e) => {
              // rely on type="number" to prevent non-numeric input
              // additionally prevent . and -
              if (['.', '-'].includes(e.key)) e.preventDefault()
            }}
            onFocus={(e) => {
              e.target.select()
              setFocused(true)
            }}
            onBlur={handleBlur}
          />
          <Label $highlighted={highlighted}>{t(`unit.${unit}`, { count: value })}</Label>
        </LabelContainer>
        <Button
          type="button"
          onClick={incrementHandler(1)}
          data-testid="plus-minus-control-plus"
          disabled={focused || plusDisabled}
        >
          <PlusIcon />
        </Button>
      </Container>
    )
  },
)
