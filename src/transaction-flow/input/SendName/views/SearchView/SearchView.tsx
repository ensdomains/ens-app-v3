import { useEffect } from 'react'
import { useFormContext } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'
import { Address } from 'viem'

import { Button, Dialog, MagnifyingGlassSimpleSVG } from '@ensdomains/thorin'

import { DialogFooterWithBorder } from '@app/components/@molecules/DialogComponentVariants/DialogFooterWithBorder'
import { DialogInput } from '@app/components/@molecules/DialogComponentVariants/DialogInput'
import { useSimpleSearch } from '@app/transaction-flow/input/EditRoles/hooks/useSimpleSearch'

import type { SendNameForm } from '../../SendName-flow'
import { SearchViewErrorView } from './views/SearchViewErrorView'
import { SearchViewIntroView } from './views/SearchViewIntroView'
import { SearchViewLoadingView } from './views/SearchViewLoadingView'
import { SearchViewNoResultsView } from './views/SearchViewNoResultsView'
import { SearchViewResultsView } from './views/SearchViewResultsView'

type Props = {
  name: string
  senderRole?: 'owner' | 'manager' | null
  onSelect: (address: Address) => void
  onCancel: () => void
}

export const SearchView = ({ name, senderRole, onCancel, onSelect }: Props) => {
  const { t } = useTranslation('transactionFlow')
  const { register, watch, setValue } = useFormContext<SendNameForm>()
  const query = watch('query')
  const search = useSimpleSearch()

  // Set search results when coming back from summary view
  useEffect(() => {
    if (query.length > 2) search.mutate(query)
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return (
    <>
      <Dialog.Heading title="Send Name" />
      <DialogInput
        data-testid="send-name-search-input"
        label="Name"
        size="medium"
        hideLabel
        icon={<MagnifyingGlassSimpleSVG />}
        clearable
        {...register('query', {
          onChange: (e) => {
            const newQuery = e.currentTarget.value
            if (newQuery.length < 3) return
            search.mutate(newQuery)
          },
        })}
        placeholder={t('input.sendName.views.search.placeholder')}
        onClickAction={() => {
          setValue('query', '')
        }}
      />
      <Dialog.Content fullWidth horizontalPadding="0">
        {match([query, search])
          .with([P._, { isError: true }], () => <SearchViewErrorView />)
          .with([P.when((s: string) => !s || s.length < 3), P._], () => <SearchViewIntroView />)
          .with([P._, { isSuccess: false }], () => <SearchViewLoadingView />)
          .with(
            [P._, { isSuccess: true, data: P.when((d) => !!d && d.length > 0) }],
            ([, { data }]) => (
              <SearchViewResultsView
                name={name}
                results={data}
                senderRole={senderRole}
                onSelect={onSelect}
              />
            ),
          )
          .with([P._, { isSuccess: true, data: P.when((d) => !d || d.length === 0) }], () => (
            <SearchViewNoResultsView />
          ))
          .otherwise(() => null)}
      </Dialog.Content>
      <DialogFooterWithBorder
        fullWidth
        trailing={
          <Button colorStyle="accentSecondary" onClick={onCancel}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
