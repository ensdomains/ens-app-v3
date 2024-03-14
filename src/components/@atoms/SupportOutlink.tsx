import { ComponentProps, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { OutlinkSVG, Typography } from '@ensdomains/thorin'

import { SupportQuestionIcon } from './SupportQuestionIcon'

const StyledAnchor = styled.a(
  ({ theme }) => css`
    --item-color: ${theme.colors.indigo};
    color: var(--item-color);

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['1']};

    transition: color 0.15s ease-in-out;

    :hover {
      --item-color: ${theme.colors.indigoBright};
    }
  `,
)

const StyledSupportIcon = styled(SupportQuestionIcon)(
  ({ theme }) => css`
    background-color: var(--item-color);
    width: ${theme.space['5']};
    height: ${theme.space['5']};
    transition: background-color 0.15s ease-in-out;
  `,
)

const OutlinkIcon = styled.svg(
  ({ theme }) => css`
    --size: calc(${theme.space['2.5']} + ${theme.space['0.25']});
    width: var(--size);
    height: var(--size);
  `,
)

export const SupportOutlink = forwardRef<HTMLAnchorElement, ComponentProps<'a'>>(
  ({ children, ...props }, ref) => (
    <StyledAnchor {...props} ref={ref} rel="noreferrer noopener" target="_blank" role="link">
      <StyledSupportIcon />
      <Typography color="inherit" fontVariant="smallBold">
        {children}
      </Typography>
      <OutlinkIcon as={OutlinkSVG} />
    </StyledAnchor>
  ),
)
