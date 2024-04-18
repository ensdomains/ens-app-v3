import { ReactElement } from 'react'

import { DotBox } from '@app/components/pages/dotbox/[name]/DotBoxRegistration'
import { ContentGrid } from '@app/layouts/ContentGrid'

export default function Page() {
  return <DotBox />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
