export type DecodedContentHash = {
  protocolType?: any
  decoded?: any
  error?: any
}

export type Profile = {
  isMigrated: boolean | null
  createdAt: string | null
  address?: string | undefined
  name?: string | undefined
  match?: boolean | undefined
  message?: string | undefined
  records?:
    | {
        contentHash?: string | DecodedContentHash | null | undefined
        texts?:
          | {
              key: string | number
              type: 'text' | 'addr' | 'contentHash'
              coin?: string | undefined
              value: string
            }[]
          | undefined
        coinTypes?:
          | {
              key: string | number
              type: 'text' | 'addr' | 'contentHash'
              coin?: string | undefined
              value: string
            }[]
          | undefined
      }
    | undefined
  resolverAddress?: string | undefined
}
