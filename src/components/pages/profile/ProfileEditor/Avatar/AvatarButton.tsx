import CameraIcon from '@app/assets/Camera.svg'
import { ProfileEditorType } from '@app/types'
import { Avatar, Dropdown } from '@ensdomains/thorin'
import { useRef } from 'react'
import { UseFormSetValue } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

const Container = styled.button<{ $error?: boolean; $validated?: boolean }>(
  ({ theme, $validated, $error }) => css`
    width: 90px;
    height: 90px;
    border-radius: 50%;
    background-color: ${theme.colors.white};
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

    ${$validated &&
    css`
      :after {
        background-color: ${theme.colors.blue};
        border-color: ${theme.colors.white};
        transform: translate(-20%, 20%) scale(1);
      }
    `}

    ${$error &&
    css`
      :after {
        background-color: ${theme.colors.red};
        border-color: ${theme.colors.white};
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
    width: 100%;
    height: 100%;
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    background: linear-gradient(0deg, rgba(0, 0, 0, 0.6), rgba(0, 0, 0, 0.6));
    border: 4px solid ${theme.colors.grey};

    svg {
      width: 40px;
      display: block;
    }
  `,
)

type Props = {
  validated?: boolean
  error?: boolean
  src?: string
  onSelectOption?: (value: string) => void
  setValue: UseFormSetValue<ProfileEditorType>
  setDisplay: (display: string | null) => void
}

const AvatarButton = ({
  validated,
  error,
  src,
  onSelectOption,
  setValue,
  setDisplay,
}: Props) => {
  const { t } = useTranslation('profile')

  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleSelectOption = (value: string) => () => {
    if (value === 'remove') {
      setValue('avatar', undefined)
      setDisplay(null)
    } else if (value === 'upload') {
      fileInputRef.current?.click()
    } else {
      onSelectOption?.(value)
    }
  }

  return (
    <Dropdown
      items={[
        {
          label: t('profileEditor.tabs.avatar.dropdown.selectNFT'),
          color: 'black',
          onClick: handleSelectOption('nft'),
        },
        {
          label: t('profileEditor.tabs.avatar.dropdown.uploadImage'),
          color: 'black',
          onClick: handleSelectOption('upload'),
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
      ]}
      keepMenuOnTop
      shortThrow
    >
      <Container $validated={validated} $error={error} type="button">
        <Avatar label="profile-button-avatar" src={src} noBorder />
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
              setValue('_avatar', e.target.files[0])
              onSelectOption?.('upload')
            }
          }}
        />
      </Container>
    </Dropdown>
  )
}

export default AvatarButton
