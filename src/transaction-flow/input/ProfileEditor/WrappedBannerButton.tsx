import { ComponentProps } from 'react'
import { Control, useFormState } from 'react-hook-form'

import BannerButton from '@app/components/@molecules/ProfileEditor/Banner/BannerButton'
import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'

type Props = {
  name: string
  control: Control<ProfileEditorForm>
} & Omit<ComponentProps<typeof BannerButton>, 'validated'>

export const WrappedBannerButton = ({ control, name, src, ...props }: Props) => {
  const formState = useFormState<ProfileEditorForm>({
    control,
    name: 'banner',
  })
  const isValidated = !!src
  const isDirty = !!formState.dirtyFields.banner
  return <BannerButton {...props} src={src} validated={isValidated} dirty={isDirty} />
}
