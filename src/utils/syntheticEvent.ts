import React from 'react'

export const createSyntheticEvent = <T extends Element, E extends Event>(
  event: E,
): React.SyntheticEvent<T, E> => {
  let isDefaultPrevented = false
  let isPropagationStopped = false
  const preventDefault = () => {
    isDefaultPrevented = true
    event.preventDefault()
  }
  const stopPropagation = () => {
    isPropagationStopped = true
    event.stopPropagation()
  }
  return {
    nativeEvent: event,
    currentTarget: event.currentTarget as EventTarget & T,
    target: event.target as EventTarget & T,
    bubbles: event.bubbles,
    cancelable: event.cancelable,
    defaultPrevented: event.defaultPrevented,
    eventPhase: event.eventPhase,
    isTrusted: event.isTrusted,
    preventDefault,
    isDefaultPrevented: () => isDefaultPrevented,
    stopPropagation,
    isPropagationStopped: () => isPropagationStopped,
    // eslint-disable-next-line @typescript-eslint/no-empty-function
    persist: () => {},
    timeStamp: event.timeStamp,
    type: event.type,
  }
}

export const createChangeEvent = (value: unknown, name = 'input') => {
  const target = document.createElement('input')
  target.value = value as string
  target.name = name
  const event = new Event('change', { bubbles: true })
  Object.defineProperty(event, 'target', {
    writable: false,
    value: target,
  })
  return createSyntheticEvent(event) as React.ChangeEvent<HTMLInputElement>
}
