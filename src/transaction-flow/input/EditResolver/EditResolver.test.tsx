import { useProfile } from '@app/hooks/useProfile'
import { fireEvent, mockFunction, render, screen, userEvent, waitFor } from '@app/test-utils'
import { RESOLVER_ADDRESSES } from '@app/utils/constants'
import { useNetwork, useProvider } from 'wagmi'
import { EditResolver } from './EditResolver-flow'

jest.mock('@app/hooks/useProfile')

const mockUseProfile = mockFunction(useProfile)
const mockUseProvider = mockFunction(useProvider)
const mockUseNetwork = mockFunction(useNetwork)

const mockDispatch = jest.fn()

const getLatestRadio = async (): Promise<HTMLInputElement> => screen.findByLabelText(/latestlabel/i)
const getCustomRadio = async (): Promise<HTMLInputElement> => screen.findByLabelText(/customlabel/i)
const getCustomInput = async (): Promise<HTMLInputElement> =>
  screen.findByPlaceholderText('input.editResolver.customPlaceholder')
const getUpdateBtn = async (): Promise<HTMLButtonElement> => screen.findByText(/action.update/i)

describe('EditResolver', () => {
  it('should render', async () => {
    mockUseProfile.mockReturnValue({ profile: { resolverAddress: '' } })
    mockUseProvider.mockReturnValue({})
    mockUseNetwork.mockReturnValue({ chain: { id: 1 } })
    render(
      <EditResolver data={{ name: 'user1.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
    )

    const latestRadio = await getLatestRadio()
    const customRadio = await getCustomRadio()
    const customInput = await getCustomInput()
    const updateBtn = await getUpdateBtn()

    await waitFor(() => {
      expect(screen.getByTestId('edit-resolver-form')).toBeVisible()
      expect(customInput).toBeVisible()
      expect(latestRadio).toBeVisible()
      expect(customRadio).toBeVisible()
      expect(updateBtn).toBeVisible()
    })
  })

  describe('When profile is not updated to latest resolver', () => {
    beforeEach(() => {
      mockUseProfile.mockReturnValue({
        profile: { resolverAddress: RESOLVER_ADDRESSES[2] },
        loading: false,
      })
      mockUseProvider.mockReturnValue({})
      mockUseNetwork.mockReturnValue({ chain: { id: 1 } })
    })

    afterEach(() => {
      jest.resetAllMocks()
    })

    it('should allow user to update if the have chosen to use the latest resolver', async () => {
      render(
        <EditResolver data={{ name: 'user1.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      const saveBtn = await screen.findByText('action.update')
      fireEvent.click(saveBtn)

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled()
      })

      expect(mockDispatch.mock.calls[0][0].name).toEqual('setTransactions')
      expect(mockDispatch.mock.calls[0][0].payload[0]).toEqual({
        name: 'updateResolver',
        data: {
          contract: 'registry',
          name: 'user1.eth',
          oldResolver: RESOLVER_ADDRESSES[2],
          resolver: RESOLVER_ADDRESSES[0],
        },
      })
    })

    it('should NOT allow the user to update if they have chosen a custom resolver and have not provided a valid address', async () => {
      render(
        <EditResolver data={{ name: 'user1.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )

      const customRadio = await getCustomRadio()
      const customInput = await getCustomInput()
      const updateBtn = await getUpdateBtn()

      fireEvent.click(customRadio)

      await waitFor(() => {
        expect(customInput).not.toBeDisabled()
      })
      await userEvent.type(customInput, 'invalid address')

      fireEvent.click(updateBtn)

      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled()
      })
    })

    it('should NOT allow the user to update if they have chosen a custom resolver and have not provided a valid address', async () => {
      render(
        <EditResolver data={{ name: 'user1.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )

      const customRadio = await getCustomRadio()
      const customInput = await getCustomInput()
      const updateBtn = await getUpdateBtn()

      fireEvent.click(customRadio)

      await waitFor(() => {
        expect(customInput).not.toBeDisabled()
      })
      await userEvent.type(customInput, 'invalid address')

      fireEvent.click(updateBtn)

      await waitFor(() => {
        expect(mockDispatch).not.toHaveBeenCalled()
      })
    })

    it('should allow the user to update if they have chosen a custom resolver and HAVE provided a valid address', async () => {
      render(
        <EditResolver data={{ name: 'user1.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )

      const customRadio = await getCustomRadio()
      const customInput = await getCustomInput()
      const updateBtn = await getUpdateBtn()

      fireEvent.click(customRadio)

      await waitFor(() => {
        expect(customInput).not.toBeDisabled()
      })
      await userEvent.type(customInput, RESOLVER_ADDRESSES[1])

      fireEvent.click(updateBtn)

      await waitFor(() => {
        expect(mockDispatch).toHaveBeenCalled()
      })
      expect(mockDispatch.mock.calls[0][0].payload[0]).toEqual({
        name: 'updateResolver',
        data: {
          contract: 'registry',
          name: 'user1.eth',
          oldResolver: RESOLVER_ADDRESSES[2],
          resolver: RESOLVER_ADDRESSES[1],
        },
      })
    })
  })

  describe('when profile is update to latest resolver', () => {
    beforeEach(() => {
      mockUseProfile.mockReturnValue({
        profile: { resolverAddress: RESOLVER_ADDRESSES[0] },
        loading: false,
      })
      mockUseProvider.mockReturnValue({})
      mockUseNetwork.mockReturnValue({ chain: { id: 1 } })
    })

    it('should disable the latest resolver button', async () => {
      render(
        <EditResolver data={{ name: 'user1.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )
      const latestRadio = await getLatestRadio()
      await waitFor(() => {
        expect(latestRadio).toBeDisabled()
      })
      expect(screen.getByText('input.editResolver.latestLabel')).toBeVisible()
    })

    it('should have custom radio option checked', async () => {
      render(
        <EditResolver data={{ name: 'user1.eth' }} dispatch={mockDispatch} onDismiss={() => {}} />,
      )

      const customRadio = await getCustomRadio()
      await waitFor(() => {
        expect(customRadio).toBeChecked()
      })
    })
  })
})
