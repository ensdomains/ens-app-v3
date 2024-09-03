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
  return Math.floor((newDate.getTime() - startDate.getTime()) / 1000)
}

export type DatesDiff = {
  years: number
  months: number
  days: number
}

export const calculateDatesDiff = (
  date1: Date,
  date2: Date,
): { diff: DatesDiff; isNegative: boolean } => {
  const isNegative = date1 > date2
  const [startDate, endDate] = isNegative ? [date2, date1] : [date1, date2]
  const dateDiff = {
    years: endDate.getFullYear() - startDate.getFullYear(),
    months: endDate.getMonth() - startDate.getMonth(),
    days: endDate.getDate() - startDate.getDate(),
  }

  if (dateDiff.days < 0) {
    const numberOfDaysInMonthBeforeEndDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      0,
    ).getDate()

    const newDays = numberOfDaysInMonthBeforeEndDate - startDate.getDate() + endDate.getDate()

    dateDiff.days = newDays
    dateDiff.months -= 1
  }

  if (dateDiff.months < 0) {
    dateDiff.years -= 1
    dateDiff.months += 12
  }

  return {
    diff: dateDiff,
    isNegative,
  }
}
