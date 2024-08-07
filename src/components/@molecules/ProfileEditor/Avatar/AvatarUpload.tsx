/* eslint-disable no-multi-assign */
import { useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, Helper } from '@ensdomains/thorin'

import { AvCancelButton, CropComponent } from './AvatarCrop'
import { useUploadAvatar } from './useUploadAvatar'

const CroppedImagePreview = styled.img(
  ({ theme }) => css`
    aspect-ratio: 1;
    width: ${theme.space.full};
    max-width: ${theme.space['72']};
    border-radius: ${theme.radii.extraLarge};
  `,
)

const UploadComponent = ({
  dataURL,
  handleCancel,
  handleSubmit,
  name,
}: {
  dataURL: string
  handleCancel: () => void
  handleSubmit: (type: 'upload', uri: string, display?: string) => void
  name: string
}) => {
  const { t } = useTranslation('transactionFlow')

  const { signAndUpload, isPending, error } = useUploadAvatar()

  const handleUpload = async () => {
    try {
      const endpoint = await signAndUpload({ dataURL, name })

      if (endpoint) {
        handleSubmit('upload', endpoint, dataURL)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <Dialog.Heading
        title={t('input.profileEditor.tabs.avatar.image.upload.title')}
        subtitle={t('input.profileEditor.tabs.avatar.image.upload.subtitle')}
      />
      <Dialog.Content>
        <CroppedImagePreview data-testid="cropped-image-preview" src={dataURL} />
      </Dialog.Content>
      {error && (
        <Helper data-testid="avatar-upload-error" type="error">
          {error.message}
        </Helper>
      )}
      <Dialog.Footer
        leading={<AvCancelButton handleCancel={handleCancel} />}
        trailing={
          <Button
            disabled={isPending}
            colorStyle={error ? 'redSecondary' : undefined}
            onClick={handleUpload}
            data-testid="upload-button"
          >
            {error
              ? t('action.tryAgain', { ns: 'common' })
              : t('input.profileEditor.tabs.avatar.image.upload.action')}
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
  handleSubmit: (type: 'upload', uri: string, display?: string) => void
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
