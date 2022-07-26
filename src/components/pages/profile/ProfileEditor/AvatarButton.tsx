import { Avatar, Dropdown } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'
import CameraIcon from '@app/assets/Camera.svg'
import React from 'react'

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
}

const AvatarButton = ({ validated, error, src, onSelectOption }: Props) => {
  const handleSelectOption = (value: string) => () => {
    if (onSelectOption) onSelectOption(value)
  }

  return (
    <Dropdown
      items={[
        {
          label: 'Select NFT',
          color: 'black',
          onClick: handleSelectOption('nft'),
        },
        {
          label: 'Upload Image',
          color: 'black',
          onClick: handleSelectOption('upload'),
        },
      ]}
      keepMenuOnTop
    >
      <Container $validated={validated} $error={error} type="button">
        <Avatar label="profile-button-avatar" src={src} noBorder />
        {!validated && !error && (
          <IconMask>
            <CameraIcon />
          </IconMask>
        )}
      </Container>
    </Dropdown>
  )
}

export default AvatarButton
