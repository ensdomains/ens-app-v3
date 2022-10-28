import { ethers } from 'ethers'
import { useMemo, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount, useQuery } from 'wagmi'

import { Button, Checkbox, Dialog, Helper, Input, Typography, mq } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { NameAvatar } from '@app/components/AvatarWithZorb'
import { Outlink } from '@app/components/Outlink'
import { useBasicName } from '@app/hooks/useBasicName'
import { useChainId } from '@app/hooks/useChainId'
import { usePrimary } from '@app/hooks/usePrimary'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { useEns } from '@app/utils/EnsProvider'
import { isASubname } from '@app/utils/utils'

import { makeTransactionItem } from '../transaction'

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['7']};
    min-width: ${theme.space['7']};
    height: ${theme.space['7']};
  `,
)

const ValueTypography = styled(Typography)(
  () => css`
    text-align: right;
  `,
)

const ValueWithAvatarContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row-reverse;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['4']};
    padding: 20px;
    width: 100%;
    border-radius: ${theme.radii.extraLarge};
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid}
      rgba(${theme.shadesRaw.foreground}, 0.06);
  `,
)

const SwitchBox = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['4']};
    padding: 20px;
    width: 100%;
    border-radius: ${theme.radii.extraLarge};
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid}
      rgba(${theme.shadesRaw.foreground}, 0.06);
  `,
)

const TextContainer = styled.div`
  display: flex;
  flex-direction: column;
