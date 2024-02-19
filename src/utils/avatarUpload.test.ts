import { describe, expect, it } from 'vitest'

import { calcMomentum, getVars } from './avatarUpload'

describe('avatarUpload', () => {
  describe('getVars', () => {
    it('should return the correct variables', () => {
      const canvas = {
        getContext: (type: string) => type,
        width: 256,
      }

      const vars = getVars(canvas as any)
      expect(vars).toEqual({
        imagePercent: 0.6875,
        size: 256,
        cropSize: 176,
        inverseCropSize: 80,
        ctx: '2d',
        max: 80 / 2,
      })
    })
    it('should return 0/null variables if no canvas', () => {
      const canvas = null
      const vars = getVars(canvas as any)
      expect(vars).toEqual({
        imagePercent: 0,
        size: 0,
        cropSize: 0,
        inverseCropSize: 0,
        ctx: null,
        max: 0,
      })
    })
  })
  describe('calcMomentum', () => {
    it('should return 0 momentum if within bound', () => {
      const n = 40
      const max = 40
      const size = 176
      const cropSize = 176
      const momentum = calcMomentum(n, max, size, cropSize)
      expect(momentum).toBe(0)
    })
    it('should return negative momentum if positively outside bound', () => {
      const n = 19072
      const max = 40
      const size = 176
      const cropSize = 176
      const momentum = calcMomentum(n, max, size, cropSize)
      expect(momentum).toBe(-96)
    })
    it('should return positive momentum if negatively outside bound', () => {
      const n = -19072
      const max = 40
      const size = 176
      const cropSize = 176
      const momentum = calcMomentum(n, max, size, cropSize)
      expect(momentum).toBe(96)
    })
    it('should provide exact distance if within resolution boundary', () => {
      const n = 42.5
      const max = 40
      const size = 176
      const cropSize = 176
      const momentum = calcMomentum(n, max, size, cropSize)
      expect(momentum).toBe(-2.5)
    })
  })
})
