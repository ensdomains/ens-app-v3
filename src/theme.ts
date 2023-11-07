import 'styled-components'

import { DefaultTheme as ThorinDefaultTheme } from '@ensdomains/thorin2'

declare module 'styled-components' {
  // eslint-disable-next-line @typescript-eslint/no-empty-interface
  interface DefaultTheme extends ThorinDefaultTheme {}
}