`

const InnerContainer = styled.div(() => [
  css`
    width: 100%;
  `,
  mq.sm.min(css`
    width: 510px;
  `),
])

const NameValue = ({ value }: { value: string }) => {
  const network = useChainId()

  return (
    <ValueWithAvatarContainer>
      <ValueTypography weight="bold">{value}</ValueTypography>
      <AvatarWrapper>
        <NameAvatar name={value} label={`${value}-avatar`} network={network} />
      </AvatarWrapper>
    </ValueWithAvatarContainer>
  )
}

type Data = {
  name: string
  type?: 'manager' | 'owner'
}

type FormData = {
  managerChoice: string
  ownerChoice: string
  sendName: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const sendOwner = (
  dispatch: TransactionDialogPassthrough['dispatch'],
  name: string,
  sendNameWatch: string,
) => {
  dispatch({
    name: 'setTransactions',
    payload: [
      makeTransactionItem('transferName', {
        name,
        newOwner: sendNameWatch,
        contract: 'baseRegistrar',
      }),
    ],
  })
  dispatch({ name: 'setFlowStage', payload: 'transaction' })
}

const sendOwnerManager = (
  dispatch: TransactionDialogPassthrough['dispatch'],
  name: string,
  sendNameWatch: string,
) => {
  dispatch({
    name: 'setTransactions',
    payload: [
      makeTransactionItem('transferName', {
        name,
        newOwner: sendNameWatch,
        contract: 'baseRegistrar',
      }),
      makeTransactionItem('transferName', {
        name,
        newOwner: sendNameWatch,
        contract: 'registry',
      }),
    ],
  })
  dispatch({ name: 'setFlowStage', payload: 'transaction' })
}

const sendWrappedOwner = (
  dispatch: TransactionDialogPassthrough['dispatch'],
  name: string,
  sendNameWatch: string,
) => {
  dispatch({
    name: 'setTransactions',
    payload: [
      makeTransactionItem('transferName', {
        name,
        newOwner: sendNameWatch,
        contract: 'nameWrapper',
      }),
    ],
  })
  dispatch({ name: 'setFlowStage', payload: 'transaction' })
}

const sendSubname = (
  dispatch: TransactionDialogPassthrough['dispatch'],
  name: string,
  sendNameWatch: string,
) => {
  dispatch({
    name: 'setTransactions',
    payload: [
      makeTransactionItem('transferSubname', {
        name,
        newOwner: sendNameWatch,
        contract: 'registry',
      }),
    ],
  })
  dispatch({ name: 'setFlowStage', payload: 'transaction' })
}

const sendWrappedSubnameAsOwner = (
  dispatch: TransactionDialogPassthrough['dispatch'],
  name: string,
  sendNameWatch: string,
) => {
  dispatch({
    name: 'setTransactions',
    payload: [
      makeTransactionItem('transferSubname', {
        name,
        newOwner: sendNameWatch,
        contract: 'nameWrapper',
      }),
    ],
  })
  dispatch({ name: 'setFlowStage', payload: 'transaction' })
}

const sendWrappedSubnameAsManager = (
  dispatch: TransactionDialogPassthrough['dispatch'],
  name: string,
  sendNameWatch: string,
) => {
  dispatch({
    name: 'setTransactions',
    payload: [
      makeTransactionItem('transferName', {
        name,
        newOwner: sendNameWatch,
        contract: 'nameWrapper',
      }),
    ],
  })
  dispatch({ name: 'setFlowStage', payload: 'transaction' })
}

const sendManagerAsOwner = (
  dispatch: TransactionDialogPassthrough['dispatch'],
  name: string,
  sendNameWatch: string,
) => {
  dispatch({
    name: 'setTransactions',
    payload: [
      makeTransactionItem('transferController', {
        name,
        newOwner: sendNameWatch,
        isOwner: false,
      }),
    ],
  })
  dispatch({ name: 'setFlowStage', payload: 'transaction' })
}

const sendManagerAsManager = (
  dispatch: TransactionDialogPassthrough['dispatch'],
  name: string,
  sendNameWatch: string,
) => {
  dispatch({
    name: 'setTransactions',
    payload: [
      makeTransactionItem('transferName', {
        name,
        newOwner: sendNameWatch,
        contract: 'registry',
      }),
    ],
  })
  dispatch({ name: 'setFlowStage', payload: 'transaction' })
}

export const handleSubmitForm =
  ({
    ownerData,
    parentNameOwnerData,
    dispatch,
    sendNameWatch,
    managerChoiceWatch,
    ownerChoiceWatch,
    name,
    address,
  }: {
    ownerData: ReturnType<typeof useBasicName>['ownerData']
    parentNameOwnerData: ReturnType<typeof useBasicName>
    dispatch: TransactionDialogPassthrough['dispatch']
    sendNameWatch: string
    managerChoiceWatch: string
    ownerChoiceWatch: string
    name: string
    address?: string
  }) =>
  () => {
    const isController = ownerData?.owner === address
    const isRegistrant = ownerData?.registrant === address

    const isSubname = name.split('.').length > 2

    if (managerChoiceWatch && ownerChoiceWatch) {
      sendOwnerManager(dispatch, name, sendNameWatch)
      return
    }

    if (!managerChoiceWatch && ownerChoiceWatch) {
      if (ownerData?.ownershipLevel === 'nameWrapper') {
        sendWrappedOwner(dispatch, name, sendNameWatch)
        return
      }
      if (isSubname) {
        sendSubname(dispatch, name, sendNameWatch)
        return
      }
      sendOwner(dispatch, name, sendNameWatch)
      return
    }

    if (managerChoiceWatch && !ownerChoiceWatch) {
      if (isSubname && ownerData?.ownershipLevel === 'nameWrapper' && address === ownerData.owner) {
        sendWrappedSubnameAsOwner(dispatch, name, sendNameWatch)
        return
      }

      if (
        isSubname &&
        ownerData?.ownershipLevel === 'nameWrapper' &&
        address === parentNameOwnerData?.ownerData?.owner
      ) {
        sendWrappedSubnameAsManager(dispatch, name, sendNameWatch)
        return
      }

      if (isRegistrant) {
        sendManagerAsOwner(dispatch, name, sendNameWatch)
        return
      }

      if (isController) {
        sendManagerAsManager(dispatch, name, sendNameWatch)
      }
    }
  }

// Must take into account PCC when you are a parent

// As a user, who is the...
const contractFunction = {
  isUnwrapped: {
    name: {
      isOwner: {
        sendManager: {
          contract: 'baseRegistrar',
          method: 'reclaim',
        },
        sendOwner: {
          contract: 'baseRegistrar',
          method: 'safeTransferFrom',
        },
      },
      isManager: {
        sendManager: {
          contract: 'regsitry',
          method: 'setOwner',
        },
      },
    },
    subname: {
      manager: {
        sendManager: {
          contract: 'registry',
          method: 'setOwner',
        },
      },
      parentManager: {
        sendManager: {
          contract: 'registry',
          method: 'setSubnodeOwner',
        },
      },
      parentOwner: {
        // We shouldn't actually do this!
        // In parent change controller, then do what you would do as controller
        sendManager: [],
      },
    },
    wrappedSubname: {
      manager: {
        sendManager: {
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        },
      },
      parentManager: {
        // We shouldn't actually do this! Will forcibly unwrap the name
        sendManager: {
          contract: 'registry',
          method: 'setSubnodeOwner',
        },
      },
      parentOwner: {
        // Will require setting yourself as manager first
        sendManager: [],
      },
    },
  },
  isWrapped: {
    name: {
      owner: {
        sendOwner: {
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        },
      },
      manager: {
        sendManager: {
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        },
      },
    },
    wrappedSubname: {
      owner: {
        sendOwner: {
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        },
      },
      manager: {
        sendManager: {
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        },
      },
      parentManager: {
        sendManager: {
          contract: 'nameWrapper',
          method: 'setSubnodeOwner',
        },
      },
      parentOwner: {
        sendOwner: {
          contract: 'nameWrapper',
          method: 'setSubnodeOwner',
        },
        sendManager: {
          contract: 'nameWrapper',
          method: 'setSubnodeOnwer',
        },
      },
    },
    subname: {
      manager: {
        sendManager: {
          contract: 'registry',
          method: 'setOwner',
        },
      },
      parentManager: {
        // Must forcibly wrap subname or unwrap parent
        sendManager: [],
      },
      parentOwner: {
        // Must forcibly wrap subname or unwrap parent
        sendManager: [],
      },
    },
  },
}

export const getFunctionCallDetails = ({
  ownerData,
  parentOwnerData,
  name,
  wrapperData,
  parentWrapperData,
  address,
}) => {
  const isSubname = name.split('.').length > 2
  const { fuseObj } = wrapperData
  const parentFuseObj = parentWrapperData.fuseObj
  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'
  const isOwnerOrManager = ownerData?.owner === address

  let functionCallDetails

  if (isOwnerOrManager) {
    functionCallDetails =
      contractFunction[isWrapped ? 'isWrapped' : 'isUnwrapped'][
        isWrapped ? 'wrappedSubname' : 'subname'
      ][isOwnerOrManager && 'manager']
  }

  if (isSubname) {
    const isParentWrapped = parentOwnerData?.ownershipLevel === 'nameWrapper'
    const isParentOwnerOrManager = parentOwnerData?.owner === address

    if (!isOwnerOrManager && !isParentOwnerOrManager) {
      return
    }

    const isParentOwner = isParentWrapped
      ? parentFuseObj.PARENT_CANNOT_CONTROL
      : parentOwnerData.registrant === address

    if (isParentOwnerOrManager) {
      functionCallDetails =
        contractFunction[isParentWrapped ? 'isWrapped' : 'isUnwrapped'][
          isWrapped ? 'subname' : 'wrappedSubname'
        ][`parent${isParentOwner ? 'Owner' : 'Manager'}`]
    }
  }

  return functionCallDetails
}

export const SendName = ({ data, dispatch, onDismiss }: Props) => {
  const { name } = data
  const { t } = useTranslation('profile')
  const formRef = useRef<HTMLFormElement>(null)
  const { getRecords } = useEns()
  const { ownerData, wrapperData } = useBasicName(name as string)
  const parentName = name.split('.').slice(1).join('.')
  const parentNameOwnerData = useBasicName(parentName)
  const { address } = useAccount()
  const { register, watch, getFieldState } = useForm<FormData>({
    mode: 'onChange',
  })

  console.log('ownerData: ', ownerData)
  console.log('wrapperData: ', wrapperData)
  console.log('parentNameOwnerData: ', parentNameOwnerData)

  const managerDefaultChecked = data.type !== 'owner'
  const ownerDefaultChecked = data.type !== 'manager'

  const managerChoiceWatch = watch('managerChoice')
  const ownerChoiceWatch = watch('ownerChoice')
  const sendNameWatch = watch('sendName')
  const { data: ethNameValidation, isLoading } = useQuery(
    ['ethNameValidation', sendNameWatch],
    async () => {
      const result = await getRecords(sendNameWatch)
      return result?.address
    },
    { enabled: sendNameWatch?.includes('.eth') },
  )

  const { name: primaryName } = usePrimary(ethNameValidation || sendNameWatch)

  const { data: canModify } = useQuery(['resolver', ownerData?.toString()], () => {
    let _canModifyOwner = false
    let _canModifyManager = false

    if (ownerData?.ownershipLevel === 'registrar') {
      if (address === ownerData?.registrant) {
        _canModifyOwner = address === ownerData?.registrant
        _canModifyManager = true
      } else {
        _canModifyManager = address === ownerData?.owner
      }
    }

    if (ownerData?.ownershipLevel === 'nameWrapper') {
      if (isASubname(name)) {
        _canModifyManager =
          address === ownerData?.owner || address === parentNameOwnerData?.ownerData?.owner
      } else {
        _canModifyOwner = address === ownerData?.owner
      }
    }

    if (ownerData?.ownershipLevel === 'registry') {
      _canModifyOwner =
        address === ownerData?.owner || address === parentNameOwnerData?.ownerData?.owner
    }

    return {
      canModifyOwner: _canModifyOwner,
      canModifyManager: _canModifyManager,
    }
  })

  const hasErrors = useMemo(() => {
    const errorData = {
      formMessage: '',
      fieldMessage: '',
      hasError: false,
    }

    if (typeof managerChoiceWatch === 'undefined' && typeof ownerChoiceWatch === 'undefined')
      return errorData

    if (!managerChoiceWatch && !ownerChoiceWatch) {
      return {
        ...errorData,
        formMessage: 'Must choose either Manager or Owner to send',
        hasError: true,
      }
    }
    if (getFieldState('sendName').error) return errorData
    if (isLoading) return errorData
    if (sendNameWatch?.includes('.') && !ethNameValidation)
      return { ...errorData, message: 'No address set on name', hasError: true }

    return errorData
  }, [
    ethNameValidation,
    getFieldState,
    isLoading,
    managerChoiceWatch,
    ownerChoiceWatch,
    sendNameWatch,
  ])

  return (
    <>
      <Typography variant="extraLarge">{t('details.sendName.title')}</Typography>
      <Typography style={{ textAlign: 'center' }}>{t('details.sendName.description')}</Typography>
      <Outlink href="">{t('details.sendName.learnMore')}</Outlink>
      {canModify?.canModifyOwner && (
        <SwitchBox>
          <TextContainer>
            <Typography weight="bold">{t('details.sendName.makeOwner')}</Typography>
            <Typography weight="light" variant="small">
              {t('details.sendName.makeOwnerDescription')}
            </Typography>
          </TextContainer>
          <Checkbox
            label=""
            size="large"
            variant="switch"
            value="owner"
            defaultChecked={ownerDefaultChecked}
            data-testid="owner-checkbox"
            {...register('ownerChoice', { shouldUnregister: true })}
          />
        </SwitchBox>
      )}
      {canModify?.canModifyManager && (
        <SwitchBox>
          <TextContainer>
            <Typography weight="bold">{t('details.sendName.makeManager')}</Typography>
            <Typography weight="light" variant="small">
              {t('details.sendName.makeManagerDescription')}
            </Typography>
          </TextContainer>
          <Checkbox
            size="large"
            label=""
            variant="switch"
            value="manager"
            defaultChecked={managerDefaultChecked}
            data-testid="manager-checkbox"
            {...register('managerChoice', { shouldUnregister: true })}
          />
        </SwitchBox>
      )}
      <InnerContainer>
        <form data-testid="edit-resolver-form" ref={formRef}>
          <Input
            data-testid="send-name-input"
            label="Send to"
            placeholder={t('details.sendName.inputPlaceholder')}
            {...register('sendName', {
              validate: {
                length: (value) =>
                  !value.includes('.eth') && value.length !== 42
                    ? t('errors.addressLength')
                    : undefined,
                isAddress: (value) =>
                  !value.includes('.eth') && !ethers.utils.isAddress(value)
                    ? t('errors.invalidAddress')
                    : undefined,
              },
            })}
            error={getFieldState('sendName').error?.message || hasErrors.fieldMessage}
          />
          <Spacer $height="4" />
        </form>
        {primaryName && <NameValue value={primaryName} />}
      </InnerContainer>
      {hasErrors.formMessage && <Helper type="error">{t('errors.ownerManagerChoice')}</Helper>}
      <Dialog.Footer
        leading={
          <Button
            variant="secondary"
            tone="grey"
            shadowless
            onClick={onDismiss}
            loading={isLoading}
          >
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button
            shadowless
            onClick={handleSubmitForm({
              ownerData,
              parentNameOwnerData,
              dispatch,
              sendNameWatch,
              managerChoiceWatch,
              ownerChoiceWatch,
              name,
              address,
            })}
            disabled={hasErrors.hasError}
          >
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default SendName
