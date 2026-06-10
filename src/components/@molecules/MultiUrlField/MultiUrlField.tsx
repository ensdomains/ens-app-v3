import { useEffect, useMemo, useState } from 'react'
import styled, { css } from 'styled-components'

import { Button, CrossSVG, Input, PlusSVG, Typography } from '@ensdomains/thorin'

import { DynamicIcon } from '@app/components/pages/profile/[name]/registration/steps/Profile/DynamicIcon'

const MAX_URLS = 5

const Container = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2']};
  `,
)

const Row = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    align-items: stretch;
    gap: ${theme.space['2']};
    position: relative;
  `,
)

const ButtonColumn = styled.div<{ $hasLabel: boolean }>(
  ({ theme, $hasLabel }) => css`
    width: ${theme.space['11']};
    display: flex;
    flex-direction: column;
    justify-content: flex-start;

    /* The first row sits below a label, so the trash button is offset down
     * to line up with the input field; rows without a label have no offset. */
    padding-top: ${$hasLabel ? theme.space['8'] : '0'};
    margin-top: -1px;
  `,
)

const DeleteButton = styled.button(
  ({ theme }) => css`
    width: ${theme.space['11']};
    height: ${theme.space['11']};
    display: flex;
    justify-content: center;
    align-items: center;
  `,
)

const InnerButton = styled.div<{ $disabled?: boolean }>(
  ({ theme, $disabled }) => css`
    width: ${theme.space['8']};
    height: ${theme.space['8']};
    border-radius: 50%;
    display: flex;
    align-items: center;
    justify-content: center;
    transition: all 150ms ease-in-out;
    cursor: pointer;

    svg {
      color: ${theme.colors.greyPrimary};
      width: ${theme.space[4]};
      height: ${theme.space[4]};
    }

    &:hover {
      background: ${theme.colors.greySurface};
      transform: translateY(-1px);
    }

    ${$disabled &&
    css`
      svg {
        color: ${theme.colors.border};
      }
      &:hover {
        background: none;
        transform: initial;
        cursor: not-allowed;
      }
    `}
  `,
)

const IconWrapper = styled.div(
  () => css`
    svg {
      display: block;
      width: 22px;
      height: 22px;
    }
  `,
)

