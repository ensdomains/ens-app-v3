import { describe, expect, it } from 'vitest'

import { validateAccount } from './validateAccount'

describe('validateAccount', () => {
  const testCases = [
    // Twitter tests
    {
      description: 'Valid Twitter username',
      key: 'com.twitter',
      value: 'valid_username',
      expected: true,
    },
    {
      description: 'Invalid Twitter username with special char',
      key: 'com.twitter',
      value: 'invalid_username!',
      expected: false,
    },
    {
      description: 'Invalid Twitter username with spaces',
      key: 'com.twitter',
      value: 'bad twitter',
      expected: false,
    },
    {
      description: 'Invalid Twitter username with special chars',
      key: 'com.twitter',
      value: 'bad@twitter',
      expected: false,
    },
    {
      description: 'Max length Twitter username',
      key: 'com.twitter',
      value: 'a'.repeat(15),
      expected: true,
    },
    {
      description: 'Too long Twitter username',
      key: 'com.twitter',
      value: 'a'.repeat(16),
      expected: false,
    },
    {
      description: 'Twitter username with 1 character',
      key: 'com.twitter',
      value: 'a',
      expected: true,
    },
    {
      description: 'Twitter username with mixed case',
      key: 'com.twitter',
      value: 'Valid_User',
      expected: true,
    },

    // GitHub tests
    {
      description: 'Valid GitHub username',
      key: 'com.github',
      value: 'valid-username',
      expected: true,
    },
    {
      description: 'Invalid GitHub username',
      key: 'com.github',
      value: 'invalid_username',
      expected: false,
    },
    {
      description: 'Invalid GitHub username starting with hyphen',
      key: 'com.github',
      value: '-badgithub',
      expected: false,
    },
    {
      description: 'Invalid GitHub username with consecutive hyphens',
      key: 'com.github',
      value: 'bad--github',
      expected: false,
    },
    {
      description: 'Max length GitHub username',
      key: 'com.github',
      value: 'a'.repeat(39),
      expected: true,
    },
    {
      description: 'Too long GitHub username',
      key: 'com.github',
      value: 'a'.repeat(40),
      expected: false,
    },
    {
      description: 'GitHub username ending with hyphen',
      key: 'com.github',
      value: 'valid-',
      expected: true,
    },
    {
      description: 'Single-character GitHub username',
      key: 'com.github',
      value: 'a',
      expected: true,
    },
    {
      description: 'GitHub username with a hyphen',
      key: 'com.github',
      value: 'valid-username',
      expected: true,
    },
    {
      description: 'GitHub username with a hyphen and mixed case',
      key: 'com.github',
      value: 'Valid-Username',
      expected: true,
    },
    {
      description: 'GitHub username with hyphen',
      key: 'com.github',
      value: 'Valid-Username-123-456',
      expected: true,
    },
    {
      description: 'Invalid empty string GitHub username',
      key: 'com.github',
      value: '',
      expected: false,
    },

    // Discord tests
    {
      description: 'Valid Discord username',
      key: 'com.discord',
      value: 'valid_username',
      expected: true,
    },
    {
      description: 'Discord username shorter than min length',
      key: 'com.discord',
      value: 'a',
      expected: false,
    },
    {
      description: 'Discord username with consecutive periods',
      key: 'com.discord',
      value: 'bad..discord',
      expected: false,
    },
    {
      description: 'Max length Discord username',
      key: 'com.discord',
      value: 'a'.repeat(32),
      expected: true,
    },
    {
      description: 'Too long Discord username',
      key: 'com.discord',
      value: 'a'.repeat(33),
      expected: false,
    },
    {
      description: 'Discord username with underscore and dash',
      key: 'com.discord',
      value: 'valid_username-123',
      expected: false,
    },
    {
      description: 'Discord username with mixed case',
      key: 'com.discord',
      value: 'Valid_Username',
      expected: false,
    },

    // Telegram tests
    {
      description: 'Valid Telegram username',
      key: 'org.telegram',
      value: 'valid_username',
      expected: true,
    },
    {
      description: 'Invalid Telegram username',
      key: 'org.telegram',
      value: 'invalid_username!',
      expected: false,
    },
    {
      description: 'Telegram username shorter than min length',
      key: 'org.telegram',
      value: 'a'.repeat(4),
      expected: false,
    },
    {
      description: 'Max length Telegram username',
      key: 'org.telegram',
      value: 'a'.repeat(32),
      expected: true,
    },
    {
      description: 'Too long Telegram username',
      key: 'org.telegram',
      value: 'a'.repeat(33),
      expected: false,
    },
    {
      description: 'Telegram username with mixed case',
      key: 'org.telegram',
      value: 'Valid_Username',
      expected: true,
    },
    {
      description: 'Telegram username with only underscores',
      key: 'org.telegram',
      value: '_____',
      expected: true,
    },

    // Email tests
    { description: 'Valid email', key: 'email', value: 'test@example.com', expected: true },
    { description: 'Invalid email', key: 'email', value: 'invalid_email', expected: false },
    { description: 'Email without @', key: 'email', value: 'bademail.com', expected: false },
    { description: 'Email without domain', key: 'email', value: 'bad@email', expected: false },
    {
      description: 'Email with tld and country tld',
      key: 'email',
      value: 'test@example.com.tw',
      expected: true,
    },

    // Test for unknown key
    { description: 'True for unknown key', key: 'unknown', value: 'value', expected: true },
  ]

  testCases.forEach(({ description, key, value, expected }) => {
    it(description, () => {
      expect(validateAccount({ key, value })).toBe(expected)
    })
  })
})
