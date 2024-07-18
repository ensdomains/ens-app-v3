export const safeDateObj = (date: Date | string | number | undefined) => {
  if (!date) return undefined
  if (typeof date === 'string' && /^\d+$/.test(date)) return new Date(parseInt(date))
  const dateObj = date instanceof Date ? date : new Date(date)
  if (Number.isNaN(dateObj)) return undefined
  return dateObj
}

export const secondsToDate = (seconds: number) => new Date(seconds * 1000)

export const dateToDateInput = (date: Date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0') // Month is zero-indexed
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

export function secondsToDateInput(seconds: number) {
  const date = secondsToDate(seconds) // Convert seconds to milliseconds
  return dateToDateInput(date)
}

// add seconds to complete a day
export const roundDurationWithDay = (valueAsDate: Date, now: number) => {
  // Have to add in the timezone offset to make sure that the date shows up correctly after calendar picking for UTC
  const valueAsDateClone = new Date(
    valueAsDate.getTime() + valueAsDate.getTimezoneOffset() * 60 * 1000,
  ).setHours(0, 0, 0, 0)
  const nowClone = new Date(now * 1000).setHours(0, 0, 0, 0)
  return Math.floor((valueAsDateClone - nowClone) / 1000)
}
