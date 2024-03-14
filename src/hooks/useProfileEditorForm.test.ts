import { act, renderHook } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import registerI18n from '@app/../public/locales/en/register.json'
import { supportedAddresses } from '@app/constants/supportedAddresses'

import profileRecordOptions, { grouped, ProfileRecord } from '../constants/profileRecordOptions'
import { isDirtyForRecordAtIndexCalc, useProfileEditorForm } from './useProfileEditorForm'

const baseRecord: ProfileRecord = {
  key: 'eth',
  group: 'address',
  type: 'addr',
  value: '0xb794f5ea0ba39494ce839613fffba74279579268',
}

const avatarRecord: ProfileRecord = {
  key: 'avatar',
  group: 'media',
  type: 'text',
  value: 'https://image.com/avatar.png',
}
const records: ProfileRecord[] = [baseRecord, avatarRecord]

const validEth = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
const invalidEth = '0x70997970C51812dc3A010C7d01b50e0d17dc79X4'
const validOnion = 'onion3://p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uqd'
const invalidOnion = 'onion3://p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uq'

describe('useProfileEditorForm', () => {
  describe('loading', () => {
    it('should load the default records', async () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      expect(result.current.getAvatar()).toBe('https://image.com/avatar.png')
      expect(result.current.getValues('records')).toEqual([baseRecord])
      expect(result.current.getRecords()).toEqual(records)
    })

    it('should add value field to default values if it is missing it', () => {
      const existingRecords: ProfileRecord[] = [
        { key: 'test', group: 'custom', type: 'text' },
        ...records,
      ]
      const expectedRecords: ProfileRecord[] = [
        { key: 'test', group: 'custom', type: 'text', value: '' },
        baseRecord,
        avatarRecord,
      ]
      const { result } = renderHook(() => useProfileEditorForm(existingRecords))
      expect(result.current.getAvatar()).toBe('https://image.com/avatar.png')
      expect(result.current.getValues('records')).toEqual([
        { key: 'test', group: 'custom', type: 'text', value: '' },
        baseRecord,
      ])
      expect(result.current.getRecords()).toEqual(expectedRecords)
    })

    it('should load avatar as custom record if it is custom record', () => {
      const existingRecords: ProfileRecord[] = [
        { key: 'avatar', group: 'custom', type: 'text', value: '' },
        baseRecord,
      ]
      const { result } = renderHook(() => useProfileEditorForm(existingRecords))
      expect(result.current.getAvatar()).toBe('')
      expect(result.current.getValues('records')).toEqual(existingRecords)
      expect(result.current.getRecords()).toEqual(existingRecords)
    })
  })
  describe('labels', () => {
    it('should not return an empty string for any groups', async () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      grouped.forEach(({ items }) => {
        items.forEach((record) => {
          expect(result.current.labelForRecord(record)).toBeTruthy()
          expect(result.current.secondaryLabelForRecord(record)).toBeTruthy()
        })
      })
    })
  })

  describe('validators', () => {
    it('should pass validation with a valid eth address', async () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      expect(
        await result.current.validatorForRecord({
          key: 'eth',
          group: 'address',
          type: 'addr',
        })(validEth),
      ).toBe(true)
    })

    it('should fail validation with an invalid eth address', async () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      expect(
        typeof (await result.current.validatorForRecord({
          key: 'eth',
          group: 'address',
          type: 'addr',
        })(invalidEth)),
      ).toBe('string')
    })

    it('should fail validation with an invalid eth address not in check sum format', async () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      expect(
        typeof (await result.current.validatorForRecord({
          key: 'ETH',
          group: 'address',
          type: 'addr',
        })('0xbbbb')),
      ).toBe('string')
    })

    it('should pass validation with a valid onion address', async () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      expect(
        await result.current.validatorForRecord({
          key: 'onion',
          group: 'website',
          type: 'contenthash',
        })(validOnion),
      ).toBe(true)
    })

    it('should fail validation with an invalid onion address', async () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      expect(
        typeof (await result.current.validatorForRecord({
          key: 'onion',
          group: 'website',
          type: 'contenthash',
        })(invalidOnion)),
      ).toBe('string')
    })

    it('should pass validation with a valid onion address using contentHash key', async () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      expect(
        await result.current.validatorForRecord({
          key: 'contentHash',
          group: 'other',
          type: 'contenthash',
        })(validOnion),
      ).toBe(true)
    })

    it('should fail with an invalid onion address using contentHash key', async () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      expect(
        typeof (await result.current.validatorForRecord({
          key: 'contentHash',
          group: 'other',
          type: 'contenthash',
        })(invalidOnion)),
      ).toBe('string')
    })

    it('should fail validation for a custom key with a duplicate key value', async () => {
      // In use, the record will be added twice to the list of records
      const { result } = renderHook(() =>
        useProfileEditorForm([
          ...records,
          {
            key: 'description',
            group: 'general',
            type: 'text',
          },
          {
            key: 'description',
            group: 'general',
            type: 'text',
          },
        ]),
      )
      expect(
        typeof (await result.current.validatorForRecord({
          key: 'description',
          group: 'custom',
          type: 'text',
        })('description')),
      ).toBe('string')
    })

    it('should trim values when searching for duplicate keys', async () => {
      // In use, the record will be added twice to the list of records
      const { result } = renderHook(() =>
        useProfileEditorForm([
          ...records,
          {
            key: 'description',
            group: 'general',
            type: 'text',
          },
          {
            key: '   description   ',
            group: 'general',
            type: 'text',
          },
        ]),
      )
      expect(
        typeof (await result.current.validatorForRecord({
          key: 'description',
          group: 'custom',
          type: 'text',
        })('  description  ')),
      ).toBe('string')
    })

    it('should fail validation with an empty custom key value', async () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      expect(
        typeof (await result.current.validatorForRecord({
          key: '',
          group: 'custom',
          type: 'text',
        })('')),
      ).toBe('string')
    })
  })

  describe('Social Media Validation', () => {
    const invalidGithubRecord: ProfileRecord = {
      key: 'com.github',
      group: 'social',
      type: 'text',
      value: 'invalid_username-',
    }

    const moreRecords: ProfileRecord[] = [baseRecord, avatarRecord, invalidGithubRecord]
    const testCases = [
      { platform: 'Twitter', key: 'com.twitter', username: 'valid_twitter', isValid: true },
      {
        platform: 'Twitter',
        key: 'com.twitter',
        username: 'invalid_twitter!',
        isValid: 'steps.profile.errors.invalidValue',
      },
      { platform: 'GitHub', key: 'com.github', username: 'valid-github', isValid: true },
      {
        platform: 'GitHub',
        key: 'com.github',
        username: 'invalid_username',
        isValid: 'steps.profile.errors.invalidValue',
      },
      { platform: 'Discord', key: 'com.discord', username: 'valid_username', isValid: true },
      {
        platform: 'Discord',
        key: 'com.discord',
        username: 'bad..discord',
        isValid: 'steps.profile.errors.invalidValue',
      },
      { platform: 'Telegram', key: 'org.telegram', username: 'valid_username', isValid: true },
      {
        platform: 'Telegram',
        key: 'org.telegram',
        username: 'invalid_username!',
        isValid: 'steps.profile.errors.invalidValue',
      },
      { platform: 'Email', key: 'email', username: 'test@example.com', isValid: true },
      {
        platform: 'Email',
        key: 'email',
        username: 'test@example',
        isValid: 'steps.profile.errors.invalidValue',
      },
    ]

    testCases.forEach(({ platform, key, username, isValid }) => {
      it(`should ${isValid == true ? 'validate' : 'invalidate'} ${isValid == true ? 'a' : 'an'} ${
        isValid == true ? 'correct' : 'incorrect'
      } ${platform} account`, async () => {
        const { result } = renderHook(() => useProfileEditorForm(moreRecords))
        await act(async () => {
          const validationOutcome = await result.current.validatorForRecord({
            key: key,
            group: 'social',
            type: 'text',
          })(username)

          expect(validationOutcome).toBe(isValid)
        })
      })
    })
  })

  describe('removeRecordByTypeAndKey', () => {
    it('should be able to remove a address record by type and key', async () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      act(() => {
        result.current.removeRecordByGroupAndKey('address', 'eth')
      })
      expect(result.current.getRecords().length).toBe(1)
    })
  })

  describe('addRecords', () => {
    it('should add value property if it does not exist', async () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      act(() => {
        result.current.addRecords({
          key: 'description',
          group: 'general',
          type: 'text',
        })
      })
      expect(result.current.getRecords()).toEqual([
        baseRecord,
        {
          key: 'description',
          group: 'general',
          type: 'text',
          value: '',
        },
        avatarRecord,
      ])
    })

    it('should transfer value property for an added record', async () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      act(() => {
        result.current.addRecords({
          key: 'description',
          group: 'general',
          type: 'text',
          value: 'testing',
        })
      })
      expect(result.current.getRecords()).toEqual([
        baseRecord,
        {
          key: 'description',
          group: 'general',
          type: 'text',
          value: 'testing',
        },
        avatarRecord,
      ])
    })

    it('should be able to add text record individually', async () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      act(() => {
        result.current.addRecords({
          key: 'description',
          group: 'general',
          type: 'text',
        })
      })
      expect(result.current.getRecords()).toEqual([
        baseRecord,
        {
          key: 'description',
          group: 'general',
          type: 'text',
          value: '',
        },
        avatarRecord,
      ])
    })

    it('should not be able to add a text record if the record already exists', () => {
      const currentRecords: ProfileRecord[] = [
        {
          key: 'description',
          group: 'general',
          type: 'text',
          value: '',
        },
        ...records,
      ]
      const { result } = renderHook(() => useProfileEditorForm(currentRecords))
      act(() => {
        result.current.addRecords({
          key: 'description',
          group: 'general',
          type: 'text',
          value: 'test',
        })
      })
      expect(result.current.getRecords()).toEqual(currentRecords)
    })

    it('should not be able to add a address record if the record already exists', () => {
      const { result } = renderHook(() => useProfileEditorForm(records))
      result.current.addRecords({
        key: 'eth',
        group: 'address',
        type: 'addr',
        value: 'test',
      })
      expect(result.current.getRecords()).toEqual(records)
    })

    it('should not be able to add a contenthash or website record if the contentHash key already exits', () => {
      const currentRecords: ProfileRecord[] = [
        records[0],
        { key: 'contentHash', group: 'other', type: 'contenthash', value: 'test' },
      ]
      const { result } = renderHook(() => useProfileEditorForm(currentRecords))
      const contenthashOptions = profileRecordOptions.filter((o) => o.type === 'contenthash')
      expect(contenthashOptions.length).toBe(5)
      act(() => {
        result.current.addRecords(contenthashOptions)
      })
      expect(result.current.getRecords()).toEqual(currentRecords)
    })

    it('should not be able to add a contenthash or website record if a website record already exits', () => {
      const currentRecords: ProfileRecord[] = [
        records[0],
        { key: 'ipfs', group: 'website', type: 'contenthash', value: 'test' },
      ]
      const { result } = renderHook(() => useProfileEditorForm(currentRecords))
      const contenthashOptions = profileRecordOptions.filter((o) => o.type === 'contenthash')
      expect(contenthashOptions.length).toBe(5)
      act(() => {
        result.current.addRecords(contenthashOptions)
      })
      expect(result.current.getRecords()).toEqual(currentRecords)
    })
  })

  describe('supportedAddress', () => {
    it('should have a custom placeholder for supported address record', () => {
      const hasTranslation = supportedAddresses.every((coin) => {
        const key =
          coin as keyof typeof registerI18n.steps.profile.options.groups.address.placeholder
        return !!registerI18n.steps.profile.options.groups.address.placeholder[key]
      })
      expect(hasTranslation).toBe(true)
    })
  })
})

