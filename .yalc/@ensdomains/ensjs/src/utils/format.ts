export const truncateFormat = (name: string): string =>
  name.replace(/(\[.{3})(.{58})(.{3}\])/g, '$1...$3')
