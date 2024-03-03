import {
  ChangeEventHandler,
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

import MinusIcon from '@app/assets/Minus.svg'
import PlusIcon from '@app/assets/Plus.svg'
import { useExpiry } from '@app/hooks/ensjs/public/useExpiry'
import { useDefaultRef } from '@app/hooks/useDefaultRef'

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

const Label = styled.label<{ $highlighted?: boolean }>(
  ({ theme, $highlighted }) => css`
    position: relative;
    flex: 1;
    height: ${theme.space['11']};
    border-radius: ${theme.radii.full};
    background-color: transparent;
    width: 100%;
    display: block;
    white-space: nowrap;
    text-overflow: ellipsis;
    overflow: hidden;
    font-style: normal;
    font-weight: ${theme.fontWeights.bold};
    font-size: ${$highlighted ? theme.fontSizes.headingTwo : theme.fontSizes.large};
    line-height: ${theme.space['11']};
    text-align: center;
    color: ${$highlighted ? theme.colors.accent : theme.colors.text};
    opacity: 1;
    transition: opacity 150ms ease-in-out;
  `,
)

const LabelInput = styled.input<{ $highlighted?: boolean }>(
  () => css`
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
    height: 100%;
    opacity: 0;
  `,
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
  onChange?: (year: number) => void
} & Omit<InputProps, 'value' | 'defaultValue' | 'min' | 'max' | 'onChange' | 'name'>

const ONE_YEAR = 31536000000

const getLaterDate = (date1: Date, date2: Date) => [date1, date2].reduce((a, b) => (a > b ? a : b))

export const PlusMinusControl = forwardRef(
  (
    {
      value,
      defaultValue,
      name,
      minValue = 1,
      // maxValue is needed to prevent exceeding NUMBER.MAX_SAFE_INTEGER
      maxValue = Number.MAX_SAFE_INTEGER - 1,
      onChange,
      onBlur,
      highlighted,
      ...props
    }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
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

    const { data } = useExpiry({ name })

    const now = Date.now()

    const yearAfterExpiry = new Date(
      data!.expiry.date.getFullYear() + (value ?? 0),
      data!.expiry.date.getMonth(),
      data!.expiry.date.getDate(),
    )

    const [inputValue, setInputValue] = useState<Date>(new Date(now + (value ?? 0) * ONE_YEAR))

    const expiryDate = data ? getLaterDate(yearAfterExpiry, inputValue) : inputValue
    const minDate = data ? data.expiry.date : new Date(now + ONE_YEAR)

    const [focused, setFocused] = useState(false)

    const minusDisabled = typeof value === 'number' && value <= minValue
    const plusDisabled = typeof value === 'number' && value >= maxValue

    const incrementHandler = (inc: number) => () => {
      const newValue = (value || 0) + inc
      const normalizedValue = normalizeValue(newValue)
      if (normalizedValue === value) return
      const newInputValue = expiryDate
      newInputValue.setFullYear(expiryDate.getFullYear() + inc)
      setInputValue(newInputValue)
      onChange?.(newValue)
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const { valueAsDate } = e.currentTarget
      const year = (valueAsDate || minDate).getFullYear() - minDate.getFullYear()

      const normalizedValue = normalizeValue(year)
      if (valueAsDate) setInputValue(valueAsDate)

      const newValue = normalizedValue
      if (!isValidValue(newValue)) return
      onChange?.(year)
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
        <Label
          htmlFor="year-input"
          $highlighted={highlighted}
          onClick={() => inputRef.current!.showPicker()}
        >
          <LabelInput
            id="year-input"
            data-testid="plus-minus-control-input"
            $highlighted={highlighted}
            type="date"
            {...props}
            ref={inputRef}
            value={inputValue?.toISOString().split('T')[0]}
            onChange={handleChange}
            min={minDate.toISOString().split('T')[0]}
            onFocus={(e) => {
              e.target.select()
              setFocused(true)
            }}
          />
          {expiryDate.toLocaleDateString(undefined, {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })}
        </Label>
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
