import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Tag, mq } from '@ensdomains/thorin'

import { ReturnedName } from '@app/hooks/useNamesFromAddress'
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
  isController,
  isRegistrant,
  isWrappedOwner,
  fuses,
  expiryDate,
  network,
  truncatedName,
  mode,
  selected,
  disabled = false,
  onClick,
  notOwned,
  pccExpired,
}: Omit<ReturnedName, 'labelName' | 'labelhash' | 'isMigrated' | 'parent' | 'type' | 'id'> & {
  notOwned?: boolean
  network: number
  selected?: boolean
  mode?: 'select' | 'view'
  disabled?: boolean
  onClick?: () => void
  pccExpired?: boolean
}) => {
  const { t } = useTranslation('common')

  const isNativeEthName = /\.eth$/.test(name) && name.split('.').length === 2

  const tags: [enabled: boolean, translation: string][] = []

  if (notOwned) {
    tags.push([false, 'name.notOwned'])
  } else if (!fuses) {
    tags.push([!!isController, 'name.manager'])
    if (isNativeEthName) {
      tags.push([!!isRegistrant, 'name.owner'])
    }
  } else {
    tags.push([
      !!isWrappedOwner,
      fuses.parent.PARENT_CANNOT_CONTROL ? 'name.owner' : 'name.manager',
    ])
  }

  return (
    <NameDetailItem
      key={name}
      network={network}
      truncatedName={truncatedName}
      expiryDate={validateExpiry(name, fuses, expiryDate, pccExpired)}
      name={name}
      mode={mode}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
    >
      <OtherItemsContainer>
        {tags.map(([tagEnabled, translation]) => (
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
