export const insertZeroWidthNonJoinerAtLabel = (name: string) => {
  if (!name) return
  const [label, ...rest] = name.split('.')
  return [`${label}\u200C`, ...rest].join('.')
}
