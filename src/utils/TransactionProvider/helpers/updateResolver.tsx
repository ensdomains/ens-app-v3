import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecentTransactions } from '@rainbow-me/rainbowkit'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { DisplayItems } from '@app/components/@molecules/TransactionModal/DisplayItems'
import PaperPlaneColourSVG from '@app/assets/PaperPlaneColour.svg'
import { useChainName } from '@app/hooks/useChainName'
import { Outlink } from '@app/components/Outlink'
import { makeEtherscanLink } from '@app/utils/utils'

import { JsonRpcSigner } from '@ethersproject/providers'
import { ENS } from '@ensdomains/ensjs'
import { NewTransaction } from '@rainbow-me/rainbowkit/dist/transactions/transactionStore'

import {
  DispatchFn,
  MiningStep,
  TransactionActionTypes,
  TransactionState,
  TransactionStep,
} from '@app/types'
import { WaitingElement } from './waitingElement'

const TextContainer = styled.div(
  ({ theme }) => css`
    max-width: ${theme.space['96']};
    text-align: center;
  `,
)

export const TransactionStepComponent = ({ state }: { state: TransactionState }) => {
  const { t } = useTranslation()

  const currentStep = state.steps[state.currentStep]
  const { error } = state.steps[state.currentStep]

  return (
    <>
      {currentStep.stepStatus === 'inProgress' ? (
        <WaitingElement
          {...{
            title: t('transaction.modal.confirm.waiting.title'),
            subTitle: t('transaction.modal.confirm.waiting.subtitle'),
          }}
        />
      ) : null}
      <TextContainer>{error ? <Typography color="red">{error}</Typography> : null}</TextContainer>
      {currentStep.stepStatus === 'completed' ? (
        <>
          <PaperPlaneColourSVG />
          <Typography>Your transaction has been sent to the network.</Typography>
        </>
      ) : null}

      <DisplayItems displayItems={currentStep.infoItems} />
    </>
  )
}

export const createTransactionStep = (): TransactionStep => ({
  type: 'transaction',
  transactionType: 'updateResolver',
  title: 'Send Transaction',
  description: 'Confirm the details of the transaction',
  stepStatus: 'notStarted',
  content: TransactionStepComponent,
  error: null,
  infoItems: [
    {
      label: 'action',
      value: 'Update Resolver',
    },
    {
      label: 'info',
      value: 'Update your current resolver to the new one you have selected',
    },
    {
      label: 'currentResolver',
      value: 'shouldGetUpdated',
      type: 'address',
    },
    {
      label: 'newResolver',
      value: 'shouldGetUpdated',
      type: 'address',
    },
  ],
  buttons: {
    leading: {
      type: 'back',
      clickHandler:
        ({ dispatch }: { dispatch: DispatchFn }) =>
        () => {
          dispatch({
            type: TransactionActionTypes.updateStep,
            payload: { error: null },
          })
          dispatch({
            type: TransactionActionTypes.decreaseStep,
          })
        },
    },
    trailing: {
      type: 'send',
      clickHandler:
        ({
          signer,
          ens,
          currentStep,
          addTransaction,
          dispatch,
          estimatedGas,
        }: {
          signer: JsonRpcSigner
          ens: ENS
          currentStep: TransactionStep
          addTransaction: (transaction: NewTransaction) => void
          dispatch: DispatchFn
          estimatedGas: number
        }) =>
        async () => {
          dispatch({
            type: TransactionActionTypes.updateStep,
            payload: { error: null, stepStatus: 'inProgress' },
          })

          const transaction = await ens.setResolver.populateTransaction(
            currentStep.transactionInfo.name,
            {
              contract: 'registry',
              resolver: currentStep.transactionInfo.newResolver,
              signer,
            },
          )

          let transactionHash
          try {
            transactionHash = await signer.sendUncheckedTransaction({
              ...transaction,
              gasLimit: estimatedGas,
            })
          } catch (error: any) {
            dispatch({
              type: TransactionActionTypes.updateStep,
              payload: { error: error.message, stepStatus: 'notStarted' },
            })
            return
          }
          if (!transactionHash) throw new Error('No transaction generated')

          addTransaction({
            description: JSON.stringify({ action: 'updateResolver', key: transactionHash }),
            hash: transactionHash,
          })

          dispatch({
            type: TransactionActionTypes.updateStep,
            payload: { stepStatus: 'completed', error: null },
          })
          dispatch({
            type: TransactionActionTypes.setUpdateResolverCompletionInfo,
            payload: transaction,
          })
          dispatch({ type: TransactionActionTypes.increaseStep })
        },
    },
  },
  transactionInfo: null,
  gasEstimator: async ({
    currentStep,
    signer,
    ens,
  }: {
    currentStep: TransactionStep
    signer: JsonRpcSigner
    ens: ENS
  }) => {
    const transaction = await ens.setResolver.populateTransaction(
      currentStep.transactionInfo.name,
      {
        contract: 'registry',
        resolver: currentStep.transactionInfo.newResolver,
        signer,
      },
    )
    const estimatedGas = await signer?.estimateGas(transaction)
    return estimatedGas
  },
})

export const MiningStepComponent = ({
  state,
  dispatch,
}: {
  state: TransactionState
  dispatch: DispatchFn
}) => {
  const currentStep = state.steps[state.currentStep]
  const transactions = useRecentTransactions()
  const chainName = useChainName()
  const { t } = useTranslation('common')

  useEffect(() => {
    const currentTransaction = transactions[0]
    if (currentTransaction.status === 'confirmed') {
      dispatch({
        type: TransactionActionTypes.updateStep,
        payload: {
          title: 'Transaction confirmed',
          stepStatus: 'completed',
        },
      })
    }
  }, [transactions, dispatch])

  return (
    <>
      {currentStep.stepStatus === 'inProgress' ? (
        <>
          <WaitingElement
            {...{
              title: 'Waiting for transaction to be saved to the blockchain',
              subTitle: 'Estimated time: 15 seconds',
            }}
          />
          <TextContainer>
            <Typography>
              Your transaction has been sent to the network, but may take some time to confirm. You
              may close this dialog and we will send you a notification when it is ready.
            </Typography>
          </TextContainer>
        </>
      ) : null}
      {currentStep.stepStatus === 'completed' ? (
        <>
          <PaperPlaneColourSVG />
          <TextContainer>
            <Typography>Your transaction has been saved to the blockchain!</Typography>
          </TextContainer>
          <Outlink href={makeEtherscanLink(currentStep.transactionHash?.data!, chainName)}>
            {t('transaction.viewEtherscan')}
          </Outlink>
        </>
      ) : null}

      <DisplayItems displayItems={currentStep.infoItems} />
    </>
  )
}

export const createMiningStep = (): MiningStep => ({
  type: 'mining',
  title: 'Transaction confirmation',
  stepStatus: 'inProgress',
  content: MiningStepComponent,
  description: '',
  error: null,
  infoItems: [
    {
      label: 'action',
      value: 'Update Resolver',
    },
    {
      label: 'info',
      value: 'Update your current resolver to the new one you have selected',
    },
  ],
  buttons: {
    leading: {
      type: 'close',
      clickHandler:
        ({ dispatch }: { dispatch: DispatchFn }) =>
        () => {
          dispatch({ type: TransactionActionTypes.cancelFlow })
        },
    },
    trailing: null,
  },
})
