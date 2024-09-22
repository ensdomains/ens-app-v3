import { AvatarManual } from './AvatarManual'
import { AvatarNFT } from './AvatarNFT'
import { AvatarUpload } from './AvatarUpload'

export const AvatarViewManager = ({
  type,
  avatar,
  avatarFile,
  ...props
}: {
  handleCancel: () => void
  handleSubmit: (uri: string, display?: string) => void
  name: string
  avatar?: string
  avatarFile?: File
  type: 'upload' | 'manual' | 'nft'
}) => {
  if (type === 'upload') {
    return <AvatarUpload avatar={avatarFile!} {...props} />
  }

  if (type === 'manual') {
    return <AvatarManual avatar={avatar} {...props} />
  }

  return <AvatarNFT {...props} />
}
