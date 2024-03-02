/* eslint-disable @typescript-eslint/naming-convention */
import { match } from 'ts-pattern'

import { ValidationResult } from '@app/hooks/useValidate'

export const mockUseValidateConfig = {
  eth: { input: 'eth' },
  'valid-2ld': { input: 'name.eth' },
  'invalid-2ld': { input: 'name❤️.eth' },
  'valid-subname': { input: 'subname.name.eth' },
} as const
export type MockUseValidateType = keyof typeof mockUseValidateConfig
export const mockUseValidateTypes = Object.keys(mockUseValidateConfig) as MockUseValidateType[]

export const makeMockUseValidate = (type: MockUseValidateType): ValidationResult => {
  return match(type)
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
          input: [120, 121, 122],
          offset: 0,
          tokens: [[120, 121, 122]],
          type: 'ASCII',
          output: [120, 121, 122],
        },
        {
          input: [119, 114, 97, 112, 112, 101, 100],
          offset: 4,
          tokens: [[119, 114, 97, 112, 112, 101, 100]],
          type: 'ASCII',
          output: [119, 114, 97, 112, 112, 101, 100],
        },
        {
          input: [101, 116, 104],
          offset: 12,
          tokens: [[101, 116, 104]],
          type: 'ASCII',
          output: [101, 116, 104],
        },
      ],
      beautifiedName: 'subname.name.eth',
      isNonASCII: false,
      labelCount: 3,
    }))
    .exhaustive()
}
