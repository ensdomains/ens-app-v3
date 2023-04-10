import { useRef, useState } from 'react'
import { UseFormReturn, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useQueryClient } from 'wagmi'

import { isEncodedLabelhash, labelhash, saveName } from '@ensdomains/ensjs/utils/labels'
import { Button, Dialog, Heading, Typography, mq } from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import {
  NameTableHeader,
  SortDirection,
  SortType,
} from '@app/components/@molecules/NameTableHeader/NameTableHeader'
import { ScrollBoxWithSpinner, SpinnerRow } from '@app/components/@molecules/ScrollBoxWithSpinner'
import {
  Name,
  useAvailablePrimaryNamesForAddress,
} from '@app/hooks/useAvailablePrimaryNamesForAddress'
import { useChainId } from '@app/hooks/useChainId'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import {
  UnknownLabelsForm,
  FormData as UnknownLabelsFormData,
  nameToFormData,
} from '@app/transaction-flow/input/UnknownLabels/views/UnknownLabelsForm'
import { makeIntroItem } from '@app/transaction-flow/intro/index'
import { makeTransactionItem } from '@app/transaction-flow/transaction'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { useEns } from '@app/utils/EnsProvider'
import { RESOLVER_ADDRESSES, emptyAddress } from '@app/utils/constants'

const DEFAULT_PAGE_SIZE = 10

