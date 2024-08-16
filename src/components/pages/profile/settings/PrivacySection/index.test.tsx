import { fireEvent, mockFunction, render, screen } from '@app/test-utils'

import { afterEach, describe, expect, it, Mock, vi } from 'vitest'

import { useLocalStorage } from '@app/hooks/useLocalStorage'

import { PrivacySection } from './index'

vi.mock('@app/hooks/useLocalStorage', () => ({
  useLocalStorage: vi.fn(),
}))

const localStorage = mockFunction(useLocalStorage)

describe('PrivacySection', () => {
  afterEach(() => {
    vi.clearAllMocks()
  })
  it('renders the section with disabled clear button when history is empty', () => {
    //given an empty history
    localStorage.mockReturnValue([[], vi.fn()])

    //when the component is rendered
    render(<PrivacySection />)

    //then the clear button should be disabled
    expect(screen.getByTestId('privacy-section')).toBeInTheDocument()
    expect(screen.getByText('section.privacy.title')).toBeInTheDocument()
    expect(screen.getByTestId('history-clear-button')).toBeInTheDocument()
    expect(screen.getByTestId('history-clear-button')).toBeDisabled() // Button should be disabled with empty history
  })

  it('enables the clear button when history exists', () => {
    //given a non-empty history
    const mockHistory = [
      {
        nameType: 'address',
        text: 'example.eth',
        lastAccessed: Date.now(),
      },
    ]
    localStorage.mockReturnValue([mockHistory, vi.fn()])

    //when the component is rendered
    render(<PrivacySection />)

    //then the clear button should be enabled
    expect(screen.getByTestId('history-clear-button')).toBeEnabled()
  })

  it('clears the history when the clear button is clicked', () => {
    //given the component is rendered with a non-empty history
    const mockSetHistory = vi.fn()
    const mockHistory = [
      {
        nameType: 'address',
        text: 'example.eth',
        lastAccessed: Date.now(),
      },
    ]

    localStorage.mockReturnValue([mockHistory, mockSetHistory])

    render(<PrivacySection />)

    //when the clear button is clicked
    const clearButton = screen.getByTestId('history-clear-button')
    fireEvent.click(clearButton)

    //then the history should be cleared
    expect(mockSetHistory).toHaveBeenCalledTimes(1)
    expect(mockSetHistory).toHaveBeenCalledWith([])
  })
})
