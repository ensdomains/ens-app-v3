import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { GetNamesForAddressParameters } from '@ensdomains/ensjs/subgraph'
import { Input, MagnifyingGlassSimpleSVG, mq, Select } from '@ensdomains/thorin'

import DownDirectionSVG from '@app/assets/SortAscending.svg'
import UpDirectionSVG from '@app/assets/SortDescending.svg'
import { CheckButton } from '@app/components/@atoms/CheckButton/CheckButton'

const TableHeader = styled.div<{
  $desktopGap?: 'small' | 'medium'
}>(
  ({ theme, $desktopGap }) => css`
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    border-bottom: 1px solid ${theme.colors.border};
    padding: ${theme.space['3']} ${theme.space['4']};
    gap: ${theme.space['2']};
    ${mq.sm.min(css`
      flex-direction: row;
      align-items: center;
      padding: ${theme.space['3']} ${theme.space['4.5']};
      gap: ${$desktopGap === 'medium' ? theme.space['6'] : theme.space['2']};
    `)}
  `,
)

const TableHeaderLeading = styled.div(
  () => css`
    flex: 1;
    width: 100%;
    display: flex;
    justify-content: space-between;
    align-items: center;
  `,
)

const TableHeaderLeadingLeft = styled.div<{ $isFullWidth: boolean }>(
  ({ theme, $isFullWidth }) => css`
    display: flex;
    gap: ${theme.space['2']};
    align-items: center;
    color: ${theme.colors.text};
    ${$isFullWidth && `flex: 1;`}
    ${mq.sm.min(css`
      gap: ${theme.space['4']};
      flex-basis: auto;
      flex-grow: 0;
      flex-shrink: 0;
    `)}
  `,
)

const TableHeaderLeftControlsContainer = styled.div<{
  $isFullWidth?: boolean
}>(
  ({ theme, $isFullWidth }) => css`
    display: flex;
    gap: ${theme.space['2']};
    align-items: center;
    ${$isFullWidth &&
    css`
      flex: 1;
    `}
  `,
)

const TableHeaderLeadingRight = styled.div(() => css``)

const TableHeaderTrailing = styled.div<{
  $isDesktopFlexibleWidth?: boolean
}>(
  ({ theme, $isDesktopFlexibleWidth }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    ${mq.sm.min(css`
      flex: ${$isDesktopFlexibleWidth ? '2' : `0 0 ${theme.space['32']}`};
      width: ${theme.space['32']};
    `)}
  `,
)

const DirectionButton = styled.button<{ $active: boolean }>(
  ({ theme, $active }) => css`
    transition: all 0.15s ease-in-out;
    width: ${theme.space['10']};
    flex: 0 0 ${theme.space['10']};
    height: ${theme.space['10']};
    border: 1px solid ${theme.colors.border};
    border-radius: ${theme.space['2']};
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    svg {
      display: block;
      width: ${theme.space['3']};
      height: ${theme.space['3']};
      path {
        fill: ${$active ? theme.colors.accent : theme.colors.textTertiary};
      }
    }
    &:hover {
      background-color: ${theme.colors.border};
    }
  `,
)

export type SortType = NonNullable<GetNamesForAddressParameters['orderBy']>

export type SortDirection = 'asc' | 'desc'

export type SortValue = {
  type: SortType
  direction: SortDirection
}

export type NameTableMode = 'view' | 'select'

type Props = {
  sortType?: SortType
  sortTypeOptionValues: SortType[]
  sortDirection: SortDirection
  searchQuery?: string
  mode: NameTableMode
  selectedCount?: number
  selectable?: boolean
  onModeChange?: (mode: NameTableMode) => void
  onSearchChange?: (query: string) => void
  onSortTypeChange?: (type: SortType) => void
  onSortDirectionChange?: (direction: SortDirection) => void
}

export const NameTableHeader = ({
  sortType,
  sortTypeOptionValues,
  sortDirection,
  searchQuery,
  mode,
  selectedCount = 0,
  selectable = true,
  children,
  onModeChange,
  onSortTypeChange,
  onSortDirectionChange,
  onSearchChange,
}: PropsWithChildren<Props>) => {
  const { t } = useTranslation('common')

  const inSelectMode = selectable && mode === 'select'

  const sortTypeOptions = sortTypeOptionValues.map((value) => ({
    label: t(`sortTypes.${value}`),
    value,
  }))

  return (
    <TableHeader $desktopGap={selectable ? 'small' : 'medium'}>
      <TableHeaderLeading>
        <TableHeaderLeadingLeft $isFullWidth={!selectable}>
          {selectable && (
            <CheckButton
              active={mode === 'select'}
              onChange={(active) => onModeChange?.(active ? 'select' : 'view')}
            />
          )}
          {inSelectMode ? (
            <div>{t('unit.selected', { count: selectedCount })}</div>
          ) : (
            <TableHeaderLeftControlsContainer $isFullWidth={!selectable}>
              <Select
                value={sortType}
                size="small"
                label="Sort by"
                hideLabel
                placeholder={t('action.sort')}
                onChange={(e) => {
                  onSortTypeChange?.(e.target.value as SortType)
                }}
                options={sortTypeOptions}
                id="sort-by"
              />
              <DirectionButton
                $active={sortDirection === 'asc'}
                onClick={() => onSortDirectionChange?.('asc')}
                data-testid="direction-button-asc"
              >
                <DownDirectionSVG />
              </DirectionButton>
              <DirectionButton
                $active={sortDirection === 'desc'}
                onClick={() => onSortDirectionChange?.('desc')}
                data-testid="direction-button-desc"
              >
                <UpDirectionSVG />
              </DirectionButton>
            </TableHeaderLeftControlsContainer>
          )}
        </TableHeaderLeadingLeft>
        <TableHeaderLeadingRight>{children}</TableHeaderLeadingRight>
      </TableHeaderLeading>
      <TableHeaderTrailing $isDesktopFlexibleWidth={!selectable}>
        <Input
          data-testid="name-table-header-search"
          size="small"
          label="search"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          hideLabel
          icon={<MagnifyingGlassSimpleSVG />}
          placeholder={t('action.search')}
        />
      </TableHeaderTrailing>
    </TableHeader>
  )
}
