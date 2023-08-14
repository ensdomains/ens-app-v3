import { shouldShowExtendWarning } from "./shouldShowExtendWarning"

it('should return true when can edit', () => {
  expect(shouldShowExtendWarning({ canEdit: true } as any)).toBe(true)
})

it('should return true when can send', () => {
  expect(shouldShowExtendWarning({ canSend: true } as any)).toBe(true)
})

it('should return false when no abilities', () => {
  expect(shouldShowExtendWarning(undefined)).toBe(false)
})

it('should return false when no edit or send abilities', () => {
  expect(shouldShowExtendWarning({ canEdit: false, canSend: false } as any)).toBe(false)
})