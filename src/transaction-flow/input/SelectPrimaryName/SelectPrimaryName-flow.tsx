import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useRef, useState } from 'react'
import { useForm, UseFormReturn, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { Address, labelhash } from 'viem'
import { useClient } from 'wagmi'

import { getDecodedName, Name } from '@ensdomains/ensjs/subgraph'
import { decodeLabelhash, isEncodedLabelhash, saveName } from '@ensdomains/ensjs/utils'
import { Button, Dialog, Heading, Typography } from '@ensdomains/thorin'

import { DialogFooterWithBorder } from '@app/components/@molecules/DialogComponentVariants/DialogFooterWithBorder'
import { DialogHeadingWithBorder } from '@app/components/@molecules/DialogComponentVariants/DialogHeadinWithBorder'
import {
  NameTableHeader,
  SortDirection,
  SortType,
} from '@app/components/@molecules/NameTableHeader/NameTableHeader'
import { SpinnerRow } from '@app/components/@molecules/ScrollBoxWithSpinner'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useNamesForAddress } from '@app/hooks/ensjs/subgraph/useNamesForAddress'
import { useGetPrimaryNameTransactionFlowItem } from '@app/hooks/primary/useGetPrimaryNameTransactionFlowItem'
import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { useIsWrapped } from '@app/hooks/useIsWrapped'
import { useProfile } from '@app/hooks/useProfile'
import { createQueryKey } from '@app/hooks/useQueryOptions'
import {
  nameToFormData,
  UnknownLabelsForm,
  FormData as UnknownLabelsFormData,
} from '@app/transaction-flow/input/UnknownLabels/views/UnknownLabelsForm'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'

import { TaggedNameItemWithFuseCheck } from './components/TaggedNameItemWithFuseCheck'

const DEFAULT_PAGE_SIZE = 10

export const hasEncodedLabel = (name: string) =>
  name.split('.').some((label) => isEncodedLabelhash(label))

export const getNameFromUnknownLabels = (
  name: string,
  unknownLabels: UnknownLabelsFormData['unknownLabels'],
) => {
  const [tld, ...reversedLabels] = name.split('.').reverse()
  const labels = reversedLabels.reverse()
  const processedLabels = labels.map((label, index) => {
    const unknownLabel = unknownLabels.labels[index]
    if (
      !!unknownLabel &&
      isEncodedLabelhash(label) &&
      decodeLabelhash(label) === unknownLabel.label &&
      unknownLabel.label === labelhash(unknownLabel.value)
    )
      return unknownLabel.value
    return label
  })
  return [...processedLabels, tld].join('.')
}

type Data = {
  address: Address
}

export type Props = {
  data: Data
} & TransactionDialogPassthrough

type FormData = {
  name?: Name
} & UnknownLabelsFormData

const LoadingContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    min-height: ${theme.space['72']};
    justify-content: center;
    align-items: center;
    gap: 0;
  `,
)

const NameTableHeaderWrapper = styled.div(
  ({ theme }) => css`
    width: calc(100% + 2 * ${theme.space['4']});
    margin: 0 -${theme.space['4']} -${theme.space['4']};
    border-bottom: 1px solid ${theme.colors.border};
    > div {
      border-bottom: none;
    }
    @media (min-width: ${theme.breakpoints.sm}px) {
      width: calc(100% + 2 * ${theme.space['6']});
      margin: 0 -${theme.space['6']} -${theme.space['6']};
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

  const client = useClient()

  const [view, setView] = useState<'main' | 'decrypt'>('main')

  const [sortType, setSortType] = useState<SortType>('labelName')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, _setSearchQuery] = useState('')
  const setSearchQuery = useDebouncedCallback(_setSearchQuery, 300, [])

  const currentPrimary = usePrimaryName({ address })
  const {
    data: namesData,
    hasNextPage,
    fetchNextPage: loadMoreNames,
    isLoading: isLoadingNames,
  } = useNamesForAddress({
    address,
    orderBy: sortType,
    orderDirection: sortDirection,
    filter: {
      searchString: searchQuery,
    },
    pageSize: DEFAULT_PAGE_SIZE,
  })

  // Filter out the primary name's data
  const filteredNamesPages =
    namesData?.pages?.map((page: Name[]) =>
      page.filter((name: Name) => name?.name !== currentPrimary?.data?.name),
    ) || []

  const selectedName = useWatch({
    control,
    name: 'name',
  })

  const { data: isWrapped, isLoading: isWrappedLoading } = useIsWrapped({
    name: selectedName?.name!,
    enabled: !!selectedName?.name,
  })
  const { data: selectedNameProfile } = useProfile({
    name: selectedName?.name!,
    enabled: !!selectedName?.name,
    subgraphEnabled: false,
  })

  const resolverStatus = useResolverStatus({
    name: selectedName?.name!,
    enabled: !!selectedName && !isWrappedLoading,
    migratedRecordsMatch: { type: 'address', match: { id: 60, value: address } },
  })

  const getPrimarynameTransactionFlowItem = useGetPrimaryNameTransactionFlowItem({
    address,
    isWrapped,
    profileAddress: selectedNameProfile?.coins.find((c) => c.id === 60)?.value,
    resolverAddress: selectedNameProfile?.resolverAddress,
    resolverStatus: resolverStatus.data,
  })

  const dispatchTransactions = (name: string) => {
    const transactionFlowItem = getPrimarynameTransactionFlowItem.callBack?.(name)
    if (!transactionFlowItem) return
    const transactionCount = transactionFlowItem.transactions.length
    if (transactionCount === 1) {
      // TODO: Fix typescript transactions error
      dispatch({
        name: 'setTransactions',
        payload: transactionFlowItem.transactions as any[],
      })
      dispatch({
        name: 'setFlowStage',
        payload: 'transaction',
      })
      return
    }
    dispatch({
      name: 'startFlow',
      key: 'ChangePrimaryName',
      payload: transactionFlowItem,
    })
  }

  // Checks if name has encoded labels and attempts decrypt them if they exist
  const validateKey = (input: string) =>
    createQueryKey({
      queryDependencyType: 'independent',
      params: { input },
      functionName: 'validate',
    })
  const { mutate: mutateName, isPending: isMutationLoading } = useMutation({
    mutationFn: async (data: FormData) => {
      if (!data.name?.name) throw new Error('no_name')

      let validName = data.name.name
      if (!hasEncodedLabel(validName)) return validName

      // build name from unkown labels
      validName = getNameFromUnknownLabels(validName, data.unknownLabels)
      if (!hasEncodedLabel(validName)) {
        saveName(validName)
        queryClient.resetQueries({ queryKey: validateKey(data.name?.name) })
        return validName
      }

      // Attempt to decrypt name
      validName = (await getDecodedName(client, {
        name: validName,
        allowIncomplete: true,
      })) as string
      if (!hasEncodedLabel(validName)) {
        saveName(validName)
        queryClient.resetQueries({ queryKey: validateKey(data.name?.name) })
        return validName
      }

      throw new Error('invalid_name')
    },
    onSuccess: (name) => {
      dispatchTransactions(name)
    },
    onError: (error, variables) => {
      if (!(error instanceof Error)) return
      if (error.message === 'invalid_name') {
        setValue('unknownLabels', nameToFormData(variables.name?.name || '').unknownLabels)
        setView('decrypt')
      }
    },
  })

  const onConfirm = () => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  const isLoading = isLoadingNames || isMutationLoading
  const isLoadingName =
    resolverStatus.isLoading || isWrappedLoading || getPrimarynameTransactionFlowItem.isLoading

  // Show header if more than one page has been loaded, if only one page has been loaded but there is another page, or if there is an active search query
  const showHeader =
    (!!namesData && filteredNamesPages.length > 1 && !searchQuery) || hasNextPage || !!searchQuery

  const hasNoEligibleNames =
    !searchQuery && filteredNamesPages.length === 1 && filteredNamesPages[0].length === 0

  if (isLoading)
    return (
      <Dialog.Content hideDividers fullWidth>
        <LoadingContainer>
          <Heading>{t('loading', { ns: 'common' })}</Heading>
          <SpinnerRow />
        </LoadingContainer>
      </Dialog.Content>
    )

  return view === 'decrypt' ? (
    <UnknownLabelsForm
      {...(form as UseFormReturn<UnknownLabelsFormData>)}
      ref={formRef}
      onSubmit={mutateName}
      onCancel={() => {
        setValue('unknownLabels', nameToFormData('').unknownLabels)
        setView('main')
      }}
      onConfirm={onConfirm}
    />
  ) : (
    <>
      <DialogHeadingWithBorder title={t('input.selectPrimaryName.title')} fullWidth />
      {showHeader && (
        <NameTableHeaderWrapper>
          <NameTableHeader
            data-testid="primary-names-modal-header"
            mode="view"
            selectable={false}
            sortType={sortType}
            sortTypeOptionValues={['labelName', 'createdAt', 'expiryDate']}
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
      )}
      <Dialog.Content
        as="form"
        hideDividers
        onReachedBottom={loadMoreNames}
        fullWidth
        horizontalPadding="0"
        gap="0"
        ref={formRef}
        onSubmit={handleSubmit((data) => mutateName(data))}
      >
        {!!namesData && filteredNamesPages[0].length > 0 ? (
          <>
            {filteredNamesPages?.map((page: Name[]) =>
              page.map((name: Name) => (
                <TaggedNameItemWithFuseCheck
                  key={name.id}
                  {...name}
                  mode="select"
                  selected={selectedName?.name === name.name}
                  onClick={() => {
                    setValue('name', selectedName?.name === name.name ? undefined : name)
                  }}
                />
              )),
            )}
          </>
        ) : (
          <ErrorContainer>
            <Typography fontVariant="bodyBold" color="grey">
              {hasNoEligibleNames
                ? t('input.selectPrimaryName.errors.noEligibleNames')
                : t('input.selectPrimaryName.errors.noNamesFound')}
            </Typography>
          </ErrorContainer>
        )}
      </Dialog.Content>
      <DialogFooterWithBorder
        fullWidth
        leading={
          <Button colorStyle="accentSecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button
            data-testid="primary-next"
            onClick={onConfirm}
            disabled={!selectedName || isLoadingName}
            loading={isLoadingName}
          >
            {t('action.next', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default SelectPrimaryName
