import { ComponentProps, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Avatar, Button, Dropdown, mq } from '@ensdomains/thorin'
import { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

const AvatarWrapper = styled.button<{ $error?: boolean; $validated?: boolean; $dirty?: boolean }>(
  ({ theme, $validated, $dirty, $error }) => css`
    position: relative;
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
      :after {
        background-color: ${theme.colors.blue};
        border-color: ${theme.colors.backgroundPrimary};
        transform: translate(-20%, 20%) scale(1);
      }
    `}

    ${$validated &&
    css`
      :after {
        background-color: ${theme.colors.green};
        border-color: ${theme.colors.backgroundPrimary};
        transform: translate(-20%, 20%) scale(1);
      }
    `}

    ${$error &&
    css`
      :after {
        background-color: ${theme.colors.red};
        border-color: ${theme.colors.backgroundPrimary};
        transform: translate(-20%, 20%) scale(1);
      }
    `}
  `,
)

const ActionContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    gap: ${theme.space[2]};
    overflow: hidden;
  `,
)

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: center;
    gap: ${theme.space[4]};
    ${mq.xs.max(css`
      grid-template-columns: 80px 1fr;
    `)}
  `,
)

export type AvatarClickType = 'upload' | 'nft' | 'manual'

type PickedDropdownProps = Pick<ComponentProps<typeof Dropdown>, 'isOpen' | 'setIsOpen'>

type Props = {
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
  error,
  dirty,
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
    ? ({ isOpen, setIsOpen } as {
        isOpen: boolean
        setIsOpen: React.Dispatch<React.SetStateAction<boolean>>
      })
    : ({} as { isOpen: never; setIsOpen: never })

  return (
    <Container>
      <AvatarWrapper $validated={validated && dirty} $error={error} $dirty={dirty} type="button">
        <Avatar label="profile-button-avatar" src={src} noBorder />
      </AvatarWrapper>

      <Dropdown
        width={150}
        direction="down"
        items={
          [
            {
              label: t('input.profileEditor.tabs.avatar.dropdown.selectNFT'),
              color: 'black',
              onClick: handleSelectOption('nft'),
            },
            {
              label: t('input.profileEditor.tabs.avatar.dropdown.uploadImage'),
              color: 'black',
              onClick: handleSelectOption('upload'),
            },
            {
              label: t('input.profileEditor.tabs.avatar.dropdown.enterManually'),
              color: 'black',
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
        {...dropdownProps}
      >
        <ActionContainer>
          {!!src && (
            <Button disabled colorStyle="accentSecondary">
              {src}
            </Button>
          )}
          <div>
            <Button colorStyle="accentSecondary">
              {!!src
                ? t('input.profileEditor.tabs.avatar.change')
                : t('input.profileEditor.tabs.avatar.add')}
            </Button>
          </div>
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
        </ActionContainer>
      </Dropdown>
    </Container>
  )
}

export default AvatarButton
