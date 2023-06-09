import { ComponentProps } from 'react'
import { Control, useFormState } from 'react-hook-form'

import AvatarButton from '@app/components/@molecules/ProfileEditor/Avatar/AvatarButton'
import { useAvatar } from '@app/hooks/useAvatar'
import { useChainId } from '@app/hooks/useChainId'
import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'

type Props = {
  name: string
  control: Control<ProfileEditorForm>
} & Omit<ComponentProps<typeof AvatarButton>, 'validated'>

export const WrappedAvatarButton = ({ control, name, src, ...props }: Props) => {
  const chainId = useChainId()
  const { avatar } = useAvatar(name, chainId)
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
