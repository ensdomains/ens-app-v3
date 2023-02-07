import { useMemo, useState } from 'react'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Tooltip, Typography } from '@ensdomains/thorin'

import QuestionSVG from '@app/assets/Question.svg'
import type { useFusesStates } from '@app/hooks/fuses/useFusesStates'
import type { useGetFusesSetDates } from '@app/hooks/fuses/useGetFusesSetDates'
import { useTransactionFlow } from '@app/transaction-flow/TransactionFlowProvider'
import { CHILD_FUSES, ChildFuse } from '@app/transaction-flow/transaction/changePermissions'
import type { useEns } from '@app/utils/EnsProvider'

import { Section, SectionFooter, SectionItem } from './Section'

type GetWrapperDataFunc = ReturnType<typeof useEns>['getWrapperData']
type WrapperData = Awaited<ReturnType<GetWrapperDataFunc>>
type FusesSetDates = ReturnType<typeof useGetFusesSetDates>['fusesSetDates']
type FusesStates = ReturnType<typeof useFusesStates>

type Props = {
  name: string
  wrapperData: WrapperData
  fusesSetDates: FusesSetDates
} & FusesStates

type FuseItem = {
  fuse: ChildFuse
  translationKey: string
  revoked?: string
}

const CHILD_FUSES_WITHOUT_CBF = CHILD_FUSES.filter((fuse) => fuse !== 'CANNOT_BURN_FUSES')

const PERMISSION_TRANSLATION_KEY: {
  [key in ChildFuse]?: {
    burned: string
    unburned: string
  }
} = {
  CANNOT_UNWRAP: {
    burned: 'cannotUnwrap',
    unburned: 'canUnwrap',
  },
  CANNOT_CREATE_SUBDOMAIN: {
    burned: 'cannotCreateSubnames',
    unburned: 'canCreateSubnames',
  },
  CANNOT_TRANSFER: {
    burned: 'cannotSend',
    unburned: 'canSend',
  },
  CANNOT_SET_RESOLVER: {
    burned: 'cannotSetResolver',
    unburned: 'canSetResolver',
  },
  CANNOT_SET_TTL: {
    burned: 'cannotSetTTL',
    unburned: 'canSetTTL',
  },
}

const TypographyGreyDim = styled(Typography)(
  ({ theme }) => css`
    color: ${theme.colors.greyDim};
  `,
)

const IndicatorWrapper = styled.div(
  ({ theme }) => css`
    position: absolute;
    right: -${theme.space[2]};
    top: -${theme.space[2]};
    background: ${theme.colors.yellowPrimary};
    width: ${theme.space[6]};
    height: ${theme.space[6]};
    border-radius: ${theme.radii.full};

    display: flex;
    justify-content: center;
    align-items: center;

    svg {
      width: ${theme.space[4]};
      height: ${theme.space[4]};
    }
  `,
)

const ButtonContainer = styled.div(
  () => css`
    position: relative;
  `,
)

const FooterContainer = styled.div(
  () => css`
    display: flex;
    justify-content: flex-end;
  `,
)

export const NameChangePermissions = ({
  name,
  wrapperData,
  fusesSetDates,
  state,
  parentState,
  isUserOwner,
}: Props) => {
  const { t } = useTranslation('profile')
  const { showDataInput } = useTransactionFlow()

  const isParentLocked = parentState === 'locked'

  const permissions = CHILD_FUSES_WITHOUT_CBF.reduce<{ burned: FuseItem[]; unburned: FuseItem[] }>(
    (acc, permission) => {
      const isBurned = !!wrapperData?.child[permission]
      const burnedTranslationKey = PERMISSION_TRANSLATION_KEY[permission]?.burned
      const unburnedTranslationKey = PERMISSION_TRANSLATION_KEY[permission]?.unburned

      if (isBurned && burnedTranslationKey)
        acc.burned.push({
          fuse: permission,
          translationKey: burnedTranslationKey,
        })

      if (!isBurned && unburnedTranslationKey)
        acc.unburned.push({
          fuse: permission,
          translationKey: unburnedTranslationKey,
        })
      return acc
    },
    { burned: [], unburned: [] },
  )

  const handleRevokePermissions = () => {
    if (!wrapperData) return
    showDataInput(`revoke-permissions-${name}`, 'RevokePermissions', {
      name,
      owner: wrapperData.owner,
      parentFuses: wrapperData.parent,
      childFuses: wrapperData.child,
      flowType: 'revoke-permissions',
    })
  }

  const [isTooltipOpen, setIsTooltipOpen] = useState(false)
  const ButtonComponent = useMemo(() => {
    const showButton =
      isUserOwner && ['emancipated', 'locked'].includes(state) && permissions.unburned.length > 0
    if (!showButton) return null
    if (wrapperData?.child.CANNOT_BURN_FUSES)
      return (
        <Tooltip
          content="This name has revoked the permissions needed for this action"
          placement="top-center"
          open={isTooltipOpen}
          onDismiss={() => setIsTooltipOpen(false)}
        >
          <ButtonContainer>
            <Button
              data-testid="button-revoke-permissions-disabled"
              colorStyle="disabled"
              onClick={() => setIsTooltipOpen((value) => !value)}
            >
              {t('tabs.permissions.nameChangePermissions.action.changePermissions')}
            </Button>
            <IndicatorWrapper>
              <QuestionSVG />
            </IndicatorWrapper>
          </ButtonContainer>
        </Tooltip>
      )

    return (
      <Button data-testid="button-revoke-permissions" onClick={handleRevokePermissions}>
        {t('tabs.permissions.nameChangePermissions.action.changePermissions')}
      </Button>
    )
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [permissions, wrapperData, state, isUserOwner])

  return (
    <Section>
      {permissions.unburned.map(({ translationKey, fuse }) => (
        <SectionItem key={fuse} icon="info" data-testid={`unburned-${fuse}`}>
          <Typography fontVariant="bodyBold">
            {t(`tabs.permissions.nameChangePermissions.permissions.${translationKey}.label`)}
          </Typography>
          <Typography fontVariant="small">
            {t(`tabs.permissions.nameChangePermissions.permissions.${translationKey}.description`, {
              owner: isParentLocked
                ? t('tabs.permissions.role.owner')
                : t('tabs.permissions.role.parent'),
            })}
          </Typography>
        </SectionItem>
      ))}
      {permissions.burned.map(({ translationKey, fuse }) => (
        <SectionItem key={fuse} icon="disabled" data-testid={`burned-${fuse}`}>
          <Typography fontVariant="bodyBold">
            {t(`tabs.permissions.nameChangePermissions.permissions.${translationKey}.label`)}
          </Typography>
          {fusesSetDates[fuse] && (
            <TypographyGreyDim fontVariant="extraSmall">
              {t('tabs.permissions.revokedLabel', { date: fusesSetDates[fuse] })}
            </TypographyGreyDim>
          )}
          <Typography fontVariant="small">
            {t(`tabs.permissions.nameChangePermissions.permissions.${translationKey}.description`, {
              owner: isParentLocked
                ? t('tabs.permissions.role.owner')
                : t('tabs.permissions.role.parent'),
            })}
          </Typography>
        </SectionItem>
      ))}
      {ButtonComponent && (
        <SectionFooter>
          <FooterContainer>
            <div>{ButtonComponent}</div>
          </FooterContainer>
        </SectionFooter>
      )}
    </Section>
  )
}
