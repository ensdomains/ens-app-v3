export const stripDateMs = (dateTimeLocal: string): string => {
  return dateTimeLocal.slice(0, -4)
}

export const dateToDateTimeLocal = (date: Date, stripMs?: boolean): string => {
  const str = new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, -1)
  return stripMs ? stripDateMs(str) : str
}

export const dateTimeLocalToDate = (dateTimeLocal: string): Date => {
  const fakeUtcTime = new Date(`${dateTimeLocal}Z`)
  return new Date(fakeUtcTime.getTime() + fakeUtcTime.getTimezoneOffset() * 60000)
}
