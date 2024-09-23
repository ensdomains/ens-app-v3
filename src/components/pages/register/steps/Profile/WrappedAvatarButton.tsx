import { ComponentProps } from 'react'
import { Control, useWatch } from 'react-hook-form'

import AvatarButton from '@app/components/@molecules/ProfileEditor/Avatar/AvatarButton'
import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'

type Props = {
  control: Control<ProfileEditorForm>
} & Omit<ComponentProps<typeof AvatarButton>, 'validated'>

export const WrappedAvatarButton = ({ control, ...props }: Props) => {
  const avatar = useWatch<ProfileEditorForm>({
    control,
    name: 'avatar',
  })
  return <AvatarButton {...props} validated={!!avatar} />
}
