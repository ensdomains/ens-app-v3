import { ComponentProps, useRef } from 'react'
import { useForm } from 'react-hook-form'
import { Trans, useTranslation } from 'react-i18next'
import { match, P } from 'ts-pattern'
import { useChainId } from 'wagmi'

import { Button, Dialog, Input, Typography } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'
import { useSubscribeToEarnifi } from '@app/components/pages/profile/[name]/tabs/MoreTab/Miscellaneous/useSubscribeToEarnifi'

export const EARNIFI_OUTLINK =
  'https://www.bankless.com/claimables?utm_source=ENS+Modal&utm_medium=Banner&utm_campaign=ENS_Partnership'

const emailRegex = /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,63}$/i

type Props = {
  name: string
} & Pick<ComponentProps<typeof Dialog>, 'onDismiss' | 'open'>

export const EarnifiDialog = ({ name, open, onDismiss }: Props) => {
  const { t } = useTranslation('common')
  const chainId = useChainId()
  const formRef = useRef<HTMLFormElement>(null)

  const {
    register,
    handleSubmit,
    setError,
    clearErrors,
    formState: { errors },
  } = useForm<{ email: string }>({ mode: 'onChange' })

  const { subscribe, status, reset } = useSubscribeToEarnifi({
    onError: (error) => {
      const message =
        error instanceof Error && error.message
          ? error.message
          : t('tabs.more.misc.bankless.submitError', { ns: 'profile' })
      setError('email', {
        type: 'submitError',
        message,
      })
      setTimeout(() => {
        clearErrors('email')
      }, 3000)
    },
  })

  const handleClick = () => {
    formRef.current?.dispatchEvent(new Event('submit', { cancelable: true, bubbles: true }))
  }

  const _onDismiss = () => {
    reset()
    onDismiss?.()
  }

  return (
    <Dialog open={open} variant="blank" onDismiss={() => status !== 'pending' && _onDismiss()}>
      <Dialog.Heading title={t('tabs.more.misc.bankless.title', { ns: 'profile' })} />
      {match(status)
        .with(P.not('success'), () => (
          <>
            <Dialog.Content
              as="form"
              ref={formRef}
              onSubmit={handleSubmit(({ email }) => subscribe({ email, address: name, chainId }))}
            >
              <Typography style={{ textAlign: 'center' }}>
                <Trans
                  style={{ textAlign: 'center' }}
                  i18nKey="tabs.more.misc.bankless.enterEmail"
                  ns="profile"
                  components={{
                    a: <Outlink href={EARNIFI_OUTLINK} role="link" />,
                  }}
                />
              </Typography>
              <Input
                type="email"
                id="email"
                label={t('action.enterEmail')}
                {...register('email', {
                  required: t('errors.emailRequired'),
                  pattern: {
                    value: emailRegex,
                    message: t('errors.emailInvalid'),
                  },
                })}
                error={errors.email?.message}
              />
            </Dialog.Content>
            <Dialog.Footer
              leading={
                <Button onClick={_onDismiss} colorStyle="accentSecondary">
                  {t('action.cancel')}
                </Button>
              }
              trailing={
                <Button
                  disabled={!!errors.email || status === 'pending'}
                  loading={status === 'pending'}
                  onClick={handleClick}
                >
                  {t('action.continue')}
                </Button>
              }
            />
          </>
        ))
        .with('success', () => (
          <>
            <Dialog.Content>
              <div style={{ textAlign: 'center' }}>
                {t('tabs.more.misc.bankless.emailConfirmation', { ns: 'profile' })}
              </div>
            </Dialog.Content>
            <Dialog.Footer trailing={<Button onClick={_onDismiss}>{t('action.close')}</Button>} />
          </>
        ))
        .exhaustive()}
    </Dialog>
  )
}
