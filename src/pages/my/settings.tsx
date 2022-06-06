import { DevSection } from '@app/components/settings/DevSection'
import { TransactionSection } from '@app/components/settings/TransactionSection'
import { WalletSection } from '@app/components/settings/WalletSection'
import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Basic } from '@app/layouts/Basic'
import mq from '@app/mediaQuery'
import type { NextPage } from 'next'
import { useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

const WrapperGrid = styled.div<{ $hasError?: boolean }>`
  flex-grow: 1;
  width: 100%;
  display: grid;
  grid-template-columns: 1fr;
  grid-template-rows: min-content;
  align-items: flex-start;
  gap: ${({ theme }) => theme.space['5']};
  align-self: center;
  grid-template-areas: 'transactions transactions' 'other other';
  ${mq.lg.min`
      grid-template-areas: "transactions other";
      grid-template-columns: 1fr 1fr;
    `}
`

const OtherWrapper = styled.div`
  grid-area: other;
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  align-items: stretch;
  gap: ${({ theme }) => theme.space['3']};
  flex-gap: ${({ theme }) => theme.space['3']};
`

const SettingsPage: NextPage = () => {
  const { t } = useTranslation('settings')
  const { data: addressData, isLoading } = useAccount()

  useProtectedRoute('/', isLoading ? true : addressData)

  return (
    <Basic title={`${t('title')} -`} heading={t('title')} loading={isLoading}>
      <WrapperGrid>
        <TransactionSection />
        <OtherWrapper>
          <WalletSection />
          {process.env.NEXT_PUBLIC_PROVIDER && <DevSection />}
        </OtherWrapper>
      </WrapperGrid>
    </Basic>
  )
}

export default SettingsPage
