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

const ImageCropGuides = styled.div(
  ({ theme }) => css`
    width: 100%;
    height: 100%;
    position: absolute;
    pointer-events: none;

    &::before,
    &::after {
      content: '';
      position: absolute;
      background-color: ${theme.colors.accent};
      opacity: 0.3;
    }

    /* Vertical lines - positioned within the frame (10% left margin + 80% width) */
    &::before {
      left: calc(10% + 80% / 3);
      top: 10%;
      width: 1px;
      height: 80%;
    }

    &::after {
      left: calc(10% + 80% * 2 / 3);
      top: 10%;
      width: 1px;
      height: 80%;
    }

    /* Horizontal lines - positioned within the frame for 6:1 aspect ratio (25% 50% 25%) */
    & > span:nth-child(1) {
      position: absolute;
      left: 10%;
      top: calc(10% + 80% * 0.25);
      width: 80%;
      height: 1px;
      background-color: ${theme.colors.accent};
      opacity: 0.3;
    }

    & > span:nth-child(2) {
      position: absolute;
      left: 10%;
      top: calc(10% + 80% * 0.75);
      width: 80%;
      height: 1px;
      background-color: ${theme.colors.accent};
      opacity: 0.3;
    }
  `,
)

const AspectRatioLabel = styled.div(
  ({ theme }) => css`
    position: absolute;
    background-color: ${theme.colors.backgroundSecondary};
    color: ${theme.colors.textSecondary};
    padding: ${theme.space['1']} ${theme.space['2']};
    border-radius: ${theme.radii.large};
    font-size: ${theme.fontSizes.small};
    font-weight: ${theme.fontWeights.normal};
    pointer-events: none;
    z-index: 10;
    opacity: 0.9;
  `,
)

const OuterRatioLabel = styled(AspectRatioLabel)(
  () => css`
    top: 12%;
    right: 12%;
  `,
)

const InnerRatioLabel = styled(AspectRatioLabel)(
  () => css`
    top: 26%;
    right: 12%;
  `,
)

