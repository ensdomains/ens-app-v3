// Header aspect ratio (width:height)
export const headerAspectRatio = 3 // 3:1 aspect ratio for headers
export const imagePercent = 0.8 // Increase the visible area percentage
export const speedMultiplier = 4 // Speed multiplier for all movement calculations
export const baseMaxSpeed = 96 // Base maximum speed before multiplier
export const maxSpeed = baseMaxSpeed * speedMultiplier // Apply speed multiplier to max speed

export const getHeaderVars = (canvas: HTMLCanvasElement) => {
  if (!canvas) {
    return {
      imagePercent: 0,
      canvasWidth: 0,
      canvasHeight: 0,
      cropWidth: 0,
      cropHeight: 0,
      inverseWidthSize: 0,
      inverseHeightSize: 0,
      ctx: null,
      maxX: 0,
      maxY: 0,
    }
  }

  const ctx = canvas.getContext('2d')!

  const canvasWidth = canvas.width
  const canvasHeight = canvas.height

  // Ensure we maintain the 3:1 aspect ratio
  // Calculate crop dimensions based on the header aspect ratio
  const cropWidth = canvasWidth * imagePercent
  const cropHeight = cropWidth / headerAspectRatio // Maintain 3:1 aspect ratio

  const inverseWidthSize = canvasWidth * (1 - imagePercent)
  const inverseHeightSize = canvasHeight - cropHeight

  return {
    imagePercent,
    canvasWidth,
    canvasHeight,
    cropWidth,
    cropHeight,
    inverseWidthSize,
    inverseHeightSize,
    ctx,
    maxX: inverseWidthSize / 2,
    maxY: inverseHeightSize / 2,
  }
}

export const distanceFromEdgeX = (a: number, maxX: number, imgWidth: number, cropWidth: number) => {
  if (a > maxX) return maxX - a
  if (imgWidth < cropWidth) return Math.max(0, maxX - a)
  return Math.max(maxX - (a + imgWidth) + cropWidth, 0)
}

export const distanceFromEdgeY = (
  a: number,
  maxY: number,
  imgHeight: number,
  cropHeight: number,
) => {
  if (a > maxY) return maxY - a
  if (imgHeight < cropHeight) return Math.max(0, maxY - a)
  return Math.max(maxY - (a + imgHeight) + cropHeight, 0)
}

export const calcMomentumX = (a: number, maxX: number, imgWidth: number, cropWidth: number) => {
  let momentum = 0
  const distance = distanceFromEdgeX(a, maxX, imgWidth, cropWidth)
  if (distance > 0 || distance < 0) {
    const snapDistance = 15
    if (distance <= snapDistance && distance >= -snapDistance) {
      momentum = distance
    } else {
      const direction = distance > 0 ? 1 : -1
      const speed = Math.min(Math.abs(distance) / 10, maxSpeed / speedMultiplier) * speedMultiplier
      momentum = speed * direction

      // Special case for right edge
      if (direction < 0 && Math.abs(distance) < snapDistance * 2) {
        momentum = distance
      }
    }
  }
  return momentum
}

export const calcMomentumY = (a: number, maxY: number, imgHeight: number, cropHeight: number) => {
  let momentum = 0
  const distance = distanceFromEdgeY(a, maxY, imgHeight, cropHeight)
  if (distance > 0 || distance < 0) {
    const snapDistance = 15
    if (distance <= snapDistance && distance >= -snapDistance) {
      momentum = distance
    } else {
      const direction = distance > 0 ? 1 : -1
      const speed = Math.min(Math.abs(distance) / 10, maxSpeed / speedMultiplier) * speedMultiplier
      momentum = speed * direction
    }
  }
  return momentum
}

// For backward compatibility
export const bannerAspectRatio = headerAspectRatio
export const getBannerVars = getHeaderVars
