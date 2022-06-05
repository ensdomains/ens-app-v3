import { Button, Select } from '@ensdomains/thorin'
import UpDirectionSVG from '@app/assets/UpDirection.svg'
import DownDirectionSVG from '@app/assets/DownDirection.svg'
import styled, { css } from 'styled-components'
import React, { ChangeEvent } from 'react'
import mq from '@app/mediaQuery'
import { useTranslation } from 'next-i18next'

const SortAndDirections = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: flex-end;
    justify-content: center;
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

const SelectWrapper = styled.div(
  ({ theme }) => css`
    width: ${theme.space['32']};
    & [role='listbox'] {
      background: ${theme.colors.background};
      z-index: 5;
    }
    ${mq.md.min`
      width: ${theme.space['48']};
    `}
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
  onChange?: (value: SortValue) => void
}

const SortControl = ({ value, onChange }: SortControlProps) => {
  const { t } = useTranslation('common')

  // const [value, setValue] = useState<SortValue>(
  //   _value || { type: SortType.expiryDate, direction: SortDirection.desc },
  // )
  // useEffect(() => {
  //   if (_value && _value !== value) setValue(_value)
  //   // eslint-disable-next-line react-hooks/exhaustive-deps
  // }, [_value])

  const handleTypeChange = (e: ChangeEvent<HTMLInputElement>) => {
    const { value: newType } = e.target
    if (newType in SortType) {
      const newValue = {
        type: newType as SortType,
        direction: value.direction,
      }
      if (onChange) onChange(newValue)
    }
  }

  const handleDirectionClick = (_direction: SortDirection) => () => {
    const newValue = { ...value, direction: _direction }
    if (onChange) onChange(newValue)
  }

  return (
    <SortAndDirections>
      <FilterDropdownContainer>
        <SelectWrapper>
          <Select
            value={value.type}
            size="small"
            label="Sort by"
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
      <Button
        pressed={value.direction === 'desc'}
        onClick={handleDirectionClick(SortDirection.desc)}
        variant="transparent"
        shadowless
        size="extraSmall"
      >
        <div style={{ height: '24px' }}>
          <DownDirectionSVG width="24" height="24" />
        </div>
      </Button>
      <Button
        pressed={value.direction === 'asc'}
        onClick={handleDirectionClick(SortDirection.asc)}
        variant="transparent"
        shadowless
        size="extraSmall"
      >
        <div style={{ height: '24px' }}>
          <UpDirectionSVG width="24" height="24" />
        </div>
      </Button>
    </SortAndDirections>
  )
}

export default SortControl
