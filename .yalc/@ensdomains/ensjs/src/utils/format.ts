export const formatHashed = (name: string): string =>
  name.replace(/(\[)(.{64})(\])/g, '0x$2')

export const truncateFormat = (name: string): string =>
  name.replace(/(\[.{3})(.{58})(.{3}\])/g, '$1...$3')

export const bracketFormat = (name: string): string =>
  name.replace(/(0x)(.{64})(?=\.)/g, '[$2]')
