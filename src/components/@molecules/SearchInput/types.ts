export type NameType = 'address' | 'text' | 'dns' | 'eth' | 'box' | 'tld' | 'error'

export type SearchItem = {
  nameType: NameType
  text: string
  isValid?: boolean
  isHistory?: boolean
}

export type HistoryItem = {
  nameType: Exclude<NameType, 'error' | 'text'>
  text: string
  lastAccessed: number
}

export type AnyItem = SearchItem & {
  isHistory?: boolean
}

export type ResultItemProps = {
  name: string
}

export type SearchHandler = (index: number) => void
