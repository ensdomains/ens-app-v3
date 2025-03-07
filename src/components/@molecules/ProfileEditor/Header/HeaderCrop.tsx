/* eslint-disable no-multi-assign */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Slider } from '@ensdomains/thorin'

import CropBorderSVG from '@app/assets/HeaderCropBorder.svg'
import CropFrameSVG from '@app/assets/HeaderCropFrame.svg'
import MinusCircleSVG from '@app/assets/MinusCircle.svg'
import PlusCircleSVG from '@app/assets/PlusCircle.svg'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import {
  calcMomentumX,
  calcMomentumY,
  getHeaderVars,
  headerAspectRatio,
  speedMultiplier,
} from '@app/utils/headerUpload'

const EditImageContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    height: ${theme.space.full};
    display: flex;
    flex-direction: column;
    justify-content: stretch;
    align-items: center;
    gap: ${theme.space['2']};
  `,
)

const ImageWrapper = styled.div(
  () => css`
    width: 100%;
    height: auto;
    max-width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
  `,
)

const ImageContainer = styled.div(
  ({ theme }) => css`
    margin: 0 auto;
    position: relative;
    width: 100%;
    max-width: 100%;
    height: auto;
    border-radius: ${theme.radii.extraLarge};
    overflow: hidden;
    aspect-ratio: ${headerAspectRatio};

    svg {
      fill: none;
      width: 100%;
      height: 100%;
      position: absolute;
      top: 0;
      left: 0;
    }
  `,
)

const ImageCropBorder = styled.div(
  ({ theme }) => css`
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${theme.colors.background};

    svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  `,
)

const ImageCropFrame = styled.div(
  ({ theme }) => css`
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;
    display: flex;
    justify-content: center;
    align-items: center;
    color: ${theme.colors.accent};

    svg {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }
  `,
)

const StyledCanvas = styled.canvas(
  ({ theme }) => css`
    width: 100%;
    height: auto;
    display: block;
    cursor: grab;
    aspect-ratio: ${headerAspectRatio};
  `,
)

const SliderContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    gap: ${theme.space['4']};

    padding: ${theme.space['2']} 0;
    width: ${theme.space.full};

    & > svg {
      width: ${theme.space['6']};
      height: ${theme.space['6']};
      opacity: 0.15;
    }
    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['2']} ${theme.space['8']};
    }
  `,
)

export const AvCancelButton = ({ handleCancel }: { handleCancel: () => void }) => {
  const { t } = useTranslation('common')

  return (
    <Button data-testid="avatar-cancel-button" colorStyle="accentSecondary" onClick={handleCancel}>
      {t('action.back')}
    </Button>
  )
}

// Types for reusable hooks
type Coordinates = {
  x: number
  y: number
  mx: number
  my: number
  w: number
  h: number
  oW: number
  oH: number
  moving: boolean
}

// Hook for canvas drawing functionality
const useCanvasDrawing = (
  imageRef: React.RefObject<HTMLImageElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
) => {
  const coordinatesRef = useRef<Coordinates>({
    x: 0,
    y: 0,
    mx: 0,
    my: 0,
    w: 0,
    h: 0,
    oW: 0,
    oH: 0,
    moving: false,
  })

  const draw = useCallback(() => {
    const image = imageRef.current
    const canvas = canvasRef.current
    if (!canvas || !image) return

    const { maxX, maxY, cropWidth, cropHeight } = getHeaderVars(canvas)
    // eslint-disable-next-line prefer-const
    let { x, y, w, h, mx, my, moving } = coordinatesRef.current
    const ctx = canvas.getContext('2d')!

    ctx.clearRect(0, 0, canvas.width, canvas.height)
    x += mx
    y += my
    mx = my = 0
    x = Math.round(x)
    y = Math.round(y)
    ctx.drawImage(image, x, y, w, h)

    coordinatesRef.current = {
      ...coordinatesRef.current,
      x,
      y,
      mx,
      my,
      w,
      h,
      moving,
    }

    if (!moving) {
      coordinatesRef.current.mx = calcMomentumX(x, maxX, w, cropWidth)
      coordinatesRef.current.my = calcMomentumY(y, maxY, h, cropHeight)
      if (coordinatesRef.current.mx !== 0 || coordinatesRef.current.my !== 0) {
        window.requestAnimationFrame(draw)
      }
    }
  }, [canvasRef, imageRef])

  const updateCoordinates = useCallback((newCoords: Partial<Coordinates>) => {
    coordinatesRef.current = {
      ...coordinatesRef.current,
      ...newCoords,
    }
  }, [])

  return {
    draw,
    coordinatesRef,
    updateCoordinates,
  }
}

