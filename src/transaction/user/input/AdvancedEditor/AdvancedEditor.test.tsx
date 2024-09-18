/* eslint-disable no-await-in-loop */
import {
  cleanup,
  fireEvent,
  mockFunction,
  render,
  screen,
  userEvent,
  waitFor,
  within,
} from '@app/test-utils'

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

import { useProfile } from '@app/hooks/useProfile'
import { useResolverHasInterfaces } from '@app/hooks/useResolverHasInterfaces'
import { convertFormSafeKey, formSafeKey } from '@app/utils/editor'

import AdvancedEditor from './AdvancedEditor-flow'

const mockProfileData = {
  data: {
    address: '0x70643CB203137b9b9eE19deA56080CD2BA01dBFd' as const,
    contentHash: null,
    texts: [
      {
        key: 'email',
        value: 'test@ens.domains',
      },
      {
        key: 'url',
        value: 'https://ens.domains',
      },
      {
        key: 'avatar',
        value: 'https://example.xyz/avatar/test.jpg',
      },
      {
        key: 'com.discord',
        value: 'test',
      },
      {
        key: 'com.reddit',
        value: 'https://www.reddit.com/user/test/',
      },
      {
        key: 'com.twitter',
        value: 'https://twitter.com/test',
      },
      {
        key: 'org.telegram',
        value: '@test',
      },
      {
        key: 'com.linkedin.com',
        value: 'https://www.linkedin.com/in/test/',
      },
      {
        key: 'xyz.lensfrens',
        value: 'https://www.lensfrens.xyz/test.lens',
      },
    ],
    coins: [
      {
        id: 60,
        name: 'eth',
        value: '0xb794f5ea0ba39494ce839613fffba74279579268',
      },
      {
        id: 0,
        name: 'btc',
        value: '1JnJvEBykLcGHYxCZVWgDGDm7pkK3EBHwB',
      },
      {
        id: 3030,
        name: 'hbar',
        value: '0.0.123123',
      },
      {
        id: 501,
        name: 'sol',
        value: 'HN7cABqLq46Es1jh92dQQisAq662SmxELLLsHHe4YWrH',
      },
    ],
    abi: {
      abi: [
        {
          inputs: [
            {
              internalType: 'string',
              type: 'string',
              name: 'name',
            },
          ],
          stateMutability: 'nonpayable',
          outputs: [],
          name: 'setName',
          type: 'function',
        },
      ],
      contentType: 1,
    },
    resolverAddress: '0x0' as const,
    isMigrated: true,
    createdAt: {
      date: new Date(1630553876),
      value: 1630553876,
    },
  },
  isLoading: false,
}

vi.mock('@app/hooks/useProfile')
vi.mock('@app/transaction-flow/TransactionFlowProvider')
vi.mock('@app/hooks/useResolverHasInterfaces')

vi.mock('@app/utils/abi', () => ({
  getUsedAbiEncodeAs: () => ['json', 'cbor'],
}))

const mockUseProfile = mockFunction(useProfile)
const mockUseResolverHasInterfaces = mockFunction(useResolverHasInterfaces)

const mockIntersectionObserver = vi.fn()

const mockDispatch = vi.fn()

