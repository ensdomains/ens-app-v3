import { ComponentProps } from 'react'
import { Control, useFormState } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { useEnsAvatar } from 'wagmi'

import { Field } from '@ensdomains/thorin'

import AvatarButton from '@app/components/@molecules/ProfileEditor/Avatar/AvatarButton'
import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'
import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'

type Props = {
  name: string
  control: Control<ProfileEditorForm>
} & Omit<ComponentProps<typeof AvatarButton>, 'validated'>

export const WrappedAvatarButton = ({ control, name, src, ...props }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const { data: avatar } = useEnsAvatar({ ...ensAvatarConfig, name })
  const formState = useFormState<ProfileEditorForm>({
    control,
    name: 'avatar',
  })
  const isValidated = !!src || !!avatar
  const isDirty = !!formState.dirtyFields.avatar
  const currentOrUpdatedSrc = isDirty ? src : (avatar as string | undefined)

  return (
    <Field label={t('input.profileEditor.tabs.avatar.label')}>
      <AvatarButton {...props} src={currentOrUpdatedSrc} validated={isValidated} dirty={isDirty} />
    </Field>
  )
}
