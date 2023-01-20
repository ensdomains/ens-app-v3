import { useRef } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Dialog, mq } from '@ensdomains/thorin'

import EditResolverForm from '@app/components/@molecules/EditResolver/EditResolverForm'
import EditResolverWarnings from '@app/components/@molecules/EditResolver/EditResolverWarnings'
import useResolverEditor from '@app/hooks/useResolverEditor'

const EditResolverFormContainer = styled.div(() => [
  css`
    width: 100%;
  `,
  mq.sm.min(css`
    width: 510px;
  `),
])

type Props = {
  resolverAddress: string
  onDismiss: () => void
  onSubmit: (newResolver: string) => void
}

const Resolver = ({ resolverAddress, onDismiss, onSubmit }: Props) => {
  const { t } = useTranslation('transactionFlow')

  const formRef = useRef<HTMLFormElement>(null)

  const editResolverForm = useResolverEditor({ resolverAddress, callback: onSubmit })
  const { hasErrors } = editResolverForm

  const handleSubmitForm = () => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  return (
    <>
      <Dialog.Heading title={t('steps.profile.resolver', { ns: 'register' })} />
      <EditResolverFormContainer>
        <EditResolverWarnings {...editResolverForm} />
        <EditResolverForm {...{ ...editResolverForm, resolverAddress, formRef }} />
      </EditResolverFormContainer>
      <Dialog.Footer
        leading={
          <Button colorStyle="greySecondary" onClick={onDismiss}>
            {t('action.cancel', { ns: 'common' })}
          </Button>
        }
        trailing={
          <Button onClick={handleSubmitForm} disabled={hasErrors}>
            {t('action.update', { ns: 'common' })}
          </Button>
        }
      />
    </>
  )
}

export default Resolver
