/* eslint-disable @typescript-eslint/naming-convention */

import { PostHogConfig } from 'posthog-js'

export const posthogConfig: {
  apiKey: string
  options: Partial<PostHogConfig>
} = {
  apiKey: process.env.NEXT_PUBLIC_POSTHOG_KEY!,
  options: {
    api_host: process.env.NEXT_PUBLIC_POSTHOG_HOST,
    person_profiles: 'identified_only', // or 'always' to create profiles for anonymous users as well
    autocapture: true,
  },
}
