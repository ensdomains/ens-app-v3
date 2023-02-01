import { mockFunction, render, screen } from '@app/test-utils'

import { useGetFusesSetDates } from '@app/hooks/fuses/useGetFusesSetDates'
import { useAccountSafely } from '@app/hooks/useAccountSafely'
import { useBasicName } from '@app/hooks/useBasicName'
import { DeepPartial } from '@app/types/index'
import type { useEns } from '@app/utils/EnsProvider'

import { PermissionsTab } from './PermissionsTab'

type WrapperData = Awaited<ReturnType<ReturnType<typeof useEns>['getWrapperData']>>

const makeWrapperData = (override: DeepPartial<WrapperData> = {}) => {
  const defaultData: DeepPartial<WrapperData> = {
    parent: {
      PARENT_CANNOT_CONTROL: false,
      CAN_EXTEND_EXPIRY: false,
    },
    child: {
      CANNOT_UNWRAP: false,
      CANNOT_CREATE_SUBDOMAIN: false,
      CANNOT_TRANSFER: false,
      CANNOT_SET_RESOLVER: false,
      CANNOT_SET_TTL: false,
      CANNOT_BURN_FUSES: false,
    },
    expiryDate: new Date('2021-01-01T00:00:00.000Z'),
    owner: '0x123',
  }
  return {
    ...defaultData,
    ...override,
    parent: {
      ...defaultData.parent,
      ...override.parent,
    },
    child: {
      ...defaultData.child,
      ...override.child,
    },
  } as WrapperData
}

jest.mock('@app/hooks/fuses/useGetFusesSetDates')
jest.mock('@app/hooks/useAccountSafely')
jest.mock('@app/hooks/useBasicName')

const mockUseGetFusesSetDates = mockFunction(useGetFusesSetDates)
mockUseGetFusesSetDates.mockReturnValue({ fusesSetDates: {} })

const mockUseAccountSafely = mockFunction(useAccountSafely)
mockUseAccountSafely.mockReturnValue({
  address: '0xOwner',
})

const mockUseBasicName = mockFunction(useBasicName)

// button-revoke-pcc
// button-revoke-change-fuses
// button-extend-expiry
// button-revoke-permissions-disabled
// button-revoke-permissions

const components = [
  'banner-parent-not-locked',
  'button-revoke-pcc',
  'button-revoke-change-fuses',
  'button-extend-expiry',
  'button-revoke-permissions-disabled',
  'button-revoke-permissions',
] as const
type Component = typeof components[number]
const expectFunc = (visible: Component[] = []) => {
  for (const component of components) {
    if (visible.includes(component)) {
      expect(screen.getByTestId(component)).toBeInTheDocument()
    } else {
      expect(screen.queryByTestId(component)).toBeNull()
    }
  }
}

