import { Button, DynamicPopover, Typography } from '@ensdomains/thorin'
import React from 'react'
import styled from 'styled-components'
import FilterIcon from '@app/assets/Filter.svg'
import FilterPopover from './FilterPopover'
import { SortDirection, SortType } from '../@molecules/SortControl/SortControl'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

type FilterPopoverProps = {
  sortBy?: SortType
  sortDirection?: SortDirection
  resultsCount?: number
}

const FilterControl = ({
  sortBy = SortType.expiryDate,
  sortDirection = SortDirection.desc,
  resultsCount = 0,
}: FilterPopoverProps) => {
  return (
    <Container>
      <DynamicPopover
        popover={
          <FilterPopover sortBy={sortBy} sortDirection={sortDirection} />
        }
        placement="bottom-start"
      >
        <Button variant="secondary" suffix={<FilterIcon />} size="small">
          Filter
        </Button>
      </DynamicPopover>
      <Typography>{resultsCount} results</Typography>
    </Container>
  )
}

export default FilterControl
