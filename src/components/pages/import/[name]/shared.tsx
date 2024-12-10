import { ComponentProps, forwardRef } from 'react'
import styled, { css } from 'styled-components'

import { Button, Heading, Helper, Typography } from '@ensdomains/thorin'

import { Card } from '@app/components/Card'
import { IconCopyAnimated } from '@app/components/IconCopyAnimated'
import { useCopied } from '@app/hooks/useCopied'

export const DnsImportCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    @media (min-width: ${theme.breakpoints.sm}px) {
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    }
  `,
)

const StyledHeading = styled(Heading)(
  () => css`
    width: 100%;
    text-align: center;
    word-break: break-all;

    @supports (overflow-wrap: anywhere) {
      overflow-wrap: anywhere;
      word-break: normal;
    }
  `,
)

export const DnsImportHeading = forwardRef<HTMLDivElement, ComponentProps<typeof Heading>>(
  (props, ref) => <StyledHeading ref={ref} {...props} data-testid="import-heading" />,
)

export const DnsImportActionsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: stretch;
    width: 100%;
    gap: ${theme.space['2']};
    @media (min-width: ${theme.breakpoints.sm}px) {
      flex-direction: row;
      justify-content: center;
    }
  `,
)

export const DnsImportActionButton = styled(Button)(
  ({ theme }) => css`
    width: 100%;
    @media (min-width: ${theme.breakpoints.sm}px) {
      width: ${theme.space['40']};
    }
  `,
)

export const SuccessHelper = styled(Helper)(
  ({ theme }) => css`
    background-color: ${theme.colors.greenSurface};
    border-color: ${theme.colors.green};

    & > svg {
      width: ${theme.space['6']};
      height: ${theme.space['6']};

      color: ${theme.colors.green};
    }

    & > svg:first-of-type {
      display: none;
    }
  `,
)

const ButtonInner = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;

    padding: ${theme.space['4']};
    white-space: normal;
    overflow: hidden;
    & > div {
      max-width: 100%;
    }
  `,
)

const CopyableRightContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    gap: ${theme.space['2']};
  `,
)

const NotCopyableContainer = styled.div(
  ({ theme }) => css`
    border-radius: ${theme.radii.large};
    border: 1px solid ${theme.colors.border};
    width: 100%;
  `,
)

const ButtonWithContent = styled(Button)(
  () => css`
    & > div {
      white-space: unset;
    }
  `,
)

export const ValueText = styled(Typography)(
  () => css`
    text-align: right;
    word-break: break-all;
  `,
)

export const DnsDisplayValue = ({
  copyable,
  label,
  value,
}: {
  copyable?: boolean
  label: string
  value: string
}) => {
  const { copy, copied } = useCopied()

  const InnerContent = (
    <ButtonInner>
      <Typography fontVariant="bodyBold" color="grey">
        {label}
      </Typography>
      <CopyableRightContainer>
        <ValueText fontVariant="body">{value}</ValueText>
        {copyable && <IconCopyAnimated color="grey" copied={copied} size="3.5" />}
      </CopyableRightContainer>
    </ButtonInner>
  )

  if (!copyable) return <NotCopyableContainer>{InnerContent}</NotCopyableContainer>

  return (
    <ButtonWithContent
      colorStyle="background"
      onClick={copyable ? () => copy(value) : undefined}
      size="flexible"
      fullWidthContent
    >
      {InnerContent}
    </ButtonWithContent>
  )
}
