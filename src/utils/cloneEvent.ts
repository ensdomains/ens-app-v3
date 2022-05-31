import { SyntheticEvent } from 'react'

export const cloneEvent = (
  event: SyntheticEvent<Element, Event>,
  value: unknown,
  name?: string,
) => {
  const nativeEvent = event.nativeEvent || event
  if (!nativeEvent.constructor) return event

  const clonedEvent = new (nativeEvent as any).constructor(
    nativeEvent.type,
    nativeEvent,
  )

  Object.defineProperties(clonedEvent, {
    target: {
      writable: true,
      value: { value, name },
    },
    currentTarget: {
      writable: true,
      value: {
        value,
        name,
      },
    },
  })

  return clonedEvent
}
