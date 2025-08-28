import { ComponentProps } from 'react'
import { Control, useFormState, useWatch } from 'react-hook-form'
import { useEnsAvatar } from 'wagmi'

import AvatarButton from '@app/components/@molecules/ProfileEditor/Avatar/AvatarButton'
import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'
import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'

type Props = {
  name: string
  control: Control<ProfileEditorForm>
} & Omit<ComponentProps<typeof AvatarButton>, 'validated'>

export const WrappedAvatarButton = ({ control, name, src, ...props }: Props) => {
  const { data: avatar } = useEnsAvatar({ ...ensAvatarConfig, name })
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
    <AvatarButton {...props} src={currentOrUpdatedSrc} avatarValue={avatarValue} validated={isValidated} dirty={isDirty} />
  )
}
