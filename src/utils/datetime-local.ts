export const dateToDateTimeLocal = (date: Date): string => {
  return new Date(date.getTime() - date.getTimezoneOffset() * 60000).toISOString().slice(0, -1)
}

export const dateTimeLocalToDate = (dateTimeLocal: string): Date => {
  const fakeUtcTime = new Date(`${dateTimeLocal}Z`)
  return new Date(fakeUtcTime.getTime() + fakeUtcTime.getTimezoneOffset() * 60000)
}
