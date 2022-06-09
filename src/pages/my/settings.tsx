import { DevSection } from '@app/components/settings/DevSection'
import { TransactionSection } from '@app/components/settings/TransactionSection'
import { WalletSection } from '@app/components/settings/WalletSection'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Content } from '@app/layouts/Content'
import type { NextPage } from 'next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

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

const SettingsPage: NextPage = () => {
  const { data: addressData, isLoading } = useAccount()

  useProtectedRoute('/', isLoading ? true : addressData)

  return (
    <Content title="Settings" spacing="1fr 1fr">
      {{
        leading: <TransactionSection />,
        trailing: (
          <OtherWrapper>
            <WalletSection />
            {process.env.NEXT_PUBLIC_PROVIDER && <DevSection />}
          </OtherWrapper>
        ),
      }}
    </Content>
  )
}

export default SettingsPage
