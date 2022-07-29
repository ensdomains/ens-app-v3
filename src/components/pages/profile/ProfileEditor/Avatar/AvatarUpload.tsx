/* eslint-disable no-multi-assign */
import CropBorderSVG from '@app/assets/CropBorder.svg'
import CropFrameSVG from '@app/assets/CropFrame.svg'
import MinusCircleSVG from '@app/assets/MinusCircle.svg'
import PlusCircleSVG from '@app/assets/PlusCircle.svg'
import { Waiting } from '@app/components/@molecules/Waiting'
import { Button, Dialog, Slider } from '@ensdomains/thorin'
import { sha256, verifyTypedData } from 'ethers/lib/utils'
import { useCallback, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useSignTypedData } from 'wagmi'

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

const SliderContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: stretch;
    gap: ${theme.space['4']};

    padding: ${theme.space['2']} ${theme.space['8']};
    width: ${theme.space.full};

    & > svg {
      width: ${theme.space['6']};
      height: ${theme.space['6']};
      opacity: 15%;
    }
  `,
)

const CancelButton = ({ handleCancel }: { handleCancel: () => void }) => {
  const { t } = useTranslation('common')

  return (
    <Button variant="secondary" tone="grey" shadowless onClick={handleCancel}>
      {t('action.cancel')}
    </Button>
  )
}

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
    if (sn <= resolutionMultiplier * 2 && sn >= -resolutionMultiplier * 2) {
      momentum = sn
    } else {
      momentum = Math.round(Math.min(Math.max(sn / 16, -maxSpeed), maxSpeed))
    }
  }
  return momentum
}

const CropComponent = ({
  avatar,
  handleCancel,
  setDataURL,
}: {
  avatar: File
  handleCancel: () => void
  setDataURL: (dataURL: string) => void
}) => {
  const { t } = useTranslation('profile')
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const imageRef = useRef(new Image())

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

  const [zoom, setZoom] = useState(100)

  const handleSubmit = () => {
    const { crpSz, max } = getVars(canvasRef.current!)
    const cropCanvas = document.createElement('canvas')
    const cropCtx = cropCanvas.getContext('2d')!

    cropCanvas.width = crpSz
    cropCanvas.height = crpSz

    cropCtx.drawImage(
      canvasRef.current!,
      max,
      max,
      crpSz,
      crpSz,
      0,
      0,
      crpSz,
      crpSz,
    )
    setDataURL(cropCanvas.toDataURL('image/jpeg', 0.9))
  }

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
      w = h = crpSz
      // eslint-disable-next-line no-multi-assign
      x = y = max
    }
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
      <Dialog.Heading title="Edit Image" />
      <EditImageContainer>
        <ImageContainer>
          <ImageCropBorder as={CropBorderSVG} />
          <ImageCropFrame as={CropFrameSVG} />
          <StyledCanvas onMouseDown={handleMouseDown} ref={canvasRef} />
        </ImageContainer>
        <SliderContainer>
          <PlusCircleSVG />
          <Slider
            label="zoom"
            hideLabel
            value={zoom}
            onChange={(e) => setZoom(parseInt(e.target.value))}
            min={100}
            max={200}
          />
          <MinusCircleSVG />
        </SliderContainer>
      </EditImageContainer>
      <Dialog.Footer
        leading={<CancelButton handleCancel={handleCancel} />}
        trailing={
          <Button shadowless onClick={handleSubmit}>
            {t('action.upload', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

const CroppedImagePreview = styled.img(
  ({ theme }) => css`
    aspect-ratio: 1;
    width: ${theme.space.full};
    max-width: ${theme.space['72']};
    border-radius: ${theme.radii.extraLarge};
  `,
)

const dataURLToBytes = (dataURL: string) => {
  const base64 = dataURL.split(',')[1]
  const bytes = new TextEncoder().encode(base64)
  return bytes
}

const UploadComponent = ({
  dataURL,
  handleCancel,
  name,
}: {
  dataURL: string
  handleCancel: () => void
  name: string
}) => {
  // const { t } = useTranslation('profile')

  const urlHash = useMemo(() => sha256(dataURLToBytes(dataURL)), [dataURL])
  const expiry = useMemo(() => `${Date.now() + 1000 * 60 * 60 * 24 * 7}`, [])

  const {
    signTypedDataAsync,
    isLoading,
    data: loaded,
  } = useSignTypedData({
    domain: {
      name: 'Ethereum Name Service',
      version: '1',
    },
    types: {
      Upload: [
        { name: 'upload', type: 'string' },
        { name: 'expiry', type: 'string' },
        { name: 'name', type: 'string' },
        { name: 'hash', type: 'string' },
      ],
    },
    value: {
      upload: 'avatar',
      expiry,
      name,
      hash: urlHash,
    },
  })

  const signTypedData = async () => {
    const sig = await signTypedDataAsync()
    console.log(sig)

    const verifiedAddress = verifyTypedData(
      {
        name: 'Ethereum Name Service',
        version: '1',
      },
      {
        Upload: [
          { name: 'upload', type: 'string' },
          { name: 'expiry', type: 'string' },
          { name: 'name', type: 'string' },
          { name: 'hash', type: 'string' },
        ],
      },
      {
        upload: 'avatar',
        expiry,
        name,
        hash: urlHash,
      },
      sig,
    )

    console.log(verifiedAddress)

    // const valueItems = {
    //   upload: 'avatar',
    //   name,
    //   expiry,
    //   address: addressData!.address!,
    //   hash: urlHash,
    //   r,
    //   s,
    //   v,
    // }

    const fetched = (await fetch('/upload/avatar', {
      method: 'POST',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        name,
        expiry,
        url: dataURL,
        sig,
      }),
    }).then((res) => res.json())) as any

    console.log(fetched)

    // Object.keys(fetched as any).forEach((key: string) => {
    //   const one = fetched[key]
    //   const two = valueItems[key as keyof typeof valueItems]
    //   console.log(key, one, two, one === two)
    // })
  }

  if (!loaded) {
    return (
      <>
        <Dialog.Heading
          title="Sign Message"
          subtitle="You need to sign a message to upload an avatar. This won't cost anything."
        />
        <CroppedImagePreview src={dataURL} />
        <Dialog.Footer
          leading={<CancelButton handleCancel={handleCancel} />}
          trailing={
            <Button
              disabled={isLoading}
              onClick={() => signTypedData()}
              shadowless
            >
              Sign
            </Button>
          }
        />
      </>
    )
  }

  return (
    <>
      <Dialog.Heading title="Uploading..." />
      <Waiting title="Uploading to IPFS" subtitle="This may take some time" />
      <CroppedImagePreview src={dataURL} />
      <Dialog.Footer
        leading={<CancelButton handleCancel={handleCancel} />}
        trailing={null}
      />
    </>
  )
}

export const AvatarUpload = ({
  avatar,
  handleCancel,
  name,
}: {
  avatar: File
  handleCancel: () => void
  name: string
}) => {
  const [dataURL, setDataURL] = useState<string | null>(null)

  if (!dataURL) {
    return <CropComponent {...{ avatar, setDataURL, handleCancel }} />
  }

  return <UploadComponent {...{ dataURL, handleCancel, name }} />
}
