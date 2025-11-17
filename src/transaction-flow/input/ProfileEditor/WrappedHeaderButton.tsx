import { ComponentProps } from 'react'
import { Control, useFormState, useWatch } from 'react-hook-form'

import HeaderButton from '@app/components/@molecules/ProfileEditor/Header/HeaderButton'
import { useEnsAvatar } from '@app/hooks/useEnsAvatar'
import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'

type Props = {
  name: string
  control: Control<ProfileEditorForm>
} & Omit<ComponentProps<typeof HeaderButton>, 'validated'>

export const WrappedHeaderButton = ({ control, name, src, ...props }: Props) => {
  // @ts-ignore
  const { data: header } = useEnsAvatar({ name, key: 'header' })
  const formState = useFormState<ProfileEditorForm>({
    control,
    name: 'header',
  })
  const headerValue = useWatch({
    control,
    name: 'header',
  })
  const isValidated = !!src || !!header
  const isDirty = !!formState.dirtyFields.header
  const currentOrUpdatedSrc = isDirty ? src : (header as string | undefined)
  return (
    <HeaderButton
      {...props}
      src={currentOrUpdatedSrc}
      headerValue={headerValue}
      validated={isValidated}
      dirty={isDirty}
    />
  )
}
