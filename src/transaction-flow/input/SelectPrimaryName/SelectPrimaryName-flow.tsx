import { useRef, useState } from 'react'
import { UseFormReturn, useForm, useWatch } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useMutation, useQueryClient } from 'wagmi'

import {
  decodeLabelhash,
  isEncodedLabelhash,
  labelhash,
  saveName,
} from '@ensdomains/ensjs/utils/labels'
import { Button, Dialog, Heading, Typography, mq } from '@ensdomains/thorin'

import { InnerDialog } from '@app/components/@atoms/InnerDialog'
import {
  NameTableHeader,
  SortDirection,
  SortType,
} from '@app/components/@molecules/NameTableHeader/NameTableHeader'
import { ScrollBoxWithSpinner, SpinnerRow } from '@app/components/@molecules/ScrollBoxWithSpinner'
import {
  Name,
  useAvailablePrimaryNamesForAddress,
} from '@app/hooks/names/useAvailablePrimaryNamesForAddress/useAvailablePrimaryNamesForAddress'
import { useGetPrimaryNameTransactionFlowItem } from '@app/hooks/primary/useGetPrimaryNameTransactionFlowItem'
import { useResolverStatus } from '@app/hooks/resolver/useResolverStatus'
import { useBasicName } from '@app/hooks/useBasicName'
import { useChainId } from '@app/hooks/useChainId'
import useDebouncedCallback from '@app/hooks/useDebouncedCallback'
import { useProfile } from '@app/hooks/useProfile'
import {
  UnknownLabelsForm,
  FormData as UnknownLabelsFormData,
  nameToFormData,
} from '@app/transaction-flow/input/UnknownLabels/views/UnknownLabelsForm'
import { TransactionDialogPassthrough } from '@app/transaction-flow/types'
import { useEns } from '@app/utils/EnsProvider'
import { useQueryKeys } from '@app/utils/cacheKeyFactory'

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

const HeaderWrapper = styled.div(
  ({ theme }) =>
    css`
      margin: 0 -${theme.space['4']};
    `,
)

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

const StyledScrollBox = styled(ScrollBoxWithSpinner)(({ theme }) => [
  css`
    width: calc(100% + 2 * ${theme.space['4']});
    margin: 0 -${theme.space['4']};

    & > div:nth-last-child(2) {
      border-bottom: none;
    }
  `,
  mq.sm.min(css`
    width: calc(100% + 2 * ${theme.space['6']});
    margin: 0 -${theme.space['6']};
    max-width: calc(${theme.space['128']} + 2 * ${theme.space['6']});
  `),
])

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

  const { ready: isEnsReady, getDecryptedName } = useEns()

  const [view, setView] = useState<'main' | 'decrypt'>('main')

  const [sortType, setSortType] = useState<SortType>('labelName')
  const [sortDirection, setSortDirection] = useState<SortDirection>('asc')
  const [searchInput, setSearchInput] = useState('')
  const [searchQuery, _setSearchQuery] = useState('')
  const setSearchQuery = useDebouncedCallback(_setSearchQuery, 300, [])

  const {
    data: namesData,
    hasNextPage,
    fetchNextPage: loadMoreNames,
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

  const selectedName = useWatch({
    control,
    name: 'name',
  })

  const { isWrapped, isLoading: isBasicNameLoading } = useBasicName(selectedName?.name, {
    enabled: !!selectedName?.name,
    skipGraph: true,
  })

  const selectedNameProfile = useProfile(selectedName?.name!, {
    skip: !selectedName?.name,
    skipGraph: true,
  })

  const resolverStatus = useResolverStatus(selectedName?.name!, {
    enabled: !!selectedName && !isBasicNameLoading,
    migratedRecordsMatch: { key: '60', type: 'addr', addr: address },
  })

  const getPrimarynameTransactionFlowItem = useGetPrimaryNameTransactionFlowItem({
    address,
    isWrapped,
    profileAddress: selectedNameProfile.profile?.address,
    resolverAddress: selectedNameProfile.profile?.resolverAddress,
    resolverStatus: resolverStatus.data,
  })

  const dispatchTransactions = (name: string) => {
    const transactionFlowItem = getPrimarynameTransactionFlowItem.callBack?.(name)
    if (!transactionFlowItem) return
    const transactionCount = transactionFlowItem.transactions.length
    if (transactionCount === 1) {
      dispatch({
        name: 'setTransactions',
        payload: transactionFlowItem.transactions,
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

  // Checks if name has encrptyed labels and attempts decrypt them if they exist
  const validateKey = useQueryKeys().validate
  const { mutate: mutateName, isLoading: isMutationLoading } = useMutation(
    async (data: FormData) => {
      if (!data.name) throw new Error('no_name')

      let validName = data.name.name
      if (!hasEncodedLabel(validName)) return validName

      // build name from unkown labels
      validName = getNameFromUnknownLabels(validName, data.unknownLabels)
      if (!hasEncodedLabel(validName)) {
        saveName(validName)
        queryClient.resetQueries(validateKey(data.name?.name))
        return validName
      }

      // Attempt to decrypt name
      validName = await getDecryptedName(validName, true)
      if (!hasEncodedLabel(validName)) {
        saveName(validName)
        queryClient.resetQueries(validateKey(data.name?.name))
        return validName
      }

      throw new Error('invalid_name')
    },
    {
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
    },
  )

  const onConfirm = () => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  const isLoading = !isEnsReady || isLoadingNames || isMutationLoading
  const isLoadingName =
    resolverStatus.isLoading || isBasicNameLoading || getPrimarynameTransactionFlowItem.isLoading

  // Show header if more than one page has been loaded, if only one page has been loaded but there is another page, or if there is an active search query
  const showHeader =
    (!!namesData && namesData?.pages.length > 1 && !searchQuery) || hasNextPage || !!searchQuery

  const hasNoEligibleNames =
    !searchQuery && namesData?.pages.length === 1 && namesData.pages[0].length === 0

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
      onSubmit={mutateName}
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
      <ContentContainer ref={formRef} onSubmit={handleSubmit((data) => mutateName(data))}>
        <Divider />
        {showHeader && (
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
          {!!namesData && namesData.pages[0].length > 0 ? (
            <>
              {namesData.pages?.map((page: Name[]) =>
                page.map((name: Name) => (
                  <TaggedNameItemWithFuseCheck
                    key={name.id}
                    {...name}
                    network={chainId}
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
