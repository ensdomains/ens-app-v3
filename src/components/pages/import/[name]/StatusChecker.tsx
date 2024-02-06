import { ReactNode, useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, CounterClockwiseArrowSVG, Helper, Typography } from '@ensdomains/thorin'

const DnssecCheckContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: stretch;
    gap: ${theme.space['2']};
  `,
)

const DnssecCheckTopItemsContainer = styled.div(
  ({ theme }) => css`
    width: 100%;
    display: flex;
    flex-direction: row;
    align-items: stretch;
    justify-content: center;
    gap: ${theme.space['2']};
    height: ${theme.space['12']};

    & > div:first-of-type {
      overflow: hidden;
    }

    & > button {
      height: ${theme.space['12']};
      width: ${theme.space['12']};
    }
  `,
)

export const StatusChecker = ({
  refetch,
  isLoading,
  isRefetching,
  isError,
  dataUpdatedAt,
  statusElement,
  statusHelperElement,
  message,
}: {
  refetch: () => any
  isLoading: boolean
  isRefetching: boolean
  isError: boolean
  dataUpdatedAt: number | undefined
  statusElement?: ReactNode
  statusHelperElement?: ReactNode
  message: string
}) => {
  const { t } = useTranslation('dnssec')

  const [lastCheckedTime, setLastCheckedTime] = useState<
    null | [key: string, params?: { count: number }]
  >(null)

  useEffect(() => {
    if (dataUpdatedAt) {
      let interval: NodeJS.Timeout
      const intervalFunc = () => {
        const now = new Date()
        const then = new Date(dataUpdatedAt)
        const diffSeconds = Math.round((now.getTime() - then.getTime()) / 1000)
        if (diffSeconds < 60) {
          setLastCheckedTime(['status.secondsAgo'])
          return true
        }
        const diffMinutes = Math.round(diffSeconds / 60)
        if (diffMinutes < 60) {
          setLastCheckedTime(['status.minutesAgo', { count: diffMinutes }])
          return true
        }
        setLastCheckedTime(['status.aWhileAgo'])
        clearInterval(interval)
        return false
      }
      if (intervalFunc()) interval = setInterval(intervalFunc, 1000 * 60)
      return () => {
        clearInterval(interval)
      }
    }
  }, [dataUpdatedAt])

  return (
    <DnssecCheckContainer>
      <DnssecCheckTopItemsContainer>
        {statusElement || (
          <Helper type="warning" alignment="horizontal">
            {message}
          </Helper>
        )}
        <Button disabled={isLoading || isRefetching} onClick={() => refetch()}>
          <CounterClockwiseArrowSVG />
        </Button>
      </DnssecCheckTopItemsContainer>
      {statusHelperElement}
      <Typography fontVariant="small" color="grey">
        {(() => {
          if (isLoading || isRefetching) return t('status.checking')
          if (isError) return t('status.error')
          if (lastCheckedTime) return t(...lastCheckedTime)
        })()}
      </Typography>
    </DnssecCheckContainer>
  )
}
