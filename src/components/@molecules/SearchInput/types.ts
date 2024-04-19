export type NameType = 'address' | 'dns' | 'eth' | 'box' | 'tld' | 'error'

export type SearchItem = {
  nameType: NameType
  text: string
  isValid?: boolean
}

export type HistoryItem = {
  nameType: 'name' | 'address'
  text: string
  lastAccessed: number
}

export type AnyItem = (SearchItem | HistoryItem) & {
  isHistory: boolean
}

export type ResultItemProps = {
  name: string
}
