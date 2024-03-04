import {
  ChangeEventHandler,
  ForwardedRef,
  forwardRef,
  InputHTMLAttributes,
  useCallback,
  useState,
} from 'react'
import styled, { css } from 'styled-components'

import CalendarSVG from '@app/assets/Calendar.svg'
import { useExpiry } from '@app/hooks/ensjs/public/useExpiry'
import { useDefaultRef } from '@app/hooks/useDefaultRef'

const Label = styled.label<{ $highlighted?: boolean }>(
  ({ theme, $highlighted }) => css`
    position: relative;
    flex: 1;
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.radii.full};
    background-color: transparent;
    width: 100%;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
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
    transition: background-color 150ms ease-in-out;
    padding: ${theme.space['4']} ${theme.space['4']} ${theme.space['4']} ${theme.space['8']};
    :hover {
      background-color: ${theme.colors.blueSurface};
    }
  `,
)

const CalendarIcon = styled.span(
  ({ theme }) => css`
    background-color: ${theme.colors.bluePrimary};
    color: ${theme.colors.textAccent};
    height: ${theme.space['12']};
    width: ${theme.space['12']};
    border-radius: ${theme.radii.full};
    padding: ${theme.space['1']};
    display: flex;
    align-items: center;
    justify-content: center;
    cursor: pointer;
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
    cursor: pointer;
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

export const Calendar = forwardRef(
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

    const yearAfterExpiry = data
      ? new Date(
          data!.expiry.date.getFullYear() + (value ?? 0),
          data!.expiry.date.getMonth(),
          data!.expiry.date.getDate(),
        )
      : new Date(now + ONE_YEAR)

    const [inputValue, setInputValue] = useState<Date>(new Date(now + (value ?? 0) * ONE_YEAR))

    const expiryDate = data ? getLaterDate(yearAfterExpiry, inputValue) : inputValue
    const minDate = data ? data.expiry.date : new Date(now + ONE_YEAR)

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
          }}
        />
        <span>
          {expiryDate.toLocaleDateString(undefined, {
            month: 'short',
            day: '2-digit',
            year: 'numeric',
          })}
        </span>
        <CalendarIcon>
          <CalendarSVG height={16} width={16} />
        </CalendarIcon>
      </Label>
    )
  },
)
