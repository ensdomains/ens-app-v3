import Head from 'next/head'
import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { match } from 'ts-pattern'
import { useAccount } from 'wagmi'

import { useBasicName } from '@app/hooks/useBasicName'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { Content } from '@app/layouts/Content'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { shouldRedirect } from '@app/utils/shouldRedirect'

import { CompleteImport } from './steps/CompleteImport'
import { EnableDnssec } from './steps/EnableDnssec'
import { ImportTransaction } from './steps/onchain/ImportTransaction'
import { VerifyOnchainOwnership } from './steps/onchain/VerifyOnchainOwnership'
import { SelectImportType } from './steps/SelectImportType'
import { VerifyOffchainOwnership } from './steps/VerifyOffchainOwnership'
import { useDnsImportReducer } from './useDnsImportReducer'

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

  shouldRedirect(router, 'DnsClaim.tsx', '', {
    shouldRun: true,
    payload: {
      name,
      isLoading,
      registrationStatus,
      item,
      step,
    },
  })

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
          trailing: match(step)
            .with('selectType', () => (
              <SelectImportType dispatch={dispatch} item={item} selected={selected} />
            ))
            .with('enableDnssec', () => <EnableDnssec dispatch={dispatch} selected={selected} />)
            .with('verifyOnchainOwnership', () => (
              <VerifyOnchainOwnership dispatch={dispatch} selected={selected} />
            ))
            .with('transaction', () => (
              <ImportTransaction dispatch={dispatch} selected={selected} item={item} />
            ))
            .with('completeOnchain', () => <CompleteImport selected={selected} item={item} />)
            .with('verifyOffchainOwnership', () => (
              <VerifyOffchainOwnership dispatch={dispatch} selected={selected} />
            ))
            .with('completeOffchain', () => <CompleteImport selected={selected} item={item} />)
            .exhaustive(),
        }}
      </Content>
    </>
  )
}
