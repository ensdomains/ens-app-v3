import { ComponentProps, useEffect, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Avatar, Button, Dropdown } from '@ensdomains/thorin'
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
    display: grid;
    grid-template-columns: 120px 1fr;
    align-items: center;
    gap: ${theme.space[4]};
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
}: Props) => {
  const containerRef = useRef<HTMLDivElement | null>(null)
  const modalRef = useRef<HTMLElement | null>(null)
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

  const [isOpen, setIsOpen] = useState(false)

  useEffect(() => {
    const findModal = (el: HTMLElement | null): HTMLElement | null => {
      let node = el
      while (node?.parentNode) {
        node = node?.parentNode as HTMLElement
        if (node.className === 'modal') return node
      }
      return null
    }

    const matched = matchMedia('(min-width: 640px)').matches

    if (matched) return

    if (isOpen) {
      modalRef.current = findModal(containerRef.current)

      if (modalRef.current) {
        const container = modalRef.current.children[1] as HTMLElement

        if (container) {
          container.style.filter = 'blur(20px)'
        }
      }
    } else if (modalRef.current) {
      const container = modalRef.current.children[1] as HTMLElement

      if (container) {
        container.style.filter = ''
      }
    }
  }, [isOpen])

  // const dropdownProps = setIsOpen
  //   ? ({ isOpen, setIsOpen } as { isOpen: boolean; setIsOpen: Dispatch<SetStateAction<boolean>> })
  //   : ({} as { isOpen: never; setIsOpen: never })

  const dropdownProps = {
    isOpen,
    setIsOpen,
  }

  return (
    <Container ref={containerRef}>
      <AvatarWrapper $validated={validated && dirty} $error={error} $dirty={dirty} type="button">
        <Avatar label="profile-button-avatar" src={src} noBorder />
      </AvatarWrapper>

      <Dropdown
        width={150}
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
              {t('input.profileEditor.tabs.avatar.change')}
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
