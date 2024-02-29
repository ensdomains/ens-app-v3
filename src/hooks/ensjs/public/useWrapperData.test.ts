import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { GetWrapperDataReturnType } from '@ensdomains/ensjs/public'

import { NameType } from '@app/hooks/nameType/getNameType'

export const createMockWrapperData = (
  nameType: NameType,
  overides?: GetWrapperDataReturnType,
): GetWrapperDataReturnType | undefined =>
  match(nameType)
    .with(P.union('eth-unwrapped-2ld', 'eth-grace-period-unwrapped-2ld'), () => null)
    .with(P.union('eth-emancipated-2ld', 'eth-locked-2ld', 'eth-grace-period-emancipated-2ld', 'eth-grace-period-locked-2ld'), () => ({
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
          CANNOT_UNWRAP: nameType.includes('-locked-'),
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
          CAN_DO_EVERYTHING: nameType.includes('-emancipated-'),
        },
        value: 196608,
      },
      expiry: {
        date: new Date(),
        value: 1746423254n,
      },
      owner: overides?.owner || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
    }))
    .otherwise(() => null)
