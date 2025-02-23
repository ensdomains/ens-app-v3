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
  dataUpdatedAt,
  errorUpdatedAt,
  statusElement,
  statusHelperElement,
  message,
}: {
  refetch: () => any
  isLoading: boolean
  isRefetching: boolean
  dataUpdatedAt: number | undefined
  errorUpdatedAt: number | undefined
  statusElement?: ReactNode
  statusHelperElement?: ReactNode
  message: string
}) => {
  const { t } = useTranslation('dnssec')

  const [lastCheckedTime, setLastCheckedTime] = useState<
    null | [key: string, params?: { count: number }]
  >(null)

  const updatedAt = dataUpdatedAt || errorUpdatedAt

  useEffect(() => {
    if (updatedAt) {
      let interval: NodeJS.Timeout
      const intervalFunc = () => {
        const now = new Date()
        const then = new Date(updatedAt)
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
  }, [updatedAt])

  return (
    <DnssecCheckContainer>
      <DnssecCheckTopItemsContainer>
        {statusElement || (
          <Helper data-testid="status-checker-message" type="warning" alignment="horizontal">
            {message}
          </Helper>
        )}
        <Button
          data-testid="status-refetch"
          disabled={isLoading || isRefetching}
          onClick={() => refetch()}
          shape="square"
        >
          <CounterClockwiseArrowSVG width={16} height={16} />
        </Button>
      </DnssecCheckTopItemsContainer>
      {statusHelperElement}
      <Typography fontVariant="small" color="grey" data-testid="status-message">
        {(() => {
          if (isLoading || isRefetching) return t('status.checking')
          if (lastCheckedTime) return t(...lastCheckedTime)
        })()}
      </Typography>
    </DnssecCheckContainer>
  )
}
