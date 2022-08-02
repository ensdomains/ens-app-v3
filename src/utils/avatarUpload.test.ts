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
        ip: 0.6875,
        sz: 256,
        crpSz: 176,
        invSz: 80,
        ctx: '2d',
        max: 80 / 2,
      })
    })
    it('should return 0/null variables if no canvas', () => {
      const canvas = null
      const vars = getVars(canvas as any)
      expect(vars).toEqual({
        ip: 0,
        sz: 0,
        crpSz: 0,
        invSz: 0,
        ctx: null,
        max: 0,
      })
    })
  })
  describe('calcMomentum', () => {
    it('should return 0 momentum if within bound', () => {
      const n = 40
      const max = 40
      const s = 176
      const crpSz = 176
      const momentum = calcMomentum(n, max, s, crpSz)
      expect(momentum).toBe(0)
    })
    it('should return negative momentum if positively outside bound', () => {
      const n = 19072
      const max = 40
      const s = 176
      const crpSz = 176
      const momentum = calcMomentum(n, max, s, crpSz)
      expect(momentum).toBe(-96)
    })
    it('should return positive momentum if negatively outside bound', () => {
      const n = -19072
      const max = 40
      const s = 176
      const crpSz = 176
      const momentum = calcMomentum(n, max, s, crpSz)
      expect(momentum).toBe(96)
    })
    it('should provide exact distance if within resolution boundary', () => {
      const n = 42.5
      const max = 40
      const s = 176
      const crpSz = 176
      const momentum = calcMomentum(n, max, s, crpSz)
      expect(momentum).toBe(-2.5)
    })
  })
})