describe('<PermissionsTab>', () => {
  describe('user is parent name owner', () => {
    it('should show banner if parent has not burned any fuses', async () => {
      mockUseBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          owner: '0xOwner',
        }),
      })
      render(
        <PermissionsTab name="sub.test.eth" wrapperData={makeWrapperData()} isCached={false} />,
      )
      expectFunc(['banner-parent-not-locked'])
    })

    it('should show banner if parent has burned pcc', async () => {
      mockUseBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          owner: '0xOwner',
          parent: {
            PARENT_CANNOT_CONTROL: true,
          },
        }),
      })
      render(
        <PermissionsTab name="sub.test.eth" wrapperData={makeWrapperData()} isCached={false} />,
      )
      expectFunc(['banner-parent-not-locked'])
    })

    it('should show `give up ownership` and `extend expiry` buttons if parent is locked', async () => {
      mockUseBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          owner: '0xOwner',
          parent: {
            PARENT_CANNOT_CONTROL: true,
          },
          child: {
            CANNOT_UNWRAP: true,
          },
        }),
      })
      render(
        <PermissionsTab name="sub.test.eth" wrapperData={makeWrapperData()} isCached={false} />,
      )
      expectFunc(['button-revoke-pcc', 'button-extend-expiry'])
    })

    it('should show `give up ownership` if parent is locked and CEE is burned', async () => {
      mockUseBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          owner: '0xOwner',
          parent: {
            PARENT_CANNOT_CONTROL: true,
          },
          child: {
            CANNOT_UNWRAP: true,
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            parent: {
              CAN_EXTEND_EXPIRY: true,
            },
          })}
          isCached={false}
        />,
      )
      expectFunc(['button-revoke-pcc'])
    })

    it('should show no buttons if PCC is burned', async () => {
      mockUseBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          owner: '0xOwner',
          parent: {
            PARENT_CANNOT_CONTROL: true,
          },
          child: {
            CANNOT_UNWRAP: true,
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
          })}
          isCached={false}
        />,
      )
      expectFunc([])
    })
  })

  describe('user is name owner', () => {
    it('should not show any buttons if no fuses have been burned', async () => {
      mockUseBasicName.mockReturnValue({
        wrapperData: makeWrapperData({}),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({ owner: '0xOwner' })}
          isCached={false}
        />,
      )
      expectFunc([])
    })

    it('should show no buttons if parent has burned pcc', async () => {
      mockUseBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          parent: {
            PARENT_CANNOT_CONTROL: true,
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({ owner: '0xOwner' })}
          isCached={false}
        />,
      )
      expectFunc([])
    })

    it('should show no buttons if parent is locked', async () => {
      mockUseBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          parent: {
            PARENT_CANNOT_CONTROL: true,
          },
          child: {
            CANNOT_UNWRAP: true,
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({ owner: 'OxOwner' })}
          isCached={false}
        />,
      )
      expectFunc([])
    })

    it('should show no buttons if parent is locked and CEE is burned', async () => {
      mockUseBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          parent: {
            PARENT_CANNOT_CONTROL: true,
          },
          child: {
            CANNOT_UNWRAP: true,
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            parent: {
              CAN_EXTEND_EXPIRY: true,
            },
            owner: '0xOwner',
          })}
          isCached={false}
        />,
      )
      expectFunc([])
    })

    it('should show `revoke permissions` button if PCC is burned', async () => {
      mockUseBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          parent: {
            PARENT_CANNOT_CONTROL: true,
          },
          child: {
            CANNOT_UNWRAP: true,
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            owner: '0xOwner',
          })}
          isCached={false}
        />,
      )
      expectFunc(['button-revoke-permissions'])
    })

    it('should show `revoke change fuses` and `revoke permissions` buttons if name is locked', async () => {
      mockUseBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          parent: {
            PARENT_CANNOT_CONTROL: true,
          },
          child: {
            CANNOT_UNWRAP: true,
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
            owner: '0xOwner',
          })}
          isCached={false}
        />,
      )
      expectFunc(['button-revoke-permissions', 'button-revoke-change-fuses'])
    })

    it('should show `disabled revoke permissions` buttons if CBF is burned', async () => {
      mockUseBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          parent: {
            PARENT_CANNOT_CONTROL: true,
          },
          child: {
            CANNOT_UNWRAP: true,
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
              CANNOT_BURN_FUSES: true,
            },
            owner: '0xOwner',
          })}
          isCached={false}
        />,
      )
      expectFunc(['button-revoke-permissions-disabled'])
    })

    it('should show only show `revoke change fuses` button if all the child fuses except CBF is burned ', async () => {
      mockUseBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          parent: {
            PARENT_CANNOT_CONTROL: true,
          },
          child: {
            CANNOT_UNWRAP: true,
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
              CANNOT_CREATE_SUBDOMAIN: true,
              CANNOT_SET_RESOLVER: true,
              CANNOT_SET_TTL: true,
              CANNOT_TRANSFER: true,
            },
            owner: '0xOwner',
          })}
          isCached={false}
        />,
      )
      expectFunc(['button-revoke-change-fuses'])
    })

    it('should show no buttons if all the child fuses are burned ', async () => {
      mockUseBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          parent: {
            PARENT_CANNOT_CONTROL: true,
          },
          child: {
            CANNOT_UNWRAP: true,
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
              CANNOT_CREATE_SUBDOMAIN: true,
              CANNOT_SET_RESOLVER: true,
              CANNOT_SET_TTL: true,
              CANNOT_TRANSFER: true,
              CANNOT_BURN_FUSES: true,
            },
            owner: '0xOwner',
          })}
          isCached={false}
        />,
      )
      expectFunc([])
    })
  })
})
