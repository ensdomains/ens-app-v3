export const parseNumericString = (time: string | null): number | null => {
  if (!time) return null

  if (typeof +time === 'number' && !Number.isNaN(+time)) {
    return +time
  }

  return null
}
