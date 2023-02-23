import { mockFunction, renderHook } from '@app/test-utils'

import { toUtf8Bytes } from '@ethersproject/strings/lib/utf8'

import { DeepPartial } from '@app/types'
import { useEns } from '@app/utils/EnsProvider'
import { emptyAddress } from '@app/utils/constants'

import { useGetWrapperData } from './useGetWrapperData'
import { useValidateSubnameLabel } from './useValidateSubnameLabel'

const BYTE256 =
  '0000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000000'

jest.mock('@app/utils/EnsProvider')
jest.mock('@app/hooks/useGetWrapperData')

const mockUseEns = mockFunction(useEns)
const mockGetOwner = jest.fn()
mockUseEns.mockReturnValue({
  ready: true,
  getOwner: mockGetOwner,
})

const mockUseGetWrapperData = mockFunction(useGetWrapperData)

type OwnerData = Awaited<ReturnType<ReturnType<typeof useEns>['getOwner']>>
const makeOwnerData = (
  type: 'nameWrapper' | 'registrar' | 'registry',
  overrides: DeepPartial<OwnerData> = {},
) => {
  if (type === 'nameWrapper')
    return {
      expired: false,
      ownershipLevel: 'nameWrapper',
      owner: emptyAddress,
      ...overrides,
    }
  if (type === 'registrar')
    return {
      expired: false,
      ownershipLevel: 'registrar',
      owner: emptyAddress,
      registrant: emptyAddress,
      ...overrides,
    }
  return {
    owner: emptyAddress,
    ownershipLevel: 'registry',
    ...overrides,
  } as OwnerData
}

type WrapperData = Awaited<ReturnType<ReturnType<typeof useEns>['getWrapperData']>>
const makeWrapperData = (overrides: DeepPartial<WrapperData> = {}) => {
  const { parent = {}, child = {}, ...data } = overrides
  return {
    parent: {
      PARENT_CANNOT_CONTROL: false,
      CAN_EXTEND_EXPIRY: false,
      ...parent,
    },
    child: {
      CANNOT_UNWRAP: false,
      CANNOT_BURN_FUSES: false,
      CANNOT_TRANSFER: false,
      CANNOT_SET_RESOLVER: false,
      CANNOT_SET_TTL: false,
      CANNOT_CREATE_SUBDOMAIN: false,
      ...child,
    },
    owner: '0x0000000000000000000000000000000000000000',
    ...data,
  } as WrapperData
}

