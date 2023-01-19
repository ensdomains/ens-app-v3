import { ComponentProps } from 'react'
import { Control, useWatch } from 'react-hook-form'

import AvatarButton from '@app/components/@molecules/ProfileEditor/Avatar/AvatarButton'
import { RegistrationForm } from '@app/hooks/useRegistrationForm'

type Props = {
  control: Control<RegistrationForm>
} & Omit<ComponentProps<typeof AvatarButton>, 'validated'>

export const WrappedAvatarButton = ({ control, ...props }: Props) => {
  const avatar = useWatch<RegistrationForm>({
    control,
    name: 'avatar',
  })
  console.log(props.src)
  return <AvatarButton {...props} validated={!!avatar} />
}
