import { mockFunction, render, screen, userEvent, waitFor } from '@app/test-utils'

import { labelhash } from 'viem'
import { afterEach, describe, expect, it, vi } from 'vitest'

import { getDecodedName } from '@ensdomains/ensjs/subgraph'
import { decodeLabelhash } from '@ensdomains/ensjs/utils'

import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useNamesForAddress } from '@app/hooks/ensjs/subgraph/useNamesForAddress'
import { useGetPrimaryNameTransactionFlowItem } from '@app/hooks/primary/useGetPrimaryNameTransactionFlowItem'
import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { useIsWrapped } from '@app/hooks/useIsWrapped'
import { useProfile } from '@app/hooks/useProfile'
import { createTransactionItem } from '@app/transaction-flow/transaction'

import SelectPrimaryName, {
  getNameFromUnknownLabels,
  hasEncodedLabel,
} from './SelectPrimaryName-flow'

const encodeLabel = (label: string) => `[${labelhash(label).slice(2)}]`

vi.mock('@tanstack/react-query', async () => ({
  ...(await vi.importActual<typeof import('@tanstack/react-query')>('@tanstack/react-query')),
  useQueryClient: vi.fn().mockReturnValue({
    resetQueries: vi.fn(),
  }),
}))

vi.mock('@app/components/@atoms/NameDetailItem/TaggedNameItem', () => ({
  TaggedNameItem: ({ name, ...props }: any) => <div {...props}>{name}</div>,
}))

vi.mock('@ensdomains/ensjs/subgraph')

vi.mock('@app/hooks/ensjs/subgraph/useNamesForAddress')
vi.mock('@app/hooks/resolver/useResolverStatus')
vi.mock('@app/hooks/useIsWrapped')
vi.mock('@app/hooks/useProfile')
vi.mock('@app/hooks/primary/useGetPrimaryNameTransactionFlowItem')
vi.mock('@app/hooks/ensjs/public/usePrimaryName')

const mockGetDecodedName = mockFunction(getDecodedName)
const mockUsePrimaryName = mockFunction(usePrimaryName)
mockGetDecodedName.mockImplementation((_: any, { name }) => Promise.resolve(name))

const makeName = (index: number, overwrites?: any) => ({
  name: `test${index}.eth`,
  id: `0x${index}`,
  ...overwrites,
})
const mockUseNamesForAddress = mockFunction(useNamesForAddress)
mockUseNamesForAddress.mockReturnValue({
  data: {
    pages: [
      new Array(5)
        .fill(0)
        .map((_, i) => makeName(i))
        .flat(),
    ],
  },
  isLoading: false,
})

const mockUseResolverStatus = mockFunction(useResolverStatus)
mockUseResolverStatus.mockReturnValue({
  data: {
    isAuthorized: true,
  },
  isLoading: false,
})

const mockUseIsWrapped = mockFunction(useIsWrapped)
mockUseIsWrapped.mockReturnValue({
  data: false,
  isLoading: false,
})

const mockUseProfile = mockFunction(useProfile)
mockUseProfile.mockReturnValue({
  data: {
    coins: [],
    texts: [],
    resolverAddress: '0xresolver',
  },
  isLoading: false,
})

const mockUseGetPrimaryNameTransactionItem = mockFunction(useGetPrimaryNameTransactionFlowItem)
mockUseGetPrimaryNameTransactionItem.mockReturnValue({
  callBack: () => ({
    transactions: [createTransactionItem('setPrimaryName', { name: 'test.eth', address: '0x123' })],
  }),
  isLoading: false,
})

const mockDispatch = vi.fn()

window.IntersectionObserver = vi.fn().mockReturnValue({
  observe: vi.fn(),
  disconnect: vi.fn(),
})

afterEach(() => {
  vi.clearAllMocks()
})

