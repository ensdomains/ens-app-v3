import { useProfile } from '@app/hooks/useProfile'
import { mockFunction, render, screen } from '@app/test-utils'
import { useRouter } from 'next/router'
import ResolverDetails from './ResolverDetails'

jest.mock('next/router')
jest.mock('@app/hooks/useProfile')

const mockUseRouter = mockFunction(useRouter)
const mockUseProfile = mockFunction(useProfile)

describe('ResolverDetails', () => {
  mockUseRouter.mockReturnValue({
    query: {
      name: 'nick.eth',
    },
  })

  it('should display the address', () => {
    const mockProfileResponse = {
      profile: {
        resolverAddress: 'address',
        isMigrated: false,
      },
    }
    mockUseProfile.mockReturnValue(mockProfileResponse)
    render(<ResolverDetails />)
    expect(screen.getByText('address')).toBeVisible()
  })
  it('should show green dot and latest text when resolver is up to date', () => {
    const mockProfileResponse = {
      profile: {
        resolverAddress: '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
      },
    }
    mockUseProfile.mockReturnValue(mockProfileResponse)
    render(<ResolverDetails />)
    expect(screen.getByText('Latest')).toBeVisible()
    expect(screen.getByTestId('version-indicator-dot-latest')).toBeVisible()
  })
  it('should show red no when resolver has not been migrated', () => {
    const mockProfileResponse = {
      profile: {
        resolverAddress: '0xdaaf96c344f63131acadd0ea35170e7892d3dfba',
      },
    }
    mockUseProfile.mockReturnValue(mockProfileResponse)
    render(<ResolverDetails />)
    expect(screen.getByText('Outdated')).toBeVisible()
    expect(screen.getByTestId('version-indicator-dot-outdated')).toBeVisible()
  })
})
