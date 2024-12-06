import { fireEvent, render, screen, waitFor } from '@app/test-utils'

import { FormState } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import { DogFood } from './DogFood'

// Mock external hooks and dependencies
vi.mock('react-i18next', () => ({
  useTranslation: () => ({
    t: (key: string) => {
      const translations: Record<string, string> = {
        'profile:details.sendName.inputPlaceholder': 'Enter ENS name or address',
        'profile:errors.addressLength': 'Invalid address length',
        'profile:errors.invalidAddress': 'Invalid address',
      }
      return translations[key] || key
    },
  }),
}))

vi.mock('@tanstack/react-query', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')),
  useQueryClient: vi.fn().mockReturnValue({
    getQueryData: vi.fn().mockImplementation(() => ({
      value: '0x123',
    })),
  }),
}))

vi.mock('@app/hooks/ensjs/public/useAddressRecord', () => ({
  useAddressRecord: vi.fn().mockReturnValue({
    data: { value: '0x123' },
  }),
}))

vi.mock('react-hook-form', () => ({
  useForm: vi.fn().mockImplementation(() => ({
    register: vi.fn(),
    watch: vi.fn().mockReturnValue(''),
    setValue: vi.fn(),
    trigger: vi.fn(),
    formState: { errors: {} },
  })),
}))

describe('DogFood Component', () => {
  it('renders the input with placeholder text', () => {
    render(
      <DogFood
        register={vi.fn()}
        watch={vi.fn()}
        formState={{ errors: {} } as FormState<any>}
        setValue={vi.fn()}
        trigger={vi.fn()}
      />,
    )
    expect(screen.getByTestId('dogfood')).toHaveAttribute(
      'placeholder',
      'details.sendName.inputPlaceholder',
    )
  })

  it('shows an error for invalid address length', async () => {
    const mockSetValue = vi.fn()
    const mockTrigger = vi.fn()
    const mockWatch = vi.fn().mockReturnValue('0x123')

    render(
      <DogFood
        register={vi.fn()}
        watch={mockWatch}
        formState={{ errors: { dogfoodRaw: { message: 'Invalid address length' } } } as any}
        setValue={mockSetValue}
        trigger={mockTrigger}
      />,
    )

    fireEvent.change(screen.getByTestId('dogfood'), { target: { value: '0x123' } })
    await waitFor(() => {
      expect(screen.getByText('Invalid address length')).toBeInTheDocument()
    })
  })

  it('handles ENS name and retrieves the corresponding address', async () => {
    const mockSetValue = vi.fn()
    const mockTrigger = vi.fn()
    const mockWatch = vi.fn().mockReturnValue('test.eth')

    render(
      <DogFood
        register={vi.fn()}
        watch={mockWatch}
        formState={{ errors: {} } as FormState<any>}
        setValue={mockSetValue}
        trigger={mockTrigger}
      />,
    )

    await waitFor(() => {
      expect(mockSetValue).toHaveBeenCalledWith('address', '0x123')
      expect(mockTrigger).toHaveBeenCalledWith('dogfoodRaw')
    })
  })

  it('show DisplayItems when has no error & not disabled & has value', () => {
    const mockSetValue = vi.fn()
    const mockWatch = vi.fn().mockReturnValue('test.eth')

    render(
      <DogFood
        register={vi.fn()}
        watch={mockWatch}
        disabled={false}
        formState={{ errors: {} } as FormState<any>}
        setValue={mockSetValue}
        trigger={vi.fn()}
      />,
    )

    expect(screen.getByTestId('dogfood-items')).toBeInTheDocument()
  })
})
