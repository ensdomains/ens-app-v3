import { renderHook } from '@app/test-utils'

import { useNamesFromResolvedAddress } from '@app/hooks/names/useNamesFromResolvedAddress/useNamesFromResolvedAddress'

const mockGetNames = jest.fn().mockResolvedValue([
  {
    name: 'test.eth',
    manager: '0xaddress',
    owner: '0xvoid',
  },
  {
    name: 'test2.eth',
    manager: '0xvoid',
    owner: '0xaddress',
  },
  {
    name: 'test3.eth',
    manager: '0xvoid',
    owner: '0xaddress',
    fuses: {},
  },
])
jest.mock('@app/utils/EnsProvider', () => ({
  useEns: () => ({
    ready: true,
    getNames: () => mockGetNames(),
  }),
}))

describe('useNamesFromResolvedAddress', () => {
  it('should something', async () => {
    const { result, waitForNextUpdate } = renderHook(() => useNamesFromResolvedAddress('0xaddress'))
    await waitForNextUpdate()
    expect(result.current).toMatchObject({
      data: [
        {
          name: 'test.eth',
          isResolvedAddress: true,
          isController: true,
          isRegistrant: false,
          isWrappedOwner: false,
        },
        {
          name: 'test2.eth',
          isResolvedAddress: true,
          isController: false,
          isRegistrant: true,
          isWrappedOwner: false,
        },
        {
          name: 'test3.eth',
          isResolvedAddress: true,
          isController: false,
          isRegistrant: false,
          isWrappedOwner: true,
        },
      ],
    })
  })
})
