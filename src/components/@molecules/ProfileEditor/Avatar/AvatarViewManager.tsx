import { AvatarNFT } from './AvatarNFT'
import { AvatarUpload } from './AvatarUpload'

export const AvatarViewManager = ({
  type,
  avatarFile,
  ...props
}: {
  handleCancel: () => void
  handleSubmit: (type: 'upload' | 'nft', uri: string, display?: string) => void
  name: string
  avatarFile?: File
  type: 'upload' | 'nft'
}) => {
  return type === 'upload' ? (
    <AvatarUpload avatar={avatarFile!} {...props} />
  ) : (
    <AvatarNFT {...props} />
  )
}
