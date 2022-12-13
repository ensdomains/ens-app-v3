import { ReactElement } from 'react'

import MyNames from '@app/components/pages/my/names/MyNames'
import { ContentGrid } from '@app/layouts/ContentGrid'

export default function Page() {
  return <MyNames />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
