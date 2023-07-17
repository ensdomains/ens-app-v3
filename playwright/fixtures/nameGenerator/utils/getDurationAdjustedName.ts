/* eslint-disable import/no-extraneous-dependencies */
import { Page } from '@playwright/test'

import type { Name } from '..'

const MIN_REGISTRATION_DURATION = 28 * 24 * 60 * 60 // 24 Days

const getAllDurations = (name: Name): number[] => {
  const duration = name?.duration
  const subnameDurations = name?.subnames?.map((subname) => subname.duration) || []
  return [duration, ...subnameDurations].filter((x) => typeof x === 'number') as number[]
}

const adjustDurations = (name: Name, offset: number): Name => {
  const addDuration = (duration?: number) =>
    typeof duration === 'number' ? duration + offset : undefined
  const subnames = name.subnames?.map((subname) => ({
    ...subname,
    duration: addDuration(subname.duration),
  }))
  return {
    ...name,
    duration: addDuration(name.duration),
    subnames,
  } as Name
}

export const getDurationAdjustedName = async ({
  name,
  page,
}: {
  name: Name
  page: Page
}): Promise<Name> => {
  const allDurations = getAllDurations(name)
  const minDuration = allDurations.length ? Math.min(...allDurations) : Infinity
  console.log(minDuration, MIN_REGISTRATION_DURATION)
  if (minDuration >= MIN_REGISTRATION_DURATION) return name

  const offsetSeconds = MIN_REGISTRATION_DURATION - minDuration
  const offsetMilliseconds = offsetSeconds * 1000
  const fakeNow = Date.now() + offsetMilliseconds

  console.log('fakeNow', fakeNow)
  // Update the Date accordingly in your test pages
  await page.addInitScript(`{
    // Extend Date constructor to default to fakeNow
    Date = class extends Date {
      constructor(...args) {
        if (args.length === 0) {
          super(${fakeNow});
        } else {
          super(...args);
        }
      }
    }
    // Override Date.now() to start from fakeNow
    const __DateNow = Date.now;
    Date.now = () => __DateNow() + ${offsetMilliseconds};
  }`)

  return adjustDurations(name, offsetSeconds)
}
