/* eslint-disable @typescript-eslint/no-unused-vars */
import { useRouter } from 'next/router'
import { ReactElement } from 'react'

import { ContentGrid } from '@app/layouts/ContentGrid'
import DNSClaim from '@app/components/pages/profile/[name]/DNSClaim/DNSClaim'
import ProfilePage from '@app/components/pages/profile/[name]/Profile'

const isDNSName = (name: string): boolean => {
  const labels = name?.split('.')

  return !!labels && labels[labels.length - 1] !== 'eth'
}

export default function Page() {
  const router = useRouter()
  const name = router.query.name as string

  const isDNS = isDNSName(name)

  return isDNS ? <DNSClaim /> : <ProfilePage />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
