import type { ReturnedName } from '@app/hooks/useNamesFromAddress'
import { Tag } from '@ensdomains/thorin'
import styled from 'styled-components'
import { NameDetailItem } from '../NameDetailItem'
import { TabWrapper } from '../profile/TabWrapper'
import { ShortExpiry } from './ExpiryComponents'

const OtherItemsContainer = styled.div`
  display: flex;
  gap: ${({ theme }) => theme.space['4']};
  flex-direction: row;
  align-items: center;
  justify-content: center;
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
