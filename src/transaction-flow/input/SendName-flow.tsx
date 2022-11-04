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

interface SendPermissions {
  canSendOwner: boolean
  canSendManager: boolean
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

type BasicNameData = ReturnType<typeof useBasicName>

interface CallDetails {
  contract: 'nameWrapper' | 'baseRegistrar' | 'registry'
  method: 'setOwner' | 'setSubnodeOwner' | 'safeTransferFrom' | 'reclaim'
}

interface FunctionCallDetails {
  sendManager?: CallDetails
  sendOwner?: CallDetails
}

interface GetFunctionCallDetailsArgs {
  basicNameData: BasicNameData
  parentBasicNameData: BasicNameData
  name: string
  address: string
}

interface UserStates {
  owner: FunctionCallDetails
  manager: FunctionCallDetails
  parentManager?: FunctionCallDetails
  parentOwner?: FunctionCallDetails
}

interface NameStates {
  name: UserStates
  subname: UserStates
  wrappedSubname: UserStates
}

interface ContractFunctionInfo {
  unwrapped: NameStates
  wrapped: NameStates
}

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

// As a user, who is the...
const contractFunction: ContractFunctionInfo = {
  unwrapped: {
    name: {
      owner: {
        sendManager: {
          contract: 'baseRegistrar',
          method: 'reclaim',
        },
        sendOwner: {
          contract: 'baseRegistrar',
          method: 'safeTransferFrom',
        },
      },
      manager: {
        sendManager: {
          contract: 'registry',
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
      owner: {},
      parentManager: {
        sendManager: {
          contract: 'registry',
          method: 'setSubnodeOwner',
        },
      },
      parentOwner: {
        // We shouldn't actually do this!
        // In parent change controller, then do what you would do as controller
        // sendManager: [],
      },
    },
    wrappedSubname: {
      manager: {
        sendManager: {
          contract: 'nameWrapper',
          method: 'safeTransferFrom',
        },
      },
      owner: {
        // This state should never happen as the parent is unwrapped and cannot burn PCC
      },
      parentManager: {
        // We shouldn't actually do this! Will forcibly unwrap the name
        // sendManager: {
        //   contract: 'registry',
        //   method: 'setSubnodeOwner',
        // },
      },
      parentOwner: {
        // Will require setting yourself as manager first
        // sendManager: [],
      },
    },
  },
  wrapped: {
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
          method: 'setSubnodeOwner',
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
      owner: {
        // Unwrapped subname cannot have an owner
      },
      parentManager: {
        // Must forcibly wrap subname or unwrap parent
        // sendManager: [],
      },
      parentOwner: {
        // Must forcibly wrap subname or unwrap parent
        // sendManager: [],
      },
    },
  },
}

// Will pick out the correct function call from the object above
export const getFunctionCallDetails = ({
  basicNameData,
  parentBasicNameData,
  name,
  address,
}: GetFunctionCallDetailsArgs): FunctionCallDetails => {
  const { ownerData, wrapperData } = basicNameData
  const { ownerData: parentOwnerData, wrapperData: parentWrapperData } = parentBasicNameData

  if (!wrapperData || !parentWrapperData) return {}

  const isSubname = isASubname(name)
  const { fuseObj } = wrapperData
  const { fuseObj: parentFuseObj } = parentWrapperData
  const isWrapped = ownerData?.ownershipLevel === 'nameWrapper'
  const isOwnerOrManager = ownerData?.owner === address || ownerData?.registrant === address
  const isOwner = isWrapped ? fuseObj.PARENT_CANNOT_CONTROL : ownerData?.registrant === address

  if (isSubname) {
    const isParentWrapped = parentOwnerData?.ownershipLevel === 'nameWrapper'
    const isParentOwnerOrManager = parentOwnerData?.owner === address

    if (!isOwnerOrManager && !isParentOwnerOrManager) {
      return {}
    }

    if (isOwnerOrManager) {
      const functionCallDetails =
        contractFunction[isParentWrapped ? 'wrapped' : 'unwrapped'][
          isWrapped ? 'wrappedSubname' : 'subname'
        ][isOwner ? 'owner' : 'manager']
      return functionCallDetails
    }

    const isParentManager = isParentWrapped
      ? !parentFuseObj.PARENT_CANNOT_CONTROL
      : parentOwnerData?.owner === address

    if (isParentOwnerOrManager) {
      const functionCallDetails =
        contractFunction[isParentWrapped ? 'wrapped' : 'unwrapped'][
          isWrapped ? 'wrappedSubname' : 'subname'
        ][`parent${isParentManager ? 'Manager' : 'Owner'}`]
      return functionCallDetails ?? {}
    }
  }

  // 2LD names
  if (isOwnerOrManager) {
    const functionCallDetails =
      contractFunction[isWrapped ? 'wrapped' : 'unwrapped'].name[isOwner ? 'owner' : 'manager']
    return functionCallDetails
  }

  return {}
}

export const getPermittedActions = (props: GetFunctionCallDetailsArgs): SendPermissions => {
  if (!props.basicNameData.ownerData) return { canSendOwner: false, canSendManager: false }
  const result = getFunctionCallDetails(props)
  if (!result) return { canSendOwner: false, canSendManager: false }
  const keys = Object.keys(result)
  return {
    canSendOwner: keys.includes('sendOwner'),
    canSendManager: keys.includes('sendManager'),
  }
}

export const handleSubmitForm =
  ({
    basicNameData,
    parentBasicNameData,
    dispatch,
    sendNameWatch,
    managerChoiceWatch,
    ownerChoiceWatch,
    name,
    address,
  }: {
    basicNameData: BasicNameData
    parentBasicNameData: BasicNameData
    dispatch: TransactionDialogPassthrough['dispatch']
    sendNameWatch: string
    managerChoiceWatch: string
    ownerChoiceWatch: string
    name: string
    address: string
  }) =>
  () => {
    const { ownerData } = basicNameData
    const functionCallDetails = getFunctionCallDetails({
      basicNameData,
      parentBasicNameData,
      name,
      address,
    })
    const callCount = Object.keys(functionCallDetails).length
    const isOwnerOrManager = ownerData?.owner === address || ownerData?.registrant === address

    if (callCount > 2) {
      console.error('Too many send transactions')
      return
    }

    if (Object.keys(functionCallDetails).length === 2 && managerChoiceWatch && ownerChoiceWatch) {
      if (!functionCallDetails.sendManager || !functionCallDetails.sendOwner) return
      // This can only happen as the registrant of a 2LD .eth name
      dispatch({
        name: 'setTransactions',
        payload: [
          makeTransactionItem('transferName', {
            name,
            newOwner: sendNameWatch,
            contract: functionCallDetails.sendManager.contract,
            reclaim: functionCallDetails.sendManager.method === 'reclaim',
          }),
          makeTransactionItem('transferName', {
            name,
            newOwner: sendNameWatch,
            contract: functionCallDetails.sendOwner.contract,
          }),
        ],
      })
      dispatch({ name: 'setFlowStage', payload: 'transaction' })
      return
    }

    const sendType = managerChoiceWatch ? 'sendManager' : 'sendOwner'
    if (!functionCallDetails[sendType]) return

    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem(isOwnerOrManager ? 'transferName' : 'transferSubname', {
          name,
          newOwner: sendNameWatch,
          contract: functionCallDetails[sendType]!.contract,
          reclaim: functionCallDetails[sendType]!.method === 'reclaim',
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

export const SendName = ({ data, dispatch, onDismiss }: Props) => {
  const { name } = data
  const { t } = useTranslation('profile')
  const formRef = useRef<HTMLFormElement>(null)
  const { getRecords } = useEns()
  const basicNameData = useBasicName(name as string)
  const parentName = name.split('.').slice(1).join('.')
  const parentBasicNameData = useBasicName(parentName)
  const { address = '' } = useAccount()
  const { register, watch, getFieldState } = useForm<FormData>({
    mode: 'onChange',
  })

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

  const { canSendOwner, canSendManager } = getPermittedActions({
    basicNameData,
    parentBasicNameData,
    name,
    address,
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
      {canSendOwner && (
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
      {canSendManager && (
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
              basicNameData,
              parentBasicNameData,
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
