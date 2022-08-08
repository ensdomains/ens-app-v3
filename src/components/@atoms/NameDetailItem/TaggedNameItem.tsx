import { ReturnedName } from '@app/hooks/useNamesFromAddress'
import { mq, Tag } from '@ensdomains/thorin'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { ShortExpiry } from '../ExpiryComponents/ExpiryComponents'
import { NameDetailItem } from './NameDetailItem'

const OtherItemsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
    ${mq.md.min(css`
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
}: Omit<ReturnedName, 'labelName' | 'labelhash' | 'isMigrated' | 'parent' | 'type' | 'id'> & {
  network: number
}) => {
  const { t } = useTranslation('common')

  const isNativeEthName = /\.eth$/.test(name) && name.split('.').length === 2

  return (
    <NameDetailItem key={name} network={network} truncatedName={truncatedName} name={name}>
      <OtherItemsContainer>
        {expiryDate && <ShortExpiry expiry={expiryDate} />}
        <Tag tone={isController ? 'accent' : 'secondary'}>{t('name.controller')}</Tag>
        {isNativeEthName && (
          <Tag tone={isRegistrant ? 'accent' : 'secondary'}>{t('name.registrant')}</Tag>
        )}
      </OtherItemsContainer>
    </NameDetailItem>
  )
}
