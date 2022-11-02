import { mockFunction, render } from '@app/test-utils'

import { useAccount } from 'wagmi'

import { HeaderConnect } from './ConnectButton'

jest.mock('wagmi')

const mockUseAccount = mockFunction(useAccount)

describe('ConnectButton', () => {
  it('should return null if useAccount hook is connecting', () => {
    mockUseAccount.mockReturnValue({
      address: undefined,
      isConnecting: true,
      isReconnecting: false,
    })

    const { container } = render(<HeaderConnect />)
    expect(container).toBeEmptyDOMElement()
  })

  it('should return null if useAccount hook is reconnecting', () => {
    mockUseAccount.mockReturnValue({
      address: undefined,
      isConnecting: false,
      isReconnecting: true,
    })

    const { container } = render(<HeaderConnect />)
    expect(container).toBeEmptyDOMElement()
  })
})
