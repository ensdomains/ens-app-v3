import React from 'react'
import styled from 'styled-components'
import { useTranslation } from 'next-i18next'
import { DynamicPopover, Typography } from '@ensdomains/thorin'
import FilterIcon from '@app/assets/Filter.svg'
import { SortValue } from '@app/components/@molecules/SortControl/SortControl'
import { OutlinedButton } from '@app/components/OutlinedButton'
import FilterPopover from '@app/components/address/FilterPopover'

const Container = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-between;
`

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

  return (
    <Container>
      <DynamicPopover
        popover={
          <FilterPopover sort={sort} filter={filter} onChange={onChange} />
        }
        placement="bottom-start"
      >
        <OutlinedButton
          variant="secondary"
          suffix={<FilterIcon />}
          size="small"
        >
          {t('filter')}
        </OutlinedButton>
      </DynamicPopover>
      <Typography color="textTertiary">
        {t('nameCount', { count: resultsCount })}
      </Typography>
    </Container>
  )
}

export default FilterControl
