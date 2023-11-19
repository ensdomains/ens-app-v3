/* eslint-disable import/no-extraneous-dependencies */
import type { Name } from '../index.js'

const MIN_REGISTRATION_DURATION = 28 * 24 * 60 * 60 // 28 Days

const getAllDurations = (names: Name[]): number[] => {
  return names
    .map((name) => {
      const { duration } = name
      const subnameDurations = name.subnames?.map((subname) => subname.duration) || []
      return [duration, ...subnameDurations]
    })
    .flat()
    .filter((x) => typeof x === 'number') as number[]
}

export const getTimeOffset = ({ names }: { names: Name[] }) => {
  const allDurations = getAllDurations(names)
  const minDuration = allDurations.length ? Math.min(...allDurations) : Infinity
  if (minDuration >= MIN_REGISTRATION_DURATION) return 0
  return MIN_REGISTRATION_DURATION - minDuration
}
