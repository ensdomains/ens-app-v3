import { fireEvent, render, screen } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import MainMenu from './MainMenu'

const mockSetCurrency = vi.fn()

vi.mock('@app/utils/useUserConfig', () => ({
  default: () => ({
    userConfig: { currency: 'eth', fiat: 'usd', theme: 'light' },
    setCurrency: mockSetCurrency,
  }),
}))

vi.mock('@app/utils/SyncProvider/SyncProvider', () => ({
  useGraphOutOfSync: vi.fn(() => false),
}))

vi.mock('@app/hooks/chain/useChainName', () => ({
  useChainName: vi.fn(() => 'Ethereum'),
}))

vi.mock('@app/hooks/chain/useGasPrice', () => ({
  useGasPrice: vi.fn(() => ({ data: null })),
}))

describe('MainMenu', () => {
  it('renders correctly', () => {
    render(<MainMenu setCurrentView={vi.fn()} />)

    expect(screen.getByTestId('main-menu')).toBeInTheDocument()
    expect(screen.getByText(/language/i)).toBeInTheDocument()
    expect(screen.getByText(/currency/i)).toBeInTheDocument()
  })

  it('calls setCurrentView with "language" when Language item is clicked', () => {
    const mockSetCurrentView = vi.fn()

    render(<MainMenu setCurrentView={mockSetCurrentView} />)

    fireEvent.click(screen.getByText(/language/i))
    expect(mockSetCurrentView).toHaveBeenCalledWith('language')
  })

  it('toggles currency setting correctly', async () => {
    render(<MainMenu setCurrentView={vi.fn()} />)

    fireEvent.click(screen.getByRole('checkbox'))
    expect(mockSetCurrency).toHaveBeenCalledWith('fiat')
  })
})
