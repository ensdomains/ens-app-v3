import isEqual from 'lodash/isEqual'
import { useEffect, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'

import { ChildFuseKeys, ChildFuseReferenceType } from '@ensdomains/ensjs/utils'
import { Button, FlameSVG, Helper, mq, Typography } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { CurrentChildFuses } from '@app/types'

export const childFuseObj = Object.fromEntries(
  ChildFuseKeys.map((key) => [key, false]),
) as CurrentChildFuses

const FusesContainer = styled.div(({ theme }) => [
  css`
    width: 100%;
    padding: ${theme.space['1.25']} ${theme.space['4']};
  `,
  mq.sm.min(css`
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
    background: ${theme.colors.greyPrimary};
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

type Permission = ChildFuseReferenceType['Key']

const getPermissionTranslationKey = (permission: Permission): string =>
  match(permission)
    .with('CANNOT_UNWRAP', () => `tabs.more.fuses.permissions.CANNOT_UNWRAP`)
    .with('CANNOT_BURN_FUSES', () => `tabs.more.fuses.permissions.CANNOT_BURN_FUSES`)
    .with('CANNOT_TRANSFER', () => `tabs.more.fuses.permissions.CANNOT_TRANSFER`)
    .with('CANNOT_SET_RESOLVER', () => `tabs.more.fuses.permissions.CANNOT_SET_RESOLVER`)
    .with('CANNOT_SET_TTL', () => `tabs.more.fuses.permissions.CANNOT_SET_TTL`)
    .with('CANNOT_CREATE_SUBDOMAIN', () => `tabs.more.fuses.permissions.CANNOT_CREATE_SUBDOMAIN`)
    .otherwise(() => '')

const BurnButton = ({
  permission,
  isBurned,
  handleBurnClick,
  isSelected,
}: {
  permission: Permission
  isBurned: boolean
  handleBurnClick: (permission: Permission) => void
  isSelected: boolean
}) => {
  const { t } = useTranslation('profile')

  const translationKey = getPermissionTranslationKey(permission)

  return (
    <StyledButton
      onClick={() => handleBurnClick(permission)}
      disabled={isBurned}
      colorStyle={isSelected ? 'redSecondary' : 'greySecondary'}
      size="small"
      suffix={
        isSelected ? (
          <FlameSVG width="24" height="24" data-testid={`flame-selected-${permission}`} />
        ) : (
          <StyledFlameSVG width="24" height="24" />
        )
      }
    >
      <ButtonInner data-testid={`burn-button-${permission}`}>
        <Typography>{t(translationKey)}</Typography>
        {isBurned && (
          <BurnedFlameContainer $isBurned={isBurned}>
            <Typography>{t('tabs.more.fuses.burned')}</Typography>
            <BurnedStyledFlameSVG width="24" height="24" />
          </BurnedFlameContainer>
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
  fuseData: CurrentChildFuses,
  fuseSelected: CurrentChildFuses,
  canUnsetFuse: boolean,
) => {
  const filteredInitialFuseData: CurrentChildFuses = { ...fuseData }
  Object.keys(filteredInitialFuseData).forEach((key: string) => {
    if (filteredInitialFuseData[key as Permission]) {
      delete filteredInitialFuseData[key as Permission]
    }
  })
  const cannotUnwrap = !fuseData.CANNOT_UNWRAP && !fuseSelected.CANNOT_UNWRAP
  if (canUnsetFuse) {
    if (Object.values(fuseSelected).some((val) => val) && !fuseSelected.CANNOT_UNWRAP) return true
    return false
  }
  return isEqual(filteredInitialFuseData, fuseSelected) || cannotUnwrap
}

type BaseProps = {
  fuseData: CurrentChildFuses | undefined
  onDismiss: () => void
  canUnsetFuse?: boolean
  returnObject?: boolean
}

type PropsWithReturnObject = BaseProps & {
  returnObject: true
  onSubmit: (fuses: CurrentChildFuses) => void
}

type PropsWithReturnArray = BaseProps & {
  returnObject?: never
  onSubmit: (fuses: Permission[], fuseNames: string[]) => void
}

const BurnFusesContent = ({
  fuseData,
  onDismiss,
  onSubmit,
  canUnsetFuse = false,
  returnObject,
}: PropsWithReturnArray | PropsWithReturnObject) => {
  const { t } = useTranslation('profile')
  const { t: tc } = useTranslation('common')
  const [_fuseData, setFuseData] = useState<CurrentChildFuses>(childFuseObj)
  const [fuseSelected, setFuseSelected] = useState<CurrentChildFuses>(childFuseObj)

  const handleBurnClick = (permission: Permission) => {
    const nextFuseSelected = { ...fuseSelected } as CurrentChildFuses
    nextFuseSelected[permission] = !nextFuseSelected[permission]
    setFuseSelected(nextFuseSelected)
  }

  const _onSubmit = () => {
    if (returnObject) {
      return onSubmit({ ...fuseData, ...fuseSelected } as CurrentChildFuses)
    }

    const selectedFuses = Object.keys(fuseSelected).filter(
      (key) => fuseSelected[key as Permission],
    ) as Permission[]

    const permissions = selectedFuses.map((key) => t(getPermissionTranslationKey(key)))

    onSubmit(selectedFuses, permissions)
  }

  useEffect(() => {
    if (fuseData) {
      setFuseData(fuseData)

      const initialFusesSelected = Object.fromEntries(
        Object.entries({
          ...fuseData,
        }).filter(([, val]) => !val),
      ) as CurrentChildFuses
      if (!canUnsetFuse) setFuseSelected(initialFusesSelected)
      else setFuseSelected(fuseData)
    }
  }, [fuseData, canUnsetFuse])

  if (!_fuseData) return null

  return (
    <FusesContainer>
      <Typography fontVariant="headingFour">{t('tabs.more.fuses.burnFormTitle')}</Typography>
      {!_fuseData.CANNOT_UNWRAP && !fuseSelected.CANNOT_UNWRAP ? (
        <>
          <Spacer $height="1" />
          <Helper type="info" style={{ textAlign: 'center' }}>
            <Typography>{t('tabs.more.fuses.info')}</Typography>
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
              permission: key as Permission,
              isBurned: !!value && !canUnsetFuse,
              handleBurnClick,
              isSelected: !!fuseSelected[key as Permission],
            }}
          />
        ))}
      </BurnButtonsContainer>
      <Spacer $height="6" />
      <ButtonsContainer>
        <Button colorStyle="accentSecondary" onClick={onDismiss}>
          {tc('action.cancel')}
        </Button>
        <Button
          disabled={canContinue(_fuseData, fuseSelected, canUnsetFuse)}
          onClick={_onSubmit}
          color="red"
          data-testid="burn-form-continue"
        >
          {canUnsetFuse ? tc('action.confirm') : tc('action.burnSelected')}
        </Button>
      </ButtonsContainer>
    </FusesContainer>
  )
}

export default BurnFusesContent
