import { renderHook } from '@app/test-utils'

import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'

import { useGetPrimaryNameTransactionFlowItem } from '.'

const mockUseReverseRegistryName = jest.fn().mockReturnValue({
  data: 'test.eth',
  isLoading: false,
})
jest.mock('@app/hooks/reverseRecord/useReverseRegistryName', () => ({
  useReverseRegistryName: () => mockUseReverseRegistryName(),
}))

const makeResovlerStatus = (
  overwrites: { isAuthorized?: boolean; hasMigratedRecord?: boolean } = {},
) =>
  ({
    isAuthorized: true,
    hasMigratedRecord: true,
    ...overwrites,
  } as unknown as ReturnType<typeof useResolverStatus>['data'])

describe('useGetPrimaryNameTransactionFlowItem', () => {
  it('should return undefined if there are no transactions to be made', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        profileAddress: '0x123',
        resolverAddress: '0xresolver',
        resolverStatus: makeResovlerStatus(),
      }),
    )
    expect(result.current.callBack?.('test.eth')).toBeNull()
  })

  it('should return transaction SetPrimaryName if the reverseRegistryName is undefined.', async () => {
    mockUseReverseRegistryName.mockReturnValueOnce({
      data: undefined,
      isLoading: false,
    })
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        profileAddress: '0x123',
        resolverAddress: '0xresolver',
        resolverStatus: makeResovlerStatus(),
      }),
    )
    expect(result.current.callBack?.('test.eth')).toMatchObject({
      transactions: [
        {
          data: {
            name: 'test.eth',
            address: '0x123',
          },
          name: 'setPrimaryName',
        },
      ],
    })
  })

  it('should return transaction SetPrimaryName if the reverseRegistryName does not match the name.', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        profileAddress: '0x123',
        resolverAddress: '0xresolver',
        resolverStatus: makeResovlerStatus(),
      }),
    )
    expect(result.current.callBack?.('primary.eth')).toMatchObject({
      transactions: [
        {
          data: {
            name: 'primary.eth',
            address: '0x123',
          },
          name: 'setPrimaryName',
        },
      ],
    })
  })

  it('should return transaction updateResolver if the resolver status is unauthorized', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        resolverAddress: '0xresolver',
        resolverStatus: makeResovlerStatus({ isAuthorized: false }),
      }),
    )
    expect(result.current.callBack?.('test.eth')).toMatchObject({
      transactions: [
        {
          data: {
            name: 'test.eth',
            contract: 'registry',
          },
          name: 'updateResolver',
        },
      ],
    })
  })

  it('should return transaction updateResolver using namewrapper contract if the resolver status is unauthorized and name is wrapped', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: true,
        resolverAddress: '0xresolver',
        resolverStatus: makeResovlerStatus({ isAuthorized: false }),
      }),
    )
    expect(result.current.callBack?.('test.eth')).toMatchObject({
      transactions: [
        {
          data: {
            name: 'test.eth',
            contract: 'nameWrapper',
          },
          name: 'updateResolver',
        },
      ],
    })
  })

  it('should return transaction updateResolver and updateEthAddress on latest resolver if the resolver status is unauthorized and latest resolver does not have eth record migrated', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        resolverAddress: '0xresolver',
        resolverStatus: makeResovlerStatus({ isAuthorized: false, hasMigratedRecord: false }),
      }),
    )
    expect(result.current.callBack?.('test.eth')).toMatchObject({
      transactions: [
        {
          data: {
            name: 'test.eth',
            address: '0x123',
            latestResolver: true,
          },
          name: 'updateEthAddress',
        },
        {
          data: {
            name: 'test.eth',
            contract: 'registry',
          },
          name: 'updateResolver',
        },
      ],
    })
  })

  it('should return transaction updateEthAddress if the profile address is not the same as the use address', () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        profileAddress: '0x1234',
        resolverAddress: '0xresolver',
        resolverStatus: makeResovlerStatus(),
      }),
    )
    expect(result.current.callBack?.('test.eth')).toMatchObject({
      transactions: [
        {
          data: {
            name: 'test.eth',
            address: '0x123',
          },
          name: 'updateEthAddress',
        },
      ],
    })
  })

  it('should return intro noResolver.title if updating resolver with when profile resolver is empty string', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        resolverAddress: '',
        resolverStatus: makeResovlerStatus({ isAuthorized: false, hasMigratedRecord: false }),
      }),
    )
    expect(result.current.callBack?.('test.eth')).toMatchObject({
      intro: {
        title: ['intro.selectPrimaryName.noResolver.title', { ns: 'transactionFlow' }],
      },
    })
  })

  it('should return intro invalidResolver.title if updating resolver with when profile resolver is empty string', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        resolverAddress: '0xresolver',
        resolverStatus: makeResovlerStatus({ isAuthorized: false, hasMigratedRecord: false }),
      }),
    )
    expect(result.current.callBack?.('test.eth')).toMatchObject({
      intro: {
        title: ['intro.selectPrimaryName.invalidResolver.title', { ns: 'transactionFlow' }],
      },
    })
  })

  it('should return intro updateEthAddress.title if setting multi transaction and resolver is authorized', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x1234',
        isWrapped: false,
        resolverAddress: '0xresolver',
        resolverStatus: makeResovlerStatus(),
      }),
    )
    expect(result.current.callBack?.('primary.eth')).toMatchObject({
      intro: {
        title: ['intro.selectPrimaryName.updateEthAddress.title', { ns: 'transactionFlow' }],
      },
    })
  })

  it('should not return intro if setting a single transaction', async () => {
    const { result } = renderHook(() =>
      useGetPrimaryNameTransactionFlowItem({
        address: '0x123',
        isWrapped: false,
        profileAddress: '0x123',
        resolverAddress: '0xresolver',
        resolverStatus: makeResovlerStatus(),
      }),
    )
    expect(result.current.callBack?.('primary.eth')?.transactions.length).toBe(1)
    expect(result.current.callBack?.('primary.eth')?.intro).toBeUndefined()
  })
})
