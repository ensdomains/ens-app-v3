import Head from 'next/head'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'

import { useBasicName } from '@app/hooks/useBasicName'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { Content } from '@app/layouts/Content'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { RegistrationStatus } from '@app/utils/registrationStatus'

import { CompleteImport } from './steps/CompleteImport'
import { EnableDnssec } from './steps/EnableDnssec'
import { ImportTransaction } from './steps/onchain/ImportTransaction'
import { VerifyOnchainOwnership } from './steps/onchain/VerifyOnchainOwnership'
import { SelectImportType } from './steps/SelectImportType'
import { VerifyOffchainOwnership } from './steps/VerifyOffchainOwnership'
import { DnsImportReducerDataItem, DnsStep, useDnsImportReducer } from './useDnsImportReducer'

const getShouldRedirect = ({
  isLoading,
  registrationStatus,
  item,
  step,
}: {
  isLoading: boolean
  registrationStatus?: RegistrationStatus
  item: DnsImportReducerDataItem
  step: DnsStep
}) => {
  console.log({ isLoading, registrationStatus, item, step })
  if (isLoading) return false
  if (!registrationStatus) return false
  if (registrationStatus === 'notImported') return false
  if (registrationStatus === 'notOwned') return false

  if (!item.started) return true

  if (step === 'completeOnchain') return false
  if (step === 'completeOffchain') return false

  return true
}

export const DnsClaim = () => {
  const router = useRouterWithHistory()
  const { address } = useAccount()
  const {
    registrationStatus,
    isLoading,
    name = '',
  } = useBasicName({ name: router.query.name as string })

  const { t } = useTranslation('dnssec')

  const { dispatch, item, selected } = useDnsImportReducer({
    address,
    name,
  })
  const step = item.steps ? item.steps[item.stepIndex] : 'selectType'

  // reset item on initial mount if not started
  useEffect(() => {
    if (!item.started) {
      dispatch({ name: 'resetItem', selected })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [router.isReady])

  useEffect(() => {
    if (address) {
      dispatch({ name: 'setAddress', selected, payload: address })
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address])

  const key = `importDnsName-${selected.name}`

  const { cleanupFlow } = useTransactionFlow()

  useEffect(() => {
    const handleRouteChange = (e: string) => {
      if (e !== router.asPath && step === 'completeOnchain') {
        dispatch({ name: 'clearItem', selected })
        cleanupFlow(key)
      }
    }
    router.events.on('routeChangeComplete', handleRouteChange)
    return () => {
      router.events.off('routeChangeComplete', handleRouteChange)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [dispatch, step, selected, router.asPath])

  if (router.isReady && getShouldRedirect({ isLoading, registrationStatus, item, step })) {
    router.push(`/profile/${name}`)
  }

  return (
    <>
      <Head>
        <title>{t('title', { name })}</title>
      </Head>
      <Content
        noTitle
        title={name}
        hideHeading={step === 'completeOnchain' || step === 'completeOffchain'}
        singleColumnContent
        inlineHeading
      >
        {{
          trailing: {
            selectType: () => (
              <SelectImportType dispatch={dispatch} item={item} selected={selected} />
            ),
            enableDnssec: () => <EnableDnssec dispatch={dispatch} selected={selected} />,
            verifyOnchainOwnership: () => (
              <VerifyOnchainOwnership dispatch={dispatch} selected={selected} />
            ),
            transaction: () => (
              <ImportTransaction dispatch={dispatch} selected={selected} item={item} />
            ),
            completeOnchain: () => <CompleteImport selected={selected} item={item} />,
            verifyOffchainOwnership: () => (
              <VerifyOffchainOwnership dispatch={dispatch} selected={selected} />
            ),
            completeOffchain: () => <CompleteImport selected={selected} item={item} />,
          }[step](),
        }}
      </Content>
    </>
  )
}
