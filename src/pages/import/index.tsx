import { ReactElement } from 'react'

import DNSClaim from '@app/components/pages/import/[name]/DNSClaim'
import { ContentGrid } from '@app/layouts/ContentGrid'

export default function Page() {
  return <DNSClaim />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
