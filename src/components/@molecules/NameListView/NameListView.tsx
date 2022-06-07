import type { ReturnedName } from '@app/hooks/useNamesFromAddress'
import { Heading, Tag, mq } from '@ensdomains/thorin'
import styled, { css } from 'styled-components'
import { NameDetailItem } from '@app/components/@atoms/NameDetailItem/NameDetailItem'
import { ShortExpiry } from '@app/components/@atoms/ExpiryComponents/ExpiryComponents'
import { useTranslation } from 'next-i18next'
import { TabWrapper } from '../../profile/TabWrapper'

const OtherItemsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: center;
    gap: ${theme.space['2']};
    flex-gap: ${theme.space['2']};
    ${mq.md.min(css`
      gap: ${theme.space['4']};
      flex-gap: ${theme.space['4']};
    `)}
  `,
)

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
  network: string
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
        <NameDetailItem key={name.name} network={network} {...name}>
          <OtherItemsContainer>
            {name.expiryDate && <ShortExpiry expiry={name.expiryDate} />}
            <Tag tone={name.isController ? 'accent' : 'secondary'}>
              Controller
            </Tag>
            <Tag tone={name.isRegistrant ? 'accent' : 'secondary'}>
              Registrant
            </Tag>
          </OtherItemsContainer>
        </NameDetailItem>
      ))}
    </TabWrapper>
  )
}
