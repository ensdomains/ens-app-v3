/* eslint-disable no-multi-assign */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog, Helper, Input } from '@ensdomains/thorin'

import { useUploadAvatar } from './useUploadAvatar'

type AvatarManualProps = {
  name: string
  handleCancel: () => void
  handleSubmit: (type: 'manual', uri: string, display?: string) => void
}

function isValidHttpUrl(value: string) {
  let url

  try {
    url = new URL(value)
  } catch (_) {
    return false
  }

  return url.protocol === 'http:' || url.protocol === 'https:'
}

export function AvatarManual({ name, handleCancel, handleSubmit }: AvatarManualProps) {
  const { t } = useTranslation('transactionFlow')

  const [value, setValue] = useState<string>('')

  const { signAndUpload, isPending, error } = useUploadAvatar()

  const handleUpload = async () => {
    try {
      const dataURL = await fetch(value)
        .then((res) => res.blob())
        .then((blob) => {
          return new Promise<string>((res) => {
            const reader = new FileReader()

            reader.onload = (e) => {
              if (e.target) res(e.target.result as string)
            }

            reader.readAsDataURL(blob)
          })
        })

      const endpoint = await signAndUpload({ dataURL, name })

      if (endpoint) {
        handleSubmit('manual', endpoint, value)
      }
    } catch (e) {
      console.error(e)
    }
  }

  return (
    <>
      <Dialog.Heading title={t('input.profileEditor.tabs.avatar.dropdown.enterManually')} />
      <Dialog.Content>
        <Input
          label={t('input.profileEditor.tabs.avatar.label')}
          value={value}
          onChange={(e) => setValue(e.target.value)}
        />
      </Dialog.Content>
      {error && (
        <Helper data-testid="avatar-upload-error" type="error">
          {error.message}
        </Helper>
      )}
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={() => handleCancel()}>
            {t('action.back', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button
            disabled={isPending || !isValidHttpUrl(value)}
            colorStyle={error ? 'redSecondary' : undefined}
            onClick={handleUpload}
          >
            {error ? t('action.tryAgain', { ns: 'common' }) : t('action.confirm', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
