import { describe, expect, it } from 'vitest'

import { supportedGeneralRecordKeys } from '@app/constants/supportedGeneralRecordKeys'

import { textIcons } from './DynamicTextIcon'

describe('DynamicTextIcon', () => {
  // General-group records route through DynamicIcon -> DynamicTextIcon. Any key
  // without a `textIcons` entry renders the QuestionCircleSVG fallback (the "?"
  // placeholder). Every supported general key must therefore have a dedicated
  // icon; this guards against adding a new general record without one (WEB-155).
  it.each([...supportedGeneralRecordKeys])(
    'renders a dedicated icon (not the question-mark fallback) for general record "%s"',
    (key) => {
      expect(key in textIcons).toBe(true)
    },
  )
})
