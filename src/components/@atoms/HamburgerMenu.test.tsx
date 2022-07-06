/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/click-events-have-key-events */
import { mockFunction, render, screen, waitFor } from '@app/test-utils'
import { useRouter } from 'next/router'
import { HamburgerMenu } from './HamburgerMenu'

jest.mock('next/router')
jest.mock('next/link', () => {
  const React = jest.requireActual('react')
  const { UrlObject } = jest.requireActual('url')

  type Url = string | typeof UrlObject
  type LinkProps = {
    href: Url
    as?: Url
  }

  return ({ children, href }: React.PropsWithChildren<LinkProps>) =>
    React.cloneElement(React.Children.only(children), { href })
})
const mockUseRouter = mockFunction(useRouter)

describe('HamburgerMenu', () => {
  mockUseRouter.mockReturnValue({
    query: {
      name: 'nick.eth',
    },
  })

  it('should render the correct label', () => {
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
  it('should use next/link if https link', async () => {
    const dropdownItems = [
      {
        label: 'testLabel',
        href: 'https://test.com',
      },
    ]

    render(<HamburgerMenu {...{ dropdownItems }} />)
    screen.getByTestId('dropdown').click()
    expect(screen.getByText('testLabel')).toHaveAttribute(
      'href',
      'https://test.com',
    )
  })
  it('should use next/link if http link', async () => {
    const dropdownItems = [
      {
        label: 'testLabel',
        href: 'http://test.com',
      },
    ]
    render(<HamburgerMenu {...{ dropdownItems }} />)
    screen.getByTestId('dropdown').click()
    expect(screen.getByText('testLabel')).toHaveAttribute(
      'href',
      'http://test.com',
    )
  })
})