// Hook for handling image loading
const useImageLoader = (
  avatar: File,
  imageRef: React.RefObject<HTMLImageElement>,
  canvasRef: React.RefObject<HTMLCanvasElement>,
  coordinatesRef: React.MutableRefObject<Coordinates>,
  draw: () => void,
) => {
  const handleImageLoad = useDebouncedCallback(
    () => {
      const image = imageRef.current
      if (!image || !canvasRef.current) return

      const { canvasWidth, canvasHeight, cropWidth, cropHeight, maxX, maxY } = getHeaderVars(
        canvasRef.current,
      )
      const { width: iw, height: ih } = image
      const ir = iw / ih

      let x: number
      let y: number
      let w: number
      let h: number

      // Calculate initial image dimensions and position based on aspect ratio
      if (ir > headerAspectRatio) {
        // Image is wider than header aspect ratio
        h = cropHeight
        w = h * ir
        x = maxX - (w - cropWidth) / 2
        y = maxY
      } else if (ir < headerAspectRatio) {
        // Image is taller than header aspect ratio
        w = cropWidth
        h = w / ir
        x = maxX
        y = maxY - (h - cropHeight) / 2
      } else {
        // Image has same aspect ratio as header
        w = cropWidth
        h = cropHeight
        x = maxX
        y = maxY
      }

      const ctx = canvasRef.current.getContext('2d')!
      ctx.drawImage(image, x, y, w, h)
      coordinatesRef.current = {
        x,
        y,
        w,
        h,
        oW: w,
        oH: h,
        mx: 0,
        my: 0,
        moving: false,
      }

      window.requestAnimationFrame(draw)
    },
    100,
    [draw],
  )

  useEffect(() => {
    const image = imageRef.current
    if (canvasRef.current && image && !image.src) {
      image.src = URL.createObjectURL(avatar)
      image.onload = handleImageLoad
    }
  }, [avatar, canvasRef, handleImageLoad, imageRef])

  return { handleImageLoad }
}

// Hook for handling mouse interactions
const useMouseInteractions = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  coordinatesRef: React.MutableRefObject<Coordinates>,
  resolutionMultiplierRef: React.MutableRefObject<number>,
  draw: () => void,
) => {
  const handleMoveStart = useCallback(
    (e: MouseEvent | TouchEvent) => {
      e.preventDefault()
      coordinatesRef.current.moving = true
    },
    [coordinatesRef],
  )

  const handleMoveEnd = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!coordinatesRef.current.moving) return
      e.preventDefault()
      coordinatesRef.current.moving = false
      window.requestAnimationFrame(draw)
    },
    [coordinatesRef, draw],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!coordinatesRef.current.moving) return
      e.preventDefault()

      const resolutionMultiplier = resolutionMultiplierRef.current
      const { movementX, movementY } = e
      coordinatesRef.current = {
        ...coordinatesRef.current,
        mx: movementX * resolutionMultiplier * speedMultiplier,
        my: movementY * resolutionMultiplier * speedMultiplier,
      }
      window.requestAnimationFrame(draw)
    },
    [coordinatesRef, draw, resolutionMultiplierRef],
  )

  return {
    handleMoveStart,
    handleMoveEnd,
    handleMouseMove,
  }
}

