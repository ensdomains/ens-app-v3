import { useProtectedRoute } from '@app/hooks/useProtectedRoute'
import { Basic } from '@app/layouts/Basic'
import { Button, Typography } from '@ensdomains/thorin'
import type { NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import styled, { css } from 'styled-components'
import { useAccount, useDisconnect } from 'wagmi'

const SectionHeading = styled(Typography)`
  ${({ theme }) => css`
    font-size: ${theme.fontSizes.extraLarge};
  `}
`

const SettingsPage: NextPage = () => {
  const { data: addressData, isLoading } = useAccount()
  const { disconnect } = useDisconnect()

  useProtectedRoute('/', isLoading ? true : addressData)

  return (
    <Basic title="Settings -" heading="Settings" loading={isLoading}>
      <div style={{ flexGrow: '0', height: '0' }} />
      <SectionHeading variant="large" weight="bold">
        <div>Wallet</div>
      </SectionHeading>
      <Button tone="red" onClick={() => disconnect()}>
        Disconnect
      </Button>
    </Basic>
  )
}

export async function getStaticProps({ locale }: { locale: string }) {
  return {
    props: {
      ...(await serverSideTranslations(locale)),
      // Will be passed to the page component as props
    },
  }
}

export default SettingsPage
