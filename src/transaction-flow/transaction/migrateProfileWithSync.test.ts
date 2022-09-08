import { syncRecords } from './migrateProfileWithSync'

describe('syncRecords', () => {
  it('should return empty array if two values are the same', () => {
    const result = syncRecords(
      [
        { key: 'a', value: '1', type: 'text' },
        { key: 'b', value: '2', type: 'text' },
      ],
      [
        { key: 'a', value: '1', type: 'text' },
        { key: 'b', value: '2', type: 'text' },
      ],
    )
    expect(result).toEqual([])
  })

  it('should return key value for keys that are missing in before', () => {
    const result = syncRecords(
      [{ key: 'b', value: '2', type: 'text' }],
      [
        { key: 'a', value: '1', type: 'text' },
        { key: 'b', value: '2', type: 'text' },
      ],
    )
    expect(result).toEqual([{ key: 'a', value: '1' }])
  })

  it('should key with empty string for values that are missing in after', () => {
    const result = syncRecords(
      [
        { key: 'b', value: '2', type: 'text' },
        { key: 'a', value: '1', type: 'text' },
      ],
      [{ key: 'a', value: '1', type: 'text' }],
    )
    expect(result).toEqual([{ key: 'b', value: '' }])
  })

  describe('when using overwrite', () => {
    it('should return empty array if two values are the same', () => {
      const result = syncRecords(
        [
          { key: 'a', value: '1', type: 'text' },
          { key: 'b', value: '2', type: 'text' },
        ],
        undefined,
        [
          { key: 'a', value: '1' },
          { key: 'b', value: '2' },
        ],
      )
      expect(result).toEqual([])
    })

    it('should return key value for keys that are missing in before', () => {
      const result = syncRecords([{ key: 'b', value: '2', type: 'text' }], undefined, [
        { key: 'a', value: '1' },
        { key: 'b', value: '2' },
      ])
      expect(result).toEqual([{ key: 'a', value: '1' }])
    })

    it('should return empty array if two values are the same', () => {
      const result = syncRecords(
        [
          { key: 'b', value: '2', type: 'text' },
          { key: 'a', value: '1', type: 'text' },
        ],
        undefined,
        [{ key: 'a', value: '1' }],
      )
      expect(result).toEqual([{ key: 'b', value: '' }])
    })
  })
})
