/* eslint-disable @typescript-eslint/naming-convention */

import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { GRACE_PERIOD } from '@app/utils/constants'

import { createAccounts } from '../../playwright/fixtures/accounts'

const mockUseWrapperDataTypes = [
  'wrapped',
  'wrapped:unowned',
  'emancipated',
  'emancipated:unowned',
  'locked',
  'locked:unowned',
  'burnt',
  'burnt:unowned',
] as const
export type MockUseWrapperDataType = (typeof mockUseWrapperDataTypes)[number] | undefined

const userAddress = createAccounts().getAddress('user') as Address
const user2Address = createAccounts().getAddress('user2') as Address

export const makeMockUseWrapperDataData = (
  type?: MockUseWrapperDataType,
): GetWrapperDataReturnType | undefined => {
  return match(type)
    .with(P.union('wrapped', 'wrapped:unowned'), (_type) => ({
      fuses: {
        parent: {
          PARENT_CANNOT_CONTROL: false,
          CAN_EXTEND_EXPIRY: false,
          IS_DOT_ETH: false,
          unnamed: {
            '0x80000': false,
            '0x100000': false,
            '0x200000': false,
            '0x400000': false,
            '0x800000': false,
            '0x1000000': false,
          },
        },
        child: {
          CANNOT_UNWRAP: false,
          CANNOT_BURN_FUSES: false,
          CANNOT_TRANSFER: false,
          CANNOT_SET_RESOLVER: false,
          CANNOT_SET_TTL: false,
          CANNOT_CREATE_SUBDOMAIN: false,
          CANNOT_APPROVE: false,
          unnamed: {
            '0x80': false,
            '0x100': false,
            '0x200': false,
            '0x400': false,
            '0x800': false,
            '0x1000': false,
            '0x2000': false,
            '0x4000': false,
            '0x8000': false,
          },
          CAN_DO_EVERYTHING: true,
        },
        value: 0,
      },
      expiry: {
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 + GRACE_PERIOD),
        value: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 365 + GRACE_PERIOD),
      },
      owner: _type.endsWith('unowned') ? user2Address : userAddress,
    }))
    .with(P.union('emancipated', 'emancipated:unowned'), (_type) => ({
      fuses: {
        parent: {
          PARENT_CANNOT_CONTROL: true,
          CAN_EXTEND_EXPIRY: false,
          IS_DOT_ETH: true,
          unnamed: {
            '0x80000': false,
            '0x100000': false,
            '0x200000': false,
            '0x400000': false,
            '0x800000': false,
            '0x1000000': false,
          },
        },
        child: {
          CANNOT_UNWRAP: false,
          CANNOT_BURN_FUSES: false,
          CANNOT_TRANSFER: false,
          CANNOT_SET_RESOLVER: false,
          CANNOT_SET_TTL: false,
          CANNOT_CREATE_SUBDOMAIN: false,
          CANNOT_APPROVE: false,
          unnamed: {
            '0x80': false,
            '0x100': false,
            '0x200': false,
            '0x400': false,
            '0x800': false,
            '0x1000': false,
            '0x2000': false,
            '0x4000': false,
            '0x8000': false,
          },
          CAN_DO_EVERYTHING: true,
        },
        value: 196608,
      },
      expiry: {
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 + GRACE_PERIOD),
        value: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 365 + GRACE_PERIOD),
      },
      owner: _type.endsWith('unowned') ? user2Address : userAddress,
    }))
    .with(P.union('locked', 'locked:unowned'), (_type) => ({
      fuses: {
        parent: {
          PARENT_CANNOT_CONTROL: true,
          CAN_EXTEND_EXPIRY: false,
          IS_DOT_ETH: true,
          unnamed: {
            '0x80000': false,
            '0x100000': false,
            '0x200000': false,
            '0x400000': false,
            '0x800000': false,
            '0x1000000': false,
          },
        },
        child: {
          CANNOT_UNWRAP: true,
          CANNOT_BURN_FUSES: false,
          CANNOT_TRANSFER: false,
          CANNOT_SET_RESOLVER: false,
          CANNOT_SET_TTL: false,
          CANNOT_CREATE_SUBDOMAIN: false,
          CANNOT_APPROVE: false,
          unnamed: {
            '0x80': false,
            '0x100': false,
            '0x200': false,
            '0x400': false,
            '0x800': false,
            '0x1000': false,
            '0x2000': false,
            '0x4000': false,
            '0x8000': false,
          },
          CAN_DO_EVERYTHING: false,
        },
        value: 196609,
      },
      expiry: {
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 + GRACE_PERIOD),
        value: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 365 + GRACE_PERIOD),
      },
      owner: _type.endsWith('unowned') ? user2Address : userAddress,
    }))
    .with(P.union('burnt', 'burnt:unowned'), (_type) => ({
      fuses: {
        parent: {
          PARENT_CANNOT_CONTROL: true,
          CAN_EXTEND_EXPIRY: false,
          IS_DOT_ETH: true,
          unnamed: {
            '0x80000': false,
            '0x100000': false,
            '0x200000': false,
            '0x400000': false,
            '0x800000': false,
            '0x1000000': false,
          },
        },
        child: {
          CANNOT_UNWRAP: true,
          CANNOT_BURN_FUSES: true,
          CANNOT_TRANSFER: true,
          CANNOT_SET_RESOLVER: true,
          CANNOT_SET_TTL: true,
          CANNOT_CREATE_SUBDOMAIN: true,
          CANNOT_APPROVE: true,
          unnamed: {
            '0x80': true,
            '0x100': true,
            '0x200': true,
            '0x400': true,
            '0x800': true,
            '0x1000': true,
            '0x2000': true,
            '0x4000': true,
            '0x8000': true,
          },
          CAN_DO_EVERYTHING: false,
        },
        value: 196735,
      },
      expiry: {
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 + GRACE_PERIOD),
        value: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 365 + GRACE_PERIOD),
      },
      owner: _type.endsWith('unowned') ? user2Address : userAddress,
    }))
    .with(P.nullish, () => null)
    .exhaustive()
}
