import { match } from 'ts-pattern'

import { AvatarManual } from './AvatarManual'
import { AvatarNFT, type AvatarNftSourceMode } from './AvatarNFT'
import { AvatarUpload } from './AvatarUpload'

export const AvatarViewManager = ({
  type,
  avatarFile,
  nftSourceMode,
  ...props
}: {
  handleCancel: () => void
  handleSubmit: (type: 'upload' | 'nft' | 'manual', uri: string, display?: string) => void
  name: string
  nftSourceMode: AvatarNftSourceMode
  avatarFile?: File
  type: 'upload' | 'nft' | 'manual'
}) => {
  return match(type)
    .with('upload', () => <AvatarUpload avatar={avatarFile!} {...props} />)
    .with('nft', () => <AvatarNFT nftSourceMode={nftSourceMode} {...props} />)
    .with('manual', () => <AvatarManual {...props} />)
    .exhaustive()
}
