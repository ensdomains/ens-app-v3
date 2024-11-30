import { ButtonHTMLAttributes, ReactNode, useEffect, useMemo, useRef, useState } from 'react'
import { useTranslation } from 'react-i18next'
import useTransition, { TransitionState } from 'react-transition-state'
import styled, { css } from 'styled-components'

import { Button, Input, MagnifyingGlassSimpleSVG, PlusSVG, Typography } from '@ensdomains/thorin'

import UnsupportedSVG from '@app/assets/Unsupported.svg'
import { formSafeKey } from '@app/utils/editor'

const Container = styled.div<{ $state: TransitionState }>(
  ({ theme, $state }) => css`
    position: relative;
    border: 1px solid ${theme.colors.border};
    background: ${$state === 'exited' || $state === 'exiting'
      ? theme.colors.backgroundPrimary
      : theme.colors.greySurface};
    max-height: ${$state === 'exited' || $state === 'exiting'
      ? theme.space['12']
      : theme.space['40']};
    transition: all 0.3s ${theme.transitionTimingFunction.inOut};
    box-sizing: content-box;
    border-radius: ${theme.radii.extraLarge};
    cursor: pointer;

    &:hover {
      background: ${$state === 'exited' || $state === 'exiting'
        ? theme.colors.border
        : theme.colors.greySurface};
    }

    ${$state === 'exited' &&
    css`
      &:hover {
        transform: translateY(-1px);
      }
    `}

    ${$state === 'entered' &&
    css`
      border: 1px solid ${theme.colors.border};
    `}
  `,
)

const ControlsContainer = styled.div<{ $state: TransitionState }>(
  ({ theme, $state }) => css`
    transition: all 0.3s ${theme.transitionTimingFunction.inOut};
    top: 0;
    opacity: ${$state === 'entered' || $state === 'entering' ? 1 : 0};
    visibility: ${$state === 'entered' ? 'visible' : 'hidden'};
  `,
)

const ControlsHeader = styled.div(
  () => css`
    display: flex;
  `,
)

const ControlsHeaderLeading = styled.div(
  ({ theme }) => css`
    flex: 1;
    padding: ${theme.space['3']} 0 ${theme.space['3']} ${theme.space['3']};
  `,
)

const InputWrapper = styled.div(
  () => css`
    & > div:first-child {
      & > div:first-child {
        display: none;
      }
    }
  `,
)

const ControlsHeaderTrailing = styled.button<{ $accented: boolean }>(
  ({ theme, $accented }) => css`
    display: flex;
    align-items: center;
    padding: 0 ${theme.space['4']};
    color: ${$accented ? theme.colors.accent : theme.colors.greyPrimary};
    cursor: pointer;
    transition: all 150ms ease-in-out;

    &:disabled {
      color: ${theme.colors.greyBright};
      cursor: not-allowed;
    }

    &:hover {
      color: ${$accented ? theme.colors.accentBright : theme.colors.greyBright};
      transform: translateY(-1px);
    }

    &:disabled:hover {
      color: ${theme.colors.greyBright};
      transform: initial;
    }
  `,
)

const ControlsBody = styled.div(
  ({ theme }) => css`
    display: flex;
    overflow-x: scroll;
    overflow-y: hidden;
    margin-bottom: ${theme.space['0.75']};

    /* stylelint-disable-next-line selector-pseudo-element-no-unknown */
    /* stylelint-disable-next-line selector-pseudo-element-no-unknown */
    &::-webkit-scrollbar-track {
      background-color: transparent;
      margin: 0 ${theme.space['3']};
    }

    &::-webkit-scrollbar {
      height: ${theme.space['1.5']};
      background-color: transparent;
    }

    &::-webkit-scrollbar-thumb {
      border: none;
      border-radius: ${theme.radii.full};
      border-right-style: inset;
      border-right-width: calc(100vw + 100vh);
      border-color: inherit;
    }

    &::-webkit-scrollbar-button {
      display: none;
    }

    &:hover {
      border-color: ${theme.colors.greyPrimary};
    }
  `,
)

