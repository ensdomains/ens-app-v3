import { ReactElement } from 'react'

import { DnsClaim } from '@app/components/pages/import/[name]/DnsClaim'
import { ContentGrid } from '@app/layouts/ContentGrid'

export default function Page() {
  return <DnsClaim />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
