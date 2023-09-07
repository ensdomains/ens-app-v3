import { useRouter } from 'next/router'
import { ReactElement, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address } from 'viem'

import { NameListView } from '@app/components/@molecules/NameListView/NameListView'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import NoProfileSnippet from '@app/components/address/NoProfileSnippet'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import { usePrimaryProfile } from '@app/hooks/usePrimaryProfile'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { shortenAddress } from '@app/utils/utils'

import { useAccountSafely } from '../hooks/account/useAccountSafely'
import { useChainId } from '../hooks/chain/useChainId'

const DetailsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
  `,
)

const TabWrapperWithButtons = styled(TabWrapper)(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: normal;
    justify-content: flex-start;
    width: 100%;
    max-width: 100%;
    background: ${theme.colors.backgroundPrimary};
  `,
)

const EmptyDetailContainer = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['4']};
    display: flex;
    justify-content: center;
    align-items: center;
  `,
)

const Page = () => {
  const { t } = useTranslation('address')
  const router = useRouter()
  const { isReady, query } = router
  const { address: _address } = useAccountSafely()

  const address = query.address as Address
  const chainId = useChainId()
  const isSelf = _address === address

  const { data: primaryProfile, isLoading: isPrimaryProfileLoading } = usePrimaryProfile({
    address,
  })

  const [isError, setIsError] = useState(false)

  const getTextRecord = (key: string) => primaryProfile?.texts?.find((x) => x.key === key)

  const loading = !isReady || isPrimaryProfileLoading

  const error = isError ? t('errors.names') : ''

  return (
    <Content title={shortenAddress(address)} copyValue={address} loading={loading}>
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
                network={chainId}
                button="viewProfile"
                getTextRecord={getTextRecord}
              />
            ) : (
              <NoProfileSnippet />
            )}
          </DetailsContainer>
        ),
        trailing: <NameListView address={address} isSelf={isSelf} setError={setIsError} />,
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}

export default Page