const OptionsContainer = styled.div(
  ({ theme }) => css`
    padding: 0 ${theme.space['3']};
    display: flex;
    gap: ${theme.space['1']};
    padding-bottom: ${theme.space['0.75']};
    width: 10px;
  `,
)

type Option = {
  label?: string
  value: string
  prefix?: ReactNode
  node?: ReactNode
}

const OptionContainer = styled.button<{ $inline: boolean }>(
  ({ theme, $inline }) => css`
    position: relative;
    display: flex;
    flex-direction: ${$inline ? 'row' : 'column'};
    align-items: center;
    gap: ${theme.space['1']};
    flex: 0 0 ${$inline ? theme.space['12'] : theme.space['16']};
    width: ${$inline ? 'auto' : theme.space['16']};
    height: ${$inline ? theme.space['12'] : theme.space['16']};
    border: 1px solid ${theme.colors.border};
    background: ${theme.colors.backgroundPrimary};
    border-radius: ${theme.radii.extraLarge};
    padding: ${theme.space['2']} ${$inline ? theme.space['4'] : theme.space['2']};
    cursor: pointer;
  `,
)

const OptionHeader = styled.div(
  ({ theme }) => css`
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      width: ${theme.space['5.5']};
      height: ${theme.space['5.5']};
      display: block;
    }
  `,
)

const OptionBody = styled.div(
  ({ theme }) => css`
    font-size: ${theme.space['3.5']};
    font-weight: ${theme.fontWeights.bold};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    white-space: nowrap;
    overflow: hidden;
    text-overflow: ellipsis;
    text-align: center;
    width: 100%;
    color: ${theme.colors.textSecondary};
  `,
)

