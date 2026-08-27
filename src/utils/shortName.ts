import { checkIsDecrypted, parseInput } from '@ensdomains/ensjs/utils'

import type { RegistrationStatus } from './registrationStatus'

type ShortEthNameValidation = {
  isETH?: boolean
  is2LD?: boolean
  isShort?: boolean
  isValid?: boolean
  /**
   * The name the other flags were measured from — `useValidate`'s `name`, which `useBasicName` and
   * `useNameDetails` both spread into their results. Required so that no call site can drop the
   * unknown-label check by accident.
   */
  name: string
}

/**
 * Whether the app can read the labels of the name it is holding. A label the subgraph has not healed
 * arrives as an encoded labelhash (`[<64 hex chars>].eth`), and an unhealed label has no output to
 * measure, which `parseInput` reports as `isShort: true`. That is a statement about what is known,
 * not about the label's length, so shortness is only ever asserted for a label the app can actually
 * read: an unknown one keeps normal-name behaviour — including every renewal path — until
 * `useDecodedName` heals it, which is the same condition this asks.
 *
 * `getRegistrationStatus` asks it too, for the stronger reason that an unknown label cannot be
 * judged registerable at all.
 */
export const isKnownLabel = (name: string | undefined) => !!name && checkIsDecrypted(name)

/**
 * The `.eth` registrar enforces a three character minimum label in `register()`, so a shorter 2LD
 * can never be registered. A handful predate that rule and are real, owned names (`on.eth`), which
 * is why this is only a statement about the label, never about whether the name exists. `renew()`
 * carries no such minimum — renewal is deliberately not offered in the app for these names as
 * product policy, see WEB-1235.
 */
export const isShortEth2LD = ({ isETH, is2LD, isShort, isValid, name }: ShortEthNameValidation) =>
  isValid === true && isETH === true && is2LD === true && isShort === true && isKnownLabel(name)

/**
 * Memoised because `parseInput` normalises the label and writes it into the `ensjs:labels`
 * localStorage store on every call, which is far too costly for a per-row, per-render check. Every
 * answer is a pure function of the input string — an encoded labelhash answers the same whether or
 * not its label is known — so nothing cached here can go stale as the label store learns labels.
 */
const shortEth2LDNameCache = new Map<string, boolean>()

const parseIsShortEth2LDName = (input: string) => {
  let decodedInput: string
  try {
    decodedInput = decodeURIComponent(input)
  } catch {
    return false
  }

  try {
    const { isShort, isValid, is2LD, isETH } = parseInput(decodedInput)
    // The name judged is the one the caller passed rather than what `parseInput` resolved it to:
    // an encoded labelhash whose label is later learned to be `on` still answers not-short in that
    // form, because nothing that held that form could have known. Its decoded `on.eth` — the form
    // the app displays and passes here once the label is known — is short by the ordinary rule.
    return isShortEth2LD({ isShort, isValid, is2LD, isETH, name: decodedInput })
  } catch {
    return false
  }
}

export const isShortEth2LDName = (input: string) => {
  const cached = shortEth2LDNameCache.get(input)
  if (cached !== undefined) return cached

  const result = parseIsShortEth2LDName(input)
  shortEth2LDNameCache.set(input, result)
  return result
}

/**
 * What a short `.eth` 2LD is, from the app's point of view. `12.eth` and `on.eth` are
 * indistinguishable until the ownership and expiry lookups resolve, so `pending` exists to stop
 * surfaces flashing either a profile or a dead-end error before that answer arrives.
 */
export type ShortNameState = 'notShort' | 'pending' | 'unregistered' | 'registered'

export const getShortNameState = ({
  validation,
  registrationStatus,
}: {
  validation: ShortEthNameValidation
  registrationStatus?: RegistrationStatus
}): ShortNameState => {
  if (!isShortEth2LD(validation)) return 'notShort'
  if (registrationStatus === 'short') return 'unregistered'
  // `invalid` is what the status model reports while the ownership lookup is disabled or has not
  // been made — no answer yet, rather than evidence that the name is real.
  if (!registrationStatus || registrationStatus === 'invalid') return 'pending'
  return 'registered'
}
