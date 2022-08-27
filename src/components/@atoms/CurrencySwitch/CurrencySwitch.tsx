import { useEffect, useState } from 'react'
import styled, { css } from 'styled-components'

const Container = styled.div(
  ({ theme }) => css`
    position: relative;
    background: ${theme.colors.backgroundTertiary};
    border: ${theme.space['0.5']} solid ${theme.colors.backgroundTertiary};
    border-radius: ${theme.radii.full};
    height: ${theme.space[8]};
    display: flex;
    box-sizing: content-box;
  `,
)

const Slider = styled.div<{ $side: 'left' | 'right' }>(
  ({ theme, $side }) => css`
    position: absolute;
    left: ${$side === 'left' ? '0' : '50%'};
    background: ${theme.colors.accent};
    width: 50%;
    height: 100%;
    border-radius: ${theme.radii.full};
    transition: left 0.3s ease-in-out;
  `,
)

const Label = styled.div<{ $active: boolean }>(
  ({ $active, theme }) => css`
    padding: ${theme.space[1]} ${theme.space[4]};
    line-height: ${theme.space[5]};
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.fontSizes.label};
    z-index: 1;
    color: ${$active ? theme.colors.white : theme.colors.textTertiary};
    transition: color 0.3s ease-in-out;
    display: flex;
    align-items: center;
    justify-content: center;
    vertical-align: middle;
  `,
)

type Props = {
  value?: 'usd' | 'eth'
  onChange?: (value: 'eth' | 'usd') => void
}

export const CurrencySwitch = ({ value: _value, onChange }: Props) => {
  const [value, setValue] = useState<Props['value']>(_value || 'eth')
  useEffect(() => {
    if (_value && _value !== value) {
      setValue(_value)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [_value])

  const toggleHandler = () => {
    const newValue = value === 'eth' ? 'usd' : 'eth'
    setValue(newValue)
    onChange?.(newValue)
  }

  const side = value === 'eth' ? 'left' : 'right'

  return (
    <Container onClick={toggleHandler}>
      <Slider $side={side} data-testid="currency-switch" />
      <Label $active={value === 'eth'}>ETH</Label>
      <Label $active={value === 'usd'}>USD</Label>
    </Container>
  )
}
