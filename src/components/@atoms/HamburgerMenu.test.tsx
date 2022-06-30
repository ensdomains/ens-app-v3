import { render, screen, mockFunction, waitFor } from '@app/test-utils'

import { useTranslation } from 'react-i18next'
import { useRouter } from 'next/router'

import { HamburgerMenu } from './HamburgerMenu'

jest.mock('next/router')
jest.mock('react-i18next')
const mockUseRouter = mockFunction(useRouter)
const mockUseTranslation = mockFunction(useTranslation)

describe('HamburgerMenu', () => {
  const mockRouterObject = {
    query: {
      name: 'nick.eth',
    },
  }

  it('should render the correct label', () => {
    mockUseRouter.mockReturnValue(mockRouterObject)
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    })

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
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    })

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
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    })

    const mockReplace = jest.fn()

    const { location } = window
    delete window.location
    window.location = { replace: mockReplace }

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
    mockUseTranslation.mockReturnValue({
      t: (key: string) => key,
    })
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
