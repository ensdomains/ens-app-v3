import { ChangeEventHandler, ForwardedRef, forwardRef, InputHTMLAttributes } from 'react'
import styled, { css } from 'styled-components'

import CalendarSVG from '@app/assets/Calendar.svg'
import { useExpiry } from '@app/hooks/ensjs/public/useExpiry'
import { useDefaultRef } from '@app/hooks/useDefaultRef'
import { add28Days, formatExpiry } from '@app/utils/utils'

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

const LabelInput = styled.input(
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
  value: Date
  defaultValue?: Date
  unit?: string
  name?: string
} & Omit<InputProps, 'value' | 'defaultValue' | 'min' | 'max' | 'name'>

const now = new Date()

const dateToInput = (date: Date) => date.toISOString().split('T')[0]

const addYearToDate = (date: Date) =>
  new Date(date.getFullYear() + 1, date.getMonth(), date.getDate())

export const Calendar = forwardRef(
  (
    { value, name, onChange, onBlur, highlighted, defaultValue, ...props }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const inputRef = useDefaultRef<HTMLInputElement>(ref)

    const { data } = useExpiry({ name })

    const minDate = addYearToDate(add28Days(data ? data.expiry.date : now))

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const { valueAsDate } = e.target
      if (!valueAsDate) return

      onChange?.(e)
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
          type="date"
          {...props}
          ref={inputRef}
          defaultValue={defaultValue ? dateToInput(defaultValue) : undefined}
          value={dateToInput(value)}
          onChange={handleChange}
          min={dateToInput(minDate)}
          onFocus={(e) => {
            e.target.select()
          }}
        />
        <span>{formatExpiry(value)}</span>
        <CalendarIcon>
          <CalendarSVG height={16} width={16} />
        </CalendarIcon>
      </Label>
    )
  },
)