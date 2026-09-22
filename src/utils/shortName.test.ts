import { labelhash } from 'viem'
import { describe, expect, it } from 'vitest'

import { parseInput } from '@ensdomains/ensjs/utils'

import { getShortNameState, isShortEth2LD, isShortEth2LDName } from './shortName'

const encodedLabelhash = (label: string) => `[${labelhash(label).slice(2)}].eth`

describe('isShortEth2LD', () => {
  it('requires all validation flags to be exactly true', () => {
    expect(
      isShortEth2LD({ name: '12.eth', isValid: true, isETH: true, is2LD: true, isShort: true }),
    ).toBe(true)
    expect(isShortEth2LD({ name: '12.eth', isValid: true, isETH: true, is2LD: true })).toBe(false)
    expect(
      isShortEth2LD({
        name: '12.nick.eth',
        isValid: true,
        isETH: true,
        is2LD: false,
        isShort: true,
      }),
    ).toBe(false)
  })

  // A name that failed validation must keep taking the invalid-name path, not the short-name one.
  it.each([
    [
      'a name that failed validation',
      { name: '12.eth', isValid: false, isETH: true, is2LD: true, isShort: true },
    ],
    [
      'a name whose validation has not resolved',
      { name: '12.eth', isETH: true, is2LD: true, isShort: true },
    ],
    ['an empty validation result', { name: '' }],
  ])('is false for %s', (_label, validation) => {
    expect(isShortEth2LD(validation)).toBe(false)
  })

  // `parseInput` reports `isShort: true` for an unhealed label because there is no output to
  // measure. Trusting it would dead-end every normal-length name the subgraph has not healed yet.
  it('is false for an encoded labelhash, whose label length is not knowable', () => {
    expect(
      isShortEth2LD({
        name: encodedLabelhash('alice'),
        isValid: true,
        isETH: true,
        is2LD: true,
        isShort: true,
      }),
    ).toBe(false)
  })

  // Every call site passes a validation object that carries the name, but one that somehow does
  // not must fail towards leaving a normal name alone rather than towards dead-ending it.
  it('is false when there is no name to check the label of', () => {
    const validationWithoutName = {
      isValid: true,
      isETH: true,
      is2LD: true,
      isShort: true,
    } as Parameters<typeof isShortEth2LD>[0]

    expect(isShortEth2LD(validationWithoutName)).toBe(false)
  })
})

describe('isShortEth2LDName', () => {
  it.each(['a.eth', '12.eth', 'AB.ETH', '%31%32.eth', '💩.eth'])(
    'recognises a normalised short .eth 2LD from %s',
    (name) => {
      expect(isShortEth2LDName(name)).toBe(true)
    },
  )

  it.each(['abc.eth', 'ab.example.eth', 'ab.com', 'bad%name.eth'])(
    'does not classify %s as a short .eth 2LD',
    (name) => {
      expect(isShortEth2LDName(name)).toBe(false)
    },
  )

  it('returns the same answer when the same input is checked repeatedly', () => {
    expect(isShortEth2LDName('on.eth')).toBe(true)
    expect(isShortEth2LDName('on.eth')).toBe(true)
    expect(isShortEth2LDName('nick.eth')).toBe(false)
    expect(isShortEth2LDName('nick.eth')).toBe(false)
  })

  // An encoded labelhash is a label nobody has healed yet, so its length is unknown rather than
  // short — otherwise a normal-length name would lose bulk extension and its renewal flows.
  it('does not classify an encoded labelhash as short, before or after its label is learned', () => {
    const encodedTest = encodedLabelhash('test')

    expect(isShortEth2LDName(encodedTest)).toBe(false)

    // Something else parses `test.eth`, which writes the label into the ensjs store.
    parseInput('test.eth')

    expect(isShortEth2LDName(encodedTest)).toBe(false)
  })

  // The brackets are looked for in the decoded input, so a URL-encoded labelhash — the form a
  // route parameter actually arrives in — is refused the same way.
  it('does not classify a percent-encoded labelhash as short, before or after its label is learned', () => {
    const encodedAlice = `%5B${labelhash('alice').slice(2)}%5D.eth`

    expect(isShortEth2LDName(encodedAlice)).toBe(false)

    parseInput('alice.eth')

    expect(isShortEth2LDName(encodedAlice)).toBe(false)
  })

  // The deliberate cost of that rule: an encoded form of a genuinely short label reads as normal.
  // It fails open — towards the behaviour every other name gets — and the decoded form the app
  // displays and passes around once the label is known is still short.
  it('leaves an encoded short label not-short while its decoded form is short', () => {
    const encodedZq = encodedLabelhash('zq')

    expect(isShortEth2LDName(encodedZq)).toBe(false)

    parseInput('zq.eth')

    expect(isShortEth2LDName(encodedZq)).toBe(false)
    expect(isShortEth2LDName('zq.eth')).toBe(true)
  })

  // Same answer for an input first seen after its label was learned, so what the label store knows
  // when a name is first checked cannot change what any caller is told about it.
  it('leaves an encoded short label not-short when its label was already known', () => {
    parseInput('qy.eth')
    const encodedQy = encodedLabelhash('qy')

    // ensjs can measure this one and calls it short; the encoded form still does not.
    expect(parseInput(encodedQy).isShort).toBe(true)
    expect(isShortEth2LDName(encodedQy)).toBe(false)
  })
})

describe('getShortNameState', () => {
  const validation = {
    name: 'on.eth',
    isValid: true,
    isETH: true,
    is2LD: true,
    isShort: true,
  } as const

  it('should be notShort for any name at or above the minimum length', () => {
    expect(
      getShortNameState({
        validation: { ...validation, name: 'nick.eth', isShort: false },
        registrationStatus: 'available',
      }),
    ).toBe('notShort')
  })

  it('should be notShort for a name whose label has not been healed', () => {
    expect(
      getShortNameState({
        validation: { ...validation, name: encodedLabelhash('alice') },
        registrationStatus: 'registered',
      }),
    ).toBe('notShort')
  })

  it('should be pending while the ownership lookup has not answered', () => {
    expect(getShortNameState({ validation, registrationStatus: undefined })).toBe('pending')
  })

  it('should be pending when the status only reflects missing ownership data', () => {
    expect(getShortNameState({ validation, registrationStatus: 'invalid' })).toBe('pending')
  })

  it('should be unregistered for a short name the registrar has never issued', () => {
    expect(getShortNameState({ validation, registrationStatus: 'short' })).toBe('unregistered')
  })

  it.each(['registered', 'gracePeriod', 'desynced'] as const)(
    'should be registered for a short name reported as %s',
    (registrationStatus) => {
      expect(getShortNameState({ validation, registrationStatus })).toBe('registered')
    },
  )
})
