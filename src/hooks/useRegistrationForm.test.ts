import { renderHook } from '@testing-library/react-hooks'

import profileRecordOptions, { ProfileRecord, grouped } from '../constants/profileRecordOptions'
import { useRegistrationForm } from './useRegistrationForm'

const baseRecord: ProfileRecord = {
  key: 'ETH',
  group: 'address',
  type: 'addr',
  value: '0xb794f5ea0ba39494ce839613fffba74279579268',
}

const avatarRecrod: ProfileRecord = {
  key: 'avatar',
  group: 'media',
  type: 'text',
  value: 'https://image.com/avatar.png',
}

const records: ProfileRecord[] = [baseRecord, avatarRecrod]

const validEth = '0x70997970C51812dc3A010C7d01b50e0d17dc79C8'
const invalidEth = '0x70997970C51812dc3A010C7d01b50e0d17dc79C4'
const validOnion = 'onion3://p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uqd'
const invalidOnion = 'onion3://p53lf57qovyuvwsc6xnrppyply3vtqm7l6pcobkmyqsiofyeznfu5uq'

describe('useRegistrationForm', () => {
  describe('loading', () => {
    it('should load the default records', async () => {
      const { result } = renderHook(() => useRegistrationForm(records))
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
        avatarRecrod,
      ]
      const { result } = renderHook(() => useRegistrationForm(existingRecords))
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
      const { result } = renderHook(() => useRegistrationForm(existingRecords))
      expect(result.current.getAvatar()).toBe(undefined)
      expect(result.current.getValues('records')).toEqual(existingRecords)
      expect(result.current.getRecords()).toEqual(existingRecords)
    })
  })
  describe('labels', () => {
    it('should not return an empty string for any groups', async () => {
      const { result } = renderHook(() => useRegistrationForm(records))
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
      const { result } = renderHook(() => useRegistrationForm(records))
      expect(
        await result.current.validatorForRecord({
          key: 'ETH',
          group: 'address',
          type: 'addr',
        })(validEth),
      ).toBe(true)
    })

    it('should fail validation with an invalid eth address', async () => {
      const { result } = renderHook(() => useRegistrationForm(records))
      expect(
        typeof (await result.current.validatorForRecord({
          key: 'ETH',
          group: 'address',
          type: 'addr',
        })(invalidEth)),
      ).toBe('string')
    })

    it('should fail validation with an invalid eth address not in check sum format', async () => {
      const { result } = renderHook(() => useRegistrationForm(records))
      expect(
        typeof (await result.current.validatorForRecord({
          key: 'ETH',
          group: 'address',
          type: 'addr',
        })('0xbbbb')),
      ).toBe('string')
    })

    it('should pass validation with a valid onion address', async () => {
      const { result } = renderHook(() => useRegistrationForm(records))
      expect(
        await result.current.validatorForRecord({
          key: 'onion',
          group: 'website',
          type: 'contenthash',
        })(validOnion),
      ).toBe(true)
    })

    it('should fail validation with an invalid onion address', async () => {
      const { result } = renderHook(() => useRegistrationForm(records))
      expect(
        typeof (await result.current.validatorForRecord({
          key: 'onion',
          group: 'website',
          type: 'contenthash',
        })(invalidOnion)),
      ).toBe('string')
    })

    it('should pass validation with a valid onion address using contentHash key', async () => {
      const { result } = renderHook(() => useRegistrationForm(records))
      expect(
        await result.current.validatorForRecord({
          key: 'contentHash',
          group: 'other',
          type: 'contenthash',
        })(validOnion),
      ).toBe(true)
    })

    it('should fail with an invalid onion address using contentHash key', async () => {
      const { result } = renderHook(() => useRegistrationForm(records))
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
        useRegistrationForm([
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
        useRegistrationForm([
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
      const { result } = renderHook(() => useRegistrationForm(records))
      expect(
        typeof (await result.current.validatorForRecord({
          key: '',
          group: 'custom',
          type: 'text',
        })('')),
      ).toBe('string')
    })
  })

  describe('removeRecordByTypeAndKey', () => {
    it('should be able to remove a address record by type and key', async () => {
      const { result } = renderHook(() => useRegistrationForm(records))
      result.current.removeRecordByTypeAndKey('addr', 'ETH')
      expect(result.current.getRecords().length).toBe(1)
    })
  })

  describe('addRecords', () => {
    it('should add value property if it does not exist', async () => {
      const { result } = renderHook(() => useRegistrationForm(records))
      result.current.addRecords({
        key: 'description',
        group: 'general',
        type: 'text',
      })
      expect(result.current.getRecords()).toEqual([
        baseRecord,
        {
          key: 'description',
          group: 'general',
          type: 'text',
          value: '',
        },
        avatarRecrod,
      ])
    })

    it('should transfer value property for an added record', async () => {
      const { result } = renderHook(() => useRegistrationForm(records))
      result.current.addRecords({
        key: 'description',
        group: 'general',
        type: 'text',
        value: 'testing',
      })
      expect(result.current.getRecords()).toEqual([
        baseRecord,
        {
          key: 'description',
          group: 'general',
          type: 'text',
          value: 'testing',
        },
        avatarRecrod,
      ])
    })

    it('should be able to add text record individually', async () => {
      const { result } = renderHook(() => useRegistrationForm(records))
      result.current.addRecords({
        key: 'description',
        group: 'general',
        type: 'text',
      })
      expect(result.current.getRecords()).toEqual([
        baseRecord,
        {
          key: 'description',
          group: 'general',
          type: 'text',
          value: '',
        },
        avatarRecrod,
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
      const { result } = renderHook(() => useRegistrationForm(currentRecords))
      result.current.addRecords({
        key: 'description',
        group: 'general',
        type: 'text',
        value: 'test',
      })
      expect(result.current.getRecords()).toEqual(currentRecords)
    })

    it('should not be able to add a address record if the record already exists', () => {
      const { result } = renderHook(() => useRegistrationForm(records))
      result.current.addRecords({
        key: 'ETH',
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
      const { result } = renderHook(() => useRegistrationForm(currentRecords))
      const contenthashOptions = profileRecordOptions.filter((o) => o.type === 'contenthash')
      expect(contenthashOptions.length).toBe(6)
      result.current.addRecords(contenthashOptions)
      expect(result.current.getRecords()).toEqual(currentRecords)
    })

    it('should not be able to add a contenthash or website record if a website record already exits', () => {
      const currentRecords: ProfileRecord[] = [
        records[0],
        { key: 'ipfs', group: 'website', type: 'contenthash', value: 'test' },
      ]
      const { result } = renderHook(() => useRegistrationForm(currentRecords))
      const contenthashOptions = profileRecordOptions.filter((o) => o.type === 'contenthash')
      expect(contenthashOptions.length).toBe(6)
      result.current.addRecords(contenthashOptions)
      expect(result.current.getRecords()).toEqual(currentRecords)
    })
  })
})
