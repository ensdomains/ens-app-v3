import { useState, ReactNode, useMemo, useRef, ButtonHTMLAttributes } from 'react'
import styled, { css, useTheme } from 'styled-components'
import { Button, CloseSVG, Input, PlusSVG, SearchSVG } from '@ensdomains/thorin'
import useTransition, { TransitionState } from 'react-transition-state'
import UnsupportedSVG from '@app/assets/Unsupported.svg'
import { useTranslation } from 'react-i18next'

const Container = styled.div<{ $state: TransitionState }>(
  ({ theme, $state }) => css`
    position: relative;
    border: 1px solid ${theme.colors.borderTertiary};
    background: ${$state === 'exited' || $state === 'exiting'
      ? theme.colors.white
      : theme.colors.foregroundTertiary};
    max-height: ${$state === 'exited' || $state === 'exiting'
      ? theme.space['12']
      : theme.space['40']};
    transition: all 0.3s ${theme.transitionTimingFunction.inOut};
    overflow: hidden;
    box-sizing: content-box;
    border-radius: ${theme.radii.extraLarge};
    cursor: pointer;

    ${$state === 'exited' &&
    `
    &:hover {
      transform: translateY(-1px);
    }
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

const SearchIconWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['5']};
    height: ${theme.space['5']};

    svg {
      display: block;
      width: 100%;
      height: 100%;
      path {
        stroke-width: 3;
        stroke: ${theme.colors.textTertiary};
      }
    }
  `,
)
const ClearButton = styled.button(
  ({ theme }) => css`
    height: 100%;
    cursor: pointer;

    div {
      display: flex;
      justify-content: center;
      align-items: center;
      width: ${theme.space['6']};
      height: ${theme.space['6']};
      background: ${theme.colors.backgroundTertiary};
      border-radius: 50%;
    }

    svg {
      display: block;
      width: ${theme.space['2.5']};
      height: ${theme.space['2.5']};
      path {
        stroke: ${theme.colors.textTertiary};
        fill: ${theme.colors.textTertiary};
      }
    }
  `,
)

const ControlsHeaderTrailing = styled.button<{ $accented: boolean }>(
  ({ theme, $accented }) => css`
    display: flex;
    align-items: center;
    padding: 0 ${theme.space['4']};
    color: ${$accented ? theme.colors.accent : theme.colors.textTertiary};
    cursor: pointer;
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
      border-color: rgba(${theme.shadesRaw.foreground}, 0.2);
    }
  `,
)

const OptionsContainer = styled.div(
  ({ theme }) => css`
    padding: 0 ${theme.space['3']};
    display: flex;
    gap: ${theme.space['1']};
    padding-bottom: ${theme.space['0.75']};
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
    width: ${$inline ? 'auto' : theme.space['16']};
    height: ${$inline ? theme.space['12'] : theme.space['16']};
    border: 1px solid ${theme.colors.borderTertiary};
    background: ${theme.colors.white};
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
    color: ${theme.colors.textTertiary};
    font-style: italic;
    margin-bottom: ${theme.space['0.75']};
  `,
)

const ButtonContainer = styled.div<{ $state: TransitionState }>(
  ({ theme, $state }) => css`
    transition: all 0.3s ${theme.transitionTimingFunction.inOut};
    position: absolute;
    bottom: -1px;
    left: 0;
    width: 100%;
    opacity: ${$state === 'entered' || $state === 'entering' ? 0 : 1};
    visibility: ${$state === 'exited' ? 'visible' : 'hidden'};
  `,
)

type Props = {
  autocomplete?: boolean
  createable?: boolean
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

export const AddRecordButton = ({
  autocomplete,
  createable,
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

  const inputRef = useRef<HTMLInputElement>(null)
  const theme = useTheme()

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

  const hasInput = inputValue.length > 0

  const inputActionType = createable && hasInput ? 'create' : 'cancel'

  const prefix = autocomplete ? (
    <SearchIconWrapper>
      <SearchSVG />
    </SearchIconWrapper>
  ) : undefined

  const suffix = hasInput ? (
    <ClearButton
      type="button"
      onClick={() => {
        setInputValue('')
        inputRef.current?.focus()
      }}
      data-testid="add-record-button-clear-button"
    >
      <div>
        <CloseSVG />
      </div>
    </ClearButton>
  ) : undefined

  const options = useMemo(() => {
    return optionsProp?.filter(
      (option) => option.label!.toLowerCase().indexOf(inputValue.toLowerCase()) > -1,
    )
  }, [inputValue, optionsProp])

  const handleInputAction = () => {
    if (inputActionType === 'create' && onAddRecord) {
      onAddRecord(inputValue)
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
              <Input
                ref={inputRef}
                prefix={prefix}
                suffix={suffix}
                suffixAs="div"
                value={inputValue}
                label=""
                hideLabel
                placeholder={
                  inputType === 'search' ? t('action.search', { ns: 'common' }) : createRecord
                }
                parentStyles={css`
                  background: white;
                  height: ${theme.space['10']};
                  border-radius: ${theme.radii.extraLarge};
                `}
                padding="3.5"
                onChange={(e) => setInputValue(e.target.value)}
                data-testid="add-record-button-input"
              />
            )}
          </ControlsHeaderLeading>
          <ControlsHeaderTrailing
            type="button"
            $accented={inputActionType === 'create'}
            onClick={handleInputAction}
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
          prefix={<PlusSVG />}
          variant="transparent"
          shadowless
          onClick={handleButtonClick}
          style={{ height: `${theme.space['12']}` }}
          data-testid="add-record-button-button"
        >
          {addRecord}
        </Button>
      </ButtonContainer>
    </Container>
  )
}
