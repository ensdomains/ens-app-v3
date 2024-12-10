import { fireEvent, render, renderHook, screen } from '@app/test-utils'

import { useState } from 'react'
import { describe, expect, it } from 'vitest'

import { makeMockIntersectionObserver } from '../../../../../test/mock/makeMockIntersectionObserver'
import { NameConfirmationWarningView } from './NameConfirmationWarningView'

makeMockIntersectionObserver()

describe('NameConfirmationWarningView', () => {
  it('should disable if input does not match the name', () => {
    const { result: hook } = renderHook(() => useState(false))

    const { getByTestId } = render(
      <NameConfirmationWarningView
        name="test.eth"
        expiry={new Date()}
        setDisabled={hook.current[1]}
      />,
    )

    const input = getByTestId('input-name-confirmation')

    fireEvent.change(input, { target: { value: 'smth.eth' } })

    expect(hook.current[0]).toBe(true)
  })
  it('should enable if name matches', () => {
    const { result: hook } = renderHook(() => useState(false))

    const { getByTestId } = render(
      <NameConfirmationWarningView
        name="test.eth"
        expiry={new Date()}
        setDisabled={hook.current[1]}
      />,
    )

    const input = getByTestId('input-name-confirmation')

    fireEvent.change(input, { target: { value: 'test.eth' } })

    expect(hook.current[0]).toBe(false)
  })
})
