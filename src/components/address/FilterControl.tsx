import React, { ButtonHTMLAttributes, useState } from 'react'
import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { DynamicPopover, Typography } from '@ensdomains/thorin'
import FilterIcon from '@app/assets/Filter.svg'
import SortControl, {
  SortValue,
} from '@app/components/@molecules/SortControl/SortControl'
import FilterPopover from '@app/components/address/FilterPopover'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { useRouter } from 'next/router'
import CollapsibleContent from '../@atoms/CollapsibleContent/CollapsibleContent'

const Container = styled.div(
  () => css`
    display: flex;
    flex-direction: column;
  `,
)

const ToolBar = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: flex-end;
    justify-content: space-between;
    gap: ${theme.space[2]};
  `,
)

const ToolBarGroup = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: flex-end;
    justify-content: flex-start;
    gap: ${theme.space['2']};
  `,
)

const FilterButtonElement = styled.button<{ $pressed?: boolean }>(
  ({ theme, $pressed }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['3']};
    background: ${$pressed
      ? theme.colors.backgroundSecondary
      : theme.colors.white};
    padding: ${theme.space['1.5']} ${theme.space['4']};
    border: 1px solid ${theme.colors.borderSecondary};
    border-radius: ${theme.space['3']};
    height: ${theme.space['10']};
    transition: background 0.3s ease-in-out;

    :hover {
      background: ${theme.colors.backgroundSecondary};
    }
  `,
)

type FilterButtonProps = {
  pressed?: boolean
} & ButtonHTMLAttributes<HTMLButtonElement>

const FilterButton = ({ pressed, children, ...props }: FilterButtonProps) => {
  return (
    <FilterButtonElement {...props} $pressed={pressed}>
      {children}
    </FilterButtonElement>
  )
}

const DesktopPopoverWrapper = styled.div(
  () => css`
    width: 90vw;
    max-width: 300px;
  `,
)

const MobilePopoverWrapper = styled.div(
  ({ theme }) => css`
    margin-top: ${theme.space['5']};
  `,
)

const NameCountWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    height: ${theme.space['10']};
    white-space: nowrap;
  `,
)

type FilterControlProps = {
  sort: SortValue
  filter: 'none' | 'registration' | 'domain'
  resultsCount?: number
  onChange?: (data: {
    sort: FilterControlProps['sort']
    filter: FilterControlProps['filter']
  }) => void
}

const FilterControl = ({
  sort,
  filter,
  resultsCount = 0,
  onChange,
}: FilterControlProps) => {
  const { t } = useTranslation('address')
  const [showMenu, setShowMenu] = useState(false)
  const breakpoints = useBreakpoint()
  const { isReady } = useRouter()
  const showMobile = isReady && !breakpoints.md

  const handleToggleShowMenu = () => setShowMenu((value) => !value)

  const handleSortChange = (newSort: FilterControlProps['sort']) => {
    if (onChange)
      onChange({
        sort: newSort,
        filter,
      })
  }

  const handleFilterChange = (newFilter: FilterControlProps['filter']) => {
    if (onChange) onChange({ filter: newFilter, sort })
  }

  return (
    <Container>
      <ToolBar>
        {showMobile ? (
          <>
            <FilterButton pressed={showMenu} onClick={handleToggleShowMenu}>
              {t('filter')}
              <FilterIcon />
            </FilterButton>
            <NameCountWrapper>
              <Typography color="textTertiary" weight="bold">
                {t('nameCount', { count: resultsCount })}
              </Typography>
            </NameCountWrapper>
          </>
        ) : (
          <>
            <ToolBarGroup>
              <SortControl value={sort} onChange={handleSortChange} />
              <DynamicPopover
                popover={
                  <DesktopPopoverWrapper>
                    <FilterPopover
                      filter={filter}
                      onFilterChange={handleFilterChange}
                    />
                  </DesktopPopoverWrapper>
                }
                placement="bottom-end"
                open={showMenu}
                onDismiss={() => setShowMenu(false)}
              >
                <FilterButton pressed={showMenu} onClick={handleToggleShowMenu}>
                  {t('filter')}
                  <FilterIcon />
                </FilterButton>
              </DynamicPopover>
            </ToolBarGroup>
            <NameCountWrapper>
              <Typography color="textTertiary" weight="bold">
                {t('nameCount', { count: resultsCount })}
              </Typography>
            </NameCountWrapper>
          </>
        )}
      </ToolBar>
      {showMobile && (
        <CollapsibleContent expanded={showMobile && showMenu}>
          <MobilePopoverWrapper>
            <FilterPopover
              sort={sort}
              filter={filter}
              onSortChange={handleSortChange}
              onFilterChange={handleFilterChange}
            />
          </MobilePopoverWrapper>
        </CollapsibleContent>
      )}
    </Container>
  )
}

export default FilterControl
