/* eslint-disable @typescript-eslint/naming-convention */

import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { GRACE_PERIOD } from '@app/utils/constants'

import { createAccounts } from '../../playwright/fixtures/accounts'

const mockUseWrapperDataTypes = [
  'unwrapped-or-available',
  'eth-emancipated-2ld',
  'eth-locked-2ld',
] as const
export type MockUseWrapperDataType = (typeof mockUseWrapperDataTypes)[number]

const useAddress = createAccounts().getAddress('user') as Address

export const makeMockUseWrapperDataData = (
  type: MockUseWrapperDataType,
): GetWrapperDataReturnType | undefined => {
  return match(type)
    .with(P.union('unwrapped-or-available'), () => null)
    .with(P.union('eth-emancipated-2ld', 'eth-locked-2ld'), () => ({
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
          CANNOT_UNWRAP: type.includes('-locked-'),
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
          CAN_DO_EVERYTHING: type.includes('-emancipated-'),
        },
        value: 196608,
      },
      expiry: {
        date: new Date(Date.now() + 1000 * 60 * 60 * 24 * 365 + GRACE_PERIOD),
        value: BigInt(Date.now() + 1000 * 60 * 60 * 24 * 365 + GRACE_PERIOD),
      },
      owner: useAddress,
    }))
    .otherwise(() => null)
}
