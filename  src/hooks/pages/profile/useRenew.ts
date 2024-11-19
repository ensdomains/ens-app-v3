import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSearchParams } from 'next/navigation'
import { useEffect, useState } from 'react'
import { useAccount } from 'wagmi'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { parseNumericString } from '@app/utils/string'

export function useRenew(name: string) {
  const [opened, setOpened] = useState<boolean>(false)

  const { registrationStatus, isLoading } = useNameDetails({ name })
  const abilities = useAbilities({ name })
  const searchParams = useSearchParams()
  const { isConnected, isDisconnected } = useAccount()
  const { usePreparedDataInput } = useTransactionFlow()
  const { openConnectModal } = useConnectModal()
  const showExtendNamesInput = usePreparedDataInput('ExtendNames')

  const { data: { canSelfExtend } = {} } = abilities
  const isAvailableName = registrationStatus === 'available'
  const renewSeconds = parseNumericString(searchParams.get('renew'))

  const isRenewActive = !opened && !!renewSeconds && !isLoading

  useEffect(() => {
    if (!isRenewActive) return

    if (!isAvailableName && isDisconnected) {
      setOpened(true)
      openConnectModal?.()
      return
    }

    if (!isAvailableName && isConnected) {
      setOpened(true)
      showExtendNamesInput(`extend-names-${name}`, {
        names: [name],
        isSelf: canSelfExtend,
        seconds: renewSeconds,
      })
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRenewActive, isAvailableName, isConnected, isDisconnected, name, canSelfExtend])
}