describe('hasEncodedLabel', () => {
  it('should return true if an encoded label exists', () => {
    expect(hasEncodedLabel(`${encodeLabel('test')}.eth`)).toBe(true)
  })

  it('should return false if an encoded label does not exist', () => {
    expect(hasEncodedLabel('test.test.test.eth')).toBe(false)
  })
})

describe('getNameFromUnknownLabels', () => {
  it('should return the name if no encoded label exists', () => {
    expect(getNameFromUnknownLabels('test.test.eth', { labels: [], tld: '' })).toBe('test.test.eth')
  })

  it('should return the decoded name if encoded label exists', () => {
    expect(
      getNameFromUnknownLabels(
        `${encodeLabel('test1')}.${encodeLabel('test2')}.${encodeLabel('test3')}.eth`,
        {
          labels: [
            { label: decodeLabelhash(encodeLabel('test1')), value: 'test1', disabled: false },
            { label: decodeLabelhash(encodeLabel('test2')), value: 'test2', disabled: false },
            { label: decodeLabelhash(encodeLabel('test3')), value: 'test3', disabled: false },
          ],
          tld: 'eth',
        },
      ),
    ).toBe('test1.test2.test3.eth')
  })

  it('should skip unknown labels if they do not match the original labels', () => {
    expect(
      getNameFromUnknownLabels(
        `${encodeLabel('test1')}.${encodeLabel('test2')}.${encodeLabel('test3')}.eth`,
        {
          labels: [
            { label: decodeLabelhash(encodeLabel('test2')), value: 'test2', disabled: false },
            { label: decodeLabelhash(encodeLabel('test2')), value: 'test2', disabled: false },
            { label: decodeLabelhash(encodeLabel('test2')), value: 'test2', disabled: false },
          ],
          tld: 'eth',
        },
      ),
    ).toBe(`${encodeLabel('test1')}.test2.${encodeLabel('test3')}.eth`)
  })

  it('should be able to handle mixed encoded and decoded names', () => {
    expect(
      getNameFromUnknownLabels(`${encodeLabel('test1')}.test2.${encodeLabel('test3')}.eth`, {
        labels: [
          { label: decodeLabelhash(encodeLabel('test2')), value: 'test2', disabled: false },
          { label: 'test2', value: 'test2', disabled: true },
          { label: decodeLabelhash(encodeLabel('test2')), value: 'test2', disabled: false },
        ],
        tld: 'eth',
      }),
    ).toBe(`${encodeLabel('test1')}.test2.${encodeLabel('test3')}.eth`)
  })
})

