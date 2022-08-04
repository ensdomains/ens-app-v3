import SortControl, { SortValue } from '@app/components/@molecules/SortControl/SortControl'
import { Name } from '@app/types'
import { Field, RadioButton, RadioButtonGroup } from '@ensdomains/thorin'
import React, { ChangeEvent, ComponentProps, Ref } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

const PopoverContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['3']};
    padding: ${theme.space['3']};
    width: 100%;
    background: ${theme.colors.white};
    border: 1px solid ${theme.colors.borderTertiary};
    box-shadow: ${theme.boxShadows['0.02']};
    border-radius: ${theme.space['4']};
  `,
)

const StyledRadioButtonContainer = styled.div`
  ${({ theme }) => `
    padding: ${theme.space['1']} ${theme.space['2']};
    background: ${theme.colors.backgroundSecondary};
    border: 1px solid ${theme.colors.borderSecondary};
    border-radius: ${theme.space['2.5']};
  `}
`

const StyledRadioButton = React.forwardRef(
  ({ onClick, ...props }: ComponentProps<typeof RadioButton>, ref: Ref<HTMLInputElement>) => {
    return (
      <StyledRadioButtonContainer onClick={onClick}>
        <RadioButton ref={ref} {...props} />
      </StyledRadioButtonContainer>
    )
  },
)

const RadioButtonLabel = styled.span(
  ({ theme }) => css`
    font-family: ${theme.fonts.sans};
    font-weight: ${theme.fontWeights.bold};
    font-size: ${theme.fontSizes.root};
    line-height: ${theme.lineHeights['1.375']};
    letter-spacing: ${theme.letterSpacings['-0.01']};
    color: ${theme.colors.black};
    text-transform: capitalize;
  `,
)

type FilterType = Name['type'] | 'none'

type PopoverProps = {
  sort?: SortValue
  filter: FilterType
  onSortChange?: (sort: SortValue) => void
  onFilterChange: (filter: FilterType) => void
}

const FilterPopover = ({ sort, filter, onSortChange, onFilterChange }: PopoverProps) => {
  const { t } = useTranslation('common')

  const handleFilterChange = (e: ChangeEvent<HTMLInputElement>) => {
    const newFilter = e.target.value as FilterType
    onFilterChange(newFilter)
  }

  const handleFilterClick = (newFilter: FilterType) => () => {
    onFilterChange(newFilter)
  }

  return (
    <PopoverContainer data-testid="filter-popover">
      {sort && <SortControl value={sort} onChange={(_sort) => onSortChange && onSortChange(_sort)} />}
      <Field label="Show" width="fit">
        <RadioButtonGroup inline value={filter} onChange={handleFilterChange}>
          <StyledRadioButton
            name="filter"
            value="none"
            label={<RadioButtonLabel>{t('name.all')}</RadioButtonLabel>}
            onClick={handleFilterClick('none')}
          />
          <StyledRadioButton
            name="filter"
            value="registration"
            label={<RadioButtonLabel>{t('name.registrant')}</RadioButtonLabel>}
            onClick={handleFilterClick('registration')}
          />
          <StyledRadioButton
            name="filter"
            value="domain"
            label={<RadioButtonLabel>{t('name.controller')}</RadioButtonLabel>}
            onClick={handleFilterClick('domain')}
          />
        </RadioButtonGroup>
      </Field>
    </PopoverContainer>
  )
}

export default FilterPopover
