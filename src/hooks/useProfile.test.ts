import { mockFunction, renderHook } from '@app/test-utils'

import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedGeneralRecordKeys.json'
import supportedTexts from '@app/constants/supportedSocialRecordKeys.json'
import { useEns } from '@app/utils/EnsProvider'

import { useProfile } from './useProfile'

jest.mock('@app/utils/EnsProvider')

const mockUseEns = mockFunction(useEns)
const mockGetProfile = jest.fn()

describe('useProfile', () => {
  mockUseEns.mockReturnValue({
    getProfile: mockGetProfile,
    ready: true,
  })

  it('should call getProfile with the name', async () => {
    const { waitForNextUpdate } = renderHook(() => useProfile('0x123'))
    await waitForNextUpdate()
    expect(mockGetProfile).toHaveBeenCalledWith('0x123', {
      fallback: {
        coinTypes: supportedAddresses,
        texts: [...supportedTexts, ...supportedProfileItems],
      },
    })
  })
})
