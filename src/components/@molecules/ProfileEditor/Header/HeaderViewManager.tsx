import { match } from 'ts-pattern'

import { HeaderManual } from './HeaderManual'
import { HeaderNFT } from './HeaderNFT'
import { HeaderUpload } from './HeaderUpload'

export type HeaderViewType = 'upload' | 'nft' | 'manual'

export const HeaderViewManager = ({
  type,
  headerFile,
  ...props
}: {
  handleCancel: () => void
  handleSubmit: (type: HeaderViewType, uri: string, display?: string) => void
  name: string
  headerFile?: File
  type: HeaderViewType
}) => {
  return match(type)
    .with('upload', () => <HeaderUpload headerFile={headerFile!} {...props} />)
    .with('nft', () => <HeaderNFT {...props} />)
    .with('manual', () => <HeaderManual {...props} />)
    .exhaustive()
}
