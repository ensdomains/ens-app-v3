import Head from 'next/head'
import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address } from 'viem'
import { useChainId } from 'wagmi'

import { NameListView } from '@app/components/@molecules/NameListView/NameListView'
import NoProfileSnippet from '@app/components/address/NoProfileSnippet'
import { Outlink } from '@app/components/Outlink'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { usePrimaryProfile } from '@app/hooks/usePrimaryProfile'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { OG_IMAGE_URL } from '@app/utils/constants'
import { createEtherscanLink, shortenAddress } from '@app/utils/utils'

import { useAccountSafely } from '../hooks/account/useAccountSafely'

const DetailsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
  `,
)

const Page = () => {
  const { t } = useTranslation('address')
  const router = useRouter()
  const { isReady, query } = router
  const { address: _address } = useAccountSafely()

  const address = query.address as Address

  const { data: primaryProfile, isLoading: isPrimaryProfileLoading } = usePrimaryProfile({
    address,
  })

  const [isError, setIsError] = useState(false)

  const getTextRecord = (key: string) => primaryProfile?.texts?.find((x) => x.key === key)

  const loading = !isReady || isPrimaryProfileLoading

  const error = isError ? t('errors.names') : ''

  const shortenedAddress = shortenAddress(address)
  const titleContent = t('meta.title', { address: shortenedAddress })
  const descriptionContent = t('meta.description', { address })
  const ogImageUrl = `${OG_IMAGE_URL}/address/${address}`

  const chainId = useChainId()

  return (
    <>
      <Head>
        <title>{titleContent}</title>
        <meta name="description" content={descriptionContent} />
        <meta property="og:image" content={ogImageUrl} />
        <meta property="og:title" content={titleContent} />
        <meta property="og:description" content={descriptionContent} />
        <meta property="twitter:image" content={ogImageUrl} />
        <meta property="twitter:title" content={titleContent} />
        <meta property="twitter:description" content={descriptionContent} />
      </Head>
      <Content noTitle title={shortenedAddress} copyValue={address} loading={loading}>
        {{
          warning: error
            ? {
                type: 'warning',
                message: error,
              }
            : undefined,
          leading: (
            <DetailsContainer>
              {primaryProfile?.name ? (
                <ProfileSnippet
                  name={primaryProfile.name}
                  button="viewProfile"
                  getTextRecord={getTextRecord}
                />
              ) : (
                <NoProfileSnippet />
              )}
            </DetailsContainer>
          ),
          titleExtra: (
            <Outlink
              fontVariant="bodyBold"
              href={createEtherscanLink({ data: address, chainId, route: 'address' })}
            >
              {t('etherscan', { ns: 'common' })}
            </Outlink>
          ),
          trailing: <NameListView address={address} selfAddress={_address} setError={setIsError} />,
        }}
      </Content>
    </>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}

export default Page
