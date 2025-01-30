import { useMemo } from 'react'
import { TFunction, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address } from 'viem'

import { Typography } from '@ensdomains/thorin'

import { AvatarWithZorb, NameAvatar } from '@app/components/AvatarWithZorb'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useBeautifiedName } from '@app/hooks/useBeautifiedName'
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
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid} ${theme.colors.border};
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
      background-color: ${theme.colors.backgroundSecondary};
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
  ({ theme }) => css`
    overflow-wrap: anywhere;
    text-align: right;
    margin-left: ${theme.space['2']};
  `,
)

const AddressSubtitle = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textSecondary};
    font-weight: ${theme.fontWeights.bold};
  `,
)

const AddressValue = ({ value }: { value: string }) => {
  const primary = usePrimaryName({ address: value as Address })

  const AddressTypography = useMemo(
    () =>
      primary.data?.name ? (
        <AddressSubtitle color="grey">{shortenAddress(value)}</AddressSubtitle>
      ) : (
        <ValueTypography fontVariant="bodyBold">{shortenAddress(value)}</ValueTypography>
      ),
    [primary.data?.name, value],
  )

  return (
    <ValueWithAvatarContainer>
      <InnerValueWrapper>
        {primary.data?.name && (
          <ValueTypography fontVariant="bodyBold" color="text">
            {primary.data?.beautifiedName}
          </ValueTypography>
        )}
        {AddressTypography}
      </InnerValueWrapper>
      <AvatarWrapper>
        <AvatarWithZorb address={value} name={primary.data?.name} label={`${value}-avatar`} />
      </AvatarWrapper>
    </ValueWithAvatarContainer>
  )
}

const NameValue = ({ value }: { value: string }) => {
  const beautifiedName = useBeautifiedName(value)

  return (
    <ValueWithAvatarContainer>
      <ValueTypography fontVariant="bodyBold">{beautifiedName}</ValueTypography>
      <AvatarWrapper>
        <NameAvatar name={value} label={`${value}-avatar`} />
      </AvatarWrapper>
    </ValueWithAvatarContainer>
  )
}

const SubnameValue = ({ value }: { value: string }) => {
  const [label, ...parentParts] = value.split('.')
  const parent = parentParts.join('.')

  return (
    <ValueWithAvatarContainer>
      <div>
        <ValueTypography fontVariant="bodyBold">{label}.</ValueTypography>
        <ValueTypography fontVariant="bodyBold">{parent}</ValueTypography>
      </div>
      <AvatarWrapper>
        <NameAvatar name={value} label={`${value}-avatar`} />
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

const ListValue = ({ value }: { value: string[] }) => {
  return (
    <ListContainer>
      {value.map((val, idx) => {
        const isLast = idx === value.length - 1
        const key = idx
        if (idx === 0) {
          return (
            <Typography key={key} fontVariant="bodyBold">
              {val}
            </Typography>
          )
        }
        return <ValueTypography key={key}>{`${val}${!isLast ? ',' : ''}`}</ValueTypography>
      })}
    </ListContainer>
  )
}

const RecordsContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    text-align: right;
    gap: 0.5rem;
    margin-left: 0.5rem;
    overflow: hidden;
  `,
)

const RecordContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
  `,
)

const DurationContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    text-align: right;
    flex-direction: column;
    gap: ${theme.space[1]};
  `,
)

const RecordsValue = ({ value }: { value: [string, string | undefined][] }) => {
  return (
    <RecordsContainer>
      {value.map(([key, val]) => (
        <RecordContainer key={`${key}-${val}`}>
          <Typography ellipsis>
            <strong>
              {key}
              {!!val && ':'}
            </strong>{' '}
            {!!val && val}
          </Typography>
        </RecordContainer>
      ))}
    </RecordsContainer>
  )
}

const DurationValue = ({
  value,
}: {
  value: { duration: string; newExpiry?: string | undefined }
}) => {
  const { t } = useTranslation('transactionFlow')

  if (!value) return null

  return (
    <DurationContainer>
      <Typography ellipsis>
        <strong>{value.duration}</strong>
      </Typography>
      <Typography color="grey" fontVariant="small">
        {t('transaction.extendNames.newExpiry', { date: value.newExpiry })}
      </Typography>
    </DurationContainer>
  )
}

const DisplayItemValue = (props: Omit<TransactionDisplayItem, 'label'>) => {
  const { value, type } = props as TransactionDisplayItem
  if (type === 'duration') {
    return <DurationValue value={value} />
  }

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
  if (type === 'records') {
    return <RecordsValue value={value} />
  }
  return <ValueTypography fontVariant="bodyBold">{value}</ValueTypography>
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
