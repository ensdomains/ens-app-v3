/* eslint-disable no-nested-ternary */
import { useMemo } from 'react'
import styled, { css } from 'styled-components'

import { DynamicIcon } from './DynamicIcon'

type Props = {
  group: string
  item: string
  label?: string
  selected?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const Container = styled.button<{ $selected?: boolean }>(
  ({ theme, disabled, $selected }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space[1]};
    border-width: 1px;
    border-style: solid;
    border-radius: ${theme.radii.medium};
    border-color: ${theme.colors.grey};
    background-color: ${theme.colors.white};
    padding: ${theme.space[4]} ${theme.space[2]};

    ${$selected &&
    css`
      border-color: ${theme.colors.accent};
      background-color: ${theme.colors.accentSecondary};
    `}

    ${disabled &&
    css`
      border-color: ${theme.colors.grey};
      background-color: ${theme.colors.backgroundSecondary};
    `}
    transition: all 0.3s ease-out;
    transition-property: border-color, background-color;
  `,
)

const OptionIcon = styled.div(
  ({ theme }) => css`
    width: ${theme.space[5]};
    height: ${theme.space[5]};
    svg {
      width: 100%;
      height: 100%;
    }
  `,
)

const OptionLabel = styled.div<{
  $uppercase: boolean
}>(
  ({ theme, $uppercase }) => css`
    font-size: ${theme.fontSizes.small};
    line-height: ${theme.space[5]};

    text-transform: ${$uppercase ? 'uppercase' : 'capitalize'};
  `,
)

export const OptionButton = ({
  group,
  item,
  label: _label,
  disabled,
  selected,
  ...props
}: Props) => {
  const label = _label || item
  const Icon = useMemo(() => {
    return <DynamicIcon group={group} name={item} />
  }, [group, item])
  return (
    <Container type="button" disabled={disabled} $selected={selected} {...props}>
      <OptionIcon>{Icon}</OptionIcon>
      <OptionLabel $uppercase={!_label}>{label}</OptionLabel>
    </Container>
  )
}
