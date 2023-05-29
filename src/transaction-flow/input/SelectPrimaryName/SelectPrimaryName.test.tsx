import { mockFunction, render, screen, userEvent, waitFor } from '@app/test-utils'

import { useAvailablePrimaryNamesForAddress } from '@app/hooks/useAvailablePrimaryNamesForAddress'
import { useEns } from '@app/utils/EnsProvider'

import SelectPrimaryName from './SelectPrimaryName-flow'

jest.mock('@app/hooks/useChainId', () => ({
  useChainId: jest.fn().mockReturnValue(1),
}))

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

jest.mock('@app/utils/EnsProvider')
const mockUseEns = mockFunction(useEns)
const mockGetResolver = jest.fn()
mockGetResolver.mockReturnValue('0xresolver')

const mockGetDecryptedName = jest.fn()
mockGetDecryptedName.mockReturnValue('sub.test.eth')

mockUseEns.mockReturnValue({
  ready: true,
  getResolver: mockGetResolver,
  getDecryptedName: mockGetDecryptedName,
})

jest.mock('@app/hooks/useAvailablePrimaryNamesForAddress')
const mockUseAvailablePrimaryNamesForAddress = mockFunction(useAvailablePrimaryNamesForAddress)

const makeName = (index: number, overwrites?: any) => ({
  name: `test${index}.eth`,
  id: `0x${index}`,
  ...overwrites,
})

mockUseAvailablePrimaryNamesForAddress.mockReturnValue({
  names: new Array(5)
    .fill(0)
    .map((_, i) => makeName(i))
    .flat(),
  isLoading: false,
})

const mockDispatch = jest.fn()

window.IntersectionObserver = jest.fn().mockReturnValue({
  observe: jest.fn(),
  disconnect: jest.fn(),
})

const makeResult = (
  name: string,
  type: 'one-step' | 'two-step' | 'three-step' | 'three-step-migration',
) => ({
  ...(type === 'one-step'
    ? {
        name: 'setTransactions',
        payload: [
          {
            data: {
              address: '0x123',
              name,
            },
            name: 'setPrimaryName',
          },
        ],
      }
    : {
        key: 'ChangePrimaryName',
        name: 'startFlow',
        payload: {
          intro: {
            content: {
              data: {
                description: 'intro.selectPrimaryName.updateEthAddress.description',
              },
              name: 'GenericWithDescription',
            },
            title: ['intro.selectPrimaryName.updateEthAddress.title', { ns: 'transactionFlow' }],
          },
          transactions: [
            {
              data: {
                address: '0x123',
                name,
              },
              name: 'updateEthAddress',
            },
            {
              data: {
                address: '0x123',
                name,
              },
              name: 'setPrimaryName',
            },
          ],
        },
      }),
})

afterEach(() => {
  jest.clearAllMocks()
})

describe('SelectPrimaryName', () => {
  it('should show loading if data hook is loading', async () => {
    mockUseAvailablePrimaryNamesForAddress.mockReturnValueOnce({
      names: undefined,
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
      names: [],
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
      names: [
        ...new Array(5).fill(0).map((_, i) => makeName(i)),
        {
          name: '[2fcba40a1a605acf57a88f10820dd7f474036e9c73660ce1bafdbb9004b92ded].eth',
          id: '0xhash',
        },
      ],
      isLoading: false,
    })
    render(
      <SelectPrimaryName
        data={{ address: '0x123' }}
        dispatch={mockDispatch}
        onDismiss={() => {}}
      />,
    )
    await userEvent.click(
      screen.getByText('[2fcba40a1a605acf57a88f10820dd7f474036e9c73660ce1bafdbb9004b92ded].eth'),
    )
    await userEvent.click(screen.getByTestId('primary-next'))
    expect(mockDispatch).toHaveBeenCalled()
  })

  it('should show decrypt view if name cannot be decrypted', async () => {
    mockGetDecryptedName.mockReturnValueOnce(undefined)
    mockUseAvailablePrimaryNamesForAddress.mockReturnValueOnce({
      names: [
        ...new Array(5).fill(0).map((_, i) => makeName(i)),
        {
          name: '[2fcba40a1a605acf57a88f10820dd7f474036e9c73660ce1bafdbb9004b92ded].eth',
          id: '0xhash',
        },
      ],
      isLoading: false,
    })
    render(
      <SelectPrimaryName data={{ address: '0x123' }} dispatch={() => {}} onDismiss={() => {}} />,
    )
    expect(screen.getByTestId('primary-next')).toBeDisabled()
    await userEvent.click(
      screen.getByText('[2fcba40a1a605acf57a88f10820dd7f474036e9c73660ce1bafdbb9004b92ded].eth'),
    )
    await waitFor(() => expect(screen.getByTestId('primary-next')).not.toBeDisabled())
    await userEvent.click(screen.getByTestId('primary-next'))
    await waitFor(() => expect(screen.getByTestId('unknown-labels-form')).toBeInTheDocument())
  })

  describe('One step transactions', () => {
    it('should dispatch one step if unwrapped name with resolved address is selected', async () => {
      mockUseAvailablePrimaryNamesForAddress.mockReturnValueOnce({
        names: [makeName(1, { isResolvedAddress: true })],
        isLoading: false,
      })
      render(
        <SelectPrimaryName
          data={{ address: '0x123' }}
          dispatch={mockDispatch}
          onDismiss={() => {}}
        />,
      )
      await userEvent.click(screen.getByText('test1.eth'))
      await userEvent.click(screen.getByTestId('primary-next'))
      expect(mockDispatch).toBeCalledWith(makeResult('test1.eth', 'one-step'))
    })

    it('should dispatch one step if wrapped name with resolved address is selected', async () => {
      mockUseAvailablePrimaryNamesForAddress.mockReturnValueOnce({
        names: [makeName(1, { isResolvedAddress: true, fuses: {} })],
        isLoading: false,
      })
      render(
        <SelectPrimaryName
          data={{ address: '0x123' }}
          dispatch={mockDispatch}
          onDismiss={() => {}}
        />,
      )
      await userEvent.click(screen.getByText('test1.eth'))
      await userEvent.click(screen.getByTestId('primary-next'))
      expect(mockDispatch).toBeCalledWith(makeResult('test1.eth', 'one-step'))
    })
  })

  describe('Two step transactions', () => {
    it('should dispatch two step transaction if unwrapped name with other eth address and valid resolver', async () => {
      mockUseAvailablePrimaryNamesForAddress.mockReturnValueOnce({
        names: [makeName(1, { isResolvedAddress: false })],
        isLoading: false,
      })
      render(
        <SelectPrimaryName
          data={{ address: '0x123' }}
          dispatch={mockDispatch}
          onDismiss={() => {}}
        />,
      )
      await userEvent.click(screen.getByText('test1.eth'))
      await userEvent.click(screen.getByTestId('primary-next'))
      expect(mockDispatch).toBeCalledWith(makeResult('test1.eth', 'two-step'))
    })
  })
})
