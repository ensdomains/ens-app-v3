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

  // Calculate crop dimensions based on the header aspect ratio and imagePercent
  // This ensures the crop window is exactly 80% of the canvas size
  const cropWidth = canvasWidth * imagePercent
  const cropHeight = cropWidth / headerAspectRatio // Maintain 3:1 aspect ratio

  // Calculate the margins (the space between the edge of the canvas and the crop window)
  const inverseWidthSize = canvasWidth * (1 - imagePercent)
  const inverseHeightSize = canvasHeight - cropHeight

  // maxX and maxY represent the top-left corner of the crop window
  const maxX = inverseWidthSize / 2
  const maxY = inverseHeightSize / 2

  return {
    imagePercent,
    canvasWidth,
    canvasHeight,
    cropWidth,
    cropHeight,
    inverseWidthSize,
    inverseHeightSize,
    ctx,
    maxX,
    maxY,
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
    const snapDistance = 8
    if (distance <= snapDistance && distance >= -snapDistance) {
      momentum = distance
    } else {
      // Apply speed multiplier by dividing by (16 / speedMultiplier)
      momentum = Math.round(
        Math.min(Math.max(distance / (16 / speedMultiplier), -maxSpeed), maxSpeed),
      )
    }
  }
  return momentum
}

export const calcMomentumY = (a: number, maxY: number, imgHeight: number, cropHeight: number) => {
  let momentum = 0
  const distance = distanceFromEdgeY(a, maxY, imgHeight, cropHeight)
  if (distance > 0 || distance < 0) {
    const snapDistance = 8
    if (distance <= snapDistance && distance >= -snapDistance) {
      momentum = distance
    } else {
      // Apply speed multiplier by dividing by (16 / speedMultiplier)
      momentum = Math.round(
        Math.min(Math.max(distance / (16 / speedMultiplier), -maxSpeed), maxSpeed),
      )
    }
  }
  return momentum
}
