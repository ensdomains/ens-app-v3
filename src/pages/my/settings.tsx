import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { DevSection } from '@app/components/pages/profile/settings/DevSection'
import { PrimarySection } from '@app/components/pages/profile/settings/PrimarySection'
import { TransactionSection } from '@app/components/pages/profile/settings/TransactionSection/TransactionSection'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Content } from '@app/layouts/Content'

const OtherWrapper = styled.div(
  ({ theme }) => css`
    grid-area: other;
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    align-items: stretch;
    gap: ${theme.space['3']};
    flex-gap: ${theme.space['3']};
  `,
)

export default function Page() {
  const { t } = useTranslation('settings')
  const router = useRouter()
  const { address, isConnecting, isReconnecting } = useAccount()

  const isLoading = !router.isReady || isConnecting || isReconnecting

  useProtectedRoute('/', isLoading ? true : address)

  const showDevPanel =
    process.env.NEXT_PUBLIC_ENSJS_DEBUG ||
    process.env.NODE_ENV === 'development' ||
    process.env.NEXT_PUBLIC_PROVIDER

  return (
    <Content singleColumnContent title={t('title')}>
      {{
        trailing: (
          <OtherWrapper>
            <PrimarySection />
            <TransactionSection />
            {showDevPanel && <DevSection />}
          </OtherWrapper>
        ),
      }}
    </Content>
  )
}
