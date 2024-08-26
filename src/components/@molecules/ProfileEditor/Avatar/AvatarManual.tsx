/* eslint-disable no-multi-assign */

import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog, Input } from '@ensdomains/thorin'

type AvatarManualProps = {
  avatar?: string
  handleCancel: () => void
  handleSubmit: (type: 'manual', uri: string, display?: string) => void
}

function isValidValue(value: string, prevValue?: string) {
  return !(prevValue && value === prevValue) && !!value.length
}

export function AvatarManual({ avatar, handleCancel, handleSubmit }: AvatarManualProps) {
  const { t } = useTranslation('transactionFlow')

  const [value, setValue] = useState<string>('')

  const handleUpload = async () => {
    try {
      handleSubmit('manual', value, value)
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
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={() => handleCancel()}>
            {t('action.back', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button disabled={!isValidValue(value, avatar)} onClick={handleUpload}>
            {t('action.confirm', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
