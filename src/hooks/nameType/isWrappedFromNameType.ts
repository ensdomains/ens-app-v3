import { NameType } from './getNameType'

export const isWrappedFromNameType = (nameType?: NameType) =>
  nameType && /-(wrapped|emancipated|locked)-(sub)?name/.test(nameType)
