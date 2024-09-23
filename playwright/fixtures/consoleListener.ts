import { Page } from '@playwright/test'

const trackEventConsolePrefix = 'Event triggered on local development'

export function trackConsoleEvents(page: Page, validEventTypesRegex?: RegExp) {
  const events: string[] = []

  page.on('console', (msg) => {
    const message = msg.text()

    if (validEventTypesRegex?.test(message) ?? true) {
      events.push(message.replace(trackEventConsolePrefix, '').trim())
    }
  })

  return events
}
