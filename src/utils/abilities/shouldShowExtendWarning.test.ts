import { expect, it } from 'vitest'

import { shouldShowExtendWarning } from './shouldShowExtendWarning'

it('should return true when can send owner', () => {
  expect(shouldShowExtendWarning({ canSendOwner: true } as any)).toBe(true)
})

it('should return false when abilities are empty', () => {
  expect(shouldShowExtendWarning({} as any)).toBe(false)
})

it('should return false when no abilities', () => {
  expect(shouldShowExtendWarning(undefined)).toBe(false)
})

it('should return false when no edit or send abilities', () => {
  expect(shouldShowExtendWarning({ canEdit: false, canSend: false } as any)).toBe(false)
})