// Hook for handling touch interactions
const useTouchInteractions = (
  coordinatesRef: React.MutableRefObject<Coordinates>,
  resolutionMultiplierRef: React.MutableRefObject<number>,
  draw: () => void,
  setZoom: React.Dispatch<React.SetStateAction<number>>,
) => {
  const touchPoints = useRef<Touch[]>([])

  const handleTouchStart = useCallback(
    (e: TouchEvent) => {
      e.preventDefault()
      coordinatesRef.current.moving = true
      touchPoints.current = []
      for (let i = 0; i < e.targetTouches.length; i += 1) {
        touchPoints.current.push(e.targetTouches[i] as Touch)
      }
    },
    [coordinatesRef],
  )

  const handleTouchEnd = useCallback(
    (e: TouchEvent) => {
      if (!coordinatesRef.current.moving) return
      e.preventDefault()
      coordinatesRef.current.moving = false
      touchPoints.current = []
      window.requestAnimationFrame(draw)
    },
    [coordinatesRef, draw],
  )

  const handleTouchMove = useCallback(
    (e: TouchEvent) => {
      if (!coordinatesRef.current.moving) return
      e.preventDefault()

      const tpCache = touchPoints.current
      const pointInxs: number[] = []

      for (let i = 0; i < e.targetTouches.length; i += 1) {
        const pointInx = tpCache.findIndex(
          (touch) => touch.identifier === e.targetTouches[i].identifier,
        )
        if (pointInx > -1) {
          pointInxs.push(pointInx)
        }
      }

      // Handle pinch to zoom (two touch points)
      if (e.targetTouches.length === 2 && e.changedTouches.length > 0 && pointInxs.length === 2) {
        const [touch1, touch2] = e.changedTouches
        if (!touch2) return
        const diff1 = touch1.clientX / tpCache[pointInxs[0]].clientX
        const diff2 = touch2.clientX / tpCache[pointInxs[1]].clientX
        const zoomDiff = 1 - diff1 * diff2

        setZoom((z) => Math.max(Math.min(z + zoomDiff * 100, 200), 100))
        tpCache[pointInxs[0]] = touch1
        tpCache[pointInxs[1]] = touch2
      }
      // Handle single touch drag
      else if (
        e.targetTouches.length === 1 &&
        e.changedTouches.length === 1 &&
        pointInxs.length === 1
      ) {
        const [touch1] = e.changedTouches
        const { clientX: ogX, clientY: ogY } = tpCache[pointInxs[0]]
        const { clientX: nx, clientY: ny } = touch1
        const { x, y } = coordinatesRef.current
        const resolutionMultiplier = resolutionMultiplierRef.current
        const mx = (ogX - nx) * -1 * resolutionMultiplier * speedMultiplier
        const my = (ogY - ny) * -1 * resolutionMultiplier * speedMultiplier

        coordinatesRef.current = {
          ...coordinatesRef.current,
          x: x + mx,
          y: y + my,
        }

        tpCache[pointInxs[0]] = touch1
        window.requestAnimationFrame(draw)
      } else {
        touchPoints.current = []
      }
    },
    [coordinatesRef, draw, resolutionMultiplierRef, setZoom],
  )

  return {
    handleTouchStart,
    handleTouchEnd,
    handleTouchMove,
  }
}

// Hook for handling window resizing
const useWindowResize = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  resolutionMultiplierRef: React.MutableRefObject<number>,
  draw: () => void,
) => {
  const handleWindowResize = useCallback(() => {
    // Calculate available width and height
    const adjustedWidth = window.innerWidth * 0.8 - 25

    // For a 3:1 ratio (width:height), we need to ensure the height is 1/3 of the width
    let width = Math.min(adjustedWidth, 1200) // Cap at 1200px for max width
    let height = width / headerAspectRatio // Maintain 3:1 aspect ratio

    // Ensure minimum dimensions
    width = Math.max(width, 600)
    height = Math.max(height, 200)

    const canvas = canvasRef.current
    if (canvas) {
      // Update resolution multiplier
      resolutionMultiplierRef.current = canvas.width / width
      draw()
    }
  }, [canvasRef, draw, resolutionMultiplierRef])

  useEffect(() => {
    if (canvasRef.current) {
      handleWindowResize()
    }
  }, [canvasRef, handleWindowResize])

  return { handleWindowResize }
}