describe('AdvancedEditor', () => {
  beforeEach(() => {
    mockUseProfile.mockReturnValue(mockProfileData)

    mockUseResolverHasInterfaces.mockReturnValue({
      data: [true],
      isLoading: false,
      status: 'success',
    })

    mockIntersectionObserver.mockReturnValue({
      observe: () => null,
      unobserve: () => null,
      disconnect: () => null,
    })
    window.IntersectionObserver = mockIntersectionObserver
    window.scroll = vi.fn() as () => void
  })

  afterEach(() => {
    cleanup()
    vi.clearAllMocks()
  })

  it('should render', async () => {
    render(
      <AdvancedEditor dispatch={mockDispatch} onDismiss={() => {}} data={{ name: 'test.eth' }} />,
    )
    await waitFor(() => {
      expect(screen.getByTestId('advanced-editor')).toBeVisible()
    })
  })

  it('should submit key with empty string in an existing text record is deleted', async () => {
    render(
      <AdvancedEditor dispatch={mockDispatch} onDismiss={() => {}} data={{ name: 'test.eth' }} />,
    )

    const avatarInput = await screen.findByTestId('record-input-avatar')
    const deleteBtn = within(avatarInput).getByTestId('record-input-delete-button')
    fireEvent.click(deleteBtn)

    const submitBtn = screen.getByText('action.save')
    await waitFor(() => {
      expect(submitBtn).not.toHaveAttribute('disabled')
    })
    userEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.texts[0]).toEqual({
      key: 'avatar',
      value: '',
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.texts.length).toBe(1)
  })

  it('should submit key/value when new text is added', async () => {
    render(
      <AdvancedEditor dispatch={mockDispatch} onDismiss={() => {}} data={{ name: 'test.eth' }} />,
    )
    const addButton = await screen.findByTestId('add-record-button')
    const addInput = within(addButton).getByTestId('add-record-button-input')
    await userEvent.type(addInput, 'testKey')
    const addRecordBtn = await within(addButton).findByText('action.add')
    await userEvent.click(addRecordBtn)

    const newInput = await screen.findByTestId('record-input-testKey')
    await userEvent.type(within(newInput).getByTestId('record-input-input'), 'testValue')

    const submitBtn = screen.getByText('action.save')
    await waitFor(() => {
      expect(submitBtn).not.toHaveAttribute('disabled')
    })
    userEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.texts[0]).toEqual({
      key: 'testKey',
      value: 'testValue',
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.texts.length).toBe(1)
  })

  it('should submit key/value when new text with special characters is added', async () => {
    render(
      <AdvancedEditor dispatch={mockDispatch} onDismiss={() => {}} data={{ name: 'test.eth' }} />,
    )
    const addButton = await screen.findByTestId('add-record-button')
    const addInput = within(addButton).getByTestId('add-record-button-input')
    await userEvent.type(addInput, "'")
    const addRecordBtn = await within(addButton).findByText('action.add')
    await userEvent.click(addRecordBtn)

    const newInput = await screen.findByTestId("record-input-'")
    await userEvent.type(within(newInput).getByTestId('record-input-input'), 'testValue')

    const submitBtn = screen.getByText('action.save')
    await waitFor(() => {
      expect(submitBtn).not.toHaveAttribute('disabled')
    })
    userEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.texts[0]).toEqual({
      key: "'",
      value: 'testValue',
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.texts.length).toBe(1)
  })

  it('should submit key with empty string in an existing address record is deleted', async () => {
    render(
      <AdvancedEditor dispatch={mockDispatch} onDismiss={() => {}} data={{ name: 'test.eth' }} />,
    )
    const tab = await screen.findByTestId('address-tab')
    fireEvent.click(tab)

    const adressInput = await screen.findByTestId('record-input-ETH')
    const deleteBtn = within(adressInput).getByTestId('record-input-delete-button')
    fireEvent.click(deleteBtn)

    const submitBtn = screen.getByText('action.save')
    await waitFor(() => {
      expect(submitBtn).not.toHaveAttribute('disabled')
    })
    userEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.coins[0]).toEqual({
      coin: 'eth',
      value: '',
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.coins.length).toBe(1)
  })

  it('should submit key/value when new address is added', async () => {
    render(
      <AdvancedEditor dispatch={mockDispatch} onDismiss={() => {}} data={{ name: 'test.eth' }} />,
    )

    const tab = await screen.findByTestId('address-tab')
    fireEvent.click(tab)

    const addButton = await screen.findByTestId('add-record-button')
    await userEvent.click(addButton)
    const addOption = await screen.findByTestId('add-record-button-option-dot')
    await userEvent.click(addOption)

    const newInput = await screen.findByTestId('record-input-DOT')
    await userEvent.type(
      within(newInput).getByTestId('record-input-input'),
      '1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg',
    )

    const submitBtn = screen.getByText('action.save')
    await waitFor(() => {
      expect(submitBtn).not.toHaveAttribute('disabled')
    })
    await userEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.coins[0]).toEqual({
      coin: 'dot',
      value: '1FRMM8PEiWXYax7rpS6X4XZX1aAAxSWx1CrKTyrVYhV24fg',
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.coins.length).toBe(1)
  })

  it('should overwrite existing records and add new records for records passed in transactions', async () => {
    render(
      <AdvancedEditor
        data={{ name: 'test.eth' }}
        transactions={[
          {
            name: 'updateProfile',
            data: {
              records: {
                texts: [
                  {
                    key: 'com.twitter',
                    value: 'test2',
                  },
                  {
                    key: 'com.github',
                    value: 'test2',
                  },
                  {
                    key: 'other',
                    value: 'test2',
                  },
                  {
                    key: 'email',
                    value: 'test@ens.domains',
                  },
                ],
                coins: [
                  {
                    coin: 'bnb',
                    value: 'bnb1g5p04snezgpky203fq6da9qyjsy2k9kzr5yuhl',
                  },
                  {
                    coin: 'eth',
                    value: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
                  },
                ],
                contentHash:
                  'https://ipfs.euc.li/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu',
              },
            },
          },
        ]}
        dispatch={() => {}}
        onDismiss={() => {}}
      />,
    )

    const tabs = [
      {
        tab: 'text-tab',
        records: [
          {
            label: formSafeKey('com.twitter'),
            value: 'test2',
          },
          {
            label: formSafeKey('com.github'),
            value: 'test2',
          },
          {
            label: 'other',
            value: 'test2',
          },
          {
            label: 'email',
            value: 'test@ens.domains',
          },
        ],
      },
      {
        tab: 'address-tab',
        records: [
          {
            label: 'bnb',
            value: 'bnb1g5p04snezgpky203fq6da9qyjsy2k9kzr5yuhl',
          },
          {
            label: 'eth',
            value: '0x71C7656EC7ab88b098defB751B7401B5f6d8976F',
          },
        ],
      },
      {
        tab: 'other-tab',
        records: [
          {
            label: 'advancedEditor.tabs.other.contentHash.label',
            value: 'https://ipfs.euc.li/ipfs/Qme7ss3ARVgxv6rXqVPiikMJ8u2NLgmgszg13pYrDKEoiu',
          },
        ],
      },
    ]

    for (const { tab, records } of tabs) {
      const tabEl = await screen.findByTestId(tab)
      await userEvent.click(tabEl)

      for (const { label, value } of records) {
        const formattedLabel = tab === 'address-tab' ? label.toUpperCase() : label
        const record = await screen.findByTestId(
          `record-input-${convertFormSafeKey(formattedLabel)}`,
        )
        const recordInput = await within(record).getByTestId('record-input-input')
        expect(recordInput).toHaveValue(value)
      }
    }
  })

  it('should allow removing abi', async () => {
    render(
      <AdvancedEditor dispatch={mockDispatch} onDismiss={() => {}} data={{ name: 'test.eth' }} />,
    )
    const tab = await screen.findByTestId('other-tab')
    fireEvent.click(tab)

    const abiInput = await screen.findByLabelText('advancedEditor.tabs.other.abi.label')
    await userEvent.clear(abiInput)

    const submitBtn = screen.getByText('action.save')
    await waitFor(() => {
      expect(submitBtn).not.toHaveAttribute('disabled')
    })
    await userEvent.click(submitBtn)

    await waitFor(() => {
      expect(mockDispatch).toHaveBeenCalled()
    })
    expect(mockDispatch.mock.calls[0][0].payload[0].data.records.abi).toEqual([
      {
        contentType: 1,
        encodedData: '0x',
      },
      {
        contentType: 4,
        encodedData: '0x',
      },
    ])
  })
})
