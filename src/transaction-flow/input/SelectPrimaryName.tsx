import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { NamePill } from '@app/components/@molecules/NamePill'
import {
  LoadingContainer,
  ScrollBoxWithSpinner,
  SpinnerRow,
} from '@app/components/@molecules/ScrollBoxWithSpinner'
import { useChainId } from '@app/hooks/useChainId'
import { useEns } from '@app/utils/EnsProvider'
import { Button, Dialog, Heading, RadioButton, RadioButtonGroup } from '@ensdomains/thorin'
import { ReactNode, useState } from 'react'
import { useTranslation } from 'react-i18next'
import { useInfiniteQuery } from 'react-query'
import styled, { css } from 'styled-components'
import { makeTransactionItem } from '../transaction'
import { TransactionDialogPassthrough } from '../types'

type Data = {
  address: string
  existingPrimary: string | null
}

type Domain = {
  id: string
  name: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

const StyledScrollBox = styled(ScrollBoxWithSpinner)(
  ({ theme }) => css`
    width: ${theme.space.full};
  `,
)

const querySize = 50

export const SelectPrimaryName = ({
  data: { address, existingPrimary },
  dispatch,
  onDismiss,
}: Props) => {
  const { t } = useTranslation('settings')

  const chainId = useChainId()
  const { gqlInstance } = useEns()

  const { data, fetchNextPage, isLoading } = useInfiniteQuery(
    [address, 'primaryNameOptions'],
    async ({ pageParam }: { pageParam?: string }) => {
      const { domains } = await gqlInstance.request(
        gqlInstance.gql`
      query getEthRecordAvailableNames($address: String!, $lastID: String, $size: Int!) {
        domains(first: $size, where: { id_gt: $lastID, resolvedAddress: $address }) {
          id
          name
        }
      }
    `,
        {
          address: address.toLowerCase(),
          lastID: pageParam || '0',
          size: querySize,
        },
      )

      if (!domains) return []
      return domains as Domain[]
    },
    {
      keepPreviousData: true,
      getNextPageParam: (lastPage) => lastPage[lastPage.length - 1]?.id,
    },
  )

  const names = data?.pages?.reduce((prev, curr) => [...prev, ...curr], [] as Domain[])

  const hasNextPage = data?.pages[data.pages.length - 1].length === querySize

  const [selectedName, setSelectedName] = useState<string | undefined>(undefined)

  const handleSubmit = () => {
    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('setPrimaryName', {
          address,
          name: selectedName!,
        }),
      ],
    })
    dispatch({
      name: 'setFlowStage',
      payload: 'transaction',
    })
  }

  let Content: ReactNode

  if (isLoading) {
    Content = (
      <LoadingContainer>
        <Heading>{t('section.primary.input.loading')}</Heading>
        <SpinnerRow />
      </LoadingContainer>
    )
  } else if (names && names.length > 0) {
    Content = (
      <StyledScrollBox showSpinner={hasNextPage} onReachedBottom={() => fetchNextPage()}>
        <RadioButtonGroup value={selectedName} onChange={(e) => setSelectedName(e.target.value)}>
          {names
            ?.filter((x) => x.name !== existingPrimary)
            .map((name) => (
              <RadioButton
                labelRight
                label={<NamePill name={name.name} network={chainId} key={name.id} />}
                key={name.id}
                name={name.name}
                value={name.name}
              />
            ))}
        </RadioButtonGroup>
      </StyledScrollBox>
    )
  } else {
    Content = (
      <LoadingContainer>
        <Heading>{t('section.primary.input.noNames')}</Heading>
      </LoadingContainer>
    )
  }

  return (
    <>
      <Dialog.Heading title="Select a primary name" />
      <InnerDialog>{Content}</InnerDialog>
      <Dialog.Footer
        leading={
          <Button variant="secondary" tone="grey" shadowless onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button
            data-testid="primary-next"
            shadowless
            onClick={handleSubmit}
            disabled={!selectedName}
          >
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
