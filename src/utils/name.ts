export const nameParts = (name: string) => {
  const parts = name.split('.')
  return {
    label: parts[0],
    parent: parts.slice(1).join('.'),
  }
}
