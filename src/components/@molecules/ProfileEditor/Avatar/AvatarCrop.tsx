/* eslint-disable no-multi-assign */
import { useCallback, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Slider } from '@ensdomains/thorin'

import CropBorderSVG from '@app/assets/CropBorder.svg'
import CropFrameSVG from '@app/assets/CropFrame.svg'
import MinusCircleSVG from '@app/assets/MinusCircle.svg'
import PlusCircleSVG from '@app/assets/PlusCircle.svg'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { calcMomentum, getVars } from '@app/utils/avatarUpload'

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
    height: max-content;
  `,
)

const ImageContainer = styled.div(
  ({ theme }) => css`
    margin: 0 auto;
    aspect-ratio: 1;
    position: relative;
    width: 100%;
    height: 100%;
    max-width: ${theme.space['96']};
    border-radius: ${theme.radii.extraLarge};
    overflow: hidden;

    svg {
      fill: none;
    }
  `,
)

const ImageCropBorder = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    height: ${theme.space.full};
    max-width: ${theme.space['96']};
    color: ${theme.colors.background};
    position: absolute;
    pointer-events: none;
  `,
)

const ImageCropFrame = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    height: ${theme.space.full};
    max-width: ${theme.space['96']};
    color: ${theme.colors.accent};
    position: absolute;
    pointer-events: none;
  `,
)

const StyledCanvas = styled.canvas(
  ({ theme }) => css`
    aspect-ratio: 1;
    width: ${theme.space.full};
    height: ${theme.space.full};
    cursor: grab;
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
    const { cropSize, max } = getVars(canvasRef.current!)
    const cropCanvas = document.createElement('canvas')
    const cropCtx = cropCanvas.getContext('2d')!

    cropCanvas.width = cropSize
    cropCanvas.height = cropSize

    cropCtx.fillStyle = 'white'
    cropCtx.fillRect(0, 0, cropSize, cropSize)
    cropCtx.drawImage(canvasRef.current!, max, max, cropSize, cropSize, 0, 0, cropSize, cropSize)
    setDataURL(cropCanvas.toDataURL('image/jpeg', 0.9))
  }

  const draw = useCallback(() => {
    const image = imageRef.current
    const canvas = canvasRef.current
    if (!canvas) return
    const { max, cropSize } = getVars(canvas)
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
      coordinatesRef.current.mx = calcMomentum(x, max, w, cropSize)
      coordinatesRef.current.my = calcMomentum(y, max, h, cropSize)
      if (coordinatesRef.current.mx !== 0 || coordinatesRef.current.my !== 0) {
        window.requestAnimationFrame(draw)
      }
    }
  }, [])

  const handleImageLoad = useDebouncedCallback(
    () => {
      const image = imageRef.current
      const { size, cropSize, max, ctx } = getVars(canvasRef.current!)
      const { width: iw, height: ih } = image
      const ir = iw / ih

      let x: number
      let y: number
      let w: number
      let h: number
      if (ir > 1) {
        h = cropSize
        w = h * ir
        x = (size - w) / 2
        y = max
      } else if (ir < 1) {
        w = cropSize
        h = w / ir
        x = max
        y = (size - h) / 2
      } else {
        // eslint-disable-next-line no-multi-assign
        w = h = cropSize
        // eslint-disable-next-line no-multi-assign
        x = y = max
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
        mx: movementX * resolutionMultiplier,
        my: movementY * resolutionMultiplier,
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
        const mx = (ogX - nx) * -1 * resolutionMultiplier
        const my = (ogY - ny) * -1 * resolutionMultiplier
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
    const adjustedWidth = window.innerWidth * 0.8 - 25
    const adjustedHeight = window.innerHeight / 2
    const minBound = Math.max(Math.min(adjustedWidth, adjustedHeight, 384), 208)
    const canvas = canvasRef.current
    if (canvas) {
      const parent = canvas.parentElement!
      parent.style.height =
        parent.style.width =
        canvas.style.height =
        canvas.style.width =
          `${minBound}px`
      parent.style.width = `${minBound}px`
      resolutionMultiplierRef.current = canvas.width / minBound
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
      image.src = URL.createObjectURL(avatar)
      image.onload = handleImageLoad
    }
  }, [avatar, canvasRef, handleImageLoad])

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
              <StyledCanvas width={1024} height={1024} ref={canvasRef} />
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
