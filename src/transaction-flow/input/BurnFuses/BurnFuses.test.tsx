import { fireEvent, mockFunction, render, screen, waitFor } from '@app/test-utils'

import { useRouter } from 'next/router'

import { CurrentFuses } from '@ensdomains/ensjs/utils/fuses'

import { useGetWrapperData } from '@app/hooks/useGetWrapperData'

import { BurnFuses } from './BurnFuses-flow'

const defaultFuseObj: CurrentFuses = {
  CAN_DO_EVERYTHING: true,
  CANNOT_BURN_FUSES: false,
  CANNOT_CREATE_SUBDOMAIN: false,
  CANNOT_SET_RESOLVER: false,
  CANNOT_SET_TTL: false,
  CANNOT_TRANSFER: false,
  CANNOT_UNWRAP: false,
  PARENT_CANNOT_CONTROL: false,
}

jest.mock('next/router')
jest.mock('@app/hooks/useGetWrapperData')

const mockUseRouter = mockFunction(useRouter)
const mockUseGetWrapperData = mockFunction(useGetWrapperData)

const burnFusesProps = {
  onDismiss: () => null,
  dispatch: () => null,
  data: {
    name: 'nick.eth',
  },
}

describe('BurnFuses', () => {
  it('should render', () => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseGetWrapperData.mockReturnValue({})
    render(<BurnFuses {...burnFusesProps} />)
    expect(screen.getByText('action.burnSelected')).toBeVisible()
  })
  it('should not update selected for already burned permission', () => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseGetWrapperData.mockReturnValue({
      wrapperData: { fuseObj: { ...defaultFuseObj, CANNOT_BURN_FUSES: true } },
    })
    render(<BurnFuses {...burnFusesProps} />)
    fireEvent.click(screen.getByText('fuses.permissions.CANNOT_BURN_FUSES'))
    expect(screen.getByTestId('burn-button-CANNOT_BURN_FUSES')).toHaveTextContent('fuses.burned')
  })
  it('should set initial fuse data and correctly', () => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseGetWrapperData.mockReturnValue({
      wrapperData: { fuseObj: { ...defaultFuseObj, CANNOT_BURN_FUSES: true } },
    })
    render(<BurnFuses {...burnFusesProps} />)
    expect(screen.getByTestId('burn-button-CANNOT_UNWRAP')).not.toHaveTextContent('fuses.burned')
    expect(screen.getByTestId('burn-button-CANNOT_BURN_FUSES')).toHaveTextContent('fuses.burned')
    expect(screen.getByTestId('burn-button-CANNOT_TRANSFER')).not.toHaveTextContent('fuses.burned')
    expect(screen.getByTestId('burn-button-CANNOT_SET_RESOLVER')).not.toHaveTextContent(
      'fuses.burned',
    )
    expect(screen.getByTestId('burn-button-CANNOT_SET_TTL')).not.toHaveTextContent('fuses.burned')
    expect(screen.getByTestId('burn-button-CANNOT_CREATE_SUBDOMAIN')).not.toHaveTextContent(
      'fuses.burned',
    )
    expect(screen.queryByTestId('burn-button-PARENT_CANNOT_CONTROL')).toBeNull()
    expect(screen.queryByTestId('burn-button-CAN_DO_EVERYTHING')).toBeNull()
  })
  it('should allow user to select fuse to burn', () => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseGetWrapperData.mockReturnValue({
      wrapperData: { fuseObj: { ...defaultFuseObj, CANNOT_BURN_FUSES: true } },
    })
    render(<BurnFuses {...burnFusesProps} />)
    fireEvent.click(screen.getByText('fuses.permissions.CANNOT_TRANSFER'))
    expect(screen.getByTestId('flame-selected-CANNOT_TRANSFER')).not.toBeNull()
  })
  it('should not be able to proceed if no new fuses have been burned', () => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseGetWrapperData.mockReturnValue({
      wrapperData: { fuseObj: { ...defaultFuseObj, CANNOT_BURN_FUSES: true } },
    })
    render(<BurnFuses {...burnFusesProps} />)
    expect(screen.getByTestId('burn-form-continue')).toBeDisabled()
  })
  it('should reset inital data correctly', () => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseGetWrapperData.mockReturnValue({
      wrapperData: { fuseObj: { ...defaultFuseObj, CANNOT_BURN_FUSES: true } },
    })
    const { rerender } = render(<BurnFuses {...burnFusesProps} />)
    mockUseGetWrapperData.mockReturnValue({
      wrapperData: { fuseObj: { ...defaultFuseObj, CANNOT_BURN_FUSES: false } },
    })
    rerender(<BurnFuses {...burnFusesProps} />)
    expect(screen.getByTestId('burn-button-CANNOT_BURN_FUSES')).not.toHaveTextContent(
      'fuses.burned',
    )
  })
  it('should create transaction correctly', async () => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseGetWrapperData.mockReturnValue({
      wrapperData: { fuseObj: { ...defaultFuseObj, CANNOT_BURN_FUSES: false } },
    })
    const mockDispatch = jest.fn()
    render(<BurnFuses {...{ ...burnFusesProps, dispatch: mockDispatch }} />)
    fireEvent.click(screen.getByText('fuses.permissions.CANNOT_BURN_FUSES'))
    fireEvent.click(screen.getByText('fuses.permissions.CANNOT_UNWRAP'))
    fireEvent.click(screen.getByTestId('burn-form-continue'))
    await waitFor(() =>
      expect(mockDispatch).toHaveBeenCalledWith({
        name: 'setTransactions',
        payload: [
          {
            data: {
              name: 'nick.eth',
              permissions: [
                'fuses.permissions.CANNOT_BURN_FUSES',
                'fuses.permissions.CANNOT_UNWRAP',
              ],
              selectedFuses: ['CANNOT_BURN_FUSES', 'CANNOT_UNWRAP'],
            },
            name: 'burnFuses',
          },
        ],
      }),
    )
  })
  it('owner should not be able to burn PCC', () => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseGetWrapperData.mockReturnValue({
      wrapperData: { fuseObj: { ...defaultFuseObj, CANNOT_BURN_FUSES: true } },
    })
    render(<BurnFuses {...burnFusesProps} />)
    expect(screen.queryByText('Parent can control')).toBeNull()
  })
  it('should not allow owner to continue if they do not burn can unwrap', async () => {
    // Also check that info message is shown
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseGetWrapperData.mockReturnValue({
      wrapperData: { fuseObj: { ...defaultFuseObj } },
    })
    const mockDispatch = jest.fn()
    render(<BurnFuses {...{ ...burnFusesProps, dispatch: mockDispatch }} />)
    fireEvent.click(screen.getByText('fuses.permissions.CANNOT_BURN_FUSES'))
    fireEvent.click(screen.getByTestId('burn-form-continue'))
    expect(screen.getByText('fuses.info')).toBeInTheDocument()
    expect(mockDispatch).toHaveBeenCalledTimes(0)
  })
})
