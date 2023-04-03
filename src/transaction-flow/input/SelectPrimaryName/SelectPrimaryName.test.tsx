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

jest.mock('@app/hooks/useAvailablePrimaryNamesForAddress')
jest.mock('@app/utils/EnsProvider')

const mockUseEns = mockFunction(useEns)
const mockUseAvailablePrimaryNamesForAddress = mockFunction(useAvailablePrimaryNamesForAddress)

const makeName = (index: number) => ({
  name: `test${index}.eth`,
  id: `0x${index}`,
})

describe('SelectPrimaryName', () => {
  window.IntersectionObserver = jest.fn().mockReturnValue({
    observe: jest.fn(),
    disconnect: jest.fn(),
  })

  it('should show loading if data hook is loading', async () => {
    mockUseEns.mockReturnValue({
      ready: true,
      getResolver: jest.fn(),
    })

    mockUseAvailablePrimaryNamesForAddress.mockReturnValue({
      names: undefined,
      isLoading: true,
    })
    render(
      <SelectPrimaryName data={{ address: '0x123' }} dispatch={() => {}} onDismiss={() => {}} />,
    )
    await waitFor(() => expect(screen.getByText('loading')).toBeInTheDocument())
  })

  it('should show loading message if ens hook is loading', async () => {
    mockUseEns.mockReturnValue({
      ready: false,
      getResolver: jest.fn(),
    })
    mockUseAvailablePrimaryNamesForAddress.mockReturnValue({
      names: [{ name: 'test1.eth' }],
      isLoading: false,
    })
    render(
      <SelectPrimaryName data={{ address: '0x123' }} dispatch={() => {}} onDismiss={() => {}} />,
    )
    await waitFor(() => expect(screen.getByText('loading')).toBeInTheDocument())
  })

  it('should show no name message if data returns an empty array', async () => {
    mockUseEns.mockReturnValue({
      ready: true,
      getResolver: jest.fn(),
    })
    mockUseAvailablePrimaryNamesForAddress.mockReturnValue({
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
    mockUseEns.mockReturnValue({
      ready: true,
      getResolver: jest.fn(),
    })
    mockUseAvailablePrimaryNamesForAddress.mockReturnValue({
      names: new Array(5).fill(0).map((_, i) => makeName(i)),
      isLoading: false,
    })
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
    mockUseEns.mockReturnValue({
      ready: true,
      getResolver: jest.fn(),
    })
    mockUseAvailablePrimaryNamesForAddress.mockReturnValue({
      names: new Array(5).fill(0).map((_, i) => makeName(i)),
      isLoading: false,
    })
    render(
      <SelectPrimaryName data={{ address: '0x123' }} dispatch={() => {}} onDismiss={() => {}} />,
    )
    expect(screen.getByTestId('primary-next')).toBeDisabled()
    await userEvent.click(screen.getByText('test1.eth'))
    await waitFor(() => expect(screen.getByTestId('primary-next')).not.toBeDisabled())
  })

  it('should show decrypt view if name has hash label', async () => {
    mockUseEns.mockReturnValue({
      ready: true,
      getResolver: jest.fn(),
    })
    mockUseAvailablePrimaryNamesForAddress.mockReturnValue({
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
})
