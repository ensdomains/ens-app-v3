import { CurrencyUnit, FiatUnit } from '@app/types'
import { MouseEventHandler, useRef } from 'react'
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
    cursor: pointer;
  `,
)

type Props = {
  value?: CurrencyUnit
  fiat?: FiatUnit
  onChange: (value: CurrencyUnit) => void
}

export const CurrencySwitch = ({ value, onChange, fiat = 'usd' }: Props) => {
  const leftRef = useRef<HTMLDivElement>(null)
  const rightRef = useRef<HTMLDivElement>(null)

  const toggleHandler: MouseEventHandler<HTMLDivElement> = (e) => {
    const newValue = e.target === leftRef.current ? 'eth' : 'fiat'
    onChange(newValue)
  }

  const side = value === 'eth' ? 'left' : 'right'

  return (
    <Container onClick={toggleHandler}>
      <Slider $side={side} data-testid="currency-switch" />
      <Label ref={leftRef} $active={value === 'eth'}>
        ETH
      </Label>
      <Label ref={rightRef} $active={value === 'fiat'}>
        {fiat.toUpperCase()}
      </Label>
    </Container>
  )
}