// Hook for handling zoom functionality
const useZoomControl = (
  coordinatesRef: React.MutableRefObject<Coordinates>,
  zoom: number,
  draw: () => void,
) => {
  useEffect(() => {
    if (zoom !== undefined) {
      const { oW: originalWidth, oH: originalHeight } = coordinatesRef.current
      // Adjust zoom factor to allow for zooming out more (50% to 200%)
      const zoomFactor = zoom / 100
      const newWidth = originalWidth * zoomFactor
      const newHeight = originalHeight * zoomFactor
      const widthDiff = newWidth - coordinatesRef.current.w
      const heightDiff = newHeight - coordinatesRef.current.h

      coordinatesRef.current.w = originalWidth * zoomFactor
      coordinatesRef.current.h = originalHeight * zoomFactor
      coordinatesRef.current.x -= widthDiff / 2
      coordinatesRef.current.y -= heightDiff / 2

      window.requestAnimationFrame(draw)
    }
  }, [coordinatesRef, draw, zoom])
}

// Hook for setting up event listeners
const useEventListeners = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  handleMoveStart: (e: MouseEvent | TouchEvent) => void,
  handleMouseMove: (e: MouseEvent) => void,
  handleMoveEnd: (e: MouseEvent | TouchEvent) => void,
  handleTouchStart: (e: TouchEvent) => void,
  handleTouchMove: (e: TouchEvent) => void,
  handleTouchEnd: (e: TouchEvent) => void,
  handleWindowResize: () => void,
) => {
  useEffect(() => {
    const canvas = canvasRef.current

    // Mouse events
    canvas?.addEventListener('mousedown', handleMoveStart, { passive: false })
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMoveEnd)

    // Touch events
    canvas?.addEventListener('touchstart', handleTouchStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleTouchEnd, { passive: false })
    window.addEventListener('touchcancel', handleTouchEnd, { passive: false })

    // Window resize event
    window.addEventListener('resize', handleWindowResize)

    return () => {
      // Cleanup mouse events
      canvas?.removeEventListener('mousedown', handleMoveStart)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMoveEnd)

      // Cleanup touch events
      canvas?.removeEventListener('touchstart', handleTouchStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleTouchEnd)
      window.removeEventListener('touchcancel', handleTouchEnd)

      // Cleanup window resize event
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [
    canvasRef,
    handleMoveStart,
    handleMouseMove,
    handleMoveEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWindowResize,
  ])
}

