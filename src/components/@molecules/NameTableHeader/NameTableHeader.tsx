import { PropsWithChildren } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Input, SearchSVG, Select, mq } from '@ensdomains/thorin'

import DownDirectionSVG from '@app/assets/SortAscending.svg'
import UpDirectionSVG from '@app/assets/SortDescending.svg'
import { CheckButton } from '@app/components/@atoms/CheckButton/CheckButton'

const TableHeader = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column-reverse;
    align-items: flex-end;
    border-bottom: 1px solid ${theme.colors.borderTertiary};
    padding: ${theme.space['3']} ${theme.space['4']};
    gap: ${theme.space['2']};
    ${mq.md.min(css`
      flex-direction: row;
      align-items: center;
      padding: ${theme.space['3']} ${theme.space['4.5']};
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
    ${mq.md.min(css`
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

const TableHeaderTrailing = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    ${mq.md.min(css`
      flex: 0 0 ${theme.space['32']};
      width: ${theme.space['32']};
    `)}
  `,
)

const SearchIconWrapper = styled.div(
  ({ theme }) => css`
    svg {
      display: block;
      path {
        stroke-width: 3px;
        stroke: ${theme.colors.textTertiary};
      }
    }
  `,
)

const DirectionButton = styled.button<{ $active: boolean }>(
  ({ theme, $active }) => css`
    width: ${theme.space['9']};
    flex: 0 0 ${theme.space['9']};
    height: ${theme.space['9']};
    border: 1px solid ${theme.colors.borderSecondary};
    border-radius: ${theme.space['2']};
    display: flex;
    justify-content: center;
    align-items: center;
    svg {
      display: block;
      width: ${theme.space['3']};
      height: ${theme.space['3']};
      path {
        fill: ${$active ? theme.colors.accent : theme.colors.textTertiary};
      }
    }
  `,
)

export enum SortType {
  expiryDate = 'expiryDate',
  labelName = 'labelName',
  creationDate = 'creationDate',
}

export enum SortDirection {
  asc = 'asc',
  desc = 'desc',
}

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
    <TableHeader>
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
              />
              <DirectionButton
                $active={sortDirection === SortDirection.desc}
                onClick={() => onSortDirectionChange?.(SortDirection.desc)}
              >
                <UpDirectionSVG />
              </DirectionButton>
              <DirectionButton
                $active={sortDirection === SortDirection.asc}
                onClick={() => onSortDirectionChange?.(SortDirection.asc)}
              >
                <DownDirectionSVG />
              </DirectionButton>
            </TableHeaderLeftControlsContainer>
          )}
        </TableHeaderLeadingLeft>
        <TableHeaderLeadingRight>{children}</TableHeaderLeadingRight>
      </TableHeaderLeading>
      <TableHeaderTrailing>
        <Input
          size="medium"
          label="search"
          value={searchQuery}
          onChange={(e) => onSearchChange?.(e.target.value)}
          hideLabel
          prefix={
            <SearchIconWrapper>
              <SearchSVG />
            </SearchIconWrapper>
          }
          placeholder={t('action.search')}
          parentStyles={css`
            height: 36px;
            border-radius: 8px;
          `}
          padding="2"
        />
      </TableHeaderTrailing>
    </TableHeader>
  )
}
