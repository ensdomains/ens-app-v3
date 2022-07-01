import { render, screen, mockFunction } from '@app/test-utils'

import { NameDetailItem } from '@app/components/@atoms/NameDetailItem/NameDetailItem'
import { ShortExpiry } from '@app/components/@atoms/ExpiryComponents/ExpiryComponents'
import { NameListView } from './NameListView'

jest.mock('@app/components/@atoms/NameDetailItem/NameDetailItem')
const mockNameDetailItem = mockFunction(NameDetailItem)
jest.mock('@app/components/@atoms/ExpiryComponents/ExpiryComponents')
const mockShortExpiry = mockFunction(ShortExpiry)

const mockComponent = ({ children }) => <div>{children}</div>

describe('NameListView', () => {
  it('should render expiry date if name has expiry date', () => {
    mockNameDetailItem.mockImplementation(mockComponent)
    mockShortExpiry.mockImplementation(({ expiry }) => <div>{expiry}</div>)

    const { getByText } = render(
      <NameListView
        currentPage={[
          {
            name: 'name.eth',
            expiryDate: '2020-01-01',
            isController: true,
            isRegistrant: true,
          },
        ]}
        network={1}
      />,
    )
    expect(getByText('2020-01-01')).toBeInTheDocument()
  })
  it('should render no expiry date if name has no expiry date', () => {
    const { queryByText } = render(
      <NameListView
        currentPage={[
          {
            name: 'name.eth',
            expiryDate: null,
            isController: true,
            isRegistrant: true,
          },
        ]}
        network={1}
      />,
    )
    expect(queryByText('2020-01-01')).not.toBeInTheDocument()
  })
  it('should render no results if there are no results', () => {
    const { queryByText } = render(
      <NameListView currentPage={[]} network={1} />,
    )
    screen.debug()
    expect(queryByText('errors.noResults')).toBeInTheDocument()
  })
  it('should render registrant if .eth name', () => {
    const { queryByText } = render(
      <NameListView
        currentPage={[
          {
            name: 'name.eth',
            expiryDate: '2020-01-01',
            isController: true,
            isRegistrant: true,
          },
        ]}
        network={1}
      />,
    )
    expect(queryByText('Registrant')).toBeInTheDocument()
  })
  it('should NOT render registrant if not a .eth name', () => {
    const { queryByText } = render(
      <NameListView
        currentPage={[
          {
            name: 'name',
            expiryDate: '2020-01-01',
            isController: true,
            isRegistrant: true,
          },
        ]}
        network={1}
      />,
    )
    expect(queryByText('Registrant')).not.toBeInTheDocument()
  })
})
