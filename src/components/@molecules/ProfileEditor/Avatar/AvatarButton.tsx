import { ComponentProps, Dispatch, SetStateAction, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Avatar, Button, Dropdown, Input, Typography } from '@ensdomains/thorin'
import { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

import { LegacyDropdown } from '@app/components/@molecules/LegacyDropdown/LegacyDropdown'

const InicatorContainer = styled.button<{
  $error?: boolean
  $validated?: boolean
  $dirty?: boolean
}>(
  ({ theme, $validated, $dirty, $error }) => css`
    position: relative;
    background-color: ${theme.colors.backgroundPrimary};
    gap: 20px;

    ::after {
      content: '';
      position: absolute;
      background-color: transparent;
      width: 16px;
      height: 16px;
      border: 2px solid transparent;
      box-sizing: border-box;
      border-radius: 50%;
      right: 0;
      top: 0;
      transform: translate(-60%, 60%) scale(0.2);
      transition: all 0.3s ease-out;
    }

    ${$dirty &&
    css`
      ::after {
        background-color: ${theme.colors.blue};
        border-color: ${theme.colors.backgroundPrimary};
        transform: translate(-60%, 60%) scale(1);
      }
    `}

    ${$validated &&
    css`
      ::after {
        background-color: ${theme.colors.green};
        border-color: ${theme.colors.backgroundPrimary};
        transform: translate(-60%, 60%) scale(1);
      }
    `}

    ${$error &&
    css`
      ::after {
        background-color: ${theme.colors.red};
        border-color: ${theme.colors.backgroundPrimary};
        transform: translate(-60%, 60%) scale(1);
      }
    `}
  `,
)

const OuterContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: flex-start;
  gap: 20px;
  width: 100%;
`

const ButtonContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 10px;
  flex: 1;
  padding-top: 28px;
`

const DropdownContainer = styled.div`
  width: fit-content;
`

const AvatarContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 128px;
`

const AvatarLabel = styled(Typography)`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

export type AvatarClickType = 'upload' | 'nft' | 'manual'

type PickedDropdownProps = Pick<ComponentProps<typeof Dropdown>, 'isOpen' | 'setIsOpen'>

type Props = {
  disabledUpload?: boolean
  validated?: boolean
  dirty?: boolean
  error?: boolean
  src?: string
  avatarValue?: string
  onSelectOption?: (value: AvatarClickType) => void
  onAvatarChange?: (avatar?: string) => void
  onAvatarSrcChange?: (src?: string) => void
  onAvatarFileChange?: (file?: File) => void
} & PickedDropdownProps

const AvatarButton = ({
  validated,
  disabledUpload,
  dirty,
  error,
  src,
  avatarValue,
  onSelectOption,
  onAvatarChange,
  onAvatarSrcChange,
  onAvatarFileChange,
  isOpen,
  setIsOpen,
}: Props) => {
  const { t } = useTranslation('transactionFlow')

  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleSelectOption = (value: AvatarClickType | 'remove') => () => {
    if (value === 'remove') {
      onAvatarChange?.(undefined)
      onAvatarSrcChange?.(undefined)
    } else if (value === 'upload') {
      fileInputRef.current?.click()
    } else {
      onSelectOption?.(value)
    }
  }

  const dropdownProps = setIsOpen
    ? ({ isOpen, setIsOpen } as { isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>> })
    : ({} as { isOpen: never; setIsOpen: never })

  return (
    <OuterContainer data-testid="avatar-button">
      <AvatarContainer>
        <AvatarLabel>Avatar</AvatarLabel>
        <InicatorContainer
          $validated={validated && dirty}
          $error={error}
          $dirty={dirty}
          type="button"
        >
          <Avatar label="profile-button-avatar" src={src} />
        </InicatorContainer>
      </AvatarContainer>
      <ButtonContainer>
        {avatarValue && (
          <Input label="" value={avatarValue} disabled readOnly data-testid="avatar-uri-display" />
        )}
        <DropdownContainer>
          <LegacyDropdown
            items={
              [
                {
                  label: t('input.profileEditor.tabs.avatar.dropdown.selectNFT'),
                  color: 'text',
                  onClick: handleSelectOption('nft'),
                },
                ...(disabledUpload
                  ? []
                  : [
                      {
                        label: t('input.profileEditor.tabs.avatar.dropdown.uploadImage'),
                        color: 'text',
                        onClick: handleSelectOption('upload'),
                      },
                    ]),
                {
                  label: 'Enter Manually',
                  color: 'text',
                  onClick: handleSelectOption('manual'),
                },
                ...(validated
                  ? [
                      {
                        label: t('action.remove', { ns: 'common' }),
                        color: 'red',
                        onClick: handleSelectOption('remove'),
                      },
                    ]
                  : []),
              ] as DropdownItem[]
            }
            keepMenuOnTop
            shortThrow
            align="right"
            {...dropdownProps}
          >
            <Button width="44" colorStyle="blueSecondary">
              {src ? 'Change avatar' : 'Add avatar'}
            </Button>
            <input
              type="file"
              style={{ display: 'none' }}
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onSelectOption?.('upload')
                  onAvatarFileChange?.(e.target.files[0])
                }
              }}
            />
          </LegacyDropdown>
        </DropdownContainer>
      </ButtonContainer>
    </OuterContainer>
  )
}

export default AvatarButton
