import { useQueryClient } from '@tanstack/react-query'
import { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useChainId } from 'wagmi'

import { Button, Input, Typography } from '@ensdomains/thorin'

import { useLocalStorage } from '@app/hooks/useLocalStorage'
import { DetailedSwitch } from '@app/transaction-flow/input/ProfileEditor/components/DetailedSwitch'
import { CUSTOM_RPC_STORAGE_KEY, type CustomRpcUrls } from '@app/utils/query/customRpc'
import { probeRpcUrl } from '@app/utils/query/probeRpcUrl'
import { validateRpcUrl } from '@app/validators/validateRpcUrl'

import { SectionContainer } from '../Section'

const Container = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    width: 100%;
    gap: ${theme.space['4']};
  `,
)

const ButtonRow = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    gap: ${theme.space['2']};
  `,
)

const Warning = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.redPrimary};
  `,
)

type FormData = { url: string; exclusive: boolean }

// Stable reference so useLocalStorage's `value !== defaultValue` guard doesn't treat a fresh
// `{}` literal as a change on every keystroke-driven re-render (which would re-persist and
// dispatch a synthetic storage event each keystroke).
const EMPTY_CUSTOM_RPC_URLS: CustomRpcUrls = {}

export function RpcSection() {
  const { t } = useTranslation('settings')
  const chainId = useChainId()
  const queryClient = useQueryClient()

  const [customRpcUrls, setCustomRpcUrls] = useLocalStorage<CustomRpcUrls>(
    CUSTOM_RPC_STORAGE_KEY,
    EMPTY_CUSTOM_RPC_URLS,
  )
  const current = customRpcUrls[chainId]

  const [needsReload, setNeedsReload] = useState(false)
  const [isProbing, setIsProbing] = useState(false)
  // Probe failures are kept separate from react-hook-form validation errors: a format error
  // must block Save, but a liveness-probe failure must not wedge Save disabled — the user has
  // to be able to retry the same URL after a transient outage.
  const [probeError, setProbeError] = useState<string>()

  const { register, handleSubmit, watch, reset, formState } = useForm<FormData>({
    mode: 'onChange',
    defaultValues: { url: current?.url ?? '', exclusive: current?.exclusive ?? false },
  })

  const urlValue = watch('url')
  const exclusive = watch('exclusive')
  const validationError = formState.errors.url?.message

  // Clear a stale probe error as soon as the URL is edited.
  useEffect(() => {
    setProbeError(undefined)
  }, [urlValue])

  const onSubmit = handleSubmit(async ({ url, exclusive: exclusiveValue }) => {
    // Don't clear needsReload here: a change still needs a reload to apply, and a later
    // failed save attempt must not hide the prompt for an earlier successful one.
    setProbeError(undefined)
    setIsProbing(true)
    try {
      const result = await probeRpcUrl({ url, chainId })
      if (!result.success) {
        setProbeError(
          t(`section.rpc.errors.probe.${result.reason}`, { chainId: result.reportedChainId }),
        )
        return
      }
      // Functional updater so a probe that resolves after an intervening Reset composes with
      // the latest stored value rather than resurrecting a stale snapshot.
      setCustomRpcUrls((prev) => ({ ...prev, [chainId]: { url, exclusive: exclusiveValue } }))
      // The IndexedDB React-Query cache survives reload, so drop it to avoid serving stale
      // data from the previous endpoint after the transport switches.
      queryClient.invalidateQueries()
      setNeedsReload(true)
    } finally {
      setIsProbing(false)
    }
  })

  const onReset = () => {
    setCustomRpcUrls((prev) => {
      const next = { ...prev }
      delete next[chainId]
      return next
    })
    reset({ url: '', exclusive: false })
    queryClient.invalidateQueries()
    setNeedsReload(true)
  }

  // Only a format-validation error blocks Save; a probe failure is shown but still retryable.
  const canSave = !!urlValue && !validationError && !isProbing

  return (
    <SectionContainer data-testid="rpc-section" title={t('section.rpc.title')}>
      <Container>
        <Typography fontVariant="small">{t('section.rpc.description')}</Typography>
        <Input
          data-testid="rpc-url-input"
          label={t('section.rpc.label')}
          placeholder={t('section.rpc.placeholder')}
          autoComplete="off"
          autoCorrect="off"
          spellCheck={false}
          error={validationError ?? probeError}
          {...register('url', {
            validate: (value) => {
              const result = validateRpcUrl(value)
              return result === true ? true : t(`section.rpc.errors.validate.${result}`)
            },
          })}
        />
        <DetailedSwitch
          data-testid="rpc-exclusive-toggle"
          title={t('section.rpc.exclusive.title')}
          description={t('section.rpc.exclusive.description')}
          {...register('exclusive')}
        />
        {exclusive && (
          <Warning fontVariant="small" data-testid="rpc-exclusive-warning">
            {t('section.rpc.exclusive.warning')}
          </Warning>
        )}
        <ButtonRow>
          <Button
            data-testid="rpc-save-button"
            width="fit"
            onClick={onSubmit}
            loading={isProbing}
            disabled={!canSave}
          >
            {t('section.rpc.action.save')}
          </Button>
          <Button
            data-testid="rpc-reset-button"
            width="fit"
            colorStyle="accentSecondary"
            onClick={onReset}
            disabled={!current || isProbing}
          >
            {t('section.rpc.action.reset')}
          </Button>
        </ButtonRow>
        {needsReload && (
          <Button
            data-testid="rpc-reload-button"
            width="fit"
            colorStyle="blueSecondary"
            onClick={() => window.location.reload()}
          >
            {t('section.rpc.action.reload')}
          </Button>
        )}
      </Container>
    </SectionContainer>
  )
}
