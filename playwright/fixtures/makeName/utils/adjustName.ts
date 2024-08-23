import type { Name } from '../index.js'

const adjustDurations = (name: Name, offset: number) => {
  const addOffset = (duration?: number) =>
    typeof duration === 'number' ? duration + offset : undefined

  const subnames = name.subnames?.map((subname) => ({
    ...subname,
    duration: addOffset(subname.duration),
  }))

  return {
    ...name,
    duration: addOffset(name.duration),
    subnames,
  } as Name
}

export const adjustName = (names: Name[], offset = 0) => {
  const timestamp = Math.floor(Date.now() / 1000)
  return names.map((name) => {
    const durationAdjustedName = adjustDurations(name, offset)
    const uniqueLabel = `${name.label}-${timestamp}`
    return {
      ...durationAdjustedName,
      label: uniqueLabel,
    } as Name
  })
}
