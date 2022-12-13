import { render, screen, userEvent, waitFor } from '@app/test-utils'

import { renderHook } from '@testing-library/react-hooks'
import { useForm } from 'react-hook-form'

import { grouped as options } from '@app/constants/profileRecordOptions'
import { RegistrationForm } from '@app/hooks/useRegistrationForm'

import { AddProfileRecordView } from './AddProfileRecordView'

const { result } = renderHook(() =>
  useForm<RegistrationForm>({
    defaultValues: {
      records: [],
    },
  }),
)

const mockIntersectionObserver = jest.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver
window.scroll = jest.fn()

describe('AddProfileRecordView', () => {
  it('should render', () => {
    render(<AddProfileRecordView control={result.current.control} />)
    expect(screen.getByText('steps.profile.addProfile'))
    options.forEach(({ group, items }) => {
      expect(screen.getAllByText(`steps.profile.options.groups.${group}.label`).length).toBe(2)
      items.forEach(({ key }) => {
        expect(screen.getByTestId(`profile-record-option-${key}`)).toBeInTheDocument()
      })
    })
  })

  it('should disable currently selected options', async () => {
    result.current.reset({ records: [{ key: 'name', type: 'text', group: 'general' }] })
    render(<AddProfileRecordView control={result.current.control} />)
    expect(screen.getByTestId('profile-record-option-name')).toBeDisabled()
  })

  it('should disable all contenthash options if a website option is already selected', async () => {
    result.current.reset({ records: [{ key: 'ipfs', type: 'contenthash', group: 'website' }] })
    render(<AddProfileRecordView control={result.current.control} />)
    expect(screen.getByTestId('profile-record-option-contentHash')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-ipfs')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-skynet')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-swarm')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-onion')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-arweave')).toBeDisabled()
  })

  it('should disable all contenthash options if a contentHash option is already selected', async () => {
    result.current.reset({ records: [{ key: 'contentHash', type: 'contenthash', group: 'other' }] })
    render(<AddProfileRecordView control={result.current.control} />)
    expect(screen.getByTestId('profile-record-option-contentHash')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-ipfs')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-skynet')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-swarm')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-onion')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-arweave')).toBeDisabled()
  })

  it('should disable other contenthash options if a website option is selected', async () => {
    result.current.reset({ records: [] })
    render(<AddProfileRecordView control={result.current.control} />)
    await userEvent.click(screen.getByTestId('profile-record-option-ipfs'))
    expect(screen.getByTestId('profile-record-option-ipfs')).toHaveStyle(
      'background-color: rgba(82, 152, 255, 0.15)',
    )
    expect(screen.getByTestId('profile-record-option-contentHash')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-skynet')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-swarm')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-onion')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-arweave')).toBeDisabled()
    await userEvent.click(screen.getByTestId('profile-record-option-ipfs'))
    expect(screen.getByTestId('profile-record-option-ipfs')).not.toHaveStyle(
      'background-color: rgba(82, 152, 255, 0.15)',
    )
    expect(screen.getByTestId('profile-record-option-contentHash')).not.toBeDisabled()
    expect(screen.getByTestId('profile-record-option-skynet')).not.toBeDisabled()
    expect(screen.getByTestId('profile-record-option-swarm')).not.toBeDisabled()
    expect(screen.getByTestId('profile-record-option-onion')).not.toBeDisabled()
    expect(screen.getByTestId('profile-record-option-arweave')).not.toBeDisabled()
  })

  it('should disable other contenthash options if a website option is selected', async () => {
    result.current.reset({ records: [] })
    render(<AddProfileRecordView control={result.current.control} />)
    await userEvent.click(screen.getByTestId('profile-record-option-contentHash'))
    expect(screen.getByTestId('profile-record-option-contentHash')).toHaveStyle(
      'background-color: rgba(82, 152, 255, 0.15)',
    )
    expect(screen.getByTestId('profile-record-option-ipfs')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-skynet')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-swarm')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-onion')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-arweave')).toBeDisabled()
    await userEvent.click(screen.getByTestId('profile-record-option-contentHash'))
    expect(screen.getByTestId('profile-record-option-contentHash')).not.toHaveStyle(
      'background-color: rgba(82, 152, 255, 0.15)',
    )
    expect(screen.getByTestId('profile-record-option-ipfs')).not.toBeDisabled()
    expect(screen.getByTestId('profile-record-option-skynet')).not.toBeDisabled()
    expect(screen.getByTestId('profile-record-option-swarm')).not.toBeDisabled()
    expect(screen.getByTestId('profile-record-option-onion')).not.toBeDisabled()
    expect(screen.getByTestId('profile-record-option-arweave')).not.toBeDisabled()
  })

  it('should filter by search input', async () => {
    result.current.reset({ records: [] })
    render(<AddProfileRecordView control={result.current.control} />)
    await userEvent.type(screen.getByTestId('profile-record-search-input'), 'description')
    await waitFor(() => {
      options.forEach(({ items }) => {
        items.forEach(({ key }) => {
          if (key === 'description')
            expect(screen.getByTestId(`profile-record-option-${key}`)).toBeInTheDocument()
          else expect(screen.queryByTestId(`profile-record-option-${key}`)).toBe(null)
        })
      })
    })
  })

  it('should show custom profile option if there are no search results', async () => {
    result.current.reset({ records: [] })
    render(<AddProfileRecordView control={result.current.control} />)
    await userEvent.type(
      screen.getByTestId('profile-record-search-input'),
      'thereshouldbenomatches',
    )
    await waitFor(() => {
      expect(screen.getByTestId('profile-record-option-custom')).toBeInTheDocument()
      options.forEach(({ items }) => {
        items.forEach(({ key }) => {
          expect(screen.queryByTestId(`profile-record-option-${key}`)).toBe(null)
        })
      })
    })
  })
})
