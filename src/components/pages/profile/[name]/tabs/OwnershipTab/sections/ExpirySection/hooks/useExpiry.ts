import { useMemo } from 'react'
import { P, match } from 'ts-pattern'

import { useChainName } from '@app/hooks/useChainName'
import type { useNameDetails } from '@app/hooks/useNameDetails'
import useParentBasicName from '@app/hooks/useParentBasicName'
import useRegistrationData from '@app/hooks/useRegistrationData'
import { GRACE_PERIOD } from '@app/utils/constants'
import { nameLevel } from '@app/utils/name'

import { makeEtherscanLink } from '../../../../../../../../../utils/utils'

type Input = {
  name: string
  details: ReturnType<typeof useNameDetails>
}

type Options = {
  enabled?: boolean
}

export const useExpiry = ({ name, details }: Input, options: Options = {}) => {
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const enabled = options.enabled ?? true

  const isEth = name.endsWith('.eth')
  const level = nameLevel(name)

  const parentData = useParentBasicName(name)

  const chainName = useChainName()
  const registrationData = useRegistrationData(name)

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { pccExpired } = details || {}
  // 2LD wrapped / unwrapped
  // expiry / grace expiry / registration date

  // subname
  // parent name expires / parent grace period end

  // emancipated subname
  // name expires / parent name expires

  const isLoading = details.isLoading || parentData.isLoading || registrationData.isLoading

  const data = useMemo(() => {
    if (isLoading) return undefined
    const expiry = details.expiryDate || details.wrapperData?.expiryDate
    const parentExpiry = parentData?.expiryDate || parentData?.wrapperData?.expiryDate
    const isEmancipated = !!details.wrapperData?.parent.PARENT_CANNOT_CONTROL

    console.log('level', level)
    console.log('expiry', expiry)
    return match([level, isEth, isEmancipated])
      .with(['2ld', true, P._], () => [
        {
          type: 'expiry',
          date: expiry,
        },
        {
          type: 'grace-period',
          date: expiry ? new Date(expiry.getTime() + GRACE_PERIOD) : undefined,
          tooltip: 'details.descriptions.gracePeriod',
        },
        {
          type: 'registration',
          date: registrationData?.data?.registrationDate,
          link: makeEtherscanLink(registrationData?.data?.transactionHash!, chainName),
        },
      ])
      .with(['subname', true, true], () => [
        {
          type: 'expiry',
          date: expiry,
        },
        {
          type: 'parent-expiry',
          date: parentExpiry,
        },
      ])
      .with(['subname', true, false], () => [
        {
          type: 'parent-expiry',
          date: parentExpiry,
        },
        {
          type: 'parent-grace-period',
          date: parentExpiry ? new Date(parentExpiry.getTime() + GRACE_PERIOD) : undefined,
        },
      ])
      .with([P._, false, P._], () => [])
      .with([P.union('root', 'tld'), P._, P._], () => [])
      .exhaustive()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [details])

  return {
    data,
    isLoading,
  }
}