const StyledCanvas = styled.canvas(
  () => css`
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

export const HeaderCancelButton = ({ handleCancel }: { handleCancel: () => void }) => {
  const { t } = useTranslation('common')

  return (
    <Button data-testid="header-cancel-button" colorStyle="accentSecondary" onClick={handleCancel}>
      {t('action.back')}
    </Button>
  )
}

export const CropComponent = ({
  header,
  handleCancel,
  setDataURL,
}: {
  header: File
  handleCancel: () => void
  setDataURL: (dataURL: string) => void
}) => {
  const { t } = useTranslation('transactionFlow')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef(new Image())
  const resolutionMultiplierRef = useRef(1)

  const coordinatesRef = useRef({
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

  const touchPoints = useRef<Touch[]>([])

  const [zoom, setZoom] = useState(100)

  const handleSubmit = () => {
    const { cropWidth, cropHeight, maxX, maxY } = getHeaderVars(canvasRef.current!)
    const cropCanvas = document.createElement('canvas')
    const cropCtx = cropCanvas.getContext('2d')!

    cropCanvas.width = cropWidth
    cropCanvas.height = cropHeight

    cropCtx.fillStyle = 'white'
    cropCtx.fillRect(0, 0, cropWidth, cropHeight)
    cropCtx.drawImage(
      canvasRef.current!,
      maxX,
      maxY,
      cropWidth,
      cropHeight,
      0,
      0,
      cropWidth,
      cropHeight,
    )
    setDataURL(cropCanvas.toDataURL('image/jpeg', 0.9))
  }

  const draw = useCallback(() => {
    const image = imageRef.current
    const canvas = canvasRef.current
    if (!canvas || !image || !image.complete || !image.naturalWidth) return

    const { maxX, maxY, cropWidth, cropHeight } = getHeaderVars(canvas)
    // eslint-disable-next-line prefer-const
    let { x, y, w, h, mx, my, moving } = coordinatesRef.current
    const ctx = canvas.getContext('2d')
    if (!ctx) {
      if (process.env.NODE_ENV === 'development') {
        console.error('Failed to get canvas context')
      }
      return
    }
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
  }, [])

  const handleImageLoad = useDebouncedCallback(
    () => {
      const image = imageRef.current
      const { cropWidth, cropHeight, maxX, maxY, ctx } = getHeaderVars(canvasRef.current!)
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

      ctx!.drawImage(image, x, y, w, h)
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

  const handleMoveStart = (e: MouseEvent | TouchEvent) => {
    e.preventDefault()
    coordinatesRef.current.moving = true
    if ('targetTouches' in e) {
      touchPoints.current = []
      for (let i = 0; i < e.targetTouches.length; i += 1) {
        touchPoints.current.push(e.targetTouches[i] as Touch)
      }
    }
  }

  const handleMoveEnd = useCallback(
    (e: MouseEvent | TouchEvent) => {
      if (!coordinatesRef.current.moving) return
      e.preventDefault()
      coordinatesRef.current.moving = false
      touchPoints.current = []
      window.requestAnimationFrame(draw)
    },
    [draw],
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
    [draw],
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
      // multi-touch pinch to zoom
      if (e.targetTouches.length === 2 && e.changedTouches.length > 0 && pointInxs.length === 2) {
        const [touch1, touch2] = e.changedTouches
        if (!touch2) return
        const diff1 = touch1.clientX / tpCache[pointInxs[0]].clientX
        const diff2 = touch2.clientX / tpCache[pointInxs[1]].clientX
        const zoomDiff = 1 - diff1 * diff2

        setZoom((z) => Math.max(Math.min(z + zoomDiff * 100, 200), 100))
        tpCache[pointInxs[0]] = touch1
        tpCache[pointInxs[1]] = touch2
      } else if (
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
    [draw, setZoom],
  )

  const handleWindowResize = useCallback(() => {
    // Calculate available width and height
    const adjustedWidth = window.innerWidth * 0.8 - 25

    // For a 3:1 ratio (width:height), we need to ensure the height is 1/3 of the width
    let width = Math.min(adjustedWidth, 1200) // Cap at 1200px for max width

    // Ensure minimum dimensions
    width = Math.max(width, 600)

    const canvas = canvasRef.current
    if (canvas) {
      // Update resolution multiplier
      resolutionMultiplierRef.current = canvas.width / width
      draw()
    }
  }, [draw])

  useEffect(() => {
    if (canvasRef.current) {
      handleWindowResize()
    }
  }, [canvasRef, handleWindowResize])

  useEffect(() => {
    const image = imageRef.current
    if (canvasRef && !image.src) {
      image.src = URL.createObjectURL(header)
      image.onload = handleImageLoad
    }
  }, [header, canvasRef, handleImageLoad])

  useEffect(() => {
    const canvas = canvasRef.current
    canvas?.addEventListener('mousedown', handleMoveStart, { passive: false })
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMoveEnd)
    canvas?.addEventListener('touchstart', handleMoveStart, { passive: false })
    window.addEventListener('touchmove', handleTouchMove, { passive: false })
    window.addEventListener('touchend', handleMoveEnd, { passive: false })
    window.addEventListener('touchcancel', handleMoveEnd, { passive: false })
    window.addEventListener('resize', handleWindowResize)
    return () => {
      canvas?.removeEventListener('mousedown', handleMoveStart)
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMoveEnd)
      canvas?.removeEventListener('touchstart', handleMoveStart)
      window.removeEventListener('touchmove', handleTouchMove)
      window.removeEventListener('touchend', handleMoveEnd)
      window.removeEventListener('touchcancel', handleMoveEnd)
      window.removeEventListener('resize', handleWindowResize)
    }
  }, [handleMouseMove, handleMoveEnd, handleTouchMove, handleWindowResize])

  useEffect(() => {
    if (zoom) {
      const { oW: originalWidth, oH: originalHeight } = coordinatesRef.current
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
  }, [draw, zoom])

  return (
    <>
      <Dialog.Heading title={t('input.profileEditor.tabs.avatar.image.title')} />
      <Dialog.Content>
        <EditImageContainer data-testid="edit-image-container">
          <ImageWrapper>
            <ImageContainer>
              <ImageCropBorder as={CropBorderSVG} />
              <ImageCropFrame as={CropFrameSVG} />
              <OuterRatioLabel>3:1</OuterRatioLabel>
              <InnerRatioLabel>6:1</InnerRatioLabel>
              <ImageCropGuides>
                <span />
                <span />
              </ImageCropGuides>
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
        leading={<HeaderCancelButton handleCancel={handleCancel} />}
        trailing={
          <Button onClick={handleSubmit} data-testid="continue-button">
            {t('action.continue', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
