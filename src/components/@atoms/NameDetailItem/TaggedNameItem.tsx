import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Tag, mq } from '@ensdomains/thorin'

import { ReturnedName } from '@app/hooks/useNamesFromAddress'

import { NameDetailItem } from './NameDetailItem'

const OtherItemsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    flex-wrap: wrap;
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
  expiryDate,
  network,
  truncatedName,
  mode,
  selected,
  disabled = false,
  onClick,
}: Omit<ReturnedName, 'labelName' | 'labelhash' | 'isMigrated' | 'parent' | 'type' | 'id'> & {
  network: number
  selected?: boolean
  mode?: 'select' | 'view'
  disabled?: boolean
  onClick?: () => void
}) => {
  const { t } = useTranslation('common')

  const isNativeEthName = /\.eth$/.test(name) && name.split('.').length === 2

  return (
    <NameDetailItem
      key={name}
      network={network}
      truncatedName={truncatedName}
      expiryDate={expiryDate}
      name={name}
      mode={mode}
      selected={selected}
      disabled={disabled}
      onClick={onClick}
    >
      <OtherItemsContainer>
        <Tag tone={isController && !disabled ? 'accent' : 'secondary'}>{t('name.manager')}</Tag>
        {isNativeEthName && (
          <Tag tone={isRegistrant && !disabled ? 'accent' : 'secondary'}>{t('name.owner')}</Tag>
        )}
      </OtherItemsContainer>
    </NameDetailItem>
  )
}
