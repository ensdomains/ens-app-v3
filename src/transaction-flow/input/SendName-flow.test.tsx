import { mockFunction } from '@app/test-utils'

import { useEns } from '@app/utils/EnsProvider'

import { handleSubmitForm } from './SendName-flow'

jest.mock('@app/utils/EnsProvider')

const mockUseEns = mockFunction(useEns)

const defaultMockInputData = {
  ownerData: {},
  dipsatch: jest.fn(),
  sendNameWatch: undefined,
  managerChoiceWatch: undefined,
  ownerChoiceWatch: undefined,
  name: 'nick.eth',
  isWrapped: false,
  ownershipLavel: 'regsitry',
  address: '0x123',
}

describe('handleSubmitForm', () => {
  describe('Parent sending subname', () => {
    it('should call transferSubname on the nameWrapper if the parent is wrapped', () => {
      const result = handleSubmitForm({
        ...defaultMockInputData,
        name: 'sub.wrapped.eth',
        ownerChoiceWatch: 'owner',
      })

      const mockBatch = jest.fn()
      mockUseEns.mockReturnValue({
        getOwner: {
          batch: mockBatch,
        },
      })
      const ens = useEns()
      addRegistrationStatusToBatch(ens, 'sub1.wrapped.eth')
      expect(mockBatch).toHaveBeenCalledWith('sub1.wrapped.eth')
      expect(mockBatch.mock.calls[0].length).toEqual(1)
    })
    it.todo('should call transferSubname on the registry if the parent is not wrapped')
  })
})
