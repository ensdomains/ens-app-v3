import { Checkbox, Field } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'
import SortControl, {
  SortType,
  SortDirection,
} from '../@molecules/SortControl/SortControl'

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
  `,
)

type PopoverProps = {
  sortBy: SortType
  sortDirection: SortDirection
}

const FilterPopover = ({ sortBy, sortDirection }: PopoverProps) => {
  const initialSortValue = {
    type: sortBy,
    direction: sortDirection,
  }

  return (
    <PopoverContainer>
      <SortControl value={initialSortValue} />
      <Field label="Show">
        <CheckBoxesWrapper>
          {['registrant', 'controller', 'owner'].map((type) => (
            <CheckBoxWrapper>
              <Checkbox label={<CheckBoxLabel>{type}</CheckBoxLabel>} />
            </CheckBoxWrapper>
          ))}
        </CheckBoxesWrapper>
      </Field>
    </PopoverContainer>
  )
}

export default FilterPopover
