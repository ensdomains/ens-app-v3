import { ComponentProps, Dispatch, SetStateAction, useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dropdown, Input, Typography } from '@ensdomains/thorin'
import { DropdownItem } from '@ensdomains/thorin/dist/types/components/molecules/Dropdown/Dropdown'

import { LegacyDropdown } from '@app/components/@molecules/LegacyDropdown/LegacyDropdown'
import { useImgTimestamp } from '@app/hooks/useImgTimestamp'

const IndicatorContainer = styled.button<{
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
      transform: translate(50%, -50%) scale(0.2);
      transition: all 0.3s ease-out;
    }

    ${$dirty &&
    css`
      ::after {
        background-color: ${theme.colors.blue};
        border-color: ${theme.colors.backgroundPrimary};
        transform: translate(50%, -50%) scale(1);
      }
    `}

    ${$validated &&
    css`
      ::after {
        background-color: ${theme.colors.green};
        border-color: ${theme.colors.backgroundPrimary};
        transform: translate(50%, -50%) scale(1);
      }
    `}

    ${$error &&
    css`
      ::after {
        background-color: ${theme.colors.red};
        border-color: ${theme.colors.backgroundPrimary};
        transform: translate(50%, -50%) scale(1);
      }
    `}
  `,
)

const OuterContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: flex-start;
    gap: 10px;
    width: 100%;

    @media (min-width: ${theme.breakpoints.md}px) {
      flex-direction: row;
      gap: 20px;
      align-items: center;
      justify-content: flex-start;
    }
  `,
)

const ButtonContainer = styled.div<{ $hasImage?: boolean }>(
  ({ $hasImage, theme }) => css`
    display: flex;
    flex-direction: row;
    gap: 10px;

    @media (min-width: ${theme.breakpoints.md}px) {
      flex-direction: column;
      flex: 1;
      margin-top: 20px;
      ${$hasImage &&
      `
      height: 100px;
      justify-content: space-between;
    `}

      & > div {
        gap: 0;
      }
    }
  `,
)

const InputWrapper = styled.div(
  ({ theme }) => css`
    margin-top: -${theme.space['2']};
  `,
)

const DropdownContainer = styled.div`
  width: fit-content;
`

const HeaderContainer = styled.div`
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 300px;
`

const HeaderLabel = styled(Typography)`
  font-weight: 600;
  font-size: 14px;
  color: ${({ theme }) => theme.colors.textSecondary};
`

const HeaderPreview = styled.div<{ $src?: string }>(
  ({ theme, $src }) => css`
    width: 300px;
    height: 100px;
    border-radius: ${theme.radii.large};
    background-color: ${theme.colors.greyLight};
    background-image: ${$src ? `url(${$src})` : 'none'};
    background-size: cover;
    background-position: center;
    position: relative;
    overflow: hidden;
  `,
)

export type HeaderClickType = 'upload' | 'nft' | 'manual'

type PickedDropdownProps = Pick<ComponentProps<typeof Dropdown>, 'isOpen' | 'setIsOpen'>

type Props = {
  disabledUpload?: boolean
  validated?: boolean
  dirty?: boolean
  error?: boolean
  src?: string
  headerValue?: string
  onSelectOption?: (value: HeaderClickType) => void
  onHeaderChange?: (header?: string) => void
  onHeaderSrcChange?: (src?: string) => void
  onHeaderFileChange?: (file?: File) => void
} & PickedDropdownProps

const HeaderButton = ({
  validated,
  disabledUpload,
  dirty,
  error,
  src,
  headerValue,
  onSelectOption,
  onHeaderChange,
  onHeaderSrcChange,
  onHeaderFileChange,
  isOpen,
  setIsOpen,
}: Props) => {
  const { t } = useTranslation('transactionFlow')
  const { addTimestamp } = useImgTimestamp()

  const fileInputRef = useRef<HTMLInputElement>(null)
  const handleSelectOption = (value: HeaderClickType | 'remove') => () => {
    if (value === 'remove') {
      onHeaderChange?.(undefined)
      onHeaderSrcChange?.(undefined)
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
    <OuterContainer data-testid="header-button">
      <HeaderContainer>
        <HeaderLabel>Header</HeaderLabel>
        <IndicatorContainer
          $validated={validated && dirty}
          $error={error}
          $dirty={dirty}
          type="button"
        >
          <HeaderPreview $src={addTimestamp(src)} id="header-field" />
        </IndicatorContainer>
      </HeaderContainer>
      <ButtonContainer $hasImage={!!src}>
        {headerValue && (
          <InputWrapper>
            <Input
              label=""
              value={headerValue}
              disabled
              readOnly
              data-testid="header-uri-display"
            />
          </InputWrapper>
        )}
        <DropdownContainer>
          <LegacyDropdown
            items={
              [
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
              {src ? 'Change header' : 'Add header'}
            </Button>
            <input
              type="file"
              style={{ display: 'none' }}
              accept="image/*"
              ref={fileInputRef}
              onChange={(e) => {
                if (e.target.files?.[0]) {
                  onSelectOption?.('upload')
                  onHeaderFileChange?.(e.target.files[0])
                }
              }}
            />
          </LegacyDropdown>
        </DropdownContainer>
      </ButtonContainer>
    </OuterContainer>
  )
}

export default HeaderButton
