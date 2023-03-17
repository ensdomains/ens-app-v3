import { ChangeEventHandler, ForwardedRef, InputHTMLAttributes, forwardRef, useState } from 'react'
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
    background-color: transparent;
    transition: background-color 150ms ease-in-out;
    overflow: hidden;

    :hover {
      background-color: ${theme.colors.accentSurface};
    }

    :focus-within label {
      opacity: 0;
    }
    :focus-within input {
      opacity: 1;
    }
  `,
)

const Label = styled.label<{ $highlighted?: boolean }>(
  ({ theme, $highlighted }) => css`
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
    background-color: ${theme.colors.accentSurface};

    /* stylelint-disable property-no-vendor-prefix */
    ::-webkit-outer-spin-button,
    ::-webkit-inner-spin-button {
      -webkit-appearance: none;
      margin: 0;
    }
    -moz-appearance: textfield;
    /* stylelint-enable property-no-vendor-prefix */
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
  onChange?: ChangeEventHandler<HTMLInputElement>
} & Omit<InputProps, 'value' | 'defaultValue' | 'min' | 'max'>

export const PlusMinusControl = forwardRef(
  (
    {
      value: _value,
      defaultValue,
      minValue = 1,
      maxValue,
      name = 'plus-minus-control',
      unit = 'years',
      onChange,
      highlighted,
      ...props
    }: Props,
    ref: ForwardedRef<HTMLInputElement>,
  ) => {
    const { t } = useTranslation('common')
    const inputRef = useDefaultRef<HTMLInputElement>(ref)

    const [value, setValue] = useState(_value || defaultValue || 1)
    const [focused, setFocused] = useState(false)

    const minusDisabled = typeof minValue !== 'undefined' && value <= minValue
    const plusDisabled = typeof maxValue !== 'undefined' && value >= maxValue

    const adjustValue = (v: number) => {
      if (minValue && v < minValue) {
        return minValue
      }
      if (maxValue && v > maxValue) {
        return maxValue
      }
      return v
    }

    const incrementHandler = (inc: number) => () => {
      const newValue = (value || 0) + inc
      const adjustedValue = adjustValue(newValue)
      if (adjustedValue === value) return
      setValue(adjustedValue)
      const newEvent = createChangeEvent(adjustedValue, name)
      onChange?.(newEvent)
    }

    const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
      const newValue = parseInt(e.target.value, 10)
      setValue(newValue)
      onChange?.(e)
    }

    const handleBlur = () => {
      if (Number.isNaN(value)) {
        setValue(minValue)
        const newEvent = createChangeEvent(minValue, name)
        onChange?.(newEvent)
      }
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
            {...props}
            ref={inputRef}
            value={value}
            onChange={handleChange}
            min={minValue}
            max={maxValue}
            onFocus={() => setFocused(true)}
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
