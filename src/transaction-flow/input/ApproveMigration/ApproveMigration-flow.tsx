import { useState } from 'react'
import { useTranslation } from 'react-i18next'

import { Button, Dialog } from '@ensdomains/thorin'

export const ApproveMigration = ({ onDismiss }: { onDismiss: () => void }) => {
  const { t } = useTranslation(['transactionFlow', 'common'])

  const [viewIdx, setViewIdx] = useState(0)
  const incrementView = () => setViewIdx(() => Math.min(flow.length - 1, viewIdx + 1))
  const decrementView = () => (viewIdx <= 0 ? onDismiss() : setViewIdx(viewIdx - 1))

  return (
    <>
      <Dialog.Heading title={t('input.approveMigration.title')} />
      <Dialog.Footer
        leading={
          <Button colorStyle="accentSecondary" onClick={decrementView}>
            {t(viewIdx === 0 ? 'action.cancel' : 'action.back', { ns: 'common' })}
          </Button>
        }
        trailing={<Button>lol</Button>}
      />
    </>
  )
}
