/* eslint-disable no-await-in-loop */
import { render, screen, userEvent, waitFor } from '@app/test-utils'

import { renderHook } from '@testing-library/react-hooks'
import { useForm } from 'react-hook-form'
import { describe, expect, it, vi } from 'vitest'

import allOptionsArray, { grouped as options } from '@app/constants/profileRecordOptions'
import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'

import { AddProfileRecordView } from './AddProfileRecordView'

const { result } = renderHook(() =>
  useForm<ProfileEditorForm>({
    defaultValues: {
      records: [],
    },
  }),
)

const mockIntersectionObserver = vi.fn()
mockIntersectionObserver.mockReturnValue({
  observe: () => null,
  unobserve: () => null,
  disconnect: () => null,
})
window.IntersectionObserver = mockIntersectionObserver
window.scroll = vi.fn() as () => void

vi.setConfig({ testTimeout: 30000 })

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
    expect(screen.getByTestId('profile-record-option-ipfs')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-skynet')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-swarm')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-onion')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-arweave')).toBeDisabled()
  })

  it('should disable all contenthash options if a contentHash option is already selected', async () => {
    result.current.reset({ records: [{ key: 'contentHash', type: 'contenthash', group: 'other' }] })
    render(<AddProfileRecordView control={result.current.control} />)
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
      'background-color: rgb(238, 245, 255)',
    )
    expect(screen.getByTestId('profile-record-option-skynet')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-swarm')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-onion')).toBeDisabled()
    expect(screen.getByTestId('profile-record-option-arweave')).toBeDisabled()
    await userEvent.click(screen.getByTestId('profile-record-option-ipfs'))
    expect(screen.getByTestId('profile-record-option-ipfs')).not.toHaveStyle(
      'background-color: rgba(82, 152, 255, 0.15)',
    )
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

  it('should filter by group from search', async () => {
    result.current.reset({ records: [] })
    render(<AddProfileRecordView control={result.current.control} />)
    for (const { group, items } of options) {
      await userEvent.clear(screen.getByTestId('profile-record-search-input'))
      await userEvent.type(screen.getByTestId('profile-record-search-input'), group)
      for (const { key } of items) {
        expect(screen.getByTestId(`profile-record-option-${key}`)).toBeInTheDocument()
      }
      for (const { key } of allOptionsArray.filter(
        ({ key: k, group: g }) => g !== group && k !== group,
      )) {
        expect(screen.queryByTestId(`profile-record-option-${key}`)).not.toBeInTheDocument()
      }
    }
  })
  it('should filter by label from search', async () => {
    result.current.reset({ records: [] })
    render(<AddProfileRecordView control={result.current.control} />)
    // array for only first 10 address items, to reduce test time
    const itemsArray = options.reduce(
      (prev, curr) => {
        if (curr.group === 'address') {
          return [...prev, ...curr.items.slice(0, 10)]
        }
        return [...prev, ...curr.items]
      },
      [] as typeof allOptionsArray,
    )
    for (const { key } of itemsArray) {
      await userEvent.clear(screen.getByTestId('profile-record-search-input'))
      await userEvent.type(screen.getByTestId('profile-record-search-input'), key)
      // eslint-disable-next-line @typescript-eslint/no-loop-func
      await waitFor(() =>
        expect(screen.getByTestId(`profile-record-option-${key}`)).toBeInTheDocument(),
      )
      const lowerCaseKey = key.toLowerCase()
      for (const { key: filteredKey } of allOptionsArray.filter(
        ({ key: k, group: g, ...rest }) =>
          k.toLowerCase().indexOf(lowerCaseKey) === -1 &&
          g.toLowerCase().indexOf(lowerCaseKey) === -1 &&
          ('longName' in rest ? rest.longName.toLowerCase().indexOf(lowerCaseKey) === -1 : true) &&
          'steps.profile.options.groups.x.items'.indexOf(lowerCaseKey) === -1,
      )) {
        expect(screen.queryByTestId(`profile-record-option-${filteredKey}`)).not.toBeInTheDocument()
      }
    }
  })

  it('should not show dismiss button by default', async () => {
    result.current.reset({ records: [] })
    render(<AddProfileRecordView control={result.current.control} onClose={() => {}} />)
    expect(screen.queryByTestId('dismiss-dialog-btn')).not.toBeInTheDocument()
    expect(screen.getByTestId('add-profile-records-close')).toBeInTheDocument()
  })

  it('should show dismiss button if specified', async () => {
    result.current.reset({ records: [] })
    render(<AddProfileRecordView control={result.current.control} showDismiss onClose={() => {}} />)
    expect(screen.getByTestId('dismiss-dialog-btn')).toBeInTheDocument()
  })
})
