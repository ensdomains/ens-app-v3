import { ComponentProps } from 'react'
import { Control, useFormState, useWatch } from 'react-hook-form'

import AvatarButton from '@app/components/@molecules/ProfileEditor/Avatar/AvatarButton'
import { useEnsAvatar } from '@app/hooks/useEnsAvatar'
import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'

type Props = {
  name: string
  control: Control<ProfileEditorForm>
} & Omit<ComponentProps<typeof AvatarButton>, 'validated'>

export const WrappedAvatarButton = ({ control, name, src, ...props }: Props) => {
  const { data: avatar } = useEnsAvatar({ name })
  const formState = useFormState<ProfileEditorForm>({
    control,
    name: 'avatar',
  })
  const avatarValue = useWatch({
    control,
    name: 'avatar',
  })
  const isValidated = !!src || !!avatar
  const isDirty = !!formState.dirtyFields.avatar
  const currentOrUpdatedSrc = isDirty ? src : (avatar as string | undefined)
  return (
    <AvatarButton
      {...props}
      src={currentOrUpdatedSrc}
      avatarValue={avatarValue}
      validated={isValidated}
      dirty={isDirty}
    />
  )
}
