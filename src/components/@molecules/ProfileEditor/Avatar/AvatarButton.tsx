import { ComponentProps, Dispatch, SetStateAction, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Avatar, Dropdown } from '@ensdomains/thorin'
import { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

import CameraIcon from '@app/assets/Camera.svg'
import { LegacyDropdown } from '@app/components/@molecules/LegacyDropdown/LegacyDropdown'

const Container = styled.button<{ $error?: boolean; $validated?: boolean; $dirty?: boolean }>(
  ({ theme, $validated, $dirty, $error }) => css`
    position: relative;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: ${theme.colors.backgroundPrimary};
    cursor: pointer;

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
      transform: translate(-20%, 20%) scale(0.2);
      transition: all 0.3s ease-out;
    }

    ${$dirty &&
    css`
      ::after {
        background-color: ${theme.colors.blue};
        border-color: ${theme.colors.backgroundPrimary};
        transform: translate(-20%, 20%) scale(1);
      }
    `}

    ${$validated &&
    css`
      ::after {
        background-color: ${theme.colors.green};
        border-color: ${theme.colors.backgroundPrimary};
        transform: translate(-20%, 20%) scale(1);
      }
    `}

    ${$error &&
    css`
      ::after {
        background-color: ${theme.colors.red};
        border-color: ${theme.colors.backgroundPrimary};
        transform: translate(-20%, 20%) scale(1);
      }
    `}
  `,
)

const IconMask = styled.div(
  ({ theme }) => css`
    position: absolute;
    top: 0;
    left: 0;
    width: 90px;
    height: 90px;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
    border: 4px solid ${theme.colors.grey};
    overflow: hidden;

    svg {
      width: 40px;
      display: block;
    }
  `,
)

export type AvatarClickType = 'upload' | 'nft'

type PickedDropdownProps = Pick<ComponentProps<typeof Dropdown>, 'isOpen' | 'setIsOpen'>

type Props = {
  disabledUpload?: boolean
  validated?: boolean
  dirty?: boolean
  error?: boolean
  src?: string
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
      {...dropdownProps}
    >
      <Container $validated={validated && dirty} $error={error} $dirty={dirty} type="button">
        <Avatar label="profile-button-avatar" src={src} />
        {!validated && !error && (
          <IconMask>
            <CameraIcon />
          </IconMask>
        )}
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
      </Container>
    </LegacyDropdown>
  )
}

export default AvatarButton
