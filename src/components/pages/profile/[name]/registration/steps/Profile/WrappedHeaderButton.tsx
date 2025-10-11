import { ComponentProps } from 'react'
import { Control, useWatch } from 'react-hook-form'

import HeaderButton from '@app/components/@molecules/ProfileEditor/Header/HeaderButton'
import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'

type Props = {
  name: string
  control: Control<ProfileEditorForm>
} & Omit<ComponentProps<typeof HeaderButton>, 'validated'>

export const WrappedHeaderButton = ({ control, name, src, ...props }: Props) => {
  const headerValue = useWatch({
    control,
    name: 'header',
  })
  const isValidated = !!headerValue
  // Only show src if there's a headerValue (not removed)
  const currentOrUpdatedSrc = headerValue ? src : undefined
  return (
    <HeaderButton
      {...props}
      src={currentOrUpdatedSrc}
      headerValue={headerValue}
      validated={isValidated}
    />
  )
}
