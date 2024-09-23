import { useTranslation } from 'react-i18next'

import { GetOwnerReturnType } from '@ensdomains/ensjs/public'

import { useAccountSafely } from '@app/hooks/account/useAccountSafely'
import { NameWrapperState } from '@app/hooks/fuses/useFusesStates'
import { useTransactionManager } from '@app/transaction/transactionManager'

import BaseWrapButton from './BaseWrapButton'

type Props = {
  name: string
  ownerData: GetOwnerReturnType | undefined
  status: NameWrapperState
  disabled?: boolean
}

const UnwrapButton = ({ name, ownerData, status, disabled }: Props) => {
  const { t } = useTranslation('profile')

  const { address } = useAccountSafely()
  const startFlow = useTransactionManager((s) => s.startFlow)
  const handleUnwrapClick = () => {
    startFlow({
      flowId: `unwrapName-${name}`,
      transactions: [{ name: 'unwrapName', data: { name } }],
    })
  }

  const canBeUnwrapped = !!address && ownerData?.owner === address && status !== 'locked'

  if (!canBeUnwrapped) return null

  return (
    <BaseWrapButton disabled={disabled} data-testid="unwrap-name-btn" onClick={handleUnwrapClick}>
      {t('tabs.more.token.unwrap')}
    </BaseWrapButton>
  )
}

export default UnwrapButton
