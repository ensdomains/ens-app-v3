export type SearchItemType = 'text' | 'error' | 'address' | 'name'

export type SearchItem = {
  type: SearchItemType | 'nameWithDotEth'
  value?: string
}

export type HistoryItem = {
  type: 'name' | 'address'
  value: string
}

export type AnyItem = (SearchItem | HistoryItem) & {
  isHistory: boolean
}
