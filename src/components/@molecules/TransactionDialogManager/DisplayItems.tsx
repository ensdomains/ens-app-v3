import { useMemo } from 'react'
import { TFunction, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { AvatarWithZorb, NameAvatar } from '@app/components/AvatarWithZorb'
import { useChainId } from '@app/hooks/useChainId'
import { usePrimary } from '@app/hooks/usePrimary'
import { TransactionDisplayItem } from '@app/types'
import { shortenAddress } from '@app/utils/utils'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: stretch;
    width: ${theme.space.full};
    gap: ${theme.space['2']};
  `,
)

const DisplayItemContainer = styled.div<{ $shrink?: boolean; $fade?: boolean }>(
  ({ theme, $shrink, $fade }) => css`
    display: grid;
    grid-template-columns: 0.5fr 2fr;
    align-items: center;
    border-radius: ${theme.radii.extraLarge};
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid}
      rgba(${theme.shadesRaw.foreground}, 0.06);
    min-height: ${theme.space['14']};
    padding: ${theme.space['2']} ${theme.space['5']};
    width: ${theme.space.full};

    ${$shrink &&
    css`
      min-height: ${theme.space['12']};
      div {
        margin-top: 0;
        align-self: center;
      }
    `}
    ${$fade &&
    css`
      opacity: 0.5;
      background-color: ${theme.colors.backgroundTertiary};
    `}
  `,
)

const DisplayItemLabel = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textSecondary};
    justify-self: flex-start;
  `,
)

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['7']};
    min-width: ${theme.space['7']};
    height: ${theme.space['7']};
  `,
)

const ValueWithAvatarContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['4']};
  `,
)

const InnerValueWrapper = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: flex-end;
    justify-content: center;
    text-align: right;
  `,
)

const ValueTypography = styled(Typography)(
  () => css`
    text-align: right;
  `,
)

const AddressSubtitle = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textSecondary};
    font-weight: ${theme.fontWeights.medium};
  `,
)

const AddressValue = ({ value }: { value: string }) => {
  const primary = usePrimary(value)
  const network = useChainId()

  const AddressTypography = useMemo(
    () =>
      primary.name ? (
        <AddressSubtitle variant="label">{shortenAddress(value)}</AddressSubtitle>
      ) : (
        <ValueTypography weight="bold">{shortenAddress(value)}</ValueTypography>
      ),
    [primary.name, value],
  )

  return (
    <ValueWithAvatarContainer>
      <InnerValueWrapper>
        {primary.name && <ValueTypography weight="bold">{primary.name}</ValueTypography>}
        {AddressTypography}
      </InnerValueWrapper>
      <AvatarWrapper>
        <AvatarWithZorb
          address={value}
          name={primary.name || undefined}
          label={`${value}-avatar`}
          network={network}
        />
      </AvatarWrapper>
    </ValueWithAvatarContainer>
  )
}

const NameValue = ({ value }: { value: string }) => {
  const network = useChainId()

  return (
    <ValueWithAvatarContainer>
      <ValueTypography weight="bold">{value}</ValueTypography>
      <AvatarWrapper>
        <NameAvatar name={value} label={`${value}-avatar`} network={network} />
      </AvatarWrapper>
    </ValueWithAvatarContainer>
  )
}

const SubnameValue = ({ value }: { value: string }) => {
  const network = useChainId()
  const [label, ...parentParts] = value.split('.')
  const parent = parentParts.join('.')
  return (
    <ValueWithAvatarContainer>
      <div>
        <ValueTypography weight="bold">{label}.</ValueTypography>
        <ValueTypography weight="bold">{parent}</ValueTypography>
      </div>
      <AvatarWrapper>
        <NameAvatar name={value} label={`${value}-avatar`} network={network} />
      </AvatarWrapper>
    </ValueWithAvatarContainer>
  )
}

const ListContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    text-align: right;
  `,
)

const ListItemTypography = styled(Typography)(() => css``)

const ListValue = ({ value }: { value: string[] }) => {
  return (
    <ListContainer>
      {value.map((val, idx) => {
        const isLast = idx === value.length - 1
        const key = idx
        if (idx === 0) {
          return (
            <Typography key={key} weight="bold">
              {val}
            </Typography>
          )
        }
        return <ListItemTypography key={key}>{`${val}${!isLast ? ',' : ''}`}</ListItemTypography>
      })}
    </ListContainer>
  )
}

const DisplayItemValue = (props: Omit<TransactionDisplayItem, 'label'>) => {
  const { value, type } = props as TransactionDisplayItem
  if (type === 'address') {
    return <AddressValue value={value} />
  }
  if (type === 'name') {
    return <NameValue value={value} />
  }
  if (type === 'subname') {
    return <SubnameValue value={value} />
  }
  if (type === 'list') {
    return <ListValue value={value} />
  }
  return <ValueTypography weight="bold">{value}</ValueTypography>
}

export const DisplayItem = ({
  label,
  value,
  type,
  shrink,
  fade,
  useRawLabel,
  t,
}: TransactionDisplayItem & { t: TFunction }) => {
  return (
    <DisplayItemContainer
      data-testid={`display-item-${label}-${fade ? 'fade' : 'normal'}`}
      $fade={fade}
      $shrink={shrink}
      key={`${label}-${value}`}
    >
      <DisplayItemLabel>
        {useRawLabel ? label : t(`transaction.itemLabel.${label}`)}
      </DisplayItemLabel>
      <DisplayItemValue {...{ value, type }} />
    </DisplayItemContainer>
  )
}

export const DisplayItems = ({ displayItems }: { displayItems: TransactionDisplayItem[] }) => {
  const { t } = useTranslation()

  if (!displayItems || !displayItems.length) return null

  return <Container>{displayItems.map((props) => DisplayItem({ ...props, t }))}</Container>
}
