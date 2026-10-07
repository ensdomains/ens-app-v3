import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest'

const POSTHOG_TOKEN = 'phc_toolbar_test'
const TOOLBAR_PARAMS_KEY = '_postHogToolbarParams'

type PostHogWindow = Window &
  typeof globalThis & {
    __PosthogExtensions__?: {
      loadExternalDependency?: (...args: unknown[]) => void
    }
  }

describe('PostHog toolbar patch', () => {
  beforeEach(() => {
    vi.resetModules()
    localStorage.clear()
    history.replaceState(null, '', '/')
    delete (window as PostHogWindow).__PosthogExtensions__
  })

  afterEach(() => {
    history.replaceState(null, '', '/')
    localStorage.clear()
    delete (window as PostHogWindow).__PosthogExtensions__
  })

  it('does not load the toolbar when authorized through the URL hash', async () => {
    const toolbarState = btoa(
      JSON.stringify({
        action: 'ph_authorize',
        token: POSTHOG_TOKEN,
      }),
    )
    history.replaceState(null, '', `/#__posthog=${encodeURIComponent(toolbarState)}`)

    const { default: posthog } = await import('posthog-js')
    const loadExternalDependency = vi.fn()
    const posthogWindow = window as PostHogWindow

    posthogWindow.__PosthogExtensions__ = {
      ...posthogWindow.__PosthogExtensions__,
      loadExternalDependency,
    }
    posthog.config.token = POSTHOG_TOKEN

    expect(posthog.toolbar.maybeLoadToolbar()).toBe(false)
    expect(loadExternalDependency).not.toHaveBeenCalled()
    expect(localStorage.getItem(TOOLBAR_PARAMS_KEY)).toBeNull()
  })
})
