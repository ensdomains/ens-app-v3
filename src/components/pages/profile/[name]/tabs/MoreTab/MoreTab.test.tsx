import { mockFunction, render, screen } from '@app/test-utils'

import useOwners from '@app/hooks/useOwners'

import Miscellaneous from './Miscellaneous'
import MoreTab from './MoreTab'
import Ownership from './Ownership'
import Resolver from './Resolver'
import Token from './Token'

jest.mock('@app/hooks/useOwners')
jest.mock('./Miscellaneous')
jest.mock('./Ownership')
jest.mock('./Resolver')
jest.mock('./Token')

const mockUseOwners = mockFunction(useOwners)
const mockMiscellaneous = mockFunction(Miscellaneous)
const mockOwnership = mockFunction(Ownership)
const mockResolver = mockFunction(Resolver)
const mockToken = mockFunction(Token)

const mockComponent = (name: string) => () => <div>{name}</div>

mockUseOwners.mockImplementation(() => [])
mockMiscellaneous.mockImplementation(mockComponent('Miscellaneous'))
mockOwnership.mockImplementation(mockComponent('Ownership'))
mockResolver.mockImplementation(mockComponent('Resolver'))
mockToken.mockImplementation(mockComponent('Token'))

const renderHelper = ({ name, isWrapped }: { name: string; isWrapped: boolean }) => {
  return render(
    <MoreTab
      name={name}
      nameDetails={
        {
          isWrapped,
        } as any
      }
      selfAbilities={{} as any}
    />,
  )
}

describe('MoreTab', () => {
  describe('Token', () => {
    it('should show token section for wrapped name', () => {
      renderHelper({ name: 'test.xyz', isWrapped: true })
      expect(screen.getByText('Token')).toBeVisible()
    })
    it('should show token section for eth2ld name', () => {
      renderHelper({ name: 'test.eth', isWrapped: false })
      expect(screen.getByText('Token')).toBeVisible()
    })
    it('should not show token section for unwrapped non .eth subname', () => {
      renderHelper({ name: 'something.test.xyz', isWrapped: false })
      expect(screen.queryByText('Token')).not.toBeInTheDocument()
    })
    it('should not show token section for unwrapped .eth subname', () => {
      renderHelper({ name: 'something.test.eth', isWrapped: false })
      expect(screen.queryByText('Token')).not.toBeInTheDocument()
    })
  })
})
