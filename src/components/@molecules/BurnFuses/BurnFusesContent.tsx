import isEqual from 'lodash/isEqual'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import type { NamedFusesToBurn } from '@ensdomains/ensjs'
import { Button, FlameBurnedSVG, FlameSVG, Helper, Typography } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import mq from '@app/mediaQuery'
import { FuseObj } from '@app/types'

export const baseFuseObj = {
  CANNOT_UNWRAP: false,
  CANNOT_BURN_FUSES: false,
  CANNOT_TRANSFER: false,
  CANNOT_SET_RESOLVER: false,
  CANNOT_SET_TTL: false,
  CANNOT_CREATE_SUBDOMAIN: false,
}

export const defaultFuseObj = {
  ...baseFuseObj,
  PARENT_CANNOT_CONTROL: false,
}

export const defaultSelectableFuses = {
  ...defaultFuseObj,
}

type SelectableFuses = Omit<FuseObj, 'PARENT_CANNOT_CONTROL' | 'CAN_DO_EVERYTHING'>

const FusesContainer = styled.div(({ theme }) => [
  css`
    width: 100%;
    padding: ${theme.space['1.25']} ${theme.space['4']};
  `,
  mq.md.min(css`
    min-width: ${theme.space['112']};
  `),
])

const BurnButtonsContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['2.5']};
  `,
)

const ButtonInner = styled.div(
  () => css`
    display: flex;
    justify-content: space-between;
    width: 100%;
    align-items: center;
  `,
)

const StyledFlameSVG = styled(FlameSVG)(
  ({ theme }) => css`
    position: relative;
    bottom: -${theme.space.px};
    right: ${theme.space.px};
  `,
)

const BurnedFlameContainer = styled.div<{ $isBurned: boolean }>(
  ({ theme, $isBurned }) => css`
    background: ${theme.colors.backgroundTertiary};
    color: ${theme.colors.textSecondary};
    border-radius: ${theme.space['2.5']};
    display: flex;
    align-items: center;
    padding: ${theme.space.px} ${theme.space['2.5']};

    ${$isBurned &&
    `
      position: absolute;
      right: ${theme.space['1.5']};  
      z-index: 1;
    `}
  `,
)

const BurnedStyledFlameSVG = styled(FlameSVG)(
  ({ theme }) => css`
    position: relative;
    right: -${theme.space['2']};
    bottom: -${theme.space.px};
    color: black;
  `,
)

const StyledButton = styled(Button)(
  ({ theme }) => css`
    padding: ${theme.space['0']} -${theme.space['1.5']};
  `,
)

const BurnButton = ({
  permission,
  isBurned,
  handleBurnClick,
  isSelected,
}: {
  permission: keyof FuseObj
  isBurned: boolean
  handleBurnClick: (permission: keyof FuseObj) => void
  isSelected: boolean
}) => {
  const { t } = useTranslation('profile', { keyPrefix: 'details.tabs.advanced' })

  return (
    <StyledButton
      onClick={() => handleBurnClick(permission)}
      disabled={isBurned}
      variant="secondary"
      tone={isSelected ? 'red' : 'grey'}
      size="small"
      fullWidthContent
      shadowless
    >
      <ButtonInner data-testid={`burn-button-${permission}`}>
        <Typography>{t(`fuses.permissions.${permission}`)}</Typography>
        {isBurned && (
          <BurnedFlameContainer $isBurned={isBurned}>
            <Typography>{t('fuses.burned')}</Typography>
            <BurnedStyledFlameSVG width="24" height="24" />
          </BurnedFlameContainer>
        )}
        {isSelected ? (
          <FlameBurnedSVG width="24" height="24" data-testid={`flame-selected-${permission}`} />
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
    gap: ${theme.space['4']};
  `,
)

const canContinue = (
  fuseData: Partial<FuseObj>,
  fuseSelected: Partial<SelectableFuses>,
  canUnsetFuse: boolean,
) => {
  const filteredInitialFuseData: Partial<FuseObj> = { ...fuseData }
  Object.keys(filteredInitialFuseData).forEach((key: string) => {
    if (filteredInitialFuseData[key as keyof FuseObj]) {
      delete filteredInitialFuseData[key as keyof FuseObj]
    }
  })
  const cannotUnwrap = !fuseData.CANNOT_UNWRAP && !fuseSelected.CANNOT_UNWRAP
  if (canUnsetFuse) {
    if (Object.values(fuseSelected).some((val) => val) && !fuseSelected.CANNOT_UNWRAP) return true
    return false
  }
  return isEqual(filteredInitialFuseData, fuseSelected) || cannotUnwrap
}

type Props = {
  fuseData:
    | {
        fuseObj: Record<string, boolean>
      }
    | undefined
  onDismiss: () => void
  onSubmit: (fuses: NamedFusesToBurn, fuseNames: string[]) => void
  canUnsetFuse?: boolean
}

const BurnFusesContent = ({ fuseData, onDismiss, onSubmit, canUnsetFuse = false }: Props) => {
  const { t } = useTranslation('profile', { keyPrefix: 'details.tabs.advanced' })
  const { t: tc } = useTranslation()
  const [_fuseData, setFuseData] = useState<SelectableFuses>(defaultSelectableFuses)
  const [fuseSelected, setFuseSelected] = useState<Partial<SelectableFuses>>(defaultSelectableFuses)

  const handleBurnClick = (permission: keyof FuseObj) => {
    const nextFuseSelected = { ...fuseSelected } as FuseObj
    nextFuseSelected[permission] = !nextFuseSelected[permission]
    setFuseSelected(nextFuseSelected)
  }

  const _onSubmit = () => {
    const selectedFuses: Array<keyof SelectableFuses> = []
    Object.keys(fuseSelected).forEach((key) => {
      if (fuseSelected[key as keyof SelectableFuses]) {
        selectedFuses.push(key as keyof SelectableFuses)
      }
    })

    const permissions = selectedFuses.map((key) => t(`fuses.permissions.${key}`))

    onSubmit(selectedFuses as NamedFusesToBurn, permissions)
  }

  useEffect(() => {
    if (fuseData) {
      const initialFuseData = Object.fromEntries(
        Object.entries({
          ...(fuseData.fuseObj as FuseObj),
        }).filter(([key]) => {
          return !(key === 'PARENT_CANNOT_CONTROL' || key === 'CAN_DO_EVERYTHING')
        }),
      ) as SelectableFuses
      setFuseData(initialFuseData)

      const initialFusesSelected = Object.fromEntries(
        Object.entries({
          ...initialFuseData,
        }).filter(([, val]) => !val),
      )
      if (!canUnsetFuse) setFuseSelected(initialFusesSelected)
      else setFuseSelected(initialFuseData)
    }
  }, [fuseData, canUnsetFuse])

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
              permission: key as keyof FuseObj,
              isBurned: !!value && !canUnsetFuse,
              handleBurnClick,
              isSelected: !!fuseSelected[key as keyof SelectableFuses],
            }}
          />
        ))}
      </BurnButtonsContainer>
      <Spacer $height="6" />
      <ButtonsContainer>
        <Button shadowless tone="grey" variant="secondary" onClick={onDismiss}>
          {tc('action.cancel')}
        </Button>
        <Button
          disabled={canContinue(_fuseData, fuseSelected, canUnsetFuse)}
          onClick={_onSubmit}
          tone="red"
          data-testid="burn-form-continue"
          shadowless
        >
          {canUnsetFuse ? tc('action.confirm') : tc('action.burnSelected')}
        </Button>
      </ButtonsContainer>
    </FusesContainer>
  )
}

export default BurnFusesContent
