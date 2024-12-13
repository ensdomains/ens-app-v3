'use client'

import { PostHogProvider } from 'posthog-js/react'

import { posthogConfig } from './config'

export function Posthog({ children }: React.PropsWithChildren) {
  return (
    <PostHogProvider apiKey={posthogConfig.apiKey} options={posthogConfig.options}>
      {children}
    </PostHogProvider>
  )
}
