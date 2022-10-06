import { ReactNode, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, DownIndicatorSVG, Dropdown, Typography } from '@ensdomains/thorin'

import { AvatarWithZorb } from '@app/components/AvatarWithZorb'
import { IconCopyAnimated } from '@app/components/IconCopyAnimated'
import { OutlinedButton } from '@app/components/OutlinedButton'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { useCopied } from '@app/hooks/useCopied'
import { usePrimary } from '@app/hooks/usePrimary'
import { useProfile } from '@app/hooks/useProfile'
import { useRouterWithHistory } from '@app/hooks/useRouterWithHistory'
import { shortenAddress } from '@app/utils/utils'

const ButtonWrapper = styled.div(
  ({ theme }) => css`
    width: 100%;
    & > button {
      border: 1px solid rgba(0, 0, 0, 0.06);
      box-shadow: 0 3px 8px rgba(0, 0, 0, 0.02);
      background-color: ${theme.colors.background};
      border-radius: ${theme.radii.extraLarge};
      & > div {
        width: 100%;
      }
    }
  `,
)

const Content = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['3']};
    flex-gap: ${theme.space['3']};
  `,
)

const Label = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
    font-size: ${theme.fontSizes.small};
  `,
)

const Name = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.text};
    font-size: ${theme.fontSizes.small};
  `,
)

const AvatarWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['6']};
    height: ${theme.space['6']};
  `,
)

const TextContainer = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;
    gap: 0;
    flex-gap: 0;
  `,
)

const OwnerButtonWrapper = ({
  children,
  onClick,
  className,
}: {
  children: ReactNode
  onClick?: () => void
  className?: string
}) => {
  return (
    <ButtonWrapper className={className}>
      <Button onClick={onClick} data-testid="owner-button" size="extraSmall">
        {children}
      </Button>
    </ButtonWrapper>
  )
}

const AddressCopyContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: space-between;
    width: ${theme.space.full};
    padding: ${theme.space['3']};
    color: ${theme.colors.textSecondary};
  `,
)

const AddressCopyButton = styled(OutlinedButton)(
  ({ theme }) => css`
    width: ${theme.space.full};
    & > button > div {
      width: ${theme.space.full};
    }
  `,
)

const InnerDialog = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['1']};
    flex-gap: ${theme.space['1']};
    margin-bottom: ${theme.space['2']};
    padding: 0 ${theme.space['6']};
    width: ${theme.space.full};
  `,
)

const TransferButton = styled.button(
  ({ theme, disabled }) => css`
    outline: none;
    padding: none;
    margin: none;
    border: none;
    background-color: transparent;
    color: ${theme.colors.accent};
    margin-top: ${theme.space['4']};
    ${disabled &&
    css`
      color: ${theme.colors.textTertiary};
      pointer-events: none;
    `}
  `,
)

const ProfileSnippetWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
  `,
)

const OwnerButtonWithPopup = ({
  address,
  name,
  network,
  label,
  description,
  canTransfer,
}: {
  address: string
  name?: string | null
  network: number
  label: string
  description: string
  canTransfer: boolean
}) => {
  const { t } = useTranslation('common')
  const { copy, copied } = useCopied()
  const [open, setOpen] = useState(false)
  const { profile, loading } = useProfile(name!, !name)

  const getTextRecord = (key: string) => profile?.records?.texts?.find((x) => x.key === key)

  return (
    <>
      <OwnerButtonWrapper onClick={() => setOpen(true)}>
        <Content>
          <AvatarWrapper>
            <AvatarWithZorb
              label={name || address}
              address={address}
              name={name || undefined}
              network={network}
            />
          </AvatarWrapper>
          <TextContainer>
            <Label ellipsis>{label}</Label>
            <Name ellipsis data-testid={`owner-button-name-${label}`}>
              {name || shortenAddress(address)}
            </Name>
          </TextContainer>
        </Content>
      </OwnerButtonWrapper>
      <Dialog
        open={open}
        subtitle={description}
        title={label}
        variant="closable"
        onDismiss={() => setOpen(false)}
      >
        <InnerDialog data-testid="owner-button-inner-dialog">
          {name && !loading && (
            <ProfileSnippetWrapper>
              <ProfileSnippet
                name={name}
                network={network}
                button="viewProfile"
                getTextRecord={getTextRecord}
              />
            </ProfileSnippetWrapper>
          )}
          <AddressCopyButton
            variant="transparent"
            size="extraSmall"
            shadowless
            onClick={() => copy(address)}
          >
            <AddressCopyContainer>
              <Typography variant="large" weight="bold">
                {shortenAddress(address, 14, 8, 6)}
              </Typography>
              <IconCopyAnimated color="textTertiary" copied={copied} size="3.5" />
            </AddressCopyContainer>
          </AddressCopyButton>
          {canTransfer && (
            <TransferButton data-testid="transfer-button" disabled>
              <Typography variant="large" weight="bold">
                {t('name.transfer')}
              </Typography>
            </TransferButton>
          )}
        </InnerDialog>
      </Dialog>
    </>
  )
}

