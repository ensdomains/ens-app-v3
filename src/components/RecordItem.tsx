import styled, { css } from 'styled-components'

import { Typography, mq } from '@ensdomains/thorin'

import { IconCopyAnimated } from '@app/components/IconCopyAnimated'
import { useCopied } from '@app/hooks/useCopied'

const RecordContainer = styled.button(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
    background: ${theme.colors.foregroundSecondary};
    padding: ${theme.space['2.5']} ${theme.space['3']};
    border-radius: ${theme.radii.large};
    border: ${theme.space.px} solid ${theme.colors.borderTertiary};

    font-size: calc(${theme.fontSizes.small} - ${theme.space.px});
    transition: all 0.15s ease-in-out;
    cursor: pointer;

    &:hover {
      background: rgba(0, 0, 0, 0.08);
      transform: translateY(-1px);
    }

    &:active {
      background: rgba(0, 0, 0, 0.04);
      transform: translateY(0);
    }

    ${mq.md.min(css`
      font-size: ${theme.fontSizes.root};
    `)}
  `,
)

const RecordKey = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
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

    ${mq.md.min(css`
      width: ${theme.space['28']};
      min-width: ${theme.space['28']};
    `)}
  `,
)

const CopyButtonWrapper = styled.div(
  () => css`
    flex-grow: 1;
    display: flex;
    align-items: center;
    justify-content: flex-end;
  `,
)

const RecordValue = styled(Typography)<{ $fullWidth: boolean }>(
  ({ theme, $fullWidth }) => css`
    max-width: calc(
      100% - ${$fullWidth ? '0px' : theme.space['20']} - ${theme.space['9']} -
        ${$fullWidth ? theme.space['2'] : theme.space['4']}
    );

    ${mq.md.min(css`
      max-width: calc(
        100% - ${$fullWidth ? '0px' : theme.space['28']} - ${theme.space['9']} -
          ${$fullWidth ? theme.space['2'] : theme.space['4']}
      );
    `)}
    display: inline-block;
    overflow-wrap: anywhere;
    text-align: left;
  `,
)

const InnerCopyButton = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    width: ${theme.space['9']};
  `,
)

const LegacyType = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.textTertiary};
  `,
)

const RecordItem = ({
  itemKey,
  value,
  showLegacy,
  type,
}: {
  itemKey?: string
  value: string
  showLegacy?: boolean
  type: 'text' | 'address' | 'contentHash'
}) => {
  const { copy, copied } = useCopied()

  return (
    <RecordContainer
      data-testid={
        itemKey ? `name-details-${type}-${itemKey.toLowerCase()}` : `name-details-${type}`
      }
      onClick={() => copy(value)}
    >
      {itemKey && (
        <RecordKey weight="bold">
          {showLegacy ? itemKey.replace('_LEGACY', '') : itemKey}
          <LegacyType weight="bold" variant="label">
            {showLegacy && 'LEGACY'}
          </LegacyType>
        </RecordKey>
      )}
      <RecordValue $fullWidth={!itemKey}>{value}</RecordValue>
      <CopyButtonWrapper>
        <InnerCopyButton>
          <IconCopyAnimated color="textTertiary" copied={copied} size="3.5" />
        </InnerCopyButton>
      </CopyButtonWrapper>
    </RecordContainer>
  )
}

export default RecordItem
