import { NextPage } from 'next'
import { Basic } from '@app/layouts/Basic'
import React from 'react'
import { gql, useQuery } from '@apollo/client'
import { useTranslation } from 'next-i18next'
import { serverSideTranslations } from 'next-i18next/serverSideTranslations'

const REACT_VAR_LISTENERS = gql`
  query reactiveVarListeners @client {
    globalError
    networkId
    network
    isAppReady
  }
`

const NetworkPage: NextPage = () => {
  const { t } = useTranslation('network')

  const {
    data: { globalError, isAppReady },
  } = useQuery(REACT_VAR_LISTENERS)

  const isLoading = !isAppReady && !globalError.network
  const isAcceptedNetwork = !globalError.network

  return (
    <Basic title={t('title')} loading={isLoading}>
      {isAcceptedNetwork ? (
        <>
          <div>{t('successMessage')}</div>
        </>
      ) : (
        <>
          <div>{t('errorMessage')}</div>
        </>
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