type OptionButtonProps = {
  option: Option
  inline?: boolean
  showUnsupportedPrefix?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const OptionButton = ({
  option,
  inline = false,
  showUnsupportedPrefix = true,
  ...props
}: OptionButtonProps) => {
  const header = (() => {
    if (option.prefix) return <OptionHeader>{option.prefix}</OptionHeader>
    if (showUnsupportedPrefix)
      return (
        <OptionHeader>
          <UnsupportedSVG />
        </OptionHeader>
      )
    return null
  })()

  return (
    <OptionContainer type="button" $inline={inline} {...props}>
      {header}
      <OptionBody>{option.label}</OptionBody>
    </OptionContainer>
  )
}

const NoOptionsContainer = styled.div<{ $inline: boolean }>(
  ({ theme, $inline }) => css`
    height: ${$inline ? theme.space['12'] : theme.space['16']};
    padding: 0 ${theme.space['3']} ${theme.space['0.75']} ${theme.space['3']};
    display: flex;
    align-items: center;
    color: ${theme.colors.text};
    font-style: italic;
    margin-bottom: ${theme.space['0.75']};
  `,
)

const SVGWrapper = styled.div(
  ({ theme }) => css`
    svg {
      color: ${theme.colors.greyPrimary};
    }
  `,
)

const ButtonContainer = styled.div<{ $state: TransitionState }>(
  ({ theme, $state }) => css`
    transition: all 0.3s ${theme.transitionTimingFunction.inOut};
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    opacity: ${$state === 'entered' || $state === 'entering' ? 0 : 1};
    visibility: ${$state === 'exited' ? 'visible' : 'hidden'};
  `,
)

type Props = {
  autocomplete?: boolean
  createable?: boolean
  reservedKeys?: string[]
  inline?: boolean
  options?: Option[]
  messages?: {
    addRecord?: string
    noOptions?: string
    selectOption?: string
    createRecord?: string
  }
  onAddRecord?: (value: string) => void
}

const WrappedPlusSVG = () => (
  <SVGWrapper>
    <PlusSVG />
  </SVGWrapper>
)

export const AddRecordButton = ({
  autocomplete,
  createable,
  reservedKeys = [],
  inline = false,
  options: optionsProp,
  messages = {},
  onAddRecord,
}: Props) => {
  const containerRef = useRef<HTMLDivElement>(null)

  const { t } = useTranslation('profile')
  const {
    addRecord = 'Add record',
    noOptions = 'No options available',
    selectOption = 'Select an option',
    createRecord = 'Create a record',
  } = messages

  const [error, setError] = useState<string | undefined>()

  const inputRef = useRef<HTMLInputElement>(null)

  const [state, toggle] = useTransition({
    timeout: 300,
  })

  const handleButtonClick = () => {
    toggle()
    process.nextTick(() => {
      containerRef.current?.scrollIntoView()
    })
  }

  const inputType = (() => {
    if (autocomplete) return 'search'
    if (createable) return 'create'
    return 'placeholder'
  })()

  const [inputValue, setInputValue] = useState('')

  useEffect(() => {
    const trimmedInputValue = inputValue.trim()
    if (reservedKeys.includes(trimmedInputValue)) {
      setError(t('errors.keyInUse', { value: trimmedInputValue }))
    } else {
      setError(undefined)
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [inputValue])

  const hasInput = inputValue.length > 0

  const inputActionType = createable && hasInput ? 'create' : 'cancel'

  const prefix = autocomplete ? <MagnifyingGlassSimpleSVG /> : undefined

  const options = useMemo(() => {
    return optionsProp?.filter(
      (option) => option.label!.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    )
  }, [inputValue, optionsProp])

  useEffect(() => {
    setInputValue('')
    setError(undefined)
  }, [optionsProp])

  // const handleInputChange = (event: ChangeEvent<HTMLInputElement>) => {
  //   setInputValue(event.target.value)
  // }

  const handleInputAction = () => {
    if (inputActionType === 'create' && onAddRecord) {
      onAddRecord(formSafeKey(inputValue))
    }
    toggle(false)
    setInputValue('')
  }

  const handleSelectOption = (value: string) => () => {
    if (onAddRecord) onAddRecord(value)
    toggle(false)
    setInputValue('')
  }

  return (
    <Container $state={state} ref={containerRef} data-testid="add-record-button">
      <ControlsContainer $state={state} data-testid="add-record-button-controls">
        <ControlsHeader>
          <ControlsHeaderLeading>
            {inputType === 'placeholder' ? (
              <div>{selectOption}</div>
            ) : (
              <InputWrapper>
                <Input
                  ref={inputRef}
                  icon={prefix}
                  suffixAs="div"
                  value={inputValue}
                  label=""
                  size="small"
                  placeholder={
                    inputType === 'search' ? t('action.search', { ns: 'common' }) : createRecord
                  }
                  error={error}
                  clearable
                  onChange={(e) => setInputValue(e.target.value)}
                  data-testid="add-record-button-input"
                />
              </InputWrapper>
            )}
          </ControlsHeaderLeading>
          <ControlsHeaderTrailing
            type="button"
            $accented={inputActionType === 'create'}
            onClick={handleInputAction}
            disabled={!!error}
            data-testid="add-record-button-action-button"
          >
            {inputActionType === 'create'
              ? t('action.add', { ns: 'common' })
              : t('action.cancel', { ns: 'common' })}
          </ControlsHeaderTrailing>
        </ControlsHeader>
        {options && (
          <ControlsBody>
            {options.length > 0 ? (
              <OptionsContainer>
                {options.map((option) => (
                  <OptionButton
                    key={option.value}
                    option={option}
                    inline={inline}
                    showUnsupportedPrefix={!inline}
                    onClick={handleSelectOption(option.value)}
                    data-testid={`add-record-button-option-${option.value}`}
                  />
                ))}
              </OptionsContainer>
            ) : (
              <NoOptionsContainer $inline={inline}>{noOptions}</NoOptionsContainer>
            )}
          </ControlsBody>
        )}
      </ControlsContainer>
      <ButtonContainer $state={state}>
        <Button
          prefix={WrappedPlusSVG}
          colorStyle="transparent"
          onClick={handleButtonClick}
          size="medium"
          data-testid="add-record-button-button"
        >
          <Typography color="greyPrimary">{addRecord}</Typography>
        </Button>
      </ButtonContainer>
    </Container>
  )
}
