import { ComponentProps } from 'react'
import { Control, useFormState } from 'react-hook-form'
import { useNetwork } from 'wagmi'

import AvatarButton from '@app/components/@molecules/ProfileEditor/Avatar/AvatarButton'
import { useAvatar } from '@app/hooks/useAvatar'
import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'

type Props = {
  name: string
  control: Control<ProfileEditorForm>
} & Omit<ComponentProps<typeof AvatarButton>, 'validated'>

export const WrappedAvatarButton = ({ control, name, src, ...props }: Props) => {
  const { chain } = useNetwork()
  const { avatar } = useAvatar(name, chain?.id || 1)
  const formState = useFormState<ProfileEditorForm>({
    control,
    name: 'avatar',
  })
  const isValidated = !!src || !!avatar
  const isDirty = !!formState.dirtyFields.avatar
  const currentOrUpdatedSrc = isDirty ? src : (avatar as string | undefined)
  return (
    <AvatarButton {...props} src={currentOrUpdatedSrc} validated={isValidated} dirty={isDirty} />
  )
}
