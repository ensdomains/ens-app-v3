import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import { useTranslation } from 'react-i18next'
import { useEffect, useState } from 'react'
import isEqual from 'lodash/isEqual'

import { Typography, Button, FlameSVG, FlameBurnedSVG, Helper } from '@ensdomains/thorin'

import { useGetFuseData } from '@app/hooks/useGetFuseData'
import { Spacer } from '@app/components/@atoms/Spacer'
import mq from '@app/mediaQuery'
import { useEns } from '@app/utils/EnsProvider'

import { makeTransactionItem } from '../transaction'

const FusesContainer = styled.div(({ theme }) => [
  css`
    width: 100%;
    padding: 5px 15px;
  `,
  mq.md.min(css`
    min-width: 400px;
  `),
])

const BurnButtonsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: 10px;
  `,
)

const ButtonInner = styled.div(
  ({ theme }) => css`
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
  `,
)

const StyledFlameSVG = styled(FlameSVG)(
  ({ theme }) => css`
    position: relative;
    bottom: -1px;
    right: 1px;
  `,
)

const BurnedFlameContainer = styled.div(
  ({ theme }) => css`
    background: ${theme.colors.backgroundTertiary};
    color: ${theme.colors.textSecondary};
    border-radius: 10px;
    display: flex;
    align-items: center;
    padding: 2px 10px;
  `,
)

const BurnedStyledFlameSVG = styled(FlameSVG)(
  ({ theme }) => css`
    position: relative;
    right: -8px;
    bottom: -1px;
    color: black;
  `,
)

const StyledButton = styled(Button)<{ isSelected: boolean }>(
  ({ theme, isSelected }) => css`
    padding: 0px 6px;
  `,
)

const BurnButton = ({ permission, isBurned, handleBurnClick, isSelected }) => {
  const { t } = useTranslation('profile', { keyPrefix: 'details.tabs.advanced' })

  return (
    <StyledButton
      onClick={() => handleBurnClick(permission)}
      disabled={isBurned}
      variant="secondary"
      tone={isSelected ? 'red' : 'grey'}
      size="small"
      fullWidthContent
      isSelected={isSelected}
      shadowless
    >
      <ButtonInner>
        <div>{t(`fuses.permissions.${permission}`)}</div>
        {isBurned ? (
          <BurnedFlameContainer>
            <Typography>Burned</Typography>
            <BurnedStyledFlameSVG width="24" height="24" />
          </BurnedFlameContainer>
        ) : isSelected ? (
          <FlameBurnedSVG width="24" height="24" />
        ) : (
          <StyledFlameSVG width="24" height="24" />
        )}
      </ButtonInner>
    </StyledButton>
  )
}

const ButtonsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    gap: 15px;
  `,
)

const canContinue = (fuseData, fuseSelected) => {
  const filteredInitialFuseData = { ...fuseData }
  Object.keys(filteredInitialFuseData).forEach(function (key) {
    if (filteredInitialFuseData[key]) {
      delete filteredInitialFuseData[key]
      return
    }
  })
  const cannotUnwrap = !fuseData.CANNOT_UNWRAP && !fuseSelected.CANNOT_UNWRAP
  return isEqual(filteredInitialFuseData, fuseSelected) || cannotUnwrap
}

export const BurnFuses = ({ onDismiss, dispatch }) => {
  const { t } = useTranslation('profile', { keyPrefix: 'details.tabs.advanced' })
  const router = useRouter()
  const { name } = router.query
  const { fuseData } = useGetFuseData((name as string) || '')
  const [_fuseData, setFuseData] = useState({})
  const [fuseSelected, setFuseSelected] = useState({})
  const { fuses } = useEns()

  const handleBurnClick = (permission) => {
    const nextFuseSelected = { ...fuseSelected }
    nextFuseSelected[permission] = !nextFuseSelected[permission]
    setFuseSelected(nextFuseSelected)
  }

  const onSubmit = () => {
    const selectedKeys = []
    Object.keys(fuseSelected).forEach(function (key) {
      if (fuseSelected[key]) {
        selectedKeys.push(key)
      }
    })

    const selectedFuses = selectedKeys.reduce(
      (previousValue, currentValue) => previousValue + fuses[currentValue],
      0,
    )

    const permissions = selectedKeys.map((key) => t(`fuses.permissions.${key}`))

    dispatch({
      name: 'setTransactions',
      payload: [
        makeTransactionItem('burnFuses', {
          name,
          selectedFuses,
          permissions,
        }),
      ],
    })
    dispatch({ name: 'setFlowStage', payload: 'transaction' })
  }

  console.log('fuseData: ', _fuseData)
  console.log('selected: ', fuseSelected)

  useEffect(() => {
    console.log('**rendered**')
    if (fuseData) {
      const _fuseData = { ...fuseData.fuseObj }
      delete _fuseData.canDoEverything
      delete _fuseData.parentCannotControl

      setFuseData({ ..._fuseData })

      const initialFusesSelected = { ..._fuseData }
      Object.keys(initialFusesSelected).forEach(function (key) {
        if (initialFusesSelected[key]) {
          delete initialFusesSelected[key]
          return
        }
        initialFusesSelected[key] = false
      })
      setFuseSelected(initialFusesSelected)
    }
  }, [fuseData])

  if (!_fuseData) return null

  return (
    <FusesContainer>
      <Typography weight="bold" variant="extraLarge">
        {t('fuses.burnFormTitle')}
      </Typography>
      {!_fuseData.CANNOT_UNWRAP && !fuseSelected.CANNOT_UNWRAP ? (
        <>
          <Spacer $height="1" />
          <Helper type="info" style={{ textAlign: 'center' }}>
            <Typography>{t('fuses.info')}</Typography>
          </Helper>
        </>
      ) : (
        ''
      )}
      <Spacer $height="4" />
      <BurnButtonsContainer>
        {Object.entries(_fuseData).map(([key, value]) => (
          <BurnButton
            {...{
              permission: key,
              isBurned: value,
              handleBurnClick,
              isSelected: fuseSelected[key],
            }}
          />
        ))}
      </BurnButtonsContainer>
      <Spacer $height="6" />
      <ButtonsContainer>
        <Button tone="grey" variant="secondary" onClick={onDismiss}>
          Cancel
        </Button>
        <Button disabled={canContinue(_fuseData, fuseSelected)} onClick={onSubmit} tone="red">
          Burn Selected
        </Button>
      </ButtonsContainer>
    </FusesContainer>
  )
}
