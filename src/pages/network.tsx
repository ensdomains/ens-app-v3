import { NextPage } from 'next'
import { Basic } from '@app/layouts/Basic'
import React, { useMemo } from 'react'
import { gql, useQuery } from '@apollo/client'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'
import { getAcceptedNetworkIds } from '@app/setup'
import { getNetworkNameFromId } from '@app/utils/utils'
import styled from 'styled-components'
import { capitalize } from 'lodash'

const REACT_VAR_LISTENERS = gql`
  query reactiveVarListeners @client {
    globalError
    networkId
    network
    isAppReady
  }
`
const MessageContainer = styled.div`
  display: flex;
  justify-content: center;
`

const NetworkPage: NextPage = () => {
  const { t } = useTranslation('network')

  const {
    data: { globalError, isAppReady },
  } = useQuery(REACT_VAR_LISTENERS)

  const isLoading = !isAppReady && !globalError.network
  const isAcceptedNetwork = !globalError.network

  const accepted: string = useMemo(() => {
    return getAcceptedNetworkIds()
      .map(getNetworkNameFromId)
      .map(capitalize)
      .join(', ')
  }, [])

  return (
    <Basic title={t('title')} loading={isLoading}>
      {isAcceptedNetwork ? (
        <MessageContainer>{t('successMessage')}</MessageContainer>
      ) : (
        <MessageContainer>{t('errorMessage', { accepted })}</MessageContainer>
      )}
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

export default NetworkPage
