import { render, screen } from '@app/test-utils'
import { useRouter } from 'next/router'

import { useProfile } from '@app/hooks/useProfile'

import ResolverDetails from './ResolverDetails'

jest.mock('next/router')
jest.mock('@app/hooks/useProfile')

describe('ResolverDetails', () => {
  useRouter.mockImplementation(() => {
    return {
      query: {
        name: 'nick.eth',
      },
    }
  })

  it('should display the address', () => {
    const mockProfileResponse = {
      profile: {
        resolverAddress: 'address',
        isMigrated: false,
      },
    }
    useProfile.mockImplementation(() => {
      return mockProfileResponse
    })
    render(<ResolverDetails />)
    expect(screen.getByText('address'))
  })
  it('should show green yes when resolver has been migrated', () => {
    const mockProfileResponse = {
      profile: {
        resolverAddress: 'address',
        isMigrated: true,
      },
    }
    useProfile.mockImplementation(() => {
      return mockProfileResponse
    })
    render(<ResolverDetails />)
    expect(screen.getByText('Yes')).toHaveStyle('color: rgb(73, 179, 147)')
  })
  it('should show red no when resolver has not been migrated', () => {
    const mockProfileResponse = {
      profile: {
        resolverAddress: 'address',
        isMigrated: false,
      },
    }
    useProfile.mockImplementation(() => {
      return mockProfileResponse
    })
    render(<ResolverDetails />)
    expect(screen.getByText('No')).toHaveStyle('color: rgb(213,85,85)')
  })
})
