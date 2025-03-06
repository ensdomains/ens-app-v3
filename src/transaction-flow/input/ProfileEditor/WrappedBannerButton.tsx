import { ComponentProps } from 'react'
import { Control, useFormState } from 'react-hook-form'
import { useEnsAvatar } from 'wagmi'

import BannerButton from '@app/components/@molecules/ProfileEditor/Banner/BannerButton'
import { ProfileEditorForm } from '@app/hooks/useProfileEditorForm'
import { ensAvatarConfig } from '@app/utils/query/ipfsGateway'

type Props = {
  name: string
  control: Control<ProfileEditorForm>
} & Omit<ComponentProps<typeof BannerButton>, 'validated'>

export const WrappedBannerButton = ({ control, name, src, ...props }: Props) => {
  const formState = useFormState<ProfileEditorForm>({
    control,
    name: 'banner',
  })
  const { data: header } = useEnsAvatar({ ...ensAvatarConfig, name, key: 'header' })

  const isValidated = !!src || !!header
  const isDirty = !!formState.dirtyFields.banner
  const currentOrUpdatedSrc = isDirty ? src : (header as string | undefined)

  return (
    <BannerButton {...props} src={currentOrUpdatedSrc} validated={isValidated} dirty={isDirty} />
  )
}
