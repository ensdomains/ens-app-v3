import { useRouter } from 'next/router'

import { mockFunction, render, screen } from '@app/test-utils'
import { useGetFuseData } from '@app/hooks/useGetFuseData'

import { BurnFuses } from './BurnFuses'

jest.mock('next/router')
jest.mock('@app/hooks/useGetFuseData')

const mockUseRouter = mockFunction(useRouter)
const mockUseGetFuseData = mockFunction(useGetFuseData)

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
    mockUseGetFuseData.mockReturnValue({})
    render(<BurnFuses {...burnFusesProps} />)
    expect(screen.getByText('action.burnSelected')).toBeVisible()
  })
  it('should not update selected for already burned permission', () => {
    mockUseRouter.mockReturnValue({
      query: {
        name: 'nick.eth',
      },
    })
    mockUseGetFuseData.mockReturnValue({})
    render(<BurnFuses {...burnFusesProps} />)
    screen.debug()
  })
  it.todo('should set initial fuse data and selected data correctly')
  it.todo('should not be able to proceed if no new fused have been burned')
  it.todo('should reset inital data correctly')
  it.todo('should create transaction correctly')
  it.todo('should not allow owner to burn PCC')
  it.todo('parent should be able to burn PCC')
  it.todo('should proudce correct fuses based on user choice')
  it.todo('should not allow owner to continue if they do not burn can unwrap')
  it.todo('should show message if CU is not burned when editing')
  it.todo('should disable continue button if CU is not burned')
})
