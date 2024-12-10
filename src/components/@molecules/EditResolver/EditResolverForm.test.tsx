import { fireEvent, render, screen, waitFor } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { makeMockIntersectionObserver } from '../../../../test/mock/makeMockIntersectionObserver'
import EditResolverForm, { Props } from './EditResolverForm'

makeMockIntersectionObserver()

vi.mock('@app/hooks/chain/useChainName', () => ({
  useChainName: vi.fn().mockReturnValue('mainnet'),
}))

vi.mock('../DogFood', () => ({
  DogFood: vi
    .fn()
    .mockImplementation(({ disabled }) => (
      <input data-testid="dogfood-input" disabled={disabled} />
    )),
}))

vi.mock('@app/utils/utils', () => ({
  makeEtherscanLink: vi.fn((address: string) => `https://etherscan.io/address/${address}`),
}))

describe('EditResolverForm', () => {
  const mockRegisterChange = vi.fn()
  const mockHandleSubmit = vi.fn()
  const mockRegister = vi.fn().mockImplementation(() => ({ onChange: mockRegisterChange }))
  const mockTrigger = vi.fn()
  const mockWatch = vi.fn()
  const mockSetValue = vi.fn()
  const mockGetFieldState = vi.fn()
  const mockReset = vi.fn()

  const lastestResolverAddress = '0x[localhost address not yet generated]'

  const defaultProps: Props = {
    lastestResolverAddress,
    isResolverAddressLatest: false,
    register: mockRegister,
    handleSubmit: mockHandleSubmit,
    reset: mockReset,
    trigger: mockTrigger,
    watch: mockWatch,
    getFieldState: mockGetFieldState,
    resolverChoice: 'latest',
    setValue: mockSetValue,
    customResolver: '',
    resolverWarnings: [],
    hasErrors: false,
    formRef: { current: null },
    resolverAddress: '0xabc',
    formState: { errors: {} } as Props['formState'],
    hasWarnings: false,
  }

  it('renders the form and latest resolver label correctly', () => {
    render(<EditResolverForm {...defaultProps} />)

    expect(screen.getByTestId('edit-resolver-form')).toBeInTheDocument()
    expect(screen.getByTestId('latest-resolver-radio')).toBeInTheDocument()
    expect(screen.getByText('input.editResolver.latestLabel')).toBeInTheDocument()
    expect(screen.getByTestId('latest-resolver-etherscan')).toHaveAttribute(
      'href',
      `https://etherscan.io/address/${lastestResolverAddress}`,
    )
  })

  it('renders the custom resolver radio button and DogFood input', () => {
    render(<EditResolverForm {...defaultProps} />)

    expect(screen.getByTestId('custom-resolver-radio')).toBeInTheDocument()
    expect(screen.getByTestId('dogfood-input')).toBeDisabled()
  })

  it('enables the DogFood input when "custom" is selected', async () => {
    mockWatch.mockReturnValue('custom')

    render(<EditResolverForm {...defaultProps} resolverChoice="custom" />)

    const customRadio = screen.getByTestId('custom-resolver-radio')
    fireEvent.click(customRadio)

    await waitFor(() => {
      expect(screen.getByTestId('dogfood-input')).not.toBeDisabled()
      expect(mockRegisterChange).toHaveBeenCalled()
    })
  })

  it('triggers validation on resolver choice change', async () => {
    render(<EditResolverForm {...defaultProps} />)

    const latestRadio = screen.getByTestId('latest-resolver-radio')
    expect(latestRadio).not.toBeDisabled()
    fireEvent.click(latestRadio)

    await waitFor(() => {
      expect(mockRegisterChange).toHaveBeenCalled()
    })
  })

  it('submits the form when handleSubmit is triggered', async () => {
    render(<EditResolverForm {...defaultProps} />)

    const form = screen.getByTestId('edit-resolver-form')
    fireEvent.submit(form)

    await waitFor(() => {
      expect(mockHandleSubmit).toHaveBeenCalled()
    })
  })
})