const AddRow = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: space-between;
    align-items: center;
    padding-left: ${theme.space['12']};
    padding-right: ${theme.space['11']};
  `,
)

type Props = {
  /** Record key for the underlying ENS text-record (e.g. `simplex.contact`). */
  recordKey: string
  /** Visual heading shown above the first row. */
  label: string
  /** Smaller hint shown next to the label. */
  secondaryLabel?: string
  /** Per-row placeholder. */
  placeholder?: string
  /** Ordered list of URLs. First is primary; rest are fallbacks. */
  value: string[]
  /** Called with the new ordered list whenever the user types / adds / removes. */
  onChange: (next: string[]) => void
  /** Optional aggregate error string surfaced on every row. */
  error?: string
  /** Disable input/edit. */
  disabled?: boolean
  /** Remove the whole record entirely (parent unmounts the field). */
  onDelete?: () => void
}

/**
 * Ordered list editor for ENS text records that hold a comma-separated list
 * of URLs. Used for `simplex.contact` / `simplex.channel`, which can carry
 * multiple SMP-server URLs for redundancy (primary first, fallbacks after).
 *
 * The component treats its `value` prop as the source of truth for which
 * URLs exist; an internal "draft" slot list tracks the per-row input strings
 * so empty rows persist while the user is typing. Empty rows are dropped
 * before being emitted upstream — keeping the form state aligned with the
 * parse rule in `parseSimplexUrls`.
 *
 * Caps at MAX_URLS (5). The `+ Add` button is disabled once the cap is hit;
 * the underlying record on-chain is unconstrained, but the editor refuses
 * to write more than five.
 */
export const MultiUrlField = ({
  recordKey,
  label,
  secondaryLabel,
  placeholder = 'https://smp16.simplex.im/a#…',
  value,
  onChange,
  error,
  disabled,
  onDelete,
}: Props) => {
  // Local draft mirrors the parent's value but preserves empty rows while
  // the user is editing. We re-seed it any time the parent provides a value
  // that has more entries than our current draft (e.g. an external reset).
  const [draft, setDraft] = useState<string[]>(() => (value.length > 0 ? value : ['']))

  useEffect(() => {
    if (value.length > draft.length) {
      setDraft(value.length > 0 ? value : [''])
    }
    // We intentionally do not sync downward on every value-change to avoid
    // wiping the row the user is currently typing into.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value.join('|')])

  const emit = (next: string[]) => {
    setDraft(next)
    // Strip empty rows before notifying the form so the persisted string
    // round-trips cleanly through `parseSimplexUrls`.
    onChange(next.map((s) => s.trim()).filter((s) => s.length > 0))
  }

  const updateAt = (index: number, next: string) => {
    const arr = [...draft]
    arr[index] = next
    emit(arr)
  }

  const removeAt = (index: number) => {
    if (draft.length <= 1) {
      // Last row: clear the field rather than removing the only input.
      emit([''])
      return
    }
    emit(draft.filter((_, i) => i !== index))
  }

  const addRow = () => {
    if (draft.length >= MAX_URLS) return
    emit([...draft, ''])
  }

  const icon = useMemo(
    () => (
      <IconWrapper>
        <DynamicIcon group="social" name={recordKey} />
      </IconWrapper>
    ),
    [recordKey],
  )

  const atCap = draft.length >= MAX_URLS

  return (
    <Container data-testid={`multi-url-field-${recordKey}`}>
      {draft.map((entry, index) => (
        <Row key={index}>
          <Input
            size="medium"
            label={index === 0 ? label : ''}
            labelSecondary={index === 0 ? secondaryLabel : ''}
            // Every row carries the SimpleX glyph so the field is still
            // recognisable past the first row, which alone shows the label.
            icon={icon}
            iconWidth="5.5"
            placeholder={placeholder}
            value={entry}
            disabled={disabled}
            error={index === 0 ? error : undefined}
            data-testid={`multi-url-field-${recordKey}-input-${index}`}
            onKeyDown={(e) => {
              // Comma is the separator inside the on-chain record. Blocking
              // it at keystroke-time prevents the rendered list from shifting
              // mid-edit and removes the only character that could mangle
              // round-trips through `parseSimplexUrls`.
              if (e.key === ',') e.preventDefault()
            }}
            onChange={(e) => updateAt(index, e.target.value.replace(/,/g, ''))}
          />
          <ButtonColumn $hasLabel={index === 0}>
            <DeleteButton
              type="button"
              disabled={disabled}
              data-testid={`multi-url-field-${recordKey}-remove-${index}`}
              onMouseDown={(e) => e.preventDefault()}
              onClick={() => {
                // First row's remove behaves as "delete record" when the
                // record contains only one URL — matches the existing
                // ProfileRecordInput contract.
                if (draft.length === 1 && onDelete) onDelete()
                else removeAt(index)
              }}
            >
              <InnerButton $disabled={disabled}>
                <CrossSVG />
              </InnerButton>
            </DeleteButton>
          </ButtonColumn>
        </Row>
      ))}
      <AddRow>
        <Typography fontVariant="small" color="grey">
          {`${draft.length} of ${MAX_URLS}`}
        </Typography>
        <Button
          // Default <button type> inside a <form> is "submit"; an Add URL
          // click was firing the ProfileEditor form's submit handler before
          // the row could be added. Pin the type so the click is local.
          type="button"
          size="small"
          prefix={PlusSVG}
          disabled={disabled || atCap}
          onClick={addRow}
          data-testid={`multi-url-field-${recordKey}-add`}
        >
          Add URL
        </Button>
      </AddRow>
    </Container>
  )
}

export { MAX_URLS as MULTI_URL_FIELD_CAP }