// Hook for handling crop submission
const useCropSubmission = (
  canvasRef: React.RefObject<HTMLCanvasElement>,
  coordinatesRef: React.MutableRefObject<Coordinates>,
  setDataURL: (dataURL: string) => void,
) => {
  const handleSubmit = useCallback(() => {
    if (!canvasRef.current) return

    const { cropWidth, cropHeight, maxX, maxY } = getHeaderVars(canvasRef.current)
    const cropCanvas = document.createElement('canvas')
    const cropCtx = cropCanvas.getContext('2d')!

    // Set the output dimensions for the cropped image with proper aspect ratio
    cropCanvas.width = cropWidth
    cropCanvas.height = cropHeight

    // Fill with white background
    cropCtx.fillStyle = 'white'
    cropCtx.fillRect(0, 0, cropWidth, cropHeight)

    // Get the current canvas and its context
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')!

    // Get the current image position and dimensions from coordinatesRef
    const { x, y, w, h } = coordinatesRef.current

    // Calculate the visible portion of the image that falls within the crop area
    // The crop area is defined by the SVG overlay, which is positioned at (maxX, maxY) with size cropWidth x cropHeight

    // Calculate source coordinates (the part of the canvas we want to extract)
    // This is the intersection of the image and the crop window
    const sourceX = Math.max(maxX, x)
    const sourceY = Math.max(maxY, y)
    const sourceWidth = Math.min(maxX + cropWidth, x + w) - sourceX
    const sourceHeight = Math.min(maxY + cropHeight, y + h) - sourceY

    // Calculate destination coordinates (where to place the extracted portion in the new canvas)
    // This maps the extracted portion to the correct position in the output
    const destX = sourceX - maxX
    const destY = sourceY - maxY

    // Draw the visible portion of the image onto the crop canvas
    cropCtx.drawImage(
      canvas,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      destX,
      destY,
      sourceWidth,
      sourceHeight,
    )

    // Convert the cropped canvas to a data URL and set it
    setDataURL(cropCanvas.toDataURL('image/jpeg', 0.9))
  }, [canvasRef, coordinatesRef, setDataURL])

  return { handleSubmit }
}

export const CropComponent = ({
  avatar,
  handleCancel,
  setDataURL,
}: {
  avatar: File
  handleCancel: () => void
  setDataURL: (dataURL: string) => void
}) => {
  const { t } = useTranslation('transactionFlow')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef(new Image())
  const resolutionMultiplierRef = useRef(1)
  // Set default zoom to 75 (75% of original size) to allow for zooming out
  const [zoom, setZoom] = useState(75)

  // Initialize canvas drawing functionality
  const { draw, coordinatesRef } = useCanvasDrawing(imageRef, canvasRef)

  // Initialize image loading
  useImageLoader(avatar, imageRef, canvasRef, coordinatesRef, draw)

  // Initialize mouse interactions
  const { handleMoveStart, handleMoveEnd, handleMouseMove } = useMouseInteractions(
    canvasRef,
    coordinatesRef,
    resolutionMultiplierRef,
    draw,
  )

  // Initialize touch interactions
  const { handleTouchStart, handleTouchEnd, handleTouchMove } = useTouchInteractions(
    coordinatesRef,
    resolutionMultiplierRef,
    draw,
    setZoom,
  )

  // Initialize window resize handling
  const { handleWindowResize } = useWindowResize(canvasRef, resolutionMultiplierRef, draw)

  // Initialize zoom control
  useZoomControl(coordinatesRef, zoom, draw)

  // Set up event listeners
  useEventListeners(
    canvasRef,
    handleMoveStart,
    handleMouseMove,
    handleMoveEnd,
    handleTouchStart,
    handleTouchMove,
    handleTouchEnd,
    handleWindowResize,
  )

  // Initialize crop submission
  const { handleSubmit } = useCropSubmission(canvasRef, coordinatesRef, setDataURL)

  return (
    <>
      <Dialog.Heading title={t('input.profileEditor.tabs.avatar.image.title')} />
      <Dialog.Content>
        <EditImageContainer data-testid="edit-image-container">
          <ImageWrapper>
            <ImageContainer>
              <ImageCropBorder as={CropBorderSVG} />
              <ImageCropFrame as={CropFrameSVG} />
              <StyledCanvas width={1200} height={400} ref={canvasRef} />
            </ImageContainer>
          </ImageWrapper>
          <SliderContainer>
            <MinusCircleSVG />
            <Slider
              label="zoom"
              hideLabel
              value={zoom}
              onChange={(e) => setZoom(parseInt(e.target.value))}
              min={100}
              max={200}
            />
            <PlusCircleSVG />
          </SliderContainer>
        </EditImageContainer>
      </Dialog.Content>
      <Dialog.Footer
        leading={<AvCancelButton handleCancel={handleCancel} />}
        trailing={
          <Button onClick={handleSubmit} data-testid="continue-button">
            {t('action.continue', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
