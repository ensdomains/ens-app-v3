import { mockFunction, render, screen } from '@app/test-utils'

import type { useNameDetails } from '@app/hooks/useNameDetails'
import useOwners from '@app/hooks/useOwners'

import Miscellaneous from './Miscellaneous/Miscellaneous'
import MoreTab from './MoreTab'
import Ownership from './Ownership'
import Resolver from './Resolver'
import Token from './Token/Token'

jest.mock('@app/hooks/useOwners')
jest.mock('./Miscellaneous/Miscellaneous')
jest.mock('./Ownership')
jest.mock('./Resolver')
jest.mock('./Token/Token')

const mockUseOwners = mockFunction(useOwners)
const mockMiscellaneous = mockFunction(Miscellaneous)
const mockOwnership = mockFunction(Ownership)
const mockResolver = mockFunction(Resolver)
const mockToken = mockFunction(Token)

const mockComponent =
  (name: string) =>
  ({ expiryDate }: { expiryDate?: Date } & any) =>
    (
      <div>
        {name}
        {expiryDate ? `-expiry:${expiryDate}` : ''}
      </div>
    )

mockUseOwners.mockImplementation(() => [])
mockMiscellaneous.mockImplementation(mockComponent('Miscellaneous'))
mockOwnership.mockImplementation(mockComponent('Ownership'))
mockResolver.mockImplementation(mockComponent('Resolver'))
mockToken.mockImplementation(mockComponent('Token'))

const renderHelper = ({
  name,
  isWrapped,
  ...props
}: { name: string; isWrapped: boolean } & Partial<ReturnType<typeof useNameDetails>>) => {
  return render(
    <MoreTab
      name={name}
      nameDetails={
        {
          isWrapped,
          ...props,
        } as any
      }
      abilities={{} as any}
    />,
  )
}

describe('MoreTab', () => {
  describe('Token', () => {
    it('should show token section if ownerData is defined', () => {
      renderHelper({ name: 'test', isWrapped: false, ownerData: {} as any })
      expect(screen.getByText('Token')).toBeVisible()
    })
    it('should not show token section if ownerData is undefined', () => {
      renderHelper({ name: 'test', isWrapped: false })
      expect(screen.queryByText('Token')).not.toBeInTheDocument()
    })
  })
})
