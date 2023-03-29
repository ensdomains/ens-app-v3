export const safeDateObj = (date: Date | string | number | undefined) => {
  if (!date) return undefined
  const dateObj = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(dateObj)) return undefined
  return dateObj
}
