import { match } from 'ts-pattern'

import { BannerManual } from './BannerManual'
import { BannerNFT } from './BannerNFT'
import { BannerUpload } from './BannerUpload'

export type BannerViewType = 'upload' | 'nft' | 'manual'

export const BannerViewManager = ({
  type,
  bannerFile,
  ...props
}: {
  handleCancel: () => void
  handleSubmit: (type: BannerViewType, uri: string, display?: string) => void
  name: string
  bannerFile?: File
  type: BannerViewType
}) => {
  return match(type)
    .with('upload', () => <BannerUpload bannerFile={bannerFile!} {...props} />)
    .with('nft', () => <BannerNFT {...props} />)
    .with('manual', () => <BannerManual {...props} />)
    .exhaustive()
}
