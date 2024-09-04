import { TFunction } from 'i18next'
import { useSyncExternalStore } from 'react'
import { useTranslation } from 'react-i18next'

const MINUTE_IN_SECONDS = 5 * 60 * 1000

type DayDiff = { years: number; months: number; days: number; hours: number; minutes: number }

export const calculateTimeDiff = (endDate?: Date) => {
  if (!endDate) return

  const now = new Date()

  // return null if the end date is in the past.
  if (endDate < now) return null

  const diff = {
    years: endDate.getFullYear() - now.getFullYear(),
    months: endDate.getMonth() - now.getMonth(),
    days: endDate.getDate() - now.getDate(),
    hours: endDate.getHours() - now.getHours(),
    minutes: endDate.getMinutes() - now.getMinutes(),
  }

  if (diff.minutes < 0) {
    diff.hours -= 1
    diff.minutes += 60
  }

  if (diff.hours < 0) {
    diff.days -= 1
    diff.hours += 24
  }

  if (diff.days < 0) {
    const numberOfDaysInMonthBeforeEndDate = new Date(
      endDate.getFullYear(),
      endDate.getMonth(),
      0,
    ).getDate()

    const newDays = numberOfDaysInMonthBeforeEndDate - now.getDate() + endDate.getDate()

    diff.days = newDays
    diff.months -= 1
  }

  if (diff.months < 0) {
    diff.years -= 1
    diff.months += 12
  }

  return diff
}

export const displayCountdown = ({ diff, t }: { diff: DayDiff; t: TFunction }) => {
  if (diff.years > 0) return t('unit.years', { count: diff.years })
  if (diff.months > 0) return t('unit.months', { count: diff.months })
  if (diff.days > 0) return t('unit.days', { count: diff.days })
  if (diff.hours > 1) return t('unit.hours', { count: diff.hours })
  // if the difference is more than 90 minutes we set the minimum to 2 hours so that the time transition does not increase
  if (diff.hours > 0 && diff.minutes > 30)
    return t('unit.hours', { count: Math.max(diff.hours, 2) })
  if (diff.hours > 0)
    return `${t('unit.hours', { count: diff.hours })} / ${t('unit.minutes', {
      count: diff.minutes,
    })}`
  // Set the minimum to 1 minute since we don't display seconds
  return `${t('unit.minutes', { count: Math.max(diff.minutes, 1) })}`
}

export const useDurationCountdown = ({ endDate }: { endDate?: Date }) => {
  const { t } = useTranslation('common')
  return useSyncExternalStore(
    (onStoreChange) => {
      const interval = setInterval(onStoreChange, MINUTE_IN_SECONDS)
      return () => clearInterval(interval)
    },
    () => {
      const dayDiff = calculateTimeDiff(endDate)
      if (!dayDiff) return dayDiff
      return displayCountdown({ diff: dayDiff, t })
    },
    () => {
      return undefined
    },
  )
}
