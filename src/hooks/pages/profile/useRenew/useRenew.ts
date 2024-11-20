import { useConnectModal } from '@rainbow-me/rainbowkit'
import { useSearchParams } from 'next/navigation'
import { useEffect } from 'react'
import { match } from 'ts-pattern'
import { useAccount } from 'wagmi'

import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useBasicName } from '@app/hooks/useBasicName'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { RegistrationStatus } from '@app/utils/registrationStatus'
import { parseNumericString } from '@app/utils/string'

type RenewStatus = 'connect-user' | 'display-extend-names' | 'idle'

export const calculateRenewState = ({
  registrationStatus,
  isRegistrationStatusLoading,
  renewSeconds,
  openConnectModal,
  connectModalOpen,
  accountStatus,
  isAbilitiesLoading,
  name,
}: {
  registrationStatus?: RegistrationStatus
  isRegistrationStatusLoading: boolean
  renewSeconds: number | null
  connectModalOpen: boolean
  openConnectModal: ReturnType<typeof useConnectModal>['openConnectModal']
  accountStatus: ReturnType<typeof useAccount>['status']
  isAbilitiesLoading: boolean
  name?: string
}): RenewStatus => {
  const isNameRegisteredOrGracePeriod =
    registrationStatus === 'registered' || registrationStatus === 'gracePeriod'
  const isRenewActive =
    !isRegistrationStatusLoading &&
    !!name &&
    isNameRegisteredOrGracePeriod &&
    !!renewSeconds &&
    !connectModalOpen

  if (isRenewActive && accountStatus === 'disconnected' && !!openConnectModal) return 'connect-user'
  if (isRenewActive && accountStatus === 'connected' && !isAbilitiesLoading)
    return 'display-extend-names'
  return 'idle'
}

export function useRenew(name: string) {
  const router = useRouterWithHistory()
  const { registrationStatus, isLoading: isBasicNameLoading } = useBasicName({ name })
  const abilities = useAbilities({ name })
  const searchParams = useSearchParams()
  const { status } = useAccount()
  const { openConnectModal, connectModalOpen } = useConnectModal()

  const { usePreparedDataInput } = useTransactionFlow()
  const showExtendNamesInput = usePreparedDataInput('ExtendNames')

  const { data: { canSelfExtend } = {}, isLoading: isAbilitiesLoading } = abilities

  const renewSeconds = parseNumericString(searchParams.get('renew'))

  const renewState = calculateRenewState({
    registrationStatus,
    isRegistrationStatusLoading: isBasicNameLoading,
    renewSeconds,
    connectModalOpen,
    accountStatus: status,
    isAbilitiesLoading,
    name,
    openConnectModal,
  })

  useEffect(() => {
    match(renewState)
      .with('connect-user', () => openConnectModal?.())
      .with('display-extend-names', () => {
        showExtendNamesInput(`extend-names-${name}`, {
          names: [name],
          isSelf: canSelfExtend,
          seconds: renewSeconds!,
        })
        router.replace(`/${name}`)
      })
      .with('idle', () => {})
      .exhaustive()
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [renewState])
}
