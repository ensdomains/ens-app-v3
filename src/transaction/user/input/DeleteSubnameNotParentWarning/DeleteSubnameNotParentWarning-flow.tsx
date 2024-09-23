import { Trans, useTranslation } from 'react-i18next'
import { Address } from 'viem'

import { Button, Dialog } from '@ensdomains/thorin'

import { usePrimaryNameOrAddress } from '@app/hooks/reverseRecord/usePrimaryNameOrAddress'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useOwners } from '@app/hooks/useOwners'
import type { TransactionDialogPassthrough } from '@app/transaction/components/TransactionDialogManager'
import TransactionLoader from '@app/transaction/components/TransactionLoader'
import { parentName } from '@app/utils/name'

import { CenterAlignedTypography } from '../RevokePermissions/components/CenterAlignedTypography'

type Data = {
  name: string
  contract: 'registry' | 'nameWrapper'
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const DeleteSubnameNotParentWarning = ({ data, onDismiss, setTransactions, setStage }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const {
    ownerData: parentOwnerData,
    wrapperData: parentWrapperData,
    dnsOwner,
    isLoading: parentBasicLoading,
  } = useNameDetails({ name: parentName(data.name) })

  const [ownerTarget] = useOwners({
    ownerData: parentOwnerData!,
    wrapperData: parentWrapperData!,
    dnsOwner,
  })
  const { data: parentPrimaryOrAddress, isLoading: parentPrimaryLoading } = usePrimaryNameOrAddress(
    {
      address: ownerTarget?.address as Address,
      enabled: !!ownerTarget,
    },
  )
  const isLoading = parentBasicLoading || parentPrimaryLoading

  const handleDelete = () => {
    setTransactions([
      {
        name: 'deleteSubname',
        data: {
          name: data.name,
          contract: data.contract,
          method: 'setRecord',
        },
      },
    ])
    setStage('transaction')
  }

  if (isLoading) return <TransactionLoader />

  return (
    <>
      <Dialog.Heading title={t('input.deleteSubnameNotParentWarning.title')} alert="error" />
      <Dialog.Content>
        <CenterAlignedTypography>
          <Trans
            i18nKey="input.deleteSubnameNotParentWarning.message"
            ns="transactionFlow"
            components={{ b: <strong /> }}
            values={{
              ownershipTerm: t(ownerTarget.label, { ns: 'common' }).toLocaleLowerCase(),
              parentOwner: parentPrimaryOrAddress.nameOrAddr,
            }}
          />
        </CenterAlignedTypography>
      </Dialog.Content>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button
            colorStyle="redPrimary"
            onClick={handleDelete}
            data-testid="delete-subname-not-parent-button"
          >
            {t('action.understand', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default DeleteSubnameNotParentWarning
