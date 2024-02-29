import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { GetOwnerReturnType } from '@ensdomains/ensjs/public'

import { NameType } from '@app/hooks/nameType/getNameType'


export const createMockOwnerData = (nameType: NameType, overides?: GetOwnerReturnType): GetOwnerReturnType | undefined =>
  match(nameType)
    .with('eth-unwrapped-2ld', () => ({
      owner: overides?.owner || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
      ownershipLevel: 'registrar' as const,
      registrant: overides?.registrant || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
    }))
    .with(P.union('eth-grace-period-unwrapped-2ld'), () => ({
      owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
      ownershipLevel: 'registrar' as const,
      registrant: null,
    }))
    .with(P.union('eth-emancipated-2ld', 'eth-locked-2ld'), () => ({
      owner: overides?.owner || '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
      ownershipLevel: 'nameWrapper' as const
    }))
    .with(P.union('eth-grace-period-emancipated-2ld', 'eth-grace-period-locked-2ld'), () => ({
      owner: '0xf39Fd6e51aad88F6F4ce6aB8827279cffFb92266' as Address,
      ownershipLevel: 'registrar' as const,
      registrant: null,
    }))
    .otherwise(() => undefined)