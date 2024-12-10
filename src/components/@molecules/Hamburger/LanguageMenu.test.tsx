import { changeLanguageMock, fireEvent, mockSupportedLngs, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import LanguageMenu from './LanguageMenu'

vi.mock('iso-639-1', () => ({
  default: {
    getNativeName: (lang: string) => `Native Name of ${lang}`, // Return a mocked native name
  },
}))

describe('LanguageMenu', () => {
  it('renders the supported languages in sorted order', () => {
    const setCurrentViewMock = vi.fn()

    render(<LanguageMenu setCurrentView={setCurrentViewMock} />)

    mockSupportedLngs
      .filter((lang) => lang && lang !== 'cimode')
      .forEach((lang) => {
        expect(screen.getByTestId(`lang-${lang}`)).toBeInTheDocument()
        expect(screen.getByText(`Native Name of ${lang}`)).toBeInTheDocument()
        expect(screen.getByText(lang.toLocaleUpperCase())).toBeInTheDocument()
      })

    expect(screen.queryByTestId('lang-cimode')).not.toBeInTheDocument()
  })

  it('changes the language when a language item is clicked', () => {
    const setCurrentViewMock = vi.fn()

    render(<LanguageMenu setCurrentView={setCurrentViewMock} />)

    const frenchLanguageItem = screen.getByTestId('lang-fr')
    fireEvent.click(frenchLanguageItem)

    expect(changeLanguageMock).toHaveBeenCalledWith('fr')
  })

  it('calls setCurrentView with "main" when the heading is clicked', () => {
    const setCurrentViewMock = vi.fn()

    render(<LanguageMenu setCurrentView={setCurrentViewMock} />)
    const frenchLanguageItem = screen.getByTestId('lang-header')
    fireEvent.click(frenchLanguageItem)

    expect(setCurrentViewMock).toHaveBeenCalledWith('main')
  })

  it('shows the active language with a check icon', () => {
    const setCurrentViewMock = vi.fn()

    render(<LanguageMenu setCurrentView={setCurrentViewMock} />)

    const activeIcon = screen.getByTestId('check-lang-en')
    expect(activeIcon).toHaveStyle({ display: 'block' })

    const inactiveIcon = screen.getByTestId('check-lang-fr')
    expect(inactiveIcon).toHaveStyle({ display: 'none' })
  })
})
