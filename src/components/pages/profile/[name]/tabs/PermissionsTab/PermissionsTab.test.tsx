import { mockFunction, render, screen } from '@app/test-utils'

import { mock } from '@wagmi/core'
import { describe, expect, it, vi } from 'vitest'

import { GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { useFusesSetDates } from '@app/hooks/fuses/useFusesSetDates'
import { useParentBasicName } from '@app/hooks/useParentBasicName'
import { DeepPartial } from '@app/types/index'
import { createDateAndValue } from '@app/utils/utils'

import { makeMockUseAbilitiesData } from '../../../../../../../test/mock/makeMockUseAbilitiesData'
import { PermissionsTab } from './PermissionsTab'

type WrapperData = GetWrapperDataReturnType

const makeWrapperData = (override: DeepPartial<WrapperData> = {}) => {
  const defaultData = {
    fuses: {
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
        CANNOT_APPROVE: false,
        CANNOT_BURN_FUSES: false,
      },
    },
    expiry: createDateAndValue(BigInt(new Date('2021-01-01T00:00:00.000Z').getTime())),
    owner: '0x123',
  } satisfies DeepPartial<WrapperData>
  return {
    ...defaultData,
    ...override,
    fuses: {
      ...defaultData.fuses,
      ...override?.fuses,
      parent: {
        ...defaultData.fuses.parent,
        ...override?.fuses?.parent,
      },
      child: {
        ...defaultData.fuses.child,
        ...override?.fuses?.child,
      },
    },
  } as WrapperData
}

vi.mock('@app/hooks/fuses/useFusesSetDates')
vi.mock('@app/hooks/account/useAccountSafely')
vi.mock('@app/hooks/useParentBasicName')
vi.mock('@app/hooks/abilities/useAbilities')

const mockUseGetFusesSetDates = mockFunction(useFusesSetDates)
mockUseGetFusesSetDates.mockReturnValue({ data: {} })

const mockUseAccountSafely = mockFunction(useAccountSafely)
mockUseAccountSafely.mockReturnValue({
  address: '0xOwner',
})

const mockUseParentBasicName = mockFunction(useParentBasicName)
const mockUseAbilities = mockFunction(useAbilities)
mockUseAbilities.mockReturnValue({
  data: makeMockUseAbilitiesData('eth-emancipated-2ld'),
  isLoading: false,
})

