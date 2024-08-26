import { AvatarManual } from './AvatarManual'
import { AvatarNFT } from './AvatarNFT'
import { AvatarUpload } from './AvatarUpload'

export type AvatarViewManagerType = 'upload' | 'manual' | 'nft'

export const AvatarViewManager = ({
  type,
  avatar,
  avatarFile,
  ...props
}: {
  handleCancel: () => void
  handleSubmit: (type: AvatarViewManagerType, uri: string, display?: string) => void
  name: string
  avatar?: string
  avatarFile?: File
  type: AvatarViewManagerType
}) => {
  if (type === 'upload') {
    return <AvatarUpload avatar={avatarFile!} {...props} />
  }

  if (type === 'manual') {
    return <AvatarManual avatar={avatar} {...props} />
  }

  return <AvatarNFT {...props} />
}
