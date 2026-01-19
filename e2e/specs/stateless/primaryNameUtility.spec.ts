import { expect } from '@playwright/test'

import { test } from '../../../playwright'

test.describe('Primary Name Utility Functions', () => {
  test.describe('setPrimaryNameState', () => {
    test('should set L1 primary name only', async ({ makeName, primaryName }) => {
      const name = await makeName({
        label: 'l1-only-test',
        type: 'legacy',
        owner: 'user',
      })

      // Clear any existing state
      await primaryName.clearAll('user')

      // Set only L1
      await primaryName.setState({
        user: 'user',
        state: { l1: name },
      })

      const state = await primaryName.getState('user')
      expect(state.l1).toBe(name)
      expect(state.default).toBeFalsy()
    })

    test('should set default primary name only', async ({ makeName, primaryName }) => {
      const name = await makeName({
        label: 'default-only-test',
        type: 'legacy',
        owner: 'user',
      })

      // Clear any existing state
      await primaryName.clearAll('user')

      // Set only default
      await primaryName.setState({
        user: 'user',
        state: { default: name },
      })

      const state = await primaryName.getState('user')
      expect(state.l1).toBeFalsy()
      expect(state.default).toBe(name)
    })

    test('should set both L1 and default primary names', async ({ makeName, primaryName }) => {
      const name = await makeName({
        label: 'both-test',
        type: 'legacy',
        owner: 'user',
      })

      // Clear any existing state
      await primaryName.clearAll('user')

      // Set both registries
      await primaryName.setState({
        user: 'user',
        state: { l1: name, default: name },
      })

      const state = await primaryName.getState('user')
      expect(state.l1).toBe(name)
      expect(state.default).toBe(name)
    })

    test('should set different names in L1 and default registries', async ({
      makeName,
      primaryName,
    }) => {
      const [name1, name2] = await makeName([
        { label: 'l1-name', type: 'legacy', owner: 'user' },
        { label: 'default-name', type: 'legacy', owner: 'user' },
      ])

      // Clear any existing state
      await primaryName.clearAll('user')

      // Set different names
      await primaryName.setState({
        user: 'user',
        state: { l1: name1, default: name2 },
      })

      const state = await primaryName.getState('user')
      expect(state.l1).toBe(name1)
      expect(state.default).toBe(name2)
    })

    test('should clear L1 primary name', async ({ makeName, primaryName }) => {
      const name = await makeName({
        label: 'clear-l1-test',
        type: 'legacy',
        owner: 'user',
      })

      // Set L1 first
      await primaryName.setState({
        user: 'user',
        state: { l1: name, default: '' },
      })

      // Verify it's set
      let state = await primaryName.getState('user')
      expect(state.l1).toBe(name)

      // Clear L1
      await primaryName.setState({
        user: 'user',
        state: { l1: '' },
      })

      state = await primaryName.getState('user')
      expect(state.l1).toBeFalsy()
    })

    test('should clear default primary name', async ({ makeName, primaryName }) => {
      const name = await makeName({
        label: 'clear-default-test',
        type: 'legacy',
        owner: 'user',
      })

      // Set default first
      await primaryName.setState({
        user: 'user',
        state: { l1: '', default: name },
      })

      // Verify it's set
      let state = await primaryName.getState('user')
      expect(state.default).toBe(name)

      // Clear default
      await primaryName.setState({
        user: 'user',
        state: { default: '' },
      })

      state = await primaryName.getState('user')
      expect(state.default).toBeFalsy()
    })

    test('should not modify L1 when only default is specified', async ({
      makeName,
      primaryName,
    }) => {
      const [l1Name, defaultName] = await makeName([
        { label: 'preserve-l1', type: 'legacy', owner: 'user' },
        { label: 'new-default', type: 'legacy', owner: 'user' },
      ])

      // Set initial L1 state
      await primaryName.setState({
        user: 'user',
        state: { l1: l1Name, default: '' },
      })

      // Only modify default (l1 should remain)
      await primaryName.setState({
        user: 'user',
        state: { default: defaultName },
      })

      const state = await primaryName.getState('user')
      expect(state.l1).toBe(l1Name)
      expect(state.default).toBe(defaultName)
    })

    test('should not modify default when only L1 is specified', async ({
      makeName,
      primaryName,
    }) => {
      const [l1Name, defaultName] = await makeName([
        { label: 'new-l1', type: 'legacy', owner: 'user' },
        { label: 'preserve-default', type: 'legacy', owner: 'user' },
      ])

      // Set initial default state
      await primaryName.setState({
        user: 'user',
        state: { l1: '', default: defaultName },
      })

      // Only modify L1 (default should remain)
      await primaryName.setState({
        user: 'user',
        state: { l1: l1Name },
      })

      const state = await primaryName.getState('user')
      expect(state.l1).toBe(l1Name)
      expect(state.default).toBe(defaultName)
    })
  })

  test.describe('clearAllPrimaryNames', () => {
    test('should clear both L1 and default primary names', async ({ makeName, primaryName }) => {
      const name = await makeName({
        label: 'clear-all-test',
        type: 'legacy',
        owner: 'user',
      })

      // Set both
      await primaryName.setState({
        user: 'user',
        state: { l1: name, default: name },
      })

      // Verify both are set
      let state = await primaryName.getState('user')
      expect(state.l1).toBe(name)
      expect(state.default).toBe(name)

      // Clear all
      await primaryName.clearAll('user')

      state = await primaryName.getState('user')
      expect(state.l1).toBeFalsy()
      expect(state.default).toBeFalsy()
    })
  })

  test.describe('getPrimaryNameState', () => {
    test('should return falsy for both when no primary names are set', async ({ primaryName }) => {
      await primaryName.clearAll('user')

      const state = await primaryName.getState('user')
      expect(state.l1).toBeFalsy()
      expect(state.default).toBeFalsy()
    })

    test('should correctly distinguish L1 source from default source', async ({
      makeName,
      primaryName,
    }) => {
      const [l1Name, defaultName] = await makeName([
        { label: 'source-l1', type: 'legacy', owner: 'user' },
        { label: 'source-default', type: 'legacy', owner: 'user' },
      ])

      await primaryName.setState({
        user: 'user',
        state: { l1: l1Name, default: defaultName },
      })

      const state = await primaryName.getState('user')

      // L1 and default should be different names
      expect(state.l1).toBe(l1Name)
      expect(state.default).toBe(defaultName)
      expect(state.l1).not.toBe(state.default)
    })
  })
})
