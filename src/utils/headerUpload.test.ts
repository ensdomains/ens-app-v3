import { describe, expect, it, vi } from 'vitest'

import {
  calcMomentumX,
  calcMomentumY,
  distanceFromEdgeX,
  distanceFromEdgeY,
  getHeaderVars,
  headerAspectRatio,
  imagePercent,
} from './headerUpload'

describe('headerUpload utilities', () => {
  describe('getHeaderVars', () => {
    it('should calculate correct dimensions for 3:1 aspect ratio', () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1200
      canvas.height = 400

      const vars = getHeaderVars(canvas)

      expect(vars.cropWidth).toBe(960) // 1200 * 0.8
      expect(vars.cropHeight).toBe(320) // 960 / 3
      expect(vars.maxX).toBeCloseTo(120, 5) // (1200 * 0.2) / 2
      expect(vars.maxY).toBeCloseTo(40, 5) // (400 - 320) / 2
      expect(vars.canvasWidth).toBe(1200)
      expect(vars.canvasHeight).toBe(400)
      expect(vars.imagePercent).toBe(imagePercent)
    })

    it('should handle different canvas sizes correctly', () => {
      const canvas = document.createElement('canvas')
      canvas.width = 900
      canvas.height = 300

      const vars = getHeaderVars(canvas)

      expect(vars.cropWidth).toBe(720) // 900 * 0.8
      expect(vars.cropHeight).toBe(240) // 720 / 3
      expect(vars.maxX).toBeCloseTo(90, 5) // (900 * 0.2) / 2
      expect(vars.maxY).toBeCloseTo(30, 5) // (300 - 240) / 2
    })

    it('should return zeros when canvas is null', () => {
      const vars = getHeaderVars(null as any)

      expect(vars.cropWidth).toBe(0)
      expect(vars.cropHeight).toBe(0)
      expect(vars.maxX).toBe(0)
      expect(vars.maxY).toBe(0)
      expect(vars.ctx).toBe(null)
    })

    it('should maintain header aspect ratio', () => {
      const canvas = document.createElement('canvas')
      canvas.width = 1500
      canvas.height = 500

      const vars = getHeaderVars(canvas)

      const calculatedRatio = vars.cropWidth / vars.cropHeight
      expect(calculatedRatio).toBeCloseTo(headerAspectRatio, 5)
    })
  })

  describe('distanceFromEdgeX', () => {
    it('should return correct distance when image is right of maxX', () => {
      const distance = distanceFromEdgeX(150, 100, 800, 700)
      expect(distance).toBe(-50) // maxX (100) - a (150)
    })

    it('should return correct distance when image width is less than crop width', () => {
      const distance = distanceFromEdgeX(50, 100, 600, 700)
      expect(distance).toBe(50) // max(0, maxX (100) - a (50))
    })

    it('should handle edge case at exact maxX position', () => {
      const distance = distanceFromEdgeX(100, 100, 800, 700)
      expect(distance).toBe(0) // maxX (100) - a (100)
    })

    it('should calculate right edge distance correctly', () => {
      const distance = distanceFromEdgeX(-100, 100, 800, 700)
      // maxX - (a + imgWidth) + cropWidth = max(100 - (-100 + 800) + 700, 0) = max(100, 0) = 100
      expect(distance).toBe(100)
    })
  })

  describe('distanceFromEdgeY', () => {
    it('should return correct distance when image is below maxY', () => {
      const distance = distanceFromEdgeY(150, 100, 400, 300)
      expect(distance).toBe(-50) // maxY (100) - a (150)
    })

    it('should return correct distance when image height is less than crop height', () => {
      const distance = distanceFromEdgeY(50, 100, 250, 300)
      expect(distance).toBe(50) // max(0, maxY (100) - a (50))
    })

    it('should handle edge case at exact maxY position', () => {
      const distance = distanceFromEdgeY(100, 100, 400, 300)
      expect(distance).toBe(0) // maxY (100) - a (100)
    })

    it('should calculate bottom edge distance correctly', () => {
      const distance = distanceFromEdgeY(-50, 100, 400, 300)
      // maxY - (a + imgHeight) + cropHeight = 100 - (-50 + 400) + 300 = 50
      expect(distance).toBe(50)
    })
  })

  describe('calcMomentumX', () => {
    it('should snap to position when within snap distance', () => {
      const momentum = calcMomentumX(105, 100, 800, 700)
      // distance = -5, within snap distance of 15
      expect(momentum).toBe(-5)
    })

    it('should calculate speed-based momentum for larger distances', () => {
      const momentum = calcMomentumX(-100, 100, 800, 700)
      // distance > snapDistance, should use speed calculation
      expect(Math.abs(momentum)).toBeGreaterThan(15)
    })

    it('should return zero momentum when at perfect position', () => {
      const momentum = calcMomentumX(100, 100, 800, 700)
      expect(momentum).toBe(0)
    })

    it('should handle negative direction correctly', () => {
      const momentum = calcMomentumX(200, 100, 800, 700)
      // image is too far right, momentum should be negative
      expect(momentum).toBeLessThan(0)
    })

    it('should handle positive direction correctly', () => {
      const momentum = calcMomentumX(-200, 100, 800, 700)
      // image is too far left, momentum should be positive
      expect(momentum).toBeGreaterThan(0)
    })

    it('should respect maximum speed', () => {
      const momentum = calcMomentumX(-1000, 100, 800, 700)
      // Even with large distance, momentum should be capped
      expect(Math.abs(momentum)).toBeLessThanOrEqual(384) // maxSpeed = 96 * 4
    })
  })

  describe('calcMomentumY', () => {
    it('should snap to position when within snap distance', () => {
      const momentum = calcMomentumY(105, 100, 400, 300)
      // distance = -5, within snap distance of 15
      expect(momentum).toBe(-5)
    })

    it('should calculate speed-based momentum for larger distances', () => {
      const momentum = calcMomentumY(-100, 100, 400, 300)
      // distance > snapDistance, should use speed calculation
      expect(Math.abs(momentum)).toBeGreaterThan(15)
    })

    it('should return zero momentum when at perfect position', () => {
      const momentum = calcMomentumY(100, 100, 400, 300)
      expect(momentum).toBe(0)
    })

    it('should handle negative direction correctly', () => {
      const momentum = calcMomentumY(200, 100, 400, 300)
      // image is too far down, momentum should be negative
      expect(momentum).toBeLessThan(0)
    })

    it('should handle positive direction correctly', () => {
      const momentum = calcMomentumY(-200, 100, 400, 300)
      // image is too far up, momentum should be positive
      expect(momentum).toBeGreaterThan(0)
    })

    it('should respect maximum speed', () => {
      const momentum = calcMomentumY(-1000, 100, 400, 300)
      // Even with large distance, momentum should be capped
      expect(Math.abs(momentum)).toBeLessThanOrEqual(384) // maxSpeed = 96 * 4
    })
  })
})
