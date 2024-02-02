import Head from 'next/head'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useAccount } from 'wagmi'

import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useValidate } from '@app/hooks/useValidate'
import { Content } from '@app/layouts/Content'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

import { EnableDnssec } from './EnableDnssec'
import { CompleteOnchain } from './onchain/CompleteOnchain'
import { ImportTransaction } from './onchain/ImportTransaction'
import { VerifyOnchainOwnership } from './onchain/VerifyOnchainOwnership'
import { SelectImportType } from './SelectImportType'
import { useDnsImportReducer } from './useDnsImportReducer'
import { VerifyOffchainOwnership } from './VerifyOffchainOwnership'

export const DnsClaim = () => {
  const router = useRouterWithHistory()
  const { address } = useAccount()

  const { name = '' } = useValidate({ input: router.query.name as string })
  const { t } = useTranslation('dnssec')

  const { dispatch, item, selected } = useDnsImportReducer({
    address,
    name,
  })
  const step = item.steps[item.stepIndex]

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
            transaction: () => <ImportTransaction dispatch={dispatch} selected={selected} />,
            completeOnchain: () => <CompleteOnchain dispatch={dispatch} selected={selected} />,
            verifyOffchainOwnership: () => (
              <VerifyOffchainOwnership dispatch={dispatch} selected={selected} />
            ),
            completeOffchain: () => null,
          }[step](),
        }}
      </Content>
    </>
  )
}
