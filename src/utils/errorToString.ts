export const errorToString = (e: unknown, fallbackMsg?: string): string => {
  if (typeof e === 'string') {
    return e
  }
  if (typeof e === 'object' && e !== null) {
    if ('message' in e) {
      return (e as Error).message
    }
    if ('toSring' in e) {
      return e.toString()
    }
  }
  return fallbackMsg || 'Unknown error'
}