describe('SelectPrimaryName', () => {
  it('should show loading if data hook is loading', async () => {
    mockUseNamesForAddress.mockReturnValueOnce({
      data: undefined,
      isLoading: true,
    })
    render(
      <SelectPrimaryName
        data={{ address: '0x123' }}
        dispatch={mockDispatch}
        onDismiss={() => {}}
      />,
    )
    await waitFor(() => expect(screen.getByText('loading')).toBeInTheDocument())
  })

  it('should show no name message if data returns an empty array', async () => {
    mockUseNamesForAddress.mockReturnValueOnce({
      data: {
        pages: [[]],
      },
      isLoading: false,
    })
    render(
      <SelectPrimaryName data={{ address: '0x123' }} dispatch={() => {}} onDismiss={() => {}} />,
    )
    await waitFor(() =>
      expect(
        screen.getByText('input.selectPrimaryName.errors.noEligibleNames'),
      ).toBeInTheDocument(),
    )
  })

  it('should show names', async () => {
    render(
      <SelectPrimaryName data={{ address: '0x123' }} dispatch={() => {}} onDismiss={() => {}} />,
    )
    await waitFor(() => {
      expect(screen.getByText('test1.eth')).toBeInTheDocument()
      expect(screen.getByText('test2.eth')).toBeInTheDocument()
      expect(screen.getByText('test3.eth')).toBeInTheDocument()
    })
  })

  it('should not show primary name in list', async () => {
    mockUsePrimaryName.mockReturnValue({
      data: {
        name: 'test2.eth',
        beautifiedName: 'test2.eth',
      },
      isLoading: false,
      status: 'success',
    })
    render(
      <SelectPrimaryName data={{ address: '0x123' }} dispatch={() => {}} onDismiss={() => {}} />,
    )
    await waitFor(() => {
      expect(screen.getByText('test1.eth')).toBeInTheDocument()
      expect(screen.queryByText('test2.eth')).not.toBeInTheDocument()
      expect(screen.getByText('test3.eth')).toBeInTheDocument()
    })
  })

  it('should only enable next button if name selected', async () => {
    render(
      <SelectPrimaryName data={{ address: '0x123' }} dispatch={() => {}} onDismiss={() => {}} />,
    )
    expect(screen.getByTestId('primary-next')).toBeDisabled()
    await userEvent.click(screen.getByText('test1.eth'))
    await waitFor(() => expect(screen.getByTestId('primary-next')).not.toBeDisabled())
  })

  it('should call dispatch if name is selected and next is clicked', async () => {
    render(
      <SelectPrimaryName
        data={{ address: '0x123' }}
        dispatch={mockDispatch}
        onDismiss={() => {}}
      />,
    )
    await userEvent.click(screen.getByText('test1.eth'))
    await userEvent.click(screen.getByTestId('primary-next'))
    await waitFor(() => expect(mockDispatch).toBeCalled())
  })

  it('should call dispatch if encrpyted name can be decrypted', async () => {
    mockUseNamesForAddress.mockReturnValueOnce({
      data: {
        pages: [
          [
            ...new Array(5).fill(0).map((_, i) => makeName(i)),
            {
              name: `${encodeLabel('test')}.eth`,
              id: '0xhash',
            },
          ],
        ],
      },
      isLoading: false,
    })
    mockGetDecodedName.mockReturnValueOnce(Promise.resolve('test.eth'))
    render(
      <SelectPrimaryName
        data={{ address: '0x123' }}
        dispatch={mockDispatch}
        onDismiss={() => {}}
      />,
    )
    await userEvent.click(screen.getByText(`${encodeLabel('test')}.eth`))
    await userEvent.click(screen.getByTestId('primary-next'))
    expect(mockDispatch).toHaveBeenCalled()
  })

  it('should be able to decrpyt name and dispatch', async () => {
    mockUseNamesForAddress.mockReturnValue({
      data: {
        pages: [
          [
            ...new Array(3).fill(0).map((_, i) => makeName(i)),
            {
              name: `${encodeLabel('test')}.eth`,
              id: '0xhash',
            },
          ],
        ],
      },
      isLoading: false,
    })
    mockGetDecodedName.mockReturnValueOnce(Promise.resolve(`${encodeLabel('test')}.eth`))
    render(
      <SelectPrimaryName
        data={{ address: '0x123' }}
        dispatch={mockDispatch}
        onDismiss={() => {}}
      />,
    )
    expect(screen.getByTestId('primary-next')).toBeDisabled()
    await userEvent.click(screen.getByText(`${encodeLabel('test')}.eth`))
    await waitFor(() => expect(screen.getByTestId('primary-next')).not.toBeDisabled())
    await userEvent.click(screen.getByTestId('primary-next'))
    await waitFor(() => expect(screen.getByTestId('unknown-labels-form')).toBeInTheDocument())
    await userEvent.type(screen.getByTestId(`unknown-label-input-${labelhash('test')}`), 'test')
    await waitFor(() => expect(screen.getByTestId('unknown-labels-confirm')).not.toBeDisabled())
    await userEvent.click(screen.getByTestId('unknown-labels-confirm'))
    expect(mockDispatch).toHaveBeenCalled()
    expect(mockDispatch.mock.calls[0][0].payload[0]).toMatchInlineSnapshot(
      {
        data: { name: 'test.eth' },
      },
      `
      {
        "data": {
          "address": "0x123",
          "name": "test.eth",
        },
        "name": "setPrimaryName",
      }
    `,
    )
  })
})
