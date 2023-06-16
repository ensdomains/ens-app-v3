import { render, screen, userEvent, waitFor } from '@app/test-utils'

import { decodeLabelhash, labelhash } from '@ensdomains/ensjs/utils/labels'

import { makeTransactionItem } from '@app/transaction-flow/transaction'

import SelectPrimaryName, {
  getNameFromUnknownLabels,
  hasEncodedLabel,
} from './SelectPrimaryName-flow'

const encodeLabel = (label: string) => `[${labelhash(label).slice(2)}]`

const mockInvalidateQueries = jest.fn()
jest.mock('wagmi', () =>
  jest.fn().mockReturnValue({
    useQueryClient: jest.fn().mockReturnValue({
      invalidateQueries: mockInvalidateQueries,
    }),
  }),
)

jest.mock('@app/components/@atoms/NameDetailItem/TaggedNameItem', () => ({
  TaggedNameItem: ({ name, ...props }: any) => <div {...props}>{name}</div>,
}))

const mockGetDecryptedName = jest.fn().mockImplementation((name: string) => Promise.resolve(name))
const mockUseEns = jest.fn().mockReturnValue({
  ready: true,
  getDecryptedName: () => mockGetDecryptedName(),
})
jest.mock('@app/utils/EnsProvider', () => ({
  useEns: () => mockUseEns(),
}))

const makeName = (index: number, overwrites?: any) => ({
  name: `test${index}.eth`,
  id: `0x${index}`,
  ...overwrites,
})
const mockUseAvailablePrimaryNamesForAddress = jest.fn().mockReturnValue({
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
jest.mock(
  '@app/hooks/names/useAvailablePrimaryNamesForAddress/useAvailablePrimaryNamesForAddress',
  () => ({
    useAvailablePrimaryNamesForAddress: () => mockUseAvailablePrimaryNamesForAddress(),
  }),
)

jest.mock('@app/hooks/useContractAddress', () => ({
  useContractAddress: () => '0xPublicResolver',
}))

const mockUseResolverStatus = jest.fn().mockReturnValue({
  data: {
    isAuthorized: true,
  },
  isLoading: false,
})
jest.mock('@app/hooks/resolver/useResolverStatus', () => ({
  useResolverStatus: () => mockUseResolverStatus(),
}))

const mockUseBasicName = jest.fn().mockReturnValue({
  isWrapped: true,
  isLoading: false,
})
jest.mock('@app/hooks/useBasicName', () => ({
  useBasicName: () => mockUseBasicName(),
}))

const mockUseProfile = jest.fn().mockReturnValue({
  profile: {
    records: {},
    resolverAddress: '0xresolver',
  },
  isLoading: false,
})
jest.mock('@app/hooks/useProfile', () => ({
  useProfile: () => mockUseProfile(),
}))

const mockUseGetPrimaryNameTransactionItem = jest.fn().mockReturnValue({
  callBack: () => ({
    transactions: [makeTransactionItem('setPrimaryName', { name: 'test.eth', address: '0x123' })],
  }),
  isLoading: false,
})
jest.mock('@app/hooks/primary/useGetPrimaryNameTransactionFlowItem', () => ({
  useGetPrimaryNameTransactionFlowItem: () => mockUseGetPrimaryNameTransactionItem(),
}))

const mockDispatch = jest.fn()

window.IntersectionObserver = jest.fn().mockReturnValue({
  observe: jest.fn(),
  disconnect: jest.fn(),
})

afterEach(() => {
  jest.clearAllMocks()
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
    mockUseAvailablePrimaryNamesForAddress.mockReturnValueOnce({
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

  it('should show loading message if ens hook is loading', async () => {
    mockUseEns.mockReturnValueOnce({
      ready: false,
      getResolver: jest.fn(),
    })
    render(
      <SelectPrimaryName data={{ address: '0x123' }} dispatch={() => {}} onDismiss={() => {}} />,
    )
    await waitFor(() => expect(screen.getByText('loading')).toBeInTheDocument())
  })

  it('should show no name message if data returns an empty array', async () => {
    mockUseAvailablePrimaryNamesForAddress.mockReturnValueOnce({
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
    mockUseAvailablePrimaryNamesForAddress.mockReturnValueOnce({
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
    mockGetDecryptedName.mockReturnValueOnce('test.eth')
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
    mockUseAvailablePrimaryNamesForAddress.mockReturnValue({
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
    mockGetDecryptedName.mockReturnValueOnce(`${encodeLabel('test')}.eth`)
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
      Object {
        "data": Object {
          "address": "0x123",
          "name": "test.eth",
        },
        "name": "setPrimaryName",
      }
    `,
    )
  })
})
