export const insertZeroWidthNonJoinerAtLabel = (name: string) => {
  const [label, ...rest] = name.split('.')
  return [`${label}\u200C`, ...rest].join('.')
}
