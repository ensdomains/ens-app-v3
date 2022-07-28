/* eslint-disable no-multi-assign */
import CropBorderSVG from '@app/assets/CropBorder.svg'
import CropFrameSVG from '@app/assets/CropFrame.svg'
import { Button, Dialog } from '@ensdomains/thorin'
import { useCallback, useEffect, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

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

const ImageContainer = styled.div(
  ({ theme }) => css`
    position: relative;
    aspect-ratio: 1;
    width: ${theme.space.full};
    height: ${theme.space.full};
    max-width: ${theme.space['112']};
    border-radius: ${theme.radii.extraLarge};
    overflow: hidden;
  `,
)

const ImageCropBorder = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    height: ${theme.space.full};
    color: ${theme.colors.background};
    position: absolute;
    pointer-events: none;
  `,
)

const ImageCropFrame = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    height: ${theme.space.full};
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

const imagePercent = 0.6875
const resolutionMultiplier = 4
const maxSpeed = 96

const getVars = (canvas: HTMLCanvasElement) => {
  const ctx = canvas.getContext('2d')!

  const ip = imagePercent
  const sz = canvas.width
  const crpSz = sz * ip
  const invSz = sz * (1 - ip)
  return {
    ip,
    sz,
    crpSz,
    invSz,
    ctx,
    max: invSz / 2,
  }
}

const distanceFromEdge = (n: number, max: number, s: number, crpSz: number) =>
  n > max ? max - n : Math.max(max - (n + s) + crpSz, 0)

const calcMomentum = (n: number, max: number, s: number, crpSz: number) => {
  let momentum = 0
  const sn = distanceFromEdge(n, max, s, crpSz)
  if (sn > 0 || sn < 0) {
    if (sn < resolutionMultiplier && sn > -resolutionMultiplier) {
      momentum = sn
    } else {
      momentum = Math.round(Math.min(Math.max(sn / 16, -maxSpeed), maxSpeed))
    }
  }
  return momentum
}

const CropComponent = ({ avatar }: { avatar: File }) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef(new Image())

  const coordinatesRef = useRef({
    x: 0,
    y: 0,
    mx: 0,
    my: 0,
    w: 0,
    h: 0,
    moving: false,
  })

  const draw = useCallback(() => {
    const image = imageRef.current
    const canvas = canvasRef.current!
    const { max, crpSz } = getVars(canvas)
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
      x,
      y,
      mx,
      my,
      w,
      h,
      moving,
    }
    if (!moving) {
      coordinatesRef.current.mx = calcMomentum(x, max, w, crpSz)
      coordinatesRef.current.my = calcMomentum(y, max, h, crpSz)
      if (coordinatesRef.current.mx !== 0 || coordinatesRef.current.my !== 0) {
        window.requestAnimationFrame(draw)
      }
    }
  }, [])

  const handleImageLoad = useCallback(() => {
    const image = imageRef.current
    const { sz, crpSz, max, ctx } = getVars(canvasRef.current!)
    const { width: iw, height: ih } = image
    const ir = iw / ih

    let x: number
    let y: number
    let w: number
    let h: number
    if (ir > 1) {
      h = crpSz
      w = h * ir
      x = (sz - w) / 2
      y = max
    } else if (ir < 1) {
      w = crpSz
      h = w / ir
      x = max
      y = (sz - h) / 2
    } else {
      // eslint-disable-next-line no-multi-assign
      w = h = crpSz / 2
      // eslint-disable-next-line no-multi-assign
      x = y = max
    }
    ctx.drawImage(image, x, y, w, h)
    coordinatesRef.current = {
      x,
      y,
      w,
      h,
      mx: 0,
      my: 0,
      moving: false,
    }
    window.requestAnimationFrame(draw)
  }, [draw])

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    e.preventDefault()
    coordinatesRef.current.moving = true
  }

  const handleMouseUp = useCallback(
    (e: MouseEvent) => {
      e.preventDefault()
      coordinatesRef.current.moving = false
      window.requestAnimationFrame(draw)
    },
    [draw],
  )

  const handleMouseMove = useCallback(
    (e: MouseEvent) => {
      if (!coordinatesRef.current.moving) return
      e.preventDefault()

      const { movementX, movementY } = e
      console.log(movementX, movementY)
      coordinatesRef.current = {
        ...coordinatesRef.current,
        mx: movementX * resolutionMultiplier,
        my: movementY * resolutionMultiplier,
      }
      window.requestAnimationFrame(draw)
    },
    [draw],
  )

  useEffect(() => {
    const canvas = canvasRef.current
    if (canvas && canvas.width !== canvas.clientHeight * resolutionMultiplier) {
      canvas.width = canvas.clientWidth * resolutionMultiplier
      canvas.height = canvas.clientHeight * resolutionMultiplier
    }
  }, [canvasRef])

  useEffect(() => {
    const image = imageRef.current
    if (canvasRef && !image.src) {
      console.log('creating')
      image.src = URL.createObjectURL(avatar)
      image.onload = handleImageLoad
    }
  }, [avatar, canvasRef, handleImageLoad])

  useEffect(() => {
    window.addEventListener('mousemove', handleMouseMove)
    window.addEventListener('mouseup', handleMouseUp)
    return () => {
      window.removeEventListener('mousemove', handleMouseMove)
      window.removeEventListener('mouseup', handleMouseUp)
    }
  }, [handleMouseMove, handleMouseUp])

  return (
    <EditImageContainer>
      <ImageContainer>
        <ImageCropBorder as={CropBorderSVG} />
        <ImageCropFrame as={CropFrameSVG} />
        <StyledCanvas onMouseDown={handleMouseDown} ref={canvasRef} />
      </ImageContainer>
    </EditImageContainer>
  )
}

export const AvatarUpload = ({
  avatar,
  handleCancel,
}: {
  avatar: File
  handleCancel: () => void
}) => {
  const { t } = useTranslation('profile')

  return (
    <>
      <Dialog.Heading title="Edit Image" />
      <CropComponent avatar={avatar} />
      <Dialog.Footer
        leading={
          <Button
            variant="secondary"
            tone="grey"
            shadowless
            onClick={handleCancel}
          >
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={null}
      />
    </>
  )
}