const ChevronIcon = styled.div<{ $pressed: boolean }>(
  ({ theme, $pressed }) => css`
    width: ${theme.space['3']};
    color: ${theme.colors.foreground};
    opacity: ${theme.opacity['30']};
    margin: ${theme.space['2']};
    transform: rotate(0deg);
    transition: all 0.2s ease-in-out;
    ${$pressed &&
    css`
      opacity: ${theme.opacity['70']};
      transform: rotate(180deg);
    `}
  `,
)

const OwnerRow = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['1.5']};
    flex-gap: ${theme.space['1.5']};
  `,
)

const ContentWithDropdown = styled(Content)(
  ({ theme }) => css`
    gap: ${theme.space['1']};
    flex-gap: ${theme.space['1']};
  `,
)

const OwnerButtonWrapperWithDropdown = styled(OwnerButtonWrapper)(
  ({ theme }) => css`
    & > button {
      padding: ${theme.space['2']} ${theme.space['3']};
    }
  `,
)

const OwnerButtonWithDropdown = ({
  address,
  name,
  network,
  label,
  canTransfer,
}: {
  address: string
  name?: string | null
  network: number
  label: string
  canTransfer: boolean
}) => {
  const { t } = useTranslation('common')
  const router = useRouterWithHistory()
  const [isOpen, setIsOpen] = useState(false)

  const menuItems = useMemo(() => {
    const items: any[] = [
      {
        label: t('address.viewAddress'),
        color: 'text',
        onClick: () => router.push(`/address/${address}`),
      },
      {
        label: t('address.copyAddress'),
        color: 'text',
        onClick: () => navigator.clipboard.writeText(address),
      },
    ]
    if (name) {
      items[0] = {
        label: t('wallet.viewProfile'),
        color: 'text',
        onClick: () => router.push(`/profile/${name}`),
      }
    }
    if (canTransfer) {
      items.push({
        label: t('name.transfer'),
        color: 'accent',
        // eslint-disable-next-line no-alert
        onClick: () => alert('Not implemented'),
      })
    }
    return items
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [address, name, canTransfer])

  return (
    <Dropdown
      items={menuItems}
      isOpen={isOpen}
      setIsOpen={setIsOpen}
      keepMenuOnTop
      shortThrow
      data-testid="owner-button-dropdown"
    >
      <OwnerButtonWrapperWithDropdown onClick={() => setIsOpen(true)}>
        <ContentWithDropdown>
          <Label ellipsis>{label}</Label>
          <div style={{ flexGrow: 1 }} />
          <OwnerRow data-testid={`${label.toLowerCase()}-data`}>
            <Name ellipsis data-testid={`owner-button-name-${label}`}>
              {name || shortenAddress(address)}
            </Name>
            <AvatarWrapper>
              <AvatarWithZorb
                label={name || address}
                address={address}
                name={name || undefined}
                network={network}
              />
            </AvatarWrapper>
          </OwnerRow>
          <ChevronIcon $pressed={isOpen} as={DownIndicatorSVG} />
        </ContentWithDropdown>
      </OwnerButtonWrapperWithDropdown>
    </Dropdown>
  )
}

export const OwnerButton = ({
  address,
  network,
  label,
  canTransfer,
  type = 'dialog',
  description,
}: {
  address: string
  network: number
  label: string
  canTransfer: boolean
  type?: 'dropdown' | 'dialog'
  description: string
}) => {
  const { name } = usePrimary(address)
  if (type === 'dialog') {
    return <OwnerButtonWithPopup {...{ address, network, label, name, description, canTransfer }} />
  }

  return (
    <OwnerButtonWithDropdown
      address={address}
      canTransfer={canTransfer}
      label={label}
      network={network}
      name={name}
    />
  )
}
