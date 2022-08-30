import { ComponentProps } from 'react'

import { render, screen } from '@app/test-utils'

import { SortDirection, SortType } from '../@molecules/SortControl/SortControl'
import FilterPopover from './FilterPopover'

describe('FilterPopover', () => {
  const baseMockData: ComponentProps<typeof FilterPopover> = {
    filter: 'none',
    onFilterChange: jest.fn(),
    onSortChange: jest.fn(),
    sort: undefined,
  }

  it('should render', () => {
    render(<FilterPopover {...baseMockData} />)
    expect(screen.getByTestId('filter-popover')).toBeVisible()
    expect(screen.getByText('name.all')).toBeVisible()
    expect(screen.getByText('name.registrant')).toBeVisible()
    expect(screen.getByText('name.controller')).toBeVisible()
  })
  it('should show sort if specified', () => {
    render(
      <FilterPopover
        {...baseMockData}
        sort={{ direction: SortDirection.asc, type: SortType.labelName }}
      />,
    )
    expect(screen.getByText('Sort by')).toBeVisible()
  })
  it('should callback on filter change', () => {
    render(<FilterPopover {...baseMockData} />)
    screen.getByText('name.registrant').click()
    expect(baseMockData.onFilterChange).toHaveBeenCalledWith('registration')
  })
})
