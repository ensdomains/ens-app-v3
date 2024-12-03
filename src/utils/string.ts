export const parseNumericString = (value: string | null): number | null => {
  if (!value) return null

  const parsed = Number(value)

  if (typeof parsed !== 'number' || Number.isNaN(parsed) || parsed < 0) {
    return null
  }

  return parseInt(String(parsed))
}
