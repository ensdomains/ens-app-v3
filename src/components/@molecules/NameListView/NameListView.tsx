import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Heading } from '@ensdomains/thorin'

import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import { TabWrapper } from '@app/components/pages/profile/TabWrapper'
import type { ReturnedName } from '@app/hooks/useNamesFromAddress'

const NoResultsContianer = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: center;
    padding: ${theme.space['4']};
  `,
)

export const NameListView = ({
  currentPage,
  network,
}: {
  currentPage: ReturnedName[]
  network: number
}) => {
  const { t } = useTranslation('common')
  if (!currentPage || currentPage.length === 0)
    return (
      <NoResultsContianer>
        <Heading as="h3">{t('errors.noResults')}</Heading>
      </NoResultsContianer>
    )
  return (
    <TabWrapper>
      {currentPage.map((name) => (
        <TaggedNameItem key={name.id} {...{ ...name, network }} />
      ))}
    </TabWrapper>
  )
}
