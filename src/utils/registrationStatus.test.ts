import { mockFunction } from '@app/test-utils'

import { useEns } from '@app/utils/EnsProvider'

import { addRegistrationStatusToBatch } from './registrationStatus'

jest.mock('@app/utils/EnsProvider')

const mockUseEns = mockFunction(useEns)

describe('addRegistrationStatustoBatch', () => {
  it('should call getOwner without specifying a contract if the name is a subname', () => {
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
})
