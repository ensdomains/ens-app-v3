// Optional: configure or set up a testing framework before each test.
// If you delete this file, remove `setupFilesAfterEnv` from `jest.config.js`

// Used for __tests__/testing-library.js
// Learn more: https://github.com/testing-library/jest-dom
import '@testing-library/jest-dom'
import '@testing-library/jest-dom/extend-expect'
import 'jest-localstorage-mock'

// https://github.com/vercel/next.js/issues/26749
jest.mock('next/image', () => ({
  __esModule: true,
  default: () => 'Next image stub', // whatever
}))
