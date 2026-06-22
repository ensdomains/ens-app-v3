import { render } from '@app/test-utils'

import { describe, expect, it } from 'vitest'

import { PermissionsTab } from './PermissionsTab'

// SNRC is wrapper-free: there is no NameWrapper and no fuses, so the Permissions
// tab is intentionally inert and renders nothing. The previous suite exercised
// the wrapped-name fuse UI, which no longer exists. Kept as a no-op assertion so
// the component contract stays covered.
describe('<PermissionsTab>', () => {
  it('renders nothing (wrapper-free, no fuses)', () => {
    const { container } = render(
      <PermissionsTab name="test.eth" wrapperData={undefined} isCached={false} />,
    )
    expect(container).toBeEmptyDOMElement()
  })
})
