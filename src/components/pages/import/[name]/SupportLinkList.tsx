import { useState } from 'react'
import styled, { css } from 'styled-components'

import { DownChevronSVG, OutlinkSVG, Typography } from '@ensdomains/thorin'

import { SupportQuestionIcon } from '@app/components/@atoms/SupportQuestionIcon'

const SupportLinksContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    border-radius: ${theme.radii.large};
    border: 2px solid ${theme.colors.indigoSurface};
  `,
)

const SupportLinksHeader = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    background-color: ${theme.colors.indigoSurface};
    padding: ${theme.space['4']};
  `,
)

const SupportLinksFirstItems = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
  `,
)

const StyledChevron = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['4']};
    height: ${theme.space['4']};
    color: ${theme.colors.indigo};
    transition: transform 0.15s ${theme.transitionTimingFunction.popIn};

    &[data-contentvisible='true'] {
      transform: rotate(180deg);
    }
  `,
)

const SupportLinkItemContainer = styled.a(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['1']};
    width: calc(100% + 14px);
    padding: ${theme.space['4']};
    color: ${theme.colors.indigo};
    text-decoration: none;
    transition: background-color 0.2s ease-in-out;

    & > svg {
      width: ${theme.space['3']};
      height: ${theme.space['3']};
      color: ${theme.colors.indigo};
    }

    position: relative;

    &:not(:last-child) {
      &::after {
        content: '';
        width: calc(100% - ${theme.space['8']});
        height: 1px;
        background-color: ${theme.colors.indigoSurface};
        position: absolute;
        bottom: 0;
        left: ${theme.space['4']};
      }
    }
  `,
)

const SupportLinksContent = styled.div(
  ({ theme }) => css`
    height: 0;
    border-radius: ${theme.radii.large};

    overflow-y: auto;
    overflow-x: hidden;
    position: relative;

    @property --scrollbar {
      syntax: '<color>';
      inherits: true;
      initial-value: ${theme.colors.greyLight};
    }

    /* stylelint-disable custom-property-no-missing-var-function */
    transition:
      --scrollbar 0.15s ease-in-out,
      height 0.15s ${theme.transitionTimingFunction.popIn};
    /* stylelint-enable custom-property-no-missing-var-function */

    /* total width */
    ::-webkit-scrollbar {
      width: 12px;
      transition: box-shadow 0.15s ease-in-out;
      background-color: transparent;
    }

    ::-webkit-scrollbar-track {
      background-color: transparent;
      /* stylelint-disable-next-line property-no-vendor-prefix */
    }

    ::-webkit-scrollbar-track-piece {
      background-color: transparent;
    }

    ::-webkit-scrollbar-thumb {
      transition: box-shadow 0.15s ease-in-out;
      box-shadow: inset 0 0 12px 12px var(--scrollbar);
      border: solid 4px transparent;
      border-radius: 12px;
      background-color: transparent;
    }

    /* set button(top and bottom of the scrollbar) */
    ::-webkit-scrollbar-button {
      display: none;
    }

    &:hover {
      --scrollbar: ${theme.colors.greyBright};
    }

    &[data-contentvisible='true'] {
      height: 160px;
    }
  `,
)

type SupportLinkItemProps = {
  href: string
  label: string
}

const SupportLinkItem = ({ href, label }: SupportLinkItemProps) => {
  return (
    <SupportLinkItemContainer href={href} target="_blank">
      <Typography color="indigo" fontVariant="bodyBold">
        {label}
      </Typography>
      <OutlinkSVG />
    </SupportLinkItemContainer>
  )
}

export const SupportLinkList = ({
  title,
  items,
}: {
  title: string
  items: SupportLinkItemProps[]
}) => {
  const [contentVisible, setContentVisible] = useState(false)

  return (
    <SupportLinksContainer>
      <SupportLinksHeader onClick={() => setContentVisible(!contentVisible)}>
        <SupportLinksFirstItems>
          <SupportQuestionIcon />
          <Typography fontVariant="bodyBold">{title}</Typography>
        </SupportLinksFirstItems>
        <StyledChevron data-contentvisible={contentVisible} as={DownChevronSVG} />
      </SupportLinksHeader>
      <SupportLinksContent data-contentvisible={contentVisible}>
        {items.map((item) => (
          <SupportLinkItem key={`${item.href}-${item.label}`} href={item.href} label={item.label} />
        ))}
      </SupportLinksContent>
    </SupportLinksContainer>
  )
}
