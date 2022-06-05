import React from 'react'
import { Checkbox, Field } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'
import { useTranslation } from 'next-i18next'
import SortControl, { SortValue } from '../@molecules/SortControl/SortControl'

const PopoverContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['3']};
    padding: ${theme.space['3']};
    width: 90vw;
    max-width: 310px;
    background: ${theme.colors.white};
    border: 1px solid ${theme.colors.borderTertiary};
    box-shadow: ${theme.boxShadows['0.02']};
    border-radius: ${theme.space['4']};
  `,
)

const CheckBoxesWrapper = styled.div`
  display: flex;
  justify-content: flex-start;
  flex-wrap: wrap;
  gap: 10px;
`

const CheckBoxWrapper = styled.div`
  ${({ theme }) => `
    padding: ${theme.space['1']} ${theme.space['2']};
    background: ${theme.colors.backgroundSecondary};
    border: 1px solid ${theme.colors.borderSecondary};
    border-radius: ${theme.space['2.5']};
  `}
`

const CheckBoxLabel = styled.span(
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

type PopoverProps = {
  sort: SortValue
  filter: 'none' | 'registration' | 'domain'
  onChange?: (data: Omit<PopoverProps, 'onChange'>) => void
}

const FilterPopover = ({ sort, filter, onChange }: PopoverProps) => {
  const { t } = useTranslation('common')

  const onSortChange = (newSort: SortValue) => {
    if (newSort.type !== sort.type || newSort.direction !== sort.direction) {
      if (onChange) onChange({ sort: newSort, filter })
    }
  }

  const onFilterClick = (newFilter: PopoverProps['filter']) => () => {
    if (filter !== newFilter) {
      if (onChange)
        onChange({
          sort,
          filter: newFilter,
        })
    }
  }

  return (
    <PopoverContainer>
      <SortControl value={sort} onChange={onSortChange} />
      <Field label="Show">
        <CheckBoxesWrapper>
          <CheckBoxWrapper onClick={onFilterClick('registration')}>
            <Checkbox
              value="registration"
              label={<CheckBoxLabel>{t('name.registrant')}</CheckBoxLabel>}
              checked={filter === 'registration'}
              readOnly
            />
          </CheckBoxWrapper>
          <CheckBoxWrapper onClick={onFilterClick('domain')}>
            <Checkbox
              value="domain"
              label={<CheckBoxLabel>{t('name.controller')}</CheckBoxLabel>}
              checked={filter === 'domain'}
              readOnly
            />
          </CheckBoxWrapper>
          <CheckBoxWrapper onClick={onFilterClick('none')}>
            <Checkbox
              value="none"
              label={<CheckBoxLabel>{t('name.all')}</CheckBoxLabel>}
              checked={filter === 'none'}
              readOnly
            />
          </CheckBoxWrapper>
        </CheckBoxesWrapper>
      </Field>
    </PopoverContainer>
  )
}

export default FilterPopover
