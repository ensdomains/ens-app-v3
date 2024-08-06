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
  const valueAsDateClone = new Date(valueAsDate.getTime()).setHours(0, 0, 0, 0)
  const nowClone = new Date(now * 1000).setHours(0, 0, 0, 0)
  return Math.floor((valueAsDateClone - nowClone) / 1000)
}

export const getDaysOfMonthsFromYears = (startYear: number, endYear: number) => {
  let daysOfMonths: number[] = []
  for (let year = startYear; year <= endYear; year += 1) {
    // Calculates leap year
    const february = (year % 4 === 0 && year % 100 !== 0) || year % 400 === 0 ? 29 : 28
    daysOfMonths = [...daysOfMonths, 31, february, 31, 30, 31, 30, 31, 31, 30, 31, 30, 31]
  }
  return daysOfMonths
}

export const dateFromDateDiff = ({
  startDate,
  additionalYears = 0,
  additionalMonths = 0,
  additionalDays = 0,
}: {
  startDate: Date
  additionalYears?: number
  additionalMonths?: number
  additionalDays?: number
}) => {
  const newDate = new Date(startDate.getTime())
  newDate.setFullYear(newDate.getFullYear() + additionalYears)
  newDate.setMonth(newDate.getMonth() + additionalMonths)
  newDate.setDate(newDate.getDate() + additionalDays)
  return newDate
}

export const secondsFromDateDiff = ({
  startDate,
  additionalYears = 0,
  additionalMonths = 0,
  additionalDays = 0,
}: {
  startDate: Date
  additionalYears?: number
  additionalMonths?: number
  additionalDays?: number
}) => {
  const newDate = dateFromDateDiff({ startDate, additionalYears, additionalMonths, additionalDays })
  // startDate.setHours(0, 0, 0)
  // newDate.setHours(0, 0, 0)
  return Math.floor((newDate.getTime() - startDate.getTime()) / 1000)
}
