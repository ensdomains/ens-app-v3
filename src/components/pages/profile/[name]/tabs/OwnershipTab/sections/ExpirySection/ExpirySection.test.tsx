import { render, screen, userEvent, waitFor } from '@app/test-utils'

import { describe, expect, it, vi } from 'vitest'

import { GRACE_PERIOD } from '@app/utils/constants'

import { makeMockIntersectionObserver } from '../../../../../../../../../test/mock/makeMockIntersectionObserver'
import { ExpirySection } from './ExpirySection'

vi.mock('./hooks/useExpiryDetails', () => ({
  useExpiryDetails: ({ name }: any) => {
    if (name === 'test.eth')
      return {
        data: [
          { type: 'expiry', date: new Date(3255803954000) },
          { type: 'grace-period', date: new Date(3255803954000 + GRACE_PERIOD) },
          { type: 'registration', date: new Date(3255803954000) },
        ],
        isLoading: false,
      }
  },
}))

const mockShowInput = vi.fn()
vi.mock('./hooks/useExpiryActions', () => ({
  useExpiryActions: ({ name }: any) => {
    if (name === 'test.eth')
      return [
        {
          label: 'action.setReminder',
          type: 'set-reminder',
          icon: () => <div>ICON</div>,
          primary: false,
          expiryDate: new Date(),
        },
        {
          label: 'action.extend',
          type: 'extend',
          icon: () => <div>ICON</div>,
          primary: true,
          onClick: () => {
            mockShowInput()
          },
        },
      ]
  },
}))

makeMockIntersectionObserver()

describe('ExpirySection', () => {
  it.skip('should be able to open earnify button modal', async () => {
    render(<ExpirySection name="test.eth" details={{} as any} />)
    expect(screen.getByText('action.setReminder')).toBeVisible()
    expect(screen.getByText('action.extend')).toBeVisible()
    await userEvent.click(screen.getByText('action.setReminder'))
    await waitFor(async () => {
      expect(screen.getByText('tabs.more.misc.reminderOptions.bankless')).toBeVisible()
      await userEvent.click(screen.getByText('tabs.more.misc.reminderOptions.bankless'))
    })
    await waitFor(() => {
      expect(screen.getByText('tabs.more.misc.bankless.title')).toBeVisible()
    })
  })

  it('should be able to call show extend modal', async () => {
    render(<ExpirySection name="test.eth" details={{} as any} />)
    expect(screen.getByText('action.extend')).toBeVisible()
    await userEvent.click(screen.getByText('action.extend'))
    await waitFor(() => {
      expect(mockShowInput).toHaveBeenCalled()
    })
  })
})
