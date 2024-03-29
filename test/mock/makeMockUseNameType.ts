/* eslint-disable @typescript-eslint/naming-convention */
import { NameType } from '@app/hooks/nameType/getNameType'

import { MockUseBasicNameType } from './makeMockUseBasicName'

export type MockUseNameTypeType = Exclude<
  NameType,
  | 'dns-emancipated-2ld'
  | 'dns-locked-2ld'
  | 'dns-emancipated-subname'
  | 'dns-locked-subname'
  | 'dns-pcc-expired-subname'
>

type MockUseNameTypeConfig = {
  name: string
  basicNameType: MockUseBasicNameType
}

export const mockUseNameTypeConfig: { [key in MockUseNameTypeType]: MockUseNameTypeConfig } = {
  root: {
    name: '[root]',
    basicNameType: 'root',
  },
  tld: {
    name: 'eth',
    basicNameType: 'eth',
  },
  'eth-unwrapped-2ld': {
    name: 'name.eth',
    basicNameType: 'eth-unwrapped-2ld',
  },
  'eth-unwrapped-2ld:grace-period': {
    name: 'name.eth',
    basicNameType: 'eth-unwrapped-2ld:grace-period',
  },
  'eth-emancipated-2ld': {
    name: 'name.eth',
    basicNameType: 'eth-emancipated-2ld',
  },
  'eth-emancipated-2ld:grace-period': {
    name: 'name.eth',
    basicNameType: 'eth-emancipated-2ld:grace-period',
  },
  'eth-locked-2ld': {
    name: 'name.eth',
    basicNameType: 'eth-locked-2ld',
  },
  'eth-locked-2ld:grace-period': {
    name: 'name.eth',
    basicNameType: 'eth-locked-2ld:grace-period',
  },
  'eth-unwrapped-subname': {
    name: 'subname.name.eth',
    basicNameType: 'eth-unwrapped-subname',
  },
  'eth-wrapped-subname': {
    name: 'subname.name.eth',
    basicNameType: 'eth-wrapped-subname',
  },
  'eth-emancipated-subname': {
    name: 'subname.name.eth',
    basicNameType: 'eth-emancipated-subname',
  },
  'eth-locked-subname': {
    name: 'subname.name.eth',
    basicNameType: 'eth-locked-subname',
  },
  'eth-pcc-expired-subname': {
    name: 'subname.name.eth',
    basicNameType: 'eth-pcc-expired-subname',
  },
  'dns-unwrapped-2ld': {
    name: 'name.com',
    basicNameType: 'dns-unwrapped-2ld',
  },
  'dns-wrapped-2ld': {
    name: 'name.com',
    basicNameType: 'dns-wrapped-2ld',
  },
  'dns-offchain-2ld': {
    name: 'name.com',
    basicNameType: 'dns-offchain-2ld',
  },
  'dns-unwrapped-subname': {
    name: 'subname.name.com',
    basicNameType: 'dns-unwrapped-subname',
  },
  'dns-wrapped-subname': {
    name: 'subname.name.com',
    basicNameType: 'dns-wrapped-subname',
  },
}

export const mockUseNameTypes = Object.keys(mockUseNameTypeConfig) as MockUseNameTypeType[]

export const makeMockUseNameTypeData = (type: MockUseNameTypeType) => {
  return type
}
