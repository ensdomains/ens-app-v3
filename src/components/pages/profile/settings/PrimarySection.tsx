import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Avatar, Button, Card, CrossSVG, PersonPlusSVG, Typography, mq } from '@ensdomains/thorin'

import { usePrimary } from '@app/hooks/usePrimary'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'

const NoNameContainer = styled.div(({ theme }) => [
  css`
    display: grid;
    grid:
      'title title' auto
      'description description' auto
      'button button' auto
      / 1fr 1fr;
    grid-row-gap: ${theme.space['4']};
  `,
  mq.sm.min(css`
    grid:
      'title button' auto
      'description description' auto
      / 1fr 1fr;
  `),
])

const NoNameTitle = styled(Typography)(({ theme }) => [
  css`
    grid-area: title;
  `,
  mq.sm.min(css`
    line-height: ${theme.space['10']};
  `),
])

const NoNameButton = styled(Button)(() => [
  css`
    grid-area: button;
  `,
  mq.sm.min(css`
    width: fit-content;
    justify-self: end;
  `),
])

const NoNameDescription = styled(Typography)(
  () => css`
    grid-area: description;
  `,
)

const PrimaryNameContainer = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['4']};
  `,
  mq.sm.min(css`
    flex-direction: row;
    gap: ${theme.space['6']};
  `),
])

const PrimaryNameInfo = styled.div(() => [
  css`
    display: flex;
    flex-direction: column;
    align-items: center;
    flex: 1;
  `,
  mq.sm.min(css`
    align-items: flex-start;
  `),
])

const AvatarContainer = styled.div(({ theme }) => [
  css`
    width: ${theme.space['26']};
    height: ${theme.space['26']};
  `,
  mq.sm.min(css`
    order: -1;
  `),
])

const ActionsContainer = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-direction: row;
    gap: ${theme.space['2']};
  `,
  mq.sm.min(css`
    flex-direction: column-reverse;
    width: ${theme.space['40']};
  `),
])

export const PrimarySection = () => {
  const { t } = useTranslation('settings')

  const { showDataInput } = useTransactionFlow()
  const { address: _address } = useAccount()
  const address = _address as string

  const { name, loading: primaryLoading } = usePrimary(address, !address)

  // const { truncatedName, isLoading: basicLoading } = useBasicName(name, true)

  // const { canSendOwner, canSendManager } = useSelfAbilities(address, name)

  const isLoading = primaryLoading

  const changePrimary = (action: 'reset' | 'select') => () =>
    showDataInput(`changePrimary-${address}`, 'SelectPrimaryName', {
      address,
      existingPrimary: name,
      action,
    })

  if (isLoading) return null
  return name ? (
    <Card>
      <PrimaryNameContainer>
        <PrimaryNameInfo>
          <Typography fontVariant="bodyBold" color="grey">
            Primary Name
          </Typography>
          <Typography fontVariant="headingTwo" ellipsis>
            {name}
          </Typography>
        </PrimaryNameInfo>
        <AvatarContainer>
          <Avatar label="primary name avatar" src={name} />
        </AvatarContainer>
        <ActionsContainer>
          <Button prefix={<CrossSVG />} colorStyle="redSecondary" onClick={changePrimary('reset')}>
            {t('action.reset', { ns: 'common' })}
          </Button>
          <Button prefix={<PersonPlusSVG />} onClick={changePrimary('select')}>
            {t('action.change', { ns: 'common' })}
          </Button>
        </ActionsContainer>
      </PrimaryNameContainer>
    </Card>
  ) : (
    <Card>
      <NoNameContainer>
        <NoNameTitle fontVariant="headingFour">Primary Name</NoNameTitle>
        <NoNameButton size="small" prefix={<PersonPlusSVG />} onClick={changePrimary('select')}>
          Choose primary name
        </NoNameButton>
        <NoNameDescription>
          A primary name links your address to a name, allowing dApps to display a name as your
          profile when connected to them. Learn about primary names
        </NoNameDescription>
      </NoNameContainer>
    </Card>
  )
}