describe('isDirtyForRecordAtIndexCalc', () => {
  it('should return true if the record value has changed', () => {
    const index = 0
    const defaultRecords: ProfileRecord[] = [
      {
        key: 'eth',
        group: 'address',
        type: 'addr',
        value: '0xb794f5ea0ba39494ce839613fffba74279579268',
      },
    ]
    const currentRecords: ProfileRecord[] = [
      {
        key: 'eth',
        group: 'address',
        type: 'addr',
        value: '0xdifferent',
      },
    ]
    const result = isDirtyForRecordAtIndexCalc(index, defaultRecords, currentRecords)
    expect(result).toBe(true)
  })
  it('should return false if the record is not dirty', () => {
    const index = 0
    const defaultRecords: ProfileRecord[] = [
      {
        key: 'eth',
        group: 'address',
        type: 'addr',
        value: '0xb794f5ea0ba39494ce839613fffba74279579268',
      },
    ]
    const currentRecords: ProfileRecord[] = [
      {
        key: 'eth',
        group: 'address',
        type: 'addr',
        value: '0xb794f5ea0ba39494ce839613fffba74279579268',
      },
    ]
    const result = isDirtyForRecordAtIndexCalc(index, defaultRecords, currentRecords)
    expect(result).toBe(false)
  })
  it('should return false if the record is not found', () => {
    const index = 0
    const defaultRecords: ProfileRecord[] = [
      {
        key: 'eth',
        group: 'address',
        type: 'addr',
        value: '0xb794f5ea0ba39494ce839613fffba74279579268',
      },
    ]
    const currentRecords: ProfileRecord[] = []
    const result = isDirtyForRecordAtIndexCalc(index, defaultRecords, currentRecords)
    expect(result).toBe(false)
  })
})
