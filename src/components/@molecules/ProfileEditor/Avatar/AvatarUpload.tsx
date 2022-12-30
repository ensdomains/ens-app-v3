/* eslint-disable no-multi-assign */
import { useMutation } from '@tanstack/react-query'
import { sha256 } from 'ethers/lib/utils'
import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useSignTypedData } from 'wagmi'

import { Button, Dialog } from '@ensdomains/thorin'

import { useChainName } from '@app/hooks/useChainName'

import { AvCancelButton, CropComponent } from './AvatarCrop'

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
  const bytes = Uint8Array.from(atob(base64), (c) => c.charCodeAt(0))
  return bytes
}

const UploadComponent = ({
  dataURL,
  handleCancel,
  handleSubmit,
  name,
}: {
  dataURL: string
  handleCancel: () => void
  handleSubmit: (uri: string) => void
  name: string
}) => {
  const { t } = useTranslation('transactionFlow')

  const urlHash = useMemo(() => sha256(dataURLToBytes(dataURL)), [dataURL])
  const expiry = useMemo(() => `${Date.now() + 1000 * 60 * 60 * 24 * 7}`, [])
  const network = useChainName()

  const { signTypedDataAsync } = useSignTypedData({
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

  const { mutate: signAndUpload, isLoading } = useMutation(async () => {
    const baseURL =
      process.env.NEXT_PUBLIC_AVUP_ENDPOINT || `https://avatar-upload.ens-cf.workers.dev/${network}`
    const endpoint = `${baseURL}/${name}`

    const sig = await signTypedDataAsync()
    const fetched = (await fetch(endpoint, {
      method: 'PUT',
      headers: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        expiry,
        dataURL,
        sig,
      }),
    }).then((res) => res.json())) as any

    if (fetched.message === 'uploaded') {
      return handleSubmit(endpoint)
    }
    throw new Error(fetched.message)
  })

  return (
    <>
      <Dialog.Heading
        title={t('input.profileEditor.tabs.avatar.image.upload.title')}
        subtitle={t('input.profileEditor.tabs.avatar.image.upload.subtitle')}
      />
      <CroppedImagePreview data-testid="cropped-image-preview" src={dataURL} />
      <Dialog.Footer
        leading={<AvCancelButton handleCancel={handleCancel} />}
        trailing={
          <Button disabled={isLoading} onClick={() => signAndUpload()} data-testid="upload-button">
            {t('input.profileEditor.tabs.avatar.image.upload.action')}
          </Button>
        }
      />
    </>
  )
}

export const AvatarUpload = ({
  avatar,
  handleCancel,
  handleSubmit,
  name,
}: {
  avatar: File
  handleCancel: () => void
  handleSubmit: (uri: string) => void
  name: string
}) => {
  const [dataURL, setDataURL] = useState<string | null>(null)

  if (!dataURL) {
    return <CropComponent {...{ avatar, setDataURL, handleCancel }} />
  }

  return (
    <UploadComponent {...{ dataURL, handleCancel: () => setDataURL(null), name, handleSubmit }} />
  )
}
