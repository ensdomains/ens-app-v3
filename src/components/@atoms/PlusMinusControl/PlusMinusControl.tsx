import {
  ChangeEventHandler,
  ForwardedRef,
  InputHTMLAttributes,
  forwardRef,
  useCallback,
  useState,
} from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import MinusIcon from '@app/assets/Minus.svg'
import PlusIcon from '@app/assets/Plus.svg'
import { useDefaultRef } from '@app/hooks/useDefaultRef'
import { createChangeEvent } from '@app/utils/syntheticEvent'

const Container = styled.div<{ $highlighted?: boolean }>(
  ({ theme, $highlighted }) => css`
    width: 100%;
    padding: ${$highlighted ? theme.space['4'] : theme.space['1']};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.full};
    display: flex;
    align-items: center;
    gap: ${theme.space['4']};
  `,
)

const Button = styled.button(
  ({ theme }) => css`
    height: ${theme.space['11']};
    width: ${theme.space['11']};
    border-radius: 50%;
    cursor: pointer;
    background: ${theme.colors.accent};
    display: flex;
    justify-content: center;
    align-items: center;
    transition: background-color 150ms ease-in-out;

    svg {
      display: block;
      transform: scale(0.67);
      pointer-events: none;
      path {
        fill: ${theme.colors.backgroundPrimary};
      }
    }

    &:disabled {
      background-color: ${theme.colors.greyBright};
      cursor: not-allowed;
    }
  `,
)

const LabelContainer = styled.div(
  ({ theme }) => css`
    position: relative;
    flex: 1;
    height: ${theme.space['11']};
    border-radius: ${theme.radii.full};
    transition: background-color 150ms ease-in-out;

    :focus-within {
      background-color: ${theme.colors.accentSurface};
    }
    :focus-within label {
      opacity: 0;
    }
    :focus-within input {
      opacity: 1;
    }
    :hover {
      background-color: ${theme.colors.accentSurface};
    }
  `,
)

const Label = styled.label<{ $highlighted?: boolean }>(
  ({ theme, $highlighted }) => css`
    display: flex;
    justify-content: center;
    align-items: center;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-style: normal;
    font-weight: ${theme.fontWeights.bold};
    font-size: ${$highlighted ? theme.fontSizes.headingTwo : theme.fontSizes.large};
    line-height: ${$highlighted ? theme.lineHeights.headingTwo : theme.lineHeights.large};
    text-align: center;
    color: ${$highlighted ? theme.colors.accent : theme.colors.text};
    pointer-events: none;
    opacity: 1;
    transition: opacity 150ms ease-in-out;
  `,
)

const LabelInput = styled.input<{ $highlighted?: boolean }>(
  ({ theme, $highlighted }) => css`
    width: 100%;
    height: 100%;
    text-align: center;
    font-style: normal;
    font-weight: ${theme.fontWeights.bold};
    font-size: ${$highlighted ? theme.fontSizes.headingTwo : theme.fontSizes.large};
    line-height: ${$highlighted ? theme.lineHeights.headingTwo : theme.lineHeights.large};
    color: ${$highlighted ? theme.colors.accent : theme.colors.text};
    opacity: 0;
    transition: opacity 150ms ease-in-out;
    border-radius: ${theme.radii.full};

    /* stylelint-disable property-no-vendor-prefix */
    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    -moz-appearance: textfield;
    /* stylelint-enable property-no-vendor-prefix */

    :hover,
    :focus {
      background-color: ${theme.colors.accentSurface};
    }
  `,
)

const getDefaultValue = (
  value: number | undefined,
  defaultValue: number | undefined,
  minValue: number | undefined,
) => {
  if (typeof value === 'number') return value
  if (typeof defaultValue === 'number') return defaultValue
  if (typeof minValue === 'number') return minValue
  return 1
}

const getInitialInputValue = (
  value: number | undefined,
  defautValue: number | undefined,
  minValue: number | undefined,
) => {
  const defaultValue = getDefaultValue(value, defautValue, minValue)
  return defaultValue.toString()
}

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
      maxValue = 1000,
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

    const [inputValue, setInputValue] = useState<string>(
      getInitialInputValue(value, defaultValue, minValue),
    )
    const [focused, setFocused] = useState(false)

    const minusDisabled =
      typeof minValue === 'number' && typeof value === 'number' && value <= minValue
    const plusDisabled =
      typeof maxValue === 'number' && typeof value === 'number' && value >= maxValue

    const normalizeValue = useCallback(
      (num: number) => {
        const normalizedValue = Number.parseFloat(num.toFixed(2))
        if (typeof minValue === 'number' && normalizedValue < minValue) return minValue
        if (typeof maxValue === 'number' && normalizedValue > maxValue) return maxValue
        return normalizedValue
      },
      [minValue, maxValue],
    )

    const isValidValue = useCallback(
      (num: number) => {
        if (Number.isNaN(num)) return false
        if (typeof minValue === 'number' && num < minValue) return false
        if (typeof maxValue === 'number' && num > maxValue) return false
        return true
      },
      [minValue, maxValue],
    )

    const incrementHandler = (inc: number) => () => {
      const newValue = (value || minValue) + inc
      const adjustedValue = normalizeValue(newValue)
      if (adjustedValue === value) return
      setInputValue(adjustedValue.toString())

      const newEvent = createChangeEvent(adjustedValue, name)
      onChange?.(newEvent)
    }

    const handleInputChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      setInputValue(e.target.value)

      const floatValue = Number.parseFloat(e.target.value)
      if (!isValidValue(floatValue)) return
      const newEvent = createChangeEvent(floatValue, name)
      onChange?.(newEvent)
    }

    const handleInputBlur = (e: any) => {
      let targetValue = Number.parseFloat(e.target.value)
      if (Number.isNaN(targetValue)) targetValue = getDefaultValue(value, defaultValue, minValue)

      const normalizedValue = normalizeValue(targetValue)

      const newInputValue = Number.parseFloat(normalizedValue.toFixed(2)).toString()
      setInputValue(newInputValue)

      const newEvent = createChangeEvent(normalizedValue, name)
      onChange?.(newEvent)

      onBlur?.(e)
      setFocused(false)
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
            step={1}
            ref={inputRef}
            value={inputValue}
            onChange={handleInputChange}
            min={minValue}
            max={maxValue}
            onFocus={() => setFocused(true)}
            onBlur={handleInputBlur}
            {...props}
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
