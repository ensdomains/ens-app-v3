import { match } from 'ts-pattern'

import { AvatarManual } from './AvatarManual'
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
  type: 'upload' | 'nft' | 'manual'
}) => {
  console.log('type', type)
  return match(type)
    .with('upload', () => <AvatarUpload avatar={avatarFile!} {...props} />)
    .with('nft', () => <AvatarNFT {...props} />)
    .with('manual', () => <AvatarManual {...props} />)
    .exhaustive()
}
