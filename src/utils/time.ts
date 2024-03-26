export const ONE_YEAR = 60 * 60 * 24 * 365

export const secondsToDays = (seconds: number) => Math.floor(seconds / (60 * 60 * 24))

export const secondsToHours = (seconds: number) => Math.floor(seconds / (60 * 60))

export const daysToSeconds = (days: number) => days * 60 * 60 * 24

export const yearsToSeconds = (years: number) => years * ONE_YEAR

export const secondsToYears = (seconds: number) => seconds / ONE_YEAR

export const addOneYear = (duration: number) => duration + ONE_YEAR
