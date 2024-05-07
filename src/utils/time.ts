export const ONE_HOUR = 60 * 60

export const ONE_YEAR = ONE_HOUR * 24 * 365

export const ONE_DAY = ONE_HOUR * 24

export const secondsToDays = (seconds: number) => Math.floor(seconds / ONE_DAY)

export const secondsToHours = (seconds: number) => Math.floor(seconds / ONE_HOUR)

export const daysToSeconds = (days: number) => days * ONE_HOUR * 24

export const yearsToSeconds = (years: number) => years * ONE_YEAR

export const secondsToYears = (seconds: number) => seconds / ONE_YEAR
