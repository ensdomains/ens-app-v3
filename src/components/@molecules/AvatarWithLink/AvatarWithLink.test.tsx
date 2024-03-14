import { render, screen } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { AvatarWithLink } from './AvatarWithLink'

describe('AvatarWithLink', () => {
  it('should render', async () => {
    render(<AvatarWithLink label="label" name="test.eth" />)
    expect(screen.getByTestId('avatar-with-link')).toHaveAttribute('href', '/test.eth')
  })
})
