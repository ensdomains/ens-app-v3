import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { Button, Typography } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'
import DismissDialogButton from '@app/components/@atoms/DismissDialogButton/DismissDialogButton'
import { makeTransactionItem } from '@app/transaction-flow/transaction'

const Container = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background: radial-gradient(
      41.95% 17.64% at 50.14% 50.08%,
      #ffffff 0%,
      rgba(255, 255, 255, 0.81) 100%
    );
    backdrop-filter: blur(8px);
    border-radius: ${theme.radii.extraLarge};
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10;
  `,
)

const Content = styled.div(
  ({ theme }) => css`
    width: 90%;
    max-width: ${theme.space['72']};
    display: flex;
    flex-direction: column;
    gap: ${theme.space['9']};
  `,
)

const Message = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: center;
  `,
)

const Title = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

const Subtitle = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

const DismissButtonWrapper = styled.div(
  () => css`
    position: absolute;
    top: 0;
    right: 0;
  `,
)

type Props = {
  name: string
  resumable?: boolean
  hasCreatedProfile?: boolean
  latestResolver: string
  oldResolver: string
} & TransactionDialogPassthrough

const ResolverWarningOverlay = ({
  name,
  resumable = false,
  hasCreatedProfile = false,
  latestResolver,
  oldResolver,
  dispatch,
  onDismiss,
}: Props) => {
  const handleUpgrade = () => {
    if (resumable) return dispatch({ name: 'resumeFlow', key: `edit-profile-flow-${name}` })
    if (hasCreatedProfile) {
      dispatch({
        name: 'setTransactions',
        payload: [
          makeTransactionItem('updateResolver', {
            name,
            contract: 'registry',
            resolver: latestResolver,
            oldResolver,
          }),
        ],
      })
      dispatch({ name: 'setFlowStage', payload: 'transaction' })
      return
    }
    dispatch({
      name: 'showDataInput',
      payload: {
        input: {
          name: 'TransferProfile',
          data: { name },
        },
      },
      key: `edit-profile-${name}`,
    })
  }

  const title = (() => {
    if (resumable) return 'Resume profile migration'
    if (hasCreatedProfile) return 'Transfer profile'
    return 'Your resolver is out of date'
  })()

  const subtitle = (() => {
    if (resumable) return 'You have previously started a transaction. Click resume to continue.'
    if (hasCreatedProfile)
      return 'You have migrated a profile to the latest resolver. Click upgrade to update to the latest resolver.'
    return 'Profile editing is disabled until you upgrade your resolver.'
  })()

  const btnTitle = (() => {
    if (resumable) return 'Resume'
    if (hasCreatedProfile) return 'Upgrade'
    return 'Upgrade'
  })()

  return (
    <Container>
      <DismissButtonWrapper>
        <DismissDialogButton onClick={onDismiss} />
      </DismissButtonWrapper>
      <Content>
        <Message>
          <Title variant="extraLarge">{title}</Title>
          <Subtitle weight="medium" color="textSecondary">
            {subtitle}
          </Subtitle>
        </Message>
        <Button onClick={handleUpgrade} shadowless>
          {btnTitle}
        </Button>
      </Content>
    </Container>
  )
}

export default ResolverWarningOverlay
