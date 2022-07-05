import { mockFunction, render, screen, waitFor } from '@app/test-utils'
import { useRouter } from 'next/router'
import { HamburgerMenu } from './HamburgerMenu'

jest.mock('next/router')
const mockUseRouter = mockFunction(useRouter)

describe('HamburgerMenu', () => {
  const mockRouterObject = {
    query: {
      name: 'nick.eth',
    },
  }

  it('should render the correct label', () => {
    mockUseRouter.mockReturnValue(mockRouterObject)

    const dropdownItems = [
      {
        label: 'testLabel',
      },
    ]

    render(<HamburgerMenu {...{ dropdownItems }} />)
    expect(screen.getByText('testLabel')).toBeInTheDocument()
  })
  it('should use provided onClick if there is one', async () => {
    const mockOnClick = jest.fn()
    mockUseRouter.mockReturnValue(mockRouterObject)

    const dropdownItems = [
      {
        label: 'testLabel',
        onClick: mockOnClick,
      },
    ]

    render(<HamburgerMenu {...{ dropdownItems }} />)
    screen.getByTestId('dropdown').click()
    screen.getByText('testLabel').click()
    await waitFor(() => {
      expect(mockOnClick).toHaveBeenCalled()
    })
  })
  it('should redirect on click if https link', async () => {
    mockUseRouter.mockReturnValue(mockRouterObject)

    const mockReplace = jest.fn()

    const { location } = window
    delete (window as any).location
    window.location = { replace: mockReplace } as any

    const dropdownItems = [
      {
        label: 'testLabel',
        href: 'https://test.com',
      },
    ]

    render(<HamburgerMenu {...{ dropdownItems }} />)
    screen.getByTestId('dropdown').click()
    screen.getByText('testLabel').click()
    await waitFor(() => {
      expect(mockReplace).toHaveBeenCalledWith('https://test.com')
    })

    window.location = location
  })
  it('should redirect on click if http link', async () => {
    const mockPush = jest.fn()
    const mockRouterObjectLocal = {
      push: mockPush,
    }
    mockUseRouter.mockReturnValue(mockRouterObjectLocal)

    const dropdownItems = [
      {
        label: 'testLabel',
        href: 'http://test.com',
      },
    ]
    render(<HamburgerMenu {...{ dropdownItems }} />)
    screen.getByTestId('dropdown').click()
    screen.getByText('testLabel').click()
    await waitFor(() => {
      expect(mockPush).toHaveBeenCalledWith('http://test.com')
    })
  })
})
