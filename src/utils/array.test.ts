import { describe, expect, it } from 'vitest'

import { chunkArr } from './array'

describe('chunkArr', () => {
  it('should return an array of arrays with the correct chunk size', () => {
    const chunked = chunkArr(new Array(10), 2)
    expect(chunked).toHaveLength(5)
    for (const chunk of chunked) {
      expect(chunk).toHaveLength(2)
    }
  })

  it('should return a single empty nested array if input is empty array', () => {
    const chunked = chunkArr([], 2)
    expect(chunked).toHaveLength(1)
    expect(chunked[0]).toHaveLength(0)
  })
})
