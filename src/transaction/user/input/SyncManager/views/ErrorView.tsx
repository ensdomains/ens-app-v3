import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

import { SearchViewErrorView } from '../../SendName/views/SearchView/views/SearchViewErrorView'

type Props = {
  onCancel: () => void
}

export const ErrorView = ({ onCancel }: Props) => {
  const { t } = useTranslation('transactionFlow')
  return (
    <>
      <Dialog.Content>
        <SearchViewErrorView />
      </Dialog.Content>
      <Dialog.Footer
        trailing={
          <Button colorStyle="redSecondary" onClick={onCancel}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}
