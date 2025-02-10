import styled, { css } from 'styled-components'

export const DateLayout = styled.div(
  ({ theme }) => css`
    align-self: flex-start;
    flex-grow: 1;
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    justify-content: center;

    & > div:first-of-type {
      color: ${theme.colors.grey};
      margin-bottom: ${theme.space['2']};
      font-weight: ${theme.fontWeights.bold};
    }

    & > div:nth-of-type(2) {
      color: ${theme.colors.text};
      font-weight: ${theme.fontWeights.bold};
    }

    & > div:nth-of-type(3) {
      color: ${theme.colors.grey};
      font-weight: ${theme.fontWeights.normal};
      font-size: ${theme.fontSizes.small};
    }

    #remind-me-button {
      cursor: pointer;
    }

    #remind-me-button,
    & > a {
      display: flex;
      flex-direction: row;
      align-items: center;
      justify-content: center;
      height: ${theme.space['5.5']};
      color: ${theme.colors.accent};
      font-weight: ${theme.fontWeights.bold};

      /* stylelint-disable-next-line no-descending-specificity */
      & > svg {
        display: inline-block;
        margin-left: ${theme.space['1']};
        width: ${theme.space['3']};
        height: ${theme.space['3']};
      }
    }
  `,
)
