import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { NameWithRelation } from '@ensdomains/ensjs/subgraph'
import { mq, Tag } from '@ensdomains/thorin2'

import { validateExpiry } from '@app/utils/utils'

import { NameDetailItem } from './NameDetailItem'

const OtherItemsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-flow: column wrap;
    align-items: flex-end;
    justify-content: center;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
    ${mq.md.min(css`
      flex-direction: row;
      gap: ${theme.space['4']};
      flex-gap: ${theme.space['4']};
    `)}
  `,
)

export const TaggedNameItem = ({
  name,
  relation,
  fuses,
  expiryDate,
  truncatedName,
  mode,
  selected,
  disabled = false,
  onClick,
  notOwned,
  pccExpired,
  hasOtherItems = true,
}: Pick<NameWithRelation, 'name' | 'expiryDate' | 'truncatedName'> &
  Pick<Partial<NameWithRelation>, 'relation' | 'fuses'> & {
    notOwned?: boolean
    selected?: boolean
    mode?: 'select' | 'view'
    disabled?: boolean
    onClick?: () => void
    pccExpired?: boolean
    hasOtherItems?: boolean
  }) => {
  const { t } = useTranslation('common')

  const isNativeEthName = /\.eth$/.test(name!) && name!.split('.').length === 2

  const tags: [enabled: boolean, translation: string][] = []

  if (notOwned) {
    tags.push([false, 'name.notOwned'])
  } else if (!fuses) {
    tags.push([!!relation?.owner, 'name.manager'])
    if (isNativeEthName) {
      tags.push([!!relation?.registrant, 'name.owner'])
    }
  } else {
    tags.push([
      !!relation?.wrappedOwner,
      fuses.parent.PARENT_CANNOT_CONTROL ? 'name.owner' : 'name.manager',
    ])
  }

  return (
    <NameDetailItem
      key={name}
      truncatedName={truncatedName!}
      expiryDate={validateExpiry({ name: name!, fuses, expiry: expiryDate?.date, pccExpired })}
      name={name!}
      mode={mode}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
    >
      <OtherItemsContainer>
        {hasOtherItems &&
          tags.map(([tagEnabled, translation]) => (
            <Tag
              key={translation}
              colorStyle={!disabled && tagEnabled ? 'accentSecondary' : 'greySecondary'}
              data-testid={`tag-${translation}-${tagEnabled}`}
            >
              {t(translation)}
            </Tag>
          ))}
      </OtherItemsContainer>
    </NameDetailItem>
  )
}
