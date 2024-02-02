import styled, { css } from 'styled-components'

import { Button, Helper, Typography } from '@ensdomains/thorin'

import { IconCopyAnimated } from '@app/components/IconCopyAnimated'
import { useCopied } from '@app/hooks/useCopied'

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
    height: 46px;
    padding: 0 ${theme.space['4']};
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
  ({ theme }) => css`
    & > div {
      white-space: unset;
    }
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
        <Typography fontVariant="body">{value}</Typography>
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
