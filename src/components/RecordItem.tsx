import styled, { css } from 'styled-components'

import { Typography } from '@ensdomains/thorin'

import { IconCopyAnimated } from '@app/components/IconCopyAnimated'
import { useCopied } from '@app/hooks/useCopied'
import mq from '@app/mediaQuery'
import { getTestId } from '@app/utils/utils'

const RecordContainer = styled.button<{ $hasBackground?: boolean }>(({ theme, $hasBackground }) => [
  css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
    padding: ${theme.space['1.5']} ${theme.space['3']};
    border-radius: ${theme.radii.large};
    font-size: calc(${theme.fontSizes.small} - ${theme.space.px});
    transition: all 0.15s ease-in-out;
    cursor: pointer;

    ${$hasBackground ? `background: rgba(0, 0, 0, 0.04);` : ``}

    &:hover {
      background: rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }

    &:active {
      background: rgba(0, 0, 0, 0.04);
      transform: translateY(0);
    }
  `,
  mq.md.min(css`
    font-size: ${theme.fontSizes.small};
  `),
])

const RecordKey = styled(Typography)(({ theme }) => [
  css`
    width: ${theme.space['20']};
    min-width: ${theme.space['20']};
    height: ${theme.space.full};
    align-self: flex-start;
    flex-direction: column;
    display: flex;
    align-items: flex-start;
    justify-content: flex-start;
    text-align: left;
    overflow-wrap: break-word;
    word-break: break-all;
  `,
  mq.md.min(css`
    width: ${theme.space['28']};
    min-width: ${theme.space['28']};
  `),
])

const CopyButtonWrapper = styled.div<{ $hasBackground?: boolean }>(
  ({ $hasBackground }) => css`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;

    ${$hasBackground
      ? ``
      : `
      align-self: flex-start;
      padding-top: 3px;
    `}
  `,
)

const RecordValue = styled(Typography)<{ $fullWidth: boolean }>(({ theme, $fullWidth }) => [
  css`
    max-width: calc(
      100% - ${$fullWidth ? '0px' : theme.space['20']} - ${theme.space['9']} -
        ${$fullWidth ? theme.space['2'] : theme.space['4']}
    );
    overflow-wrap: anywhere;
    text-align: left;
  `,
  mq.md.min(css`
    max-width: calc(
      100% - ${$fullWidth ? '0px' : theme.space['28']} - ${theme.space['9']} -
        ${$fullWidth ? theme.space['2'] : theme.space['4']}
    );
  `),
  mq.lg.min(css`
    max-width: 400px;
  `),
  mq.xl.min(css`
    max-width: 600px;
  `),
])

const InnerCopyButton = styled.div(
  ({ theme }) => css`
    width: ${theme.space['9']};
    display: flex;
    align-items: center;
    justify-content: center;
  `,
)

const LegacyType = styled(Typography)`
  ${({ theme }) => `
    color: ${theme.colors.textTertiary};
  `}
`

export const RecordItem = ({
  itemKey,
  value,
  showLegacy,
  hasBackground = true,
  ...props
}: {
  itemKey?: string
  value: string
  showLegacy?: boolean
  hasBackground?: boolean
}) => {
  const { copy, copied } = useCopied()

  return (
    <RecordContainer onClick={() => copy(value)} $hasBackground={hasBackground}>
      {itemKey && (
        <RecordKey weight="bold">
          {showLegacy ? itemKey.replace('_LEGACY', '') : itemKey}
          <LegacyType weight="bold" variant="label">
            {showLegacy && 'LEGACY'}
          </LegacyType>
        </RecordKey>
      )}
      <RecordValue $fullWidth={!itemKey} data-testid={getTestId(props, 'record-value')}>
        {value}
      </RecordValue>
      <CopyButtonWrapper $hasBackground={hasBackground}>
        <InnerCopyButton>
          {value && <IconCopyAnimated color="textTertiary" copied={copied} size="3.5" />}
        </InnerCopyButton>
      </CopyButtonWrapper>
    </RecordContainer>
  )
}
