import { ONE_DAY, ONE_YEAR } from '@app/utils/time'

export const validateExtendNamesDuration = ({
  duration,
  minDuration = ONE_DAY,
  defaultDuration = ONE_YEAR,
}: {
  duration?: unknown
  minDuration?: number
  defaultDuration?: number
}): number | null => {
  if (duration === null) return null
  const parsedDuration = parseInt(duration as string, 10)
  if (Number.isNaN(parsedDuration) || parsedDuration < 0) return defaultDuration
  if (parsedDuration < minDuration) return minDuration
  return parsedDuration
}
