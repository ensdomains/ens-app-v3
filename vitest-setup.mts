/* eslint-disable no-undef */
/* eslint-disable import/no-extraneous-dependencies */
import '@testing-library/jest-dom/vitest'

import { afterAll, beforeAll } from 'vitest'

import 'vitest-canvas-mock'

import { WebSocket } from 'ws'

beforeAll(() => {
  // @ts-ignore
  globalThis.WebSocket = WebSocket
})

afterAll(() => {
  // @ts-ignore
  delete globalThis.WebSocket
})
