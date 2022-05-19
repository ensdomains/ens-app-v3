import type { ReturnedName } from '@app/hooks/useNamesFromAddress'
import mq from '@app/mediaQuery'
import { Tag } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'
import { NameDetailItem } from '../NameDetailItem'
import { TabWrapper } from '../profile/TabWrapper'
import { ShortExpiry } from './ExpiryComponents'

const OtherItemsContainer = styled.div`
  display: flex;
  flex-direction: row;
  align-items: center;
  justify-content: center;
  ${({ theme }) => css`
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
    ${mq.medium.min`
      gap: ${theme.space['4']};
      flex-gap: ${theme.space['4']};
    `}
  `}
`

export const NameListView = ({
  currentPage,
  network,
}: {
  currentPage: ReturnedName[]
  network: string
}) => {
  return (
    <TabWrapper>
      {currentPage.map((name) => (
        <NameDetailItem key={name.name} network={network} {...name}>
          <OtherItemsContainer>
            {name.expiryDate && <ShortExpiry expiry={name.expiryDate} />}
            <Tag tone={name.isController ? 'accent' : 'secondary'}>
              Controller
            </Tag>
            <Tag tone={name.isRegistrant ? 'accent' : 'secondary'}>
              Registrant
            </Tag>
          </OtherItemsContainer>
        </NameDetailItem>
      ))}
    </TabWrapper>
  )
}
