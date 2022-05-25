import { NameSnippetMobile } from '@app/components/profile/NameSnippetMobile'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { Basic } from '@app/layouts/Basic'
import type { GetStaticPaths, NextPage } from 'next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import { useAccount, useNetwork } from 'wagmi'

const NameDetails: NextPage = () => {
  const router = useRouter()
  const name = router.query.name as string

  const { activeChain: chain } = useNetwork()
  const { data: accountData, isLoading: accountLoading } = useAccount()
  const address = accountData?.address

  const {
    normalisedName,
    expiryDate,
    ownerData,
    isLoading: detailsLoading,
  } = useNameDetails(name)

  const canSend = useMemo(() => {
    if (!address || !ownerData) return false
    if (
      ownerData.registrant === address ||
      (!ownerData.registrant && ownerData.owner === address)
    ) {
      return true
    }
  }, [address, ownerData])

  const isLoading = detailsLoading || accountLoading

  return (
    <Basic
      heading={normalisedName}
      subheading="Name Details"
      loading={isLoading}
      title={`${normalisedName} - `}
    >
      <div>
        <NameSnippetMobile
          expiryDate={expiryDate}
          name={normalisedName}
          network={chain?.name!}
          canSend={canSend}
        />
      </div>
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

export const getStaticPaths: GetStaticPaths<{ slug: string }> = async () => {
  return {
    paths: [],
    fallback: 'blocking',
  }
}

export default NameDetails
