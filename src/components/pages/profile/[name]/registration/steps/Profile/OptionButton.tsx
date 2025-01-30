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
    border-color: ${theme.colors.border};
    background-color: ${theme.colors.background};
    padding: ${theme.space[4]} ${theme.space[2]};
    cursor: pointer;

    &:hover {
      background-color: ${theme.colors.backgroundSecondary};
      transform: translateY(-1px);
    }

    ${$selected &&
    css`
      border-color: ${theme.colors.accent};
      background-color: ${theme.colors.accentSurface};

      &:hover {
        background-color: ${theme.colors.accentLight};
      }
    `}

    ${disabled &&
    css`
      border-color: ${theme.colors.border};
      background-color: ${theme.colors.greyLight};
      color: ${theme.colors.greyPrimary};
      cursor: not-allowed;

      &:hover {
        background-color: ${theme.colors.greyLight};
        transform: initial;
      }
    `}
    transition: all 0.3s ease-out;
    transition-property: border-color, background-color, transform;
  `,
)

const OptionIcon = styled.div(
  ({ theme }) => css`
    width: ${theme.space[5]};
    height: ${theme.space[5]};
    color: ${theme.colors.textPrimary};
    svg {
      display: block;
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
