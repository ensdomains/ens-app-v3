/* eslint-disable no-nested-ternary */
import styled, { css } from 'styled-components'

import { DynamicAddressIcon } from '@app/assets/address/DynamicAddressIcon'
import { DynamicContentHashIcon } from '@app/assets/contentHash/DynamicContentHashIcon'
import { DynamicSocialIcon } from '@app/assets/social/DynamicSocialIcon'
import { DynamicTextIcon } from '@app/assets/text/DynamicTextIcon'

type Props = {
  group: string
  item: string
  label?: string
  selected?: boolean
} & React.ButtonHTMLAttributes<HTMLButtonElement>

const DynamicIcon = ({ group, name }: { group: string; name: string }) => {
  console.log(group, name)
  if (group === 'address') return <DynamicAddressIcon name={name} />
  if (group === 'website') return <DynamicContentHashIcon name={name} />
  if (group === 'social') {
    return <DynamicSocialIcon name={name} />
  }
  return <DynamicTextIcon name={name} />
}

const Container = styled.button<{ $selected?: boolean }>(
  ({ theme, disabled, $selected }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space[1]};
    border-width: 1px;
    border-style: solid;
    border-color: ${$selected ? theme.colors.accent : theme.colors.grey};
    border-radius: ${theme.radii.medium};
    background: ${disabled
      ? theme.colors.backgroundSecondary
      : $selected
      ? theme.colors.accentSecondary
      : theme.colors.white};
    padding: ${theme.space[4]} ${theme.space[2]};
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
  return (
    <Container type="button" disabled={disabled} $selected={selected} {...props}>
      <OptionIcon>
        <DynamicIcon group={group} name={item} />
      </OptionIcon>
      <OptionLabel $uppercase={!_label}>{label}</OptionLabel>
    </Container>
  )
}
