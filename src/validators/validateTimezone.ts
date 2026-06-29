import { isValidTimezone } from '@app/utils/getTimezoneOffset'

/**
 * Validates a `timezone` text record value. An empty value is valid (it clears the
 * record); a non-empty value must be a zone the runtime can resolve. The editor's
 * picker only offers canonical IANA zones, so this mainly guards the free-text and
 * programmatic paths.
 */
export const validateTimezone = (value?: string): boolean => {
  if (!value) return true
  return isValidTimezone(value)
}
