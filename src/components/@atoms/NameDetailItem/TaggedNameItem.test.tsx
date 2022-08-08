import { ShortExpiry } from '@app/components/@atoms/ExpiryComponents/ExpiryComponents'
import { mockFunction, render } from '@app/test-utils'
import { ReactNode } from 'react'
import { NameDetailItem } from './NameDetailItem'
import { TaggedNameItem } from './TaggedNameItem'

jest.mock('./NameDetailItem')
jest.mock('@app/components/@atoms/ExpiryComponents/ExpiryComponents')

const mockNameDetailItem = mockFunction(NameDetailItem)
const mockShortExpiry = mockFunction(ShortExpiry)

const mockComponent = ({ children }: { children: ReactNode }) => <div>{children}</div>

describe('TaggedNameItem', () => {
  it('should render expiry date if name has expiry date', () => {
    mockNameDetailItem.mockImplementation(mockComponent as any)
    mockShortExpiry.mockImplementation(({ expiry }) => <div>{expiry}</div>)

    const { getByText } = render(
      <TaggedNameItem
        name="name.eth"
        expiryDate={'2020-01-01' as any}
        isController
        isRegistrant
        network={1}
      />,
    )
    expect(getByText('2020-01-01')).toBeInTheDocument()
  })
  it('should render no expiry date if name has no expiry date', () => {
    const { queryByText } = render(
      <TaggedNameItem
        name="name.eth"
        expiryDate={null as any}
        isController
        isRegistrant
        network={1}
      />,
    )
    expect(queryByText('2020-01-01')).not.toBeInTheDocument()
  })
  it('should render registrant if .eth name', () => {
    const { queryByText } = render(
      <TaggedNameItem
        name="name.eth"
        expiryDate={'2020-01-01' as any}
        isController
        isRegistrant
        network={1}
      />,
    )
    expect(queryByText('name.registrant')).toBeInTheDocument()
  })
  it('should NOT render registrant if not a .eth name', () => {
    const { queryByText } = render(
      <TaggedNameItem
        name="name"
        expiryDate={'2020-01-01' as any}
        isController
        isRegistrant
        network={1}
      />,
    )
    expect(queryByText('name.registrant')).not.toBeInTheDocument()
  })
})
