/* eslint-disable @typescript-eslint/naming-convention */
import { match } from 'ts-pattern'

import { ValidationResult } from '@app/hooks/useValidate'

export const mockUseValidateConfig = {
  root: { input: '[root]' },
  eth: { input: 'eth' },
  dns: { input: 'com' },
  'valid-2ld': { input: 'name.eth' },
  'valid-2ld:dns': { input: 'name.com' },
  'invalid-2ld': { input: 'name❤️.eth' },
  'valid-subname': { input: 'subname.name.eth' },
  'valid-subname:dns': { input: 'subname.name.com' },
} as const
export type MockUseValidateType = keyof typeof mockUseValidateConfig
export const mockUseValidateTypes = Object.keys(mockUseValidateConfig) as MockUseValidateType[]

export const makeMockUseValidate = (type: MockUseValidateType): ValidationResult => {
  return match(type)
    .with('root', () => ({
      type: 'label' as const,
      isShort: true,
      isValid: true,
      is2LD: false,
      isETH: false,
      labelDataArray: [
        {
          error: new Error('disallowed character: "["‎ {5B}'),
          input: [91, 114, 111, 111, 116, 93],
          offset: 0,
          output: undefined,
        },
      ],
      name: '[root]',
      beautifiedName: '[root]',
      isNonASCII: false,
      labelCount: 1,
    }))
    .with('eth', () => ({
      type: 'label' as const,
      isShort: false,
      isValid: true,
      is2LD: false,
      isETH: true,
      labelDataArray: [
        {
          input: [101, 116, 104],
          offset: 0,
          tokens: [[101, 116, 104]],
          type: 'ASCII',
          output: [101, 116, 104],
        },
      ],
      name: 'eth',
      beautifiedName: 'eth',
      isNonASCII: false,
      labelCount: 1,
    }))
    .with('dns', () => ({
      type: 'label' as const,
      isShort: false,
      isValid: true,
      is2LD: false,
      isETH: false,
      labelDataArray: [
        {
          input: [99, 111, 109],
          offset: 0,
          tokens: [[99, 111, 109]],
          type: 'ASCII',
          output: [99, 111, 109],
        },
      ],
      name: 'com',
      beautifiedName: 'com',
      isNonASCII: false,
      labelCount: 1,
    }))
    .with('valid-2ld', () => ({
      type: 'name' as const,
      isShort: false,
      isValid: true,
      is2LD: true,
      isETH: true,
      labelDataArray: [
        {
          input: [110, 97, 109, 101],
          offset: 0,
          tokens: [[110, 97, 109, 101]],
          type: 'ASCII',
          output: [110, 97, 109, 101],
        },
        {
          input: [101, 116, 104],
          offset: 5,
          tokens: [[101, 116, 104]],
          type: 'ASCII',
          output: [101, 116, 104],
        },
      ],
      name: 'name.eth',
      beautifiedName: 'name.eth',
      isNonASCII: false,
      labelCount: 2,
    }))
    .with('valid-2ld:dns', () => ({
      type: 'name' as const,
      isShort: false,
      isValid: true,
      is2LD: true,
      isETH: false,
      labelDataArray: [
        {
          input: [110, 97, 109, 101],
          offset: 0,
          tokens: [[110, 97, 109, 101]],
          type: 'ASCII',
          output: [110, 97, 109, 101],
        },
        {
          input: [99, 111, 109],
          offset: 5,
          tokens: [[99, 111, 109]],
          type: 'ASCII',
          output: [99, 111, 109],
        },
      ],
      name: 'name.com',
      beautifiedName: 'name.com',
      isNonASCII: false,
      labelCount: 2,
    }))
    .with('invalid-2ld', () => ({
      type: 'name' as const,
      isShort: false,
      isValid: true,
      is2LD: true,
      isETH: true,
      labelDataArray: [
        {
          input: [110, 97, 109, 101, 10084],
          offset: 0,
          tokens: [
            [110, 97, 109, 101],
            [10084, 65039],
          ],
          emoji: true,
          type: 'Latin',
          output: [110, 97, 109, 101, 10084],
        },
        {
          input: [101, 116, 104],
          offset: 6,
          tokens: [[101, 116, 104]],
          type: 'ASCII',
          output: [101, 116, 104],
        },
      ],
      name: 'name❤.eth',
      beautifiedName: 'name❤️.eth',
      isNonASCII: true,
      labelCount: 2,
    }))
    .with('valid-subname', () => ({
      type: 'name' as const,
      name: 'subname.name.eth',
      isShort: false,
      isValid: true,
      is2LD: false,
      isETH: true,
      labelDataArray: [
        {
          input: [115, 117, 98, 110, 97, 109, 101],
          offset: 0,
          tokens: [[115, +117, +98, +110, +97, +109, +101]],
          type: 'ASCII',
          output: [115, +117, +98, +110, +97, +109, +101],
        },
        {
          input: [110, 97, 109, 101],
          offset: 8,
          tokens: [[110, 97, 109, 101]],
          type: 'ASCII',
          output: [110, 97, 109, 101],
        },
        {
          input: [101, 116, 104],
          offset: 13,
          tokens: [[101, 116, 104]],
          type: 'ASCII',
          output: [101, 116, 104],
        },
      ],
      beautifiedName: 'subname.name.eth',
      isNonASCII: false,
      labelCount: 3,
    }))
    .with('valid-subname:dns', () => ({
      type: 'name' as const,
      name: 'subname.name.com',
      isShort: false,
      isValid: true,
      is2LD: false,
      isETH: false,
      labelDataArray: [
        {
          input: [115, 117, 98, 110, 97, 109, 101],
          offset: 0,
          tokens: [[115, +117, +98, +110, +97, +109, +101]],
          type: 'ASCII',
          output: [115, +117, +98, +110, +97, +109, +101],
        },
        {
          input: [110, 97, 109, 101],
          offset: 8,
          tokens: [[110, 97, 109, 101]],
          type: 'ASCII',
          output: [110, 97, 109, 101],
        },
        {
          input: [99, 111, 109],
          offset: 13,
          tokens: [[99, 111, 109]],
          type: 'ASCII',
          output: [99, 111, 109],
        },
      ],
      beautifiedName: 'subname.name.com',
      isNonASCII: false,
      labelCount: 3,
    }))
    .exhaustive()
}
