import { useCallback, useEffect, useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { CrossCircleSVG, QuestionCircleSVG, Spinner, Typography } from '@ensdomains/thorin'

import AeroplaneSVG from '@app/assets/Aeroplane.svg'
import CircleTickSVG from '@app/assets/CircleTick.svg'
import { Outlink } from '@app/components/Outlink'

import type { DialogStatus } from './TransactionStageModal'

const BarContainer = styled.div(
  ({ theme }) => css`
    width: ${theme.space.full};
    display: flex;
    flex-direction: column;
    align-items: center;
    gap: ${theme.space['2']};
  `,
)

const Bar = styled.div<{ $status: Exclude<DialogStatus, 'confirm'> }>(
  ({ theme, $status }) => css`
    width: ${theme.space.full};
    height: ${theme.space['9']};
    border-radius: ${theme.radii.full};
    background-color: ${theme.colors.blueSurface};
    overflow: hidden;
    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-start;

    --bar-color: ${theme.colors.blue};

    ${$status === 'success' &&
    css`
      --bar-color: ${theme.colors.green};
    `}
    ${$status === 'reverted' &&
    css`
      --bar-color: ${theme.colors.red};
    `}
  `,
)

const BarTypography = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.background};
    font-weight: ${theme.fontWeights.bold};
  `,
)

const ProgressTypography = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.accent};
    font-weight: ${theme.fontWeights.bold};
    text-align: center;
  `,
)

const AeroplaneIcon = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['4']};
    height: ${theme.space['4']};
    color: ${theme.colors.background};
  `,
)

const CircleIcon = styled.svg(
  ({ theme }) => css`
    width: ${theme.space['6']};
    height: ${theme.space['6']};
    color: ${theme.colors.background};
  `,
)

const MessageTypography = styled(Typography)(
  () => css`
    text-align: center;
  `,
)

const BarPrefix = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['2']} ${theme.space['4']};
    width: min-content;
    white-space: nowrap;
    height: ${theme.space['9']};
    margin-right: -1px;

    border-radius: ${theme.radii.full};
    border-top-right-radius: 0;
    border-bottom-right-radius: 0;
    background-color: var(--bar-color);
  `,
)

const InnerBar = styled.div(
  ({ theme }) => css`
    padding: ${theme.space['2']} ${theme.space['4']};
    height: ${theme.space['9']};

    border-radius: ${theme.radii.full};
    border-top-left-radius: 0;
    border-bottom-left-radius: 0;

    transition: width 1s linear;
    &.progress-complete {
      width: 100% !important;
      padding-right: ${theme.space['2']};
      transition: width 0.5s ease-in-out;
    }

    background-color: var(--bar-color);

    display: flex;
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;

    position: relative;

    & > svg {
      position: absolute;
      right: ${theme.space['2']};
      top: 50%;
      transform: translateY(-50%);
    }
  `,
)

export const LoadBar = ({
  dialogStatus,
  sendTime,
}: {
  dialogStatus: Exclude<DialogStatus, 'confirm'>
  sendTime: number | undefined
}) => {
  const { t } = useTranslation()

  const time = useMemo(() => ({ start: sendTime || Date.now(), ms: 45000 }), [sendTime])
  const [{ progress }, setProgress] = useState({ progress: 0, timeLeft: 45 })

  const intervalFunc = useCallback(
    (interval?: NodeJS.Timeout) => {
      const timeElapsed = Date.now() - time.start
      const _timeLeft = time.ms - timeElapsed
      const _progress = Math.min((timeElapsed / (timeElapsed + _timeLeft)) * 100, 100)
      setProgress({ timeLeft: Math.floor(_timeLeft / 1000), progress: _progress })
      if (_progress === 100) clearInterval(interval)
    },
    [time.ms, time.start],
  )

  useEffect(() => {
    intervalFunc()
    const interval = setInterval(intervalFunc, 1000)
    return () => clearInterval(interval)
  }, [intervalFunc])

  const message = useMemo(() => {
    if (dialogStatus === 'success') {
      return t('transaction.dialog.success.message')
    }
    if (dialogStatus === 'reverted') {
      return null
    }
    return t('transaction.dialog.pending.message')
  }, [dialogStatus, t])

  const isTakingLongerThanExpected = dialogStatus === 'pending' && progress === 100

  const progressMessage = useMemo(() => {
    if (isTakingLongerThanExpected) {
      return (
        <Outlink
          iconPosition="before"
          icon={QuestionCircleSVG}
          href="https://support.ens.domains/en/articles/7982906-long-running-transactions"
        >
          {t('transaction.dialog.sent.learn')}
        </Outlink>
      )
    }
    return null
  }, [isTakingLongerThanExpected, t])

  const EndElement = useMemo(() => {
    if (dialogStatus === 'success') {
      return <CircleIcon as={CircleTickSVG} />
    }
    if (dialogStatus === 'reverted') {
      return <CircleIcon as={CrossCircleSVG} />
    }
    if (progress !== 100) {
      return <AeroplaneIcon as={AeroplaneSVG} />
    }
    return <Spinner color="background" size="small" />
  }, [progress, dialogStatus])

  return (
    <>
      <BarContainer data-testid="load-bar-container">
        <Bar $status={dialogStatus} key={sendTime}>
          <BarPrefix>
            <BarTypography>
              {t(
                isTakingLongerThanExpected
                  ? 'transaction.dialog.pending.progress.message'
                  : `transaction.dialog.${dialogStatus}.progress.title`,
              )}
            </BarTypography>
          </BarPrefix>
          <InnerBar
            style={{ width: `${progress}%` }}
            className={progress === 100 || dialogStatus !== 'pending' ? 'progress-complete' : ''}
          >
            {EndElement}
          </InnerBar>
        </Bar>
        {progressMessage && <ProgressTypography>{progressMessage}</ProgressTypography>}
      </BarContainer>
      {message && <MessageTypography>{message}</MessageTypography>}
    </>
  )
}
