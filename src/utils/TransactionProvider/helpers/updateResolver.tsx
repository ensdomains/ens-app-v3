import { useEffect } from 'react'
import { useTranslation } from 'react-i18next'
import { useRecentTransactions } from '@rainbow-me/rainbowkit'
import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { DisplayItems } from '@app/components/@molecules/TransactionModal/DisplayItems'
import PaperPlaneColourSVG from '@app/assets/PaperPlaneColour.svg'

import { WaitingElement } from './waitingElement'

const TextContainer = styled.div(
  ({ theme }) => css`
    max-width: ${theme.space['96']};
    text-align: center;
  `,
)

export const TransactionStep = ({ actions, state }) => {
  const { t } = useTranslation()

  const currentStep = state.steps[state.currentStep]
  const { error } = state.steps[state.currentStep]

  return (
    <>
      {currentStep.stepStatus === 'inProgress' ? (
        <WaitingElement
          {...{
            title: t('transaction.modal.confirm.waiting.title'),
            subtitle: t('transaction.modal.confirm.waiting.subtitle'),
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

export const createTransactionStep = () => ({
  type: 'transaction',
  transactionType: 'updateResolver',
  title: 'Send Transaction',
  description: 'Confirm the details of the transaction',
  stepStatus: 'notStarted',
  content: TransactionStep,
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
        ({ actions, dispatch }) =>
        () => {
          dispatch({
            type: 'updateStep',
            payload: { error: null },
          })
          actions.decreaseStep()
        },
    },
    trailing: {
      type: 'send',
      clickHandler:
        ({ actions, signer, ens, transactionData, addTransaction, dispatch }) =>
        async () => {
          dispatch({
            type: 'updateStep',
            payload: { error: null, stepStatus: 'inProgress' },
          })

          const transaction = await ens[transactionData.transactionExecutor].populateTransaction(
            transactionData.transactionInfo.name,
            {
              contract: 'registry',
              resolver: transactionData.transactionInfo.newResolver,
              signer,
            },
          )
          const estimatedGas = await signer?.estimateGas(transaction)

          let transactionHash
          try {
            const { hash } = await signer.sendTransaction({
              ...transaction,
              gasLimit: estimatedGas!,
            })
            transactionHash = hash
          } catch (e) {
            dispatch({
              type: 'updateStep',
              payload: { error: e.message, stepStatus: 'notStarted' },
            })
            return
          }

          if (!transactionHash) throw new Error('No transaction generated')

          addTransaction({
            description: JSON.stringify({ action: 'updateResolver', hash: transactionHash }),
            hash: transactionHash,
          })

          dispatch({
            type: 'updateStep',
            payload: { stepStatus: 'completed', error: null },
          })
          actions.setUpdateResolverCompletionInfo()
          dispatch({ type: 'increaseStep' })
        },
    },
  },
  transaction: {
    type: null,
    transactionStatus: 'notStarted',
    transactionExecutor: 'setResolver',
    transactionInfo: null,
  },
})

export const MiningStep = ({ state, actions }) => {
  const currentStep = state.steps[state.currentStep]
  const transactions = useRecentTransactions()

  useEffect(() => {
    const currentTransaction = transactions[0]
    if (currentTransaction.status === 'confirmed') {
      actions.updateStep({
        title: 'Transaction confirmed',
        stepStatus: 'completed',
      })
    }
  }, [transactions])

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
              may close this dialog and we'll send you a notification when it's ready.
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
        </>
      ) : null}

      <DisplayItems displayItems={currentStep.infoItems} />
    </>
  )
}

export const createMiningStep = () => ({
  type: 'completedTransaction',
  transactionType: 'updateResolver',
  title: 'Transaction confirmation',
  stepStatus: 'inProgress',
  content: MiningStep,
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
        ({ actions }) =>
        () => {
          actions.cancelFlow()
        },
    },
    trailing: null,
  },
})
