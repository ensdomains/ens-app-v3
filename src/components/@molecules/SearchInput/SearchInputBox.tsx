/* eslint-disable jsx-a11y/click-events-have-key-events */
/* eslint-disable jsx-a11y/no-static-element-interactions */
/* eslint-disable jsx-a11y/interactive-supports-focus */
import { CancelCircleSVG, Input } from '@ensdomains/thorin'
import { Dispatch, ForwardedRef, forwardRef, SetStateAction } from 'react'
import styled, { css } from 'styled-components'

const SearchInputWrapper = styled.div<{ $size: 'large' | 'extraLarge' }>(
  ({ theme, $size }) => css`
    z-index: 1;
    box-shadow: ${theme.boxShadows['0.25']};
    border-radius: ${theme.radii['2.5xLarge']};
    border-width: 1px;
    border-color: ${theme.colors.borderTertiary};
    width: 100%;
    & input::placeholder {
      color: ${theme.colors.textTertiary};
      font-weight: ${theme.fontWeights.bold};
    }
    ${$size === 'large' &&
    css`
      transition: all 0.35s cubic-bezier(1, 0, 0.1, 1.6);
      max-width: ${theme.space['80']};
      &:focus-within {
        max-width: calc(${theme.space['80']} + ${theme.space['24']});
      }
      box-shadow: ${theme.boxShadows['0.25']};
      & input::placeholder {
        color: ${theme.colors.textTertiary};
      }
    `}
  `,
)

const StyledInputParent = () =>
  css(
    ({ theme }) => css`
      border-radius: ${theme.radii['2.5xLarge']};
      background-color: ${theme.colors.backgroundSecondary};
      transition: background-color 0.35s ease-in-out;
      &:focus-within {
        background-color: ${theme.colors.white};
        & input::placeholder {
          color: transparent;
        }
      }
    `,
  )

const ResetButton = styled.div(
  ({ theme }) => css`
    display: block;
    transition: all 0.15s ease-in-out;
    cursor: pointer;
    color: rgba(${theme.shadesRaw.foreground}, 0.25);
    width: ${theme.space['7']};
    height: ${theme.space['7']};
    margin-right: ${theme.space['2']};
    &:hover {
      color: rgba(${theme.shadesRaw.foreground}, 0.3);
      transform: translateY(-1px);
    }
  `,
)

export const SearchInputBox = forwardRef(
  (
    {
      size = 'extraLarge',
      input,
      setInput,
      containerRef,
    }: {
      size?: 'large' | 'extraLarge'
      input: string
      setInput: Dispatch<SetStateAction<string>>
      containerRef: ForwardedRef<HTMLDivElement>
    },
    ref,
  ) => {
    return (
      <SearchInputWrapper ref={containerRef} $size={size}>
        <Input
          size={size}
          label="Name search"
          hideLabel
          placeholder="Search for a name"
          value={input}
          onChange={(e) => setInput(e.target.value)}
          ref={ref as any}
          suffix={
            input !== '' && (
              <div onClick={() => setInput('')}>
                <ResetButton
                  data-testid="search-invalid"
                  as={CancelCircleSVG}
                />
              </div>
            )
          }
          autoComplete="off"
          autoCorrect="off"
          parentStyles={StyledInputParent()}
          spellCheck="false"
        />
      </SearchInputWrapper>
    )
  },
)
