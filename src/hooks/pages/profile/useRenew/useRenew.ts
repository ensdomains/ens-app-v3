import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSearchParams } from 'next/navigation'
import { useEffect, useRef } from 'react'
import { useAccount } from 'wagmi'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { parseNumericString } from '@app/utils/string'

export function useRenew(name: string) {
  const { registrationStatus, isLoading } = useNameDetails({ name })
  const abilities = useAbilities({ name })
  const searchParams = useSearchParams()
  const { isConnected, isDisconnected } = useAccount()
  const { usePreparedDataInput } = useTransactionFlow()
  const { openConnectModal, connectModalOpen } = useConnectModal()
  const showExtendNamesInput = usePreparedDataInput('ExtendNames')

  const { data: { canSelfExtend } = {} } = abilities
  const isAvailableName = registrationStatus === 'available'
  const renewSeconds = parseNumericString(searchParams.get('renew'))

  const prevIsConnected = useRef(isConnected)

  const isRenewActive =
    (!isConnected || !connectModalOpen) && !!renewSeconds && !isLoading && !isAvailableName

  // http://localhost:3000/anyname.eth?renew=63072000
  useEffect(() => {
    if (!isRenewActive) return

    if (isDisconnected && prevIsConnected.current) {
      openConnectModal?.()
      return
    }

    if (isConnected) {
      showExtendNamesInput(`extend-names-${name}`, {
        names: [name],
        isSelf: canSelfExtend,
        seconds: renewSeconds,
      })
    }

    prevIsConnected.current = !isConnected

    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isRenewActive, isConnected, isDisconnected, name, canSelfExtend])
}
