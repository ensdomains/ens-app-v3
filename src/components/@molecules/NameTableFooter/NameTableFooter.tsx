import { ComponentProps } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { PageButtons, Select } from '@ensdomains/thorin'

import { useBreakpoint } from '@app/utils/BreakpointProvider'

const Container = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    justify-content: space-between;
    flex-direction: row;
    align-items: center;
    padding: ${theme.space['3']} ${theme.space['3']};
    border-top: 1px solid ${theme.colors.borderTertiary};
  `,
)

type PageButtonProps = ComponentProps<typeof PageButtons>

type Props = {
  pageSize: number
  onPageSizeChange?: (results: number) => void
} & Omit<PageButtonProps, 'size'>

export const NameTableFooter = ({
  pageSize,
  onPageSizeChange,
  max: _max,
  alwaysShowFirst: _alwaysShowFirst,
  alwaysShowLast: _alwaysShowLast,
  ...props
}: Props) => {
  const { t } = useTranslation('common')
  const breakpoints = useBreakpoint()

  const pageSizeOptions = [5, 10, 25, 50, 100].map((value) => ({
    label: t('unit.perPage', { count: value }),
    value: value.toString(),
  }))

  /* eslint-disable no-nested-ternary */
  const max = typeof _max === 'number' ? _max : breakpoints.sm ? 5 : 3
  const alwaysShowFirst = typeof _alwaysShowFirst === 'boolean' ? _alwaysShowFirst : breakpoints.sm
  const alwaysShowLast = typeof _alwaysShowLast === 'boolean' ? _alwaysShowLast : breakpoints.sm

  return (
    <Container>
      <PageButtons
        {...props}
        size="small"
        max={max}
        alwaysShowFirst={alwaysShowFirst}
        alwaysShowLast={alwaysShowLast}
        showElipsis={breakpoints.sm}
      />
      <div>
        <Select
          hideLabel
          label="Results per page"
          direction="up"
          align="right"
          value={pageSize?.toString()}
          size="small"
          options={pageSizeOptions}
          onChange={(e) => {
            if (onPageSizeChange) {
              onPageSizeChange(parseInt(e.target.value))
              props.onChange(1)
            }
          }}
        />
      </div>
    </Container>
  )
}
