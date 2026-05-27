import { ReactElement } from 'react'

import { ContentGrid } from '@app/layouts/ContentGrid'

export default function Page() {
  return null
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
