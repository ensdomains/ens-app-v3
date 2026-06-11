// SNRC: all third-party analytics/trackers removed. These exports are kept as
// no-ops so the (now untracked) call sites continue to type-check without
// touching every component. Nothing is loaded or sent.

// eslint-disable-next-line @typescript-eslint/no-unused-vars
export const trackEvent = async (_type: string, _chain: string, _customProperties?: any) => {}