const groups = [
  {
    description: 'unwrapped 2LD',
    tests: [
      {
        description: 'should return NOT valid',
        name: 'eth',
        isWrapped: false,
        label: 'test',
        ownerData: makeOwnerData('registrar'),
        wrapperData: makeWrapperData(),
        skipWaitForNextUpdate: true,
        result: {
          valid: false,
          isLoading: false,
          error: undefined,
        },
      },
    ],
  },
  {
    description: 'unwrapped subname',
    tests: [
      {
        description: 'should return valid if owner is empty address',
        name: 'unwrapped.eth',
        isWrapped: false,
        label: 'test1',
        ownerData: makeOwnerData('registry'),
        wrapperData: makeWrapperData(),
        result: {
          valid: true,
          isLoading: false,
          error: undefined,
        },
      },
      {
        description: 'should return valid if owner is undefined',
        name: 'unwrapped.eth',
        isWrapped: false,
        label: 'test1b',
        ownerData: makeOwnerData('registry', { owner: undefined }),
        wrapperData: makeWrapperData(),
        result: {
          valid: true,
          isLoading: false,
          error: undefined,
        },
      },
      {
        description: 'should return NOT valid if owner is defined',
        name: 'unwrapped.eth',
        isWrapped: false,
        label: 'test1b',
        ownerData: makeOwnerData('registry', { owner: '0xOwner' }),
        wrapperData: makeWrapperData(),
        result: {
          valid: false,
          isLoading: false,
          error: 'alreadyExists',
        },
      },
      {
        description: 'should return NOT valid if label is not all lowercase',
        name: 'unwrapped.eth',
        isWrapped: false,
        label: 'Test2',
        ownerData: makeOwnerData('registry'),
        wrapperData: makeWrapperData(),
        result: {
          valid: false,
          isLoading: false,
          error: 'mustUseLowercase',
        },
      },
      {
        description: 'should return valid for label with 256 bytes',
        name: 'unwrapped.eth',
        isWrapped: false,
        label: BYTE256,
        ownerData: makeOwnerData('registry'),
        wrapperData: makeWrapperData(),
        result: {
          valid: true,
          isLoading: false,
          error: undefined,
        },
      },
    ],
  },
  {
    description: 'wrapped subname',
    tests: [
      {
        description: 'should return valid if owner is empty address',
        name: 'wrapped.eth',
        isWrapped: true,
        label: 'test1',
        ownerData: makeOwnerData('nameWrapper'),
        wrapperData: makeWrapperData(),
        skipCalls: {},
        result: {
          valid: true,
          isLoading: false,
          error: undefined,
        },
      },
      {
        description: 'should return valid if owner is undefined',
        name: 'wrapped.eth',
        isWrapped: true,
        label: 'test1b',
        ownerData: makeOwnerData('nameWrapper', { owner: undefined }),
        wrapperData: makeWrapperData(),
        skipCalls: {},
        result: {
          valid: true,
          isLoading: false,
          error: undefined,
        },
      },
      {
        description: 'should return NOT valid if owner is defined',
        name: 'wrapped.eth',
        isWrapped: true,
        label: 'owned',
        ownerData: makeOwnerData('nameWrapper', { owner: '0xOwner' }),
        wrapperData: makeWrapperData(),
        skipCalls: {},
        result: {
          valid: false,
          isLoading: false,
          error: 'alreadyExists',
        },
      },
      {
        description: 'should return NOT valid if label is not all lowercase',
        name: 'wrapped.eth',
        isWrapped: true,
        label: 'Test2',
        ownerData: makeOwnerData('nameWrapper'),
        wrapperData: makeWrapperData(),
        result: {
          valid: false,
          isLoading: false,
          error: 'mustUseLowercase',
        },
      },
      {
        description: 'should return NOT valid if label is 256 bytes',
        name: 'wrapped.eth',
        isWrapped: true,
        label: BYTE256,
        ownerData: makeOwnerData('nameWrapper'),
        wrapperData: makeWrapperData(),
        result: {
          valid: false,
          isLoading: false,
          error: 'nameTooLong',
        },
      },
      {
        description: 'should return valid if label is 255 bytes',
        name: 'wrapped.eth',
        isWrapped: true,
        label: BYTE256.slice(1),
        ownerData: makeOwnerData('nameWrapper'),
        wrapperData: makeWrapperData(),
        result: {
          valid: true,
          isLoading: false,
          error: undefined,
        },
      },
      {
        description: 'should return NOT valid if label exists and PCC is burned',
        name: 'wrapped.eth',
        isWrapped: true,
        label: 'pccburned',
        ownerData: makeOwnerData('nameWrapper'),
        wrapperData: makeWrapperData({
          parent: { PARENT_CANNOT_CONTROL: true },
          expiryDate: new Date('2020-01-01'),
        }),
        result: {
          valid: false,
          isLoading: false,
          error: 'pccBurned',
          expiryLabel: 'Jan 1, 2020',
        },
      },
      {
        description: 'should return NOT valid if label includes invalid characters',
        name: 'wrapped.eth',
        isWrapped: true,
        label: 'hello world',
        ownerData: makeOwnerData('nameWrapper'),
        wrapperData: makeWrapperData(),
        skipWaitForNextUpdate: true,
        result: {
          valid: false,
          isLoading: false,
          error: 'invalidCharacters',
        },
      },
      {
        description: 'should return NOT valid if label has period between text',
        name: 'wrapped.eth',
        isWrapped: true,
        label: 'hello.world',
        ownerData: makeOwnerData('nameWrapper'),
        wrapperData: makeWrapperData(),
        skipWaitForNextUpdate: true,
        result: {
          valid: false,
          isLoading: false,
          error: 'invalidCharacters',
        },
      },
    ],
  },
]

afterEach(() => {
  jest.clearAllMocks()
})

describe('BYTE256', () => {
  it('should be 256 bytes', async () => {
    expect(toUtf8Bytes(BYTE256).length).toEqual(256)
  })
})

describe('useValidateSubnameLabel', () => {
  groups.forEach((group) => {
    describe(group.description, () => {
      group.tests.forEach((test) => {
        it(test.description, async () => {
          mockGetOwner.mockReturnValue(test.ownerData)
          mockUseGetWrapperData.mockReturnValue({
            wrapperData: test.wrapperData,
            isLoading: false,
          })

          const { result, waitForNextUpdate } = renderHook(() =>
            useValidateSubnameLabel(test.name, test.label, test.isWrapped),
          )
          if (!test.skipWaitForNextUpdate) await waitForNextUpdate()
          expect(result.current).toEqual(test.result)
        })
      })
    })
  })
})
