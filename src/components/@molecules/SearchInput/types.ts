export type NameType = 'address' | 'dns' | 'eth' | 'box' | 'tld' | 'error'

export type SearchItem = {
  nameType: NameType
  text: string
  isValid?: boolean
}

export type HistoryItem = {
  nameType: Exclude<NameType, 'error'>
  text: string
  lastAccessed: number
}

export type AnyItem = (SearchItem | HistoryItem) & {
  isHistory: boolean
}

export type ResultItemProps = {
  name: string
}

export type SearchHandler = (params: { nameType: NameType; text: string }) => void
