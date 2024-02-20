import { useRouter } from 'next/router'
import { ReactElement } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'

import { NameListView } from '@app/components/@molecules/NameListView/NameListView'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'

export default function Page() {
  const { t } = useTranslation('names')
  const router = useRouter()
  const { address, isConnecting, isReconnecting } = useAccount()

  const isLoading = !router.isReady || isConnecting || isReconnecting

  useProtectedRoute('/', isLoading ? true : address && (address as any) !== '')

  return (
    <Content title={t('title')} singleColumnContent loading={isLoading}>
      {{
        trailing: <NameListView address={address} selfAddress={address} />,
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