const components = [
  'banner-parent-not-locked',
  'button-revoke-pcc',
  'button-revoke-change-fuses',
  'button-extend-expiry',
  'button-revoke-permissions-disabled',
  'button-revoke-permissions',
] as const
type Component = (typeof components)[number]
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
  describe('2LDEths', () => {
    it('should display the correct info', () => {
      mockUseParentBasicName.mockReturnValue({})
      render(
        <PermissionsTab
          name="test.eth"
          wrapperData={makeWrapperData({
            fuses: {
              parent: {
                PARENT_CANNOT_CONTROL: true,
              },
            },
          })}
          isCached={false}
        />,
      )
      expect(screen.queryByTestId('parent-can-control')).toBeNull()
      expect(screen.queryByTestId('parent-cannot-control')).toBeNull()
      expect(screen.getByTestId('owner-can-change-permissions')).toBeInTheDocument()
      expect(screen.queryByTestId('owner-cannot-change-permissions')).toBeNull()
      expect(screen.queryByTestId('parent-can-change-permissions')).toBeNull()
      expect(screen.queryByTestId('owner-can-extend-expiry')).toBeNull()
      expect(screen.queryByTestId('owner-cannot-extend-expiry')).toBeNull()
    })
  })

  describe('Subnames', () => {
    it('Should show the correct info if the parent name is in wrapped state', () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {},
          },
        }),
      })
      render(
        <PermissionsTab name="sub.test.eth" wrapperData={makeWrapperData({})} isCached={false} />,
      )
      expect(screen.getByTestId('parent-can-control')).toBeInTheDocument()
      expect(screen.getByTestId('parent-can-change-permissions')).toBeInTheDocument()
      expect(screen.getByTestId('owner-cannot-extend-expiry')).toBeInTheDocument()
    })

    it('Should show the correct info if the parent name is in emancipated state', () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab name="sub.test.eth" wrapperData={makeWrapperData({})} isCached={false} />,
      )
      expect(screen.getByTestId('parent-can-control')).toBeInTheDocument()
      expect(screen.getByTestId('parent-can-change-permissions')).toBeInTheDocument()
      expect(screen.getByTestId('owner-cannot-extend-expiry')).toBeInTheDocument()
    })

    it('Should show the correct info if the parent name is locked', () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab name="sub.test.eth" wrapperData={makeWrapperData({})} isCached={false} />,
      )
      expect(screen.getByTestId('parent-can-control')).toBeInTheDocument()
      expect(screen.getByTestId('parent-can-change-permissions')).toBeInTheDocument()
      expect(screen.getByTestId('owner-cannot-extend-expiry')).toBeInTheDocument()
    })

    it('Should show the correct info if the name is in emancipated state', () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            fuses: {
              parent: {
                PARENT_CANNOT_CONTROL: true,
              },
            },
          })}
          isCached={false}
        />,
      )
      expect(screen.getByTestId('parent-cannot-control')).toBeInTheDocument()
      expect(screen.getByTestId('owner-can-change-permissions')).toBeInTheDocument()
      expect(screen.getByTestId('owner-cannot-extend-expiry')).toBeInTheDocument()
    })

    it('Should show the correct info if can extend expiry is burned', () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            fuses: {
              parent: {
                PARENT_CANNOT_CONTROL: true,
                CAN_EXTEND_EXPIRY: true,
              },
            },
          })}
          isCached={false}
        />,
      )
      expect(screen.getByTestId('parent-cannot-control')).toBeInTheDocument()
      expect(screen.getByTestId('owner-can-change-permissions')).toBeInTheDocument()
      expect(screen.getByTestId('owner-can-extend-expiry')).toBeInTheDocument()
    })

    it('Should show the correct info if the name is locked', () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            fuses: {
              parent: {
                PARENT_CANNOT_CONTROL: true,
                CAN_EXTEND_EXPIRY: true,
              },
              child: {
                CANNOT_UNWRAP: true,
              },
            },
          })}
          isCached={false}
        />,
      )
      expect(screen.getByTestId('parent-cannot-control')).toBeInTheDocument()
      expect(screen.getByTestId('owner-can-change-permissions')).toBeInTheDocument()
      expect(screen.getByTestId('owner-can-extend-expiry')).toBeInTheDocument()
    })

    it('Should show the correct info if the name is locked', () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            fuses: {
              parent: {
                PARENT_CANNOT_CONTROL: true,
                CAN_EXTEND_EXPIRY: true,
              },
              child: {
                CANNOT_UNWRAP: true,
                CANNOT_BURN_FUSES: true,
              },
            },
          })}
          isCached={false}
        />,
      )
      expect(screen.getByTestId('parent-cannot-control')).toBeInTheDocument()
      expect(screen.getByTestId('owner-cannot-change-permissions')).toBeInTheDocument()
      expect(screen.getByTestId('owner-can-extend-expiry')).toBeInTheDocument()
    })
  })

  describe('Child fuses', () => {
    it('should display unburned permissions correctly', () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({}),
      })
      render(
        <PermissionsTab name="sub.test.eth" wrapperData={makeWrapperData()} isCached={false} />,
      )
      const fuses = [
        'CANNOT_UNWRAP',
        'CANNOT_CREATE_SUBDOMAIN',
        'CANNOT_TRANSFER',
        'CANNOT_SET_RESOLVER',
        'CANNOT_SET_TTL',
        'CANNOT_APPROVE',
      ]
      for (const fuse of fuses) {
        expect(screen.getByTestId(`unburned-${fuse}`)).toBeInTheDocument()
      }
    })

    it('should display burned permissions correctly', () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({}),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            fuses: {
              child: {
                CANNOT_UNWRAP: true,
                CANNOT_CREATE_SUBDOMAIN: true,
                CANNOT_TRANSFER: true,
                CANNOT_SET_RESOLVER: true,
                CANNOT_SET_TTL: true,
                CANNOT_APPROVE: true,
              },
            },
          })}
          isCached={false}
        />,
      )
      const fuses = [
        'CANNOT_UNWRAP',
        'CANNOT_CREATE_SUBDOMAIN',
        'CANNOT_TRANSFER',
        'CANNOT_SET_RESOLVER',
        'CANNOT_SET_TTL',
        'CANNOT_APPROVE',
      ]
      for (const fuse of fuses) {
        expect(screen.getByTestId(`burned-${fuse}`)).toBeInTheDocument()
      }
    })
  })

  describe('user is parent name owner', () => {
    it('should show banner if parent has not burned any fuses', async () => {
      mockUseParentBasicName.mockReturnValue({
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
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          owner: '0xOwner',
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab name="sub.test.eth" wrapperData={makeWrapperData()} isCached={false} />,
      )
      expectFunc(['banner-parent-not-locked'])
    })

    it('should show `give up ownership` and `extend expiry` buttons if parent is locked', async () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          owner: '0xOwner',
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab name="sub.test.eth" wrapperData={makeWrapperData()} isCached={false} />,
      )
      expectFunc(['button-revoke-pcc', 'button-extend-expiry'])
    })

    it('should show `give up ownership` if parent is locked and CEE is burned', async () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          owner: '0xOwner',
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            fuses: {
              parent: {
                CAN_EXTEND_EXPIRY: true,
              },
            },
          })}
          isCached={false}
        />,
      )
      expectFunc(['button-revoke-pcc'])
    })

    it('should show no buttons if PCC is burned', async () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          owner: '0xOwner',
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            fuses: {
              parent: {
                PARENT_CANNOT_CONTROL: true,
              },
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
      mockUseParentBasicName.mockReturnValue({
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
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
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
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
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

    it('should show no buttons if parent is locked and CEE is burned', async () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            fuses: {
              parent: {
                CAN_EXTEND_EXPIRY: true,
              },
            },
            owner: '0xOwner',
          })}
          isCached={false}
        />,
      )
      expectFunc([])
    })

    it('should show `revoke permissions` button if PCC is burned', async () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            fuses: {
              parent: {
                PARENT_CANNOT_CONTROL: true,
              },
            },
            owner: '0xOwner',
          })}
          isCached={false}
        />,
      )
      expectFunc(['button-revoke-permissions'])
    })

    it('should show `revoke change fuses` and `revoke permissions` buttons if name is locked', async () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            fuses: {
              parent: {
                PARENT_CANNOT_CONTROL: true,
              },
              child: {
                CANNOT_UNWRAP: true,
              },
            },
            owner: '0xOwner',
          })}
          isCached={false}
        />,
      )
      expectFunc(['button-revoke-permissions', 'button-revoke-change-fuses'])
    })

    it('should show `disabled revoke permissions` buttons if CBF is burned', async () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            fuses: {
              parent: {
                PARENT_CANNOT_CONTROL: true,
              },
              child: {
                CANNOT_UNWRAP: true,
                CANNOT_BURN_FUSES: true,
              },
            },
            owner: '0xOwner',
          })}
          isCached={false}
        />,
      )
      expectFunc(['button-revoke-permissions-disabled'])
    })

    it('should show only show `revoke change fuses` button if all the child fuses except CBF is burned ', async () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            fuses: {
              parent: {
                PARENT_CANNOT_CONTROL: true,
              },
              child: {
                CANNOT_UNWRAP: true,
                CANNOT_CREATE_SUBDOMAIN: true,
                CANNOT_SET_RESOLVER: true,
                CANNOT_SET_TTL: true,
                CANNOT_TRANSFER: true,
                CANNOT_APPROVE: true,
              },
            },
            owner: '0xOwner',
          })}
          isCached={false}
        />,
      )
      expectFunc(['button-revoke-change-fuses'])
    })

    it('should show no buttons if all the child fuses are burned ', async () => {
      mockUseParentBasicName.mockReturnValue({
        wrapperData: makeWrapperData({
          fuses: {
            parent: {
              PARENT_CANNOT_CONTROL: true,
            },
            child: {
              CANNOT_UNWRAP: true,
            },
          },
        }),
      })
      render(
        <PermissionsTab
          name="sub.test.eth"
          wrapperData={makeWrapperData({
            fuses: {
              parent: {
                PARENT_CANNOT_CONTROL: true,
              },
              child: {
                CANNOT_UNWRAP: true,
                CANNOT_CREATE_SUBDOMAIN: true,
                CANNOT_SET_RESOLVER: true,
                CANNOT_SET_TTL: true,
                CANNOT_APPROVE: true,
                CANNOT_TRANSFER: true,
                CANNOT_BURN_FUSES: true,
              },
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