type Data = {
  address: string
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

type FormData = {
  name?: Name
} & UnknownLabelsFormData

const LoadingContainer = styled(InnerDialog)(
  ({ theme }) => css`
    min-height: ${theme.space['72']};
    justify-content: center;
    align-items: center;
    gap: 0;
  `,
)

const HeaderWrapper = styled.div(({ theme }) => [
  css`
    margin: 0 -${theme.space['4']};
  `,
  mq.sm.min(css``),
])

const ContentContainer = styled.form(({ theme }) => [
  css`
    width: 100%;
    max-height: 60vh;
    display: flex;
    flex-direction: column;
  `,
  mq.sm.min(css`
    width: calc(80vw - 2 * ${theme.space['6']});
    max-width: ${theme.space['128']};
  `),
])

const Divider = styled.div(({ theme }) => [
  css`
    width: calc(100% + 2 * ${theme.space['4']});
    margin: 0 -${theme.space['4']};
    height: ${theme.space.px};
    flex: 0 0 ${theme.space.px};
    background: ${theme.colors.border};
  `,
  mq.sm.min(css`
    width: calc(100% + 2 * ${theme.space['6']});
    margin: 0 -${theme.space['6']};
  `),
])

const NameTableHeaderWrapper = styled.div(({ theme }) => [
  css`
    margin: 0 -${theme.space['4']};
    > div {
      border-bottom: none;
    }
  `,
  mq.sm.min(css`
    margin: 0 -${theme.space['4.5']};
  `),
])

const StyledScrollBox = styled(ScrollBoxWithSpinner)(
  ({ theme }) => css`
    width: ${theme.space.full};

    & > div:nth-last-child(2) {
      border-bottom: none;
    }
  `,
)

const ErrorContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: center;
    padding: ${theme.space['4']};
  `,
)

const SelectPrimaryName = ({ data: { address }, dispatch, onDismiss }: Props) => {
  const { t } = useTranslation('transactionFlow')
  const formRef = useRef<HTMLFormElement>(null)
  const queryClient = useQueryClient()

  const form = useForm<FormData>({
    mode: 'onChange',
    defaultValues: {
      name: undefined,
      unknownLabels: {
        tld: '',
        labels: [],
      },
    },
  })
  const { handleSubmit, control, setValue } = form

  const chainId = useChainId()
  const lastestResolverAddress = RESOLVER_ADDRESSES[`${chainId}`]?.[0]
  const { ready: isEnsReady, getResolver } = useEns()

  const [view, setView] = useState<'main' | 'decrypt'>('main')

  const [sortType, setSortType] = useState<SortType>('labelName')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, _setSearchQuery] = useState('')
  const setSearchQuery = useDebouncedCallback(_setSearchQuery, 300, [])

  const {
    names: currentPage,
    count: namesCount,
    loadMore: loadMoreNames,
    isLoading: isLoadingNames,
  } = useAvailablePrimaryNamesForAddress({
    address,
    sort: {
      type: sortType,
      orderDirection: sortDirection,
    },
    search: searchQuery,
    resultsPerPage: DEFAULT_PAGE_SIZE,
  })

  const isLoading = !isEnsReady || isLoadingNames

  const selectedName = useWatch({
    control,
    name: 'name.name',
  })

  const onSubmit = async (data: FormData) => {
    if (!data.name || isLoading) return

    let validName = data.name.name

    const hasEncodedLabel = validName.split('.').some((label) => isEncodedLabelhash(label))
    const hasValidDecodedLabels =
      data.unknownLabels.labels.length === validName.split('.').length - 1 &&
      data.unknownLabels.labels.every(
        ({ label, value }) => label === value || label === labelhash(value),
      )

    // If name has encoded labels and we do not have the decoded labels, switch to decrypt view
    if (hasEncodedLabel && !hasValidDecodedLabels) {
      setValue('unknownLabels', nameToFormData(data.name.name).unknownLabels)
      setView('decrypt')
      return
    }

    // If name has encoded labels and we have the decoded labels, set the final name
    if (hasEncodedLabel && hasValidDecodedLabels) {
      validName = [
        ...data.unknownLabels.labels.map((label) => label.value),
        data.unknownLabels.tld,
      ].join('.')

      saveName(validName)
      queryClient.resetQueries({ exact: true, queryKey: ['validate', data.name.name] })
    }

    // If resolved address is already set, then one step transaction
    if (data.name.isResolvedAddress) {
      dispatch({
        name: 'setTransactions',
        payload: [
          makeTransactionItem('setPrimaryName', {
            address,
            name: validName,
          }),
        ],
      })
      dispatch({
        name: 'setFlowStage',
        payload: 'transaction',
      })
      return
    }

    // If name does not have resolver, then three step transaction
    const isWrapped = !!data.name.fuses
    const resolver = await getResolver(validName)
    const hasResolver = !!resolver && resolver !== emptyAddress
    if (!hasResolver) {
      return dispatch({
        name: 'startFlow',
        key: 'ChangePrimaryName',
        payload: {
          intro: {
            title: ['intro.selectPrimaryName.noResolver.title', { ns: 'transactionFlow' }],
            content: makeIntroItem('GenericWithDescription', {
              description: t('intro.selectPrimaryName.noResolver.description'),
            }),
          },
          transactions: [
            makeTransactionItem('updateResolver', {
              name: validName,
              contract: isWrapped ? 'nameWrapper' : 'registry',
              resolver: lastestResolverAddress,
            }),
            makeTransactionItem('updateEthAddress', {
              address: address!,
              name: validName,
            }),
            makeTransactionItem('setPrimaryName', {
              address,
              name: validName!,
            }),
          ],
        },
      })
    }

    // Name has resolver but not resolved address, then two step transaction
    dispatch({
      name: 'startFlow',
      key: 'ChangePrimaryName',
      payload: {
        intro: {
          title: ['intro.selectPrimaryName.updateEthAddress.title', { ns: 'transactionFlow' }],
          content: makeIntroItem('GenericWithDescription', {
            description: t('intro.selectPrimaryName.updateEthAddress.description'),
          }),
        },
        transactions: [
          makeTransactionItem('updateEthAddress', {
            address: address!,
            name: validName,
          }),
          makeTransactionItem('setPrimaryName', {
            address,
            name: validName!,
          }),
        ],
      },
    })
  }

  const onConfirm = () => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  if (isLoading)
    return (
      <LoadingContainer>
        <Heading>{t('loading', { ns: 'common' })}</Heading>
        <SpinnerRow />
      </LoadingContainer>
    )
  return view === 'decrypt' ? (
    <UnknownLabelsForm
      {...(form as UseFormReturn<UnknownLabelsFormData>)}
      ref={formRef}
      onSubmit={onSubmit}
      onCancel={() => {
        setValue('unknownLabels', nameToFormData('').unknownLabels)
        setView('main')
      }}
      onConfirm={onConfirm}
    />
  ) : (
    <>
      <HeaderWrapper>
        <Dialog.Heading title={t('input.selectPrimaryName.title')} />
      </HeaderWrapper>
      <ContentContainer ref={formRef} onSubmit={handleSubmit(onSubmit)}>
        <Divider />
        {namesCount > DEFAULT_PAGE_SIZE && (
          <>
            <NameTableHeaderWrapper>
              <NameTableHeader
                data-testid="primary-names-modal-header"
                mode="view"
                selectable={false}
                sortType={sortType}
                sortTypeOptionValues={['labelName', 'creationDate', 'expiryDate']}
                sortDirection={sortDirection}
                searchQuery={searchInput}
                selectedCount={0}
                onSortTypeChange={(type) => setSortType(type as SortType)}
                onSortDirectionChange={setSortDirection}
                onSearchChange={(search) => {
                  setSearchInput(search)
                  setSearchQuery(search)
                }}
              />
            </NameTableHeaderWrapper>
            <Divider />
          </>
        )}
        <StyledScrollBox hideDividers onReachedBottom={loadMoreNames}>
          {!!currentPage && currentPage.length > 0 ? (
            <>
              {currentPage?.map((name) => (
                <TaggedNameItem
                  key={name.id}
                  {...name}
                  network={chainId}
                  mode="select"
                  selected={selectedName === name.name}
                  onClick={() => {
                    setValue('name', selectedName === name.name ? undefined : name)
                  }}
                />
              ))}
            </>
          ) : (
            <ErrorContainer>
              <Typography fontVariant="bodyBold" color="grey">
                {namesCount > 0
                  ? t('input.selectPrimaryName.errors.noNamesFound')
                  : t('input.selectPrimaryName.errors.noEligibleNames')}
              </Typography>
            </ErrorContainer>
          )}
        </StyledScrollBox>
        <Divider />
      </ContentContainer>
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button data-testid="primary-next" onClick={onConfirm} disabled={!selectedName}>
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default SelectPrimaryName
