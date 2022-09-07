import React, { ChangeEvent } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Select, mq } from '@ensdomains/thorin'

import DownDirectionSVG from '@app/assets/DownDirection.svg'
import UpDirectionSVG from '@app/assets/UpDirection.svg'

const SortAndDirections = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `,
)

const FilterDropdownContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
  `,
)

const SelectWrapper = styled.div(({ theme }) => [
  css`
    width: ${theme.space['32']};
    & [role='listbox'] {
      background: ${theme.colors.background};
      z-index: 5;
    }
  `,
  mq.md.min(css`
    width: ${theme.space['48']};
  `),
])

const ButtonWrapper = styled.div(
  ({ theme }) => css`
    flex: 0 0 ${theme.space['10']};
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

export type SortControlProps = {
  value: SortValue
  onChange: (value: SortValue) => void
  hideLabel?: boolean
}

const SortControl = ({ value, hideLabel, onChange }: SortControlProps) => {
  const { t } = useTranslation('common')

  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: newType } = e.target
    if (newType in SortType) {
      const newValue = {
        type: newType as SortType,
        direction: value.direction,
      }
      onChange(newValue)
    }
  }

  const handleDirectionClick = (_direction: SortDirection) => () => {
    const newValue = { ...value, direction: _direction }
    onChange(newValue)
  }

  return (
    <SortAndDirections>
      <FilterDropdownContainer>
        <SelectWrapper>
          <Select
            value={value.type}
            size="small"
            label="Sort by"
            hideLabel={hideLabel}
            onChange={handleTypeChange}
            options={[
              { label: t('sortTypes.expiryDate'), value: 'expiryDate' },
              {
                label: t('sortTypes.creationDate'),
                value: 'creationDate',
              },
              { label: t('sortTypes.labelName'), value: 'labelName' },
            ]}
          />
        </SelectWrapper>
      </FilterDropdownContainer>
      <ButtonWrapper>
        <Button
          pressed={value.direction === 'desc'}
          onClick={handleDirectionClick(SortDirection.desc)}
          variant="transparent"
          shadowless
          size="extraSmall"
          data-testid="button-desc"
        >
          <div style={{ height: '24px' }}>
            <DownDirectionSVG width="24" height="24" />
          </div>
        </Button>
      </ButtonWrapper>
      <ButtonWrapper>
        <Button
          pressed={value.direction === 'asc'}
          onClick={handleDirectionClick(SortDirection.asc)}
          variant="transparent"
          shadowless
          size="extraSmall"
          data-testid="button-asc"
        >
          <div style={{ height: '24px' }}>
            <UpDirectionSVG width="24" height="24" />
          </div>
        </Button>
      </ButtonWrapper>
    </SortAndDirections>
  )
}

export default SortControl
