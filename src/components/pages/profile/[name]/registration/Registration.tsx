import { NFTWithPlaceholder } from '@app/components/NFTWithPlaceholder'
import { useChainId } from '@app/hooks/useChainId'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useEstimateTransactionCost } from '@app/hooks/useTransactionCost'
import { Content } from '@app/layouts/Content'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { Colors } from '@ensdomains/thorin'
import Head from 'next/head'
import { useCallback, useRef, useState } from 'react'
import Pricing from './steps/Pricing/Pricing'
import Profile from './steps/Profile'
import { RegistrationData, RegistrationStep, RegistrationStepData } from './types'

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  isLoading: boolean
}

const Registration = ({ nameDetails, isLoading }: Props) => {
  const network = useChainId()
  const breakpoints = useBreakpoint()
  const { normalisedName, priceData } = nameDetails

  const dataRef = useRef<RegistrationData>({
    years: 1,
    makePrimary: false,
    records: {},
    resolver: '',
    permissions: {},
  })

  const [step, setStep] = useState<RegistrationStep>('pricing')
  const { data: transactionData, loading: transactionDataLoading } = useEstimateTransactionCost([
    'REGISTER',
    'COMMIT',
  ])
  const { transactionFee } = transactionData || {}

  const yearlyFee = priceData?.base
  const premiumFee = priceData?.premium
  const hasPremium = premiumFee?.gt(0)

  const makeInvoiceItems = useCallback(
    (years: number) => {
      const totalYearlyFee = yearlyFee?.mul(years)

      return [
        {
          label: `${years} year registration`,
          value: totalYearlyFee,
        },
        {
          label: 'Est. network fee',
          value: transactionFee,
        },
        ...(hasPremium
          ? [
              {
                label: 'Temporary premium',
                value: premiumFee,
                color: 'blue' as Colors,
              },
            ]
          : []),
      ]
    },
    [hasPremium, premiumFee, transactionFee, yearlyFee],
  )

  // const invoiceItems = useMemo(() => {
  //   if (step === 'pricing') return []
  //   const { years } = dataRef.current
  //   return makeInvoiceItems(years)
  // }, [step, makeInvoiceItems])

  const onPricingNext = ({ years, makePrimary }: RegistrationStepData['pricing']) => {
    dataRef.current.years = years
    dataRef.current.makePrimary = makePrimary
    setStep('profile')
  }

  return (
    <>
      <Head>
        <title>Register {normalisedName}</title>
      </Head>
      <Content
        noTitle
        title={normalisedName}
        subtitle="Register"
        loading={isLoading || transactionDataLoading}
      >
        {{
          leading: breakpoints.md && <NFTWithPlaceholder name={normalisedName} network={network} />,
          trailing: {
            pricing: (
              <Pricing
                hasPremium={hasPremium}
                nameDetails={nameDetails}
                premiumFee={premiumFee}
                transactionData={transactionData}
                yearlyFee={yearlyFee}
                callback={onPricingNext}
                makeInvoiceItems={makeInvoiceItems}
              />
            ),
            profile: <Profile nameDetails={nameDetails} />,
            info: null,
            transactions: null,
          }[step],
        }}
      </Content>
    </>
  )
}

export default Registration
