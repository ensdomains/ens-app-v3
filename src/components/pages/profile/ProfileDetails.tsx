import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Helper, Typography, mq } from '@ensdomains/thorin'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { DisabledButtonWithTooltip } from '@app/components/@molecules/DisabledButtonWithTooltip'
import coinsWithIcons from '@app/constants/coinsWithIcons.json'
import supportedProfileItems from '@app/constants/supportedGeneralRecordKeys.json'
import supportedTexts from '@app/constants/supportedSocialRecordKeys.json'
import useOwners from '@app/hooks/useOwners'
import { useProfileActions } from '@app/hooks/useProfileActions'
import { ContentHash } from '@app/types'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { contentHashToString } from '@app/utils/contenthash'
import { checkETH2LDFromName, formatExpiry } from '@app/utils/utils'

import {
  AddressProfileButton,
  OtherProfileButton,
  OwnerProfileButton,
  SocialProfileButton,
} from './ProfileButton'

const ProfileInfoBox = styled(CacheableComponent)(
  ({ theme }) =>
    css`
      background-color: ${theme.colors.background};
      border-radius: ${theme.radii['2xLarge']};
      border: ${theme.space.px} solid ${theme.colors.border};
    `,
)

const Stack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-flow: row wrap;
    flex-gap: ${theme.space['2']};
    gap: ${theme.space['2']};
    margin-top: ${theme.space['2']};
  `,
)

const SectionTitle = styled(Typography)(({ theme }) => [
  css`
    color: ${theme.colors.greyPrimary};
    margin-left: ${theme.space['2']};
  `,
])

const ProfileSection = ({
  condition,
  label,
  array,
  button,
  supported,
  type,
}: {
  condition: any
  label: string
  array: Array<Record<'key' | 'value', string>>
  button: any
  supported?: Array<string>
  type?: 'address' | 'text'
}) => {
  const { t } = useTranslation('profile')
  const ButtonComponent = button
  const supportedArray = supported
    ? array.filter((x) => supported.includes(x.key.toLowerCase()))
    : array
  const unsupportedArray = supported
    ? array.filter((x) => !supported.includes(x.key.toLowerCase())).map((x) => ({ ...x, type }))
    : []

  return condition ? (
    <div>
      <SectionTitle weight="bold">{t(label)}</SectionTitle>
      <Stack>
        {supportedArray.map((item: { key: string; value: string; type?: 'text' | 'address' }) => (
          <ButtonComponent {...{ ...item, iconKey: item.key }} />
        ))}
        {unsupportedArray.length > 0 &&
          unsupportedArray.map(
            (item: { key: string; value: string; type?: 'text' | 'address' }) => (
              <OtherProfileButton {...{ ...item, iconKey: item.key }} />
            ),
          )}
      </Stack>
    </div>
  ) : null
}

const RecordsStack = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    flex-gap: ${theme.space['4']};
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    ${mq.sm.min(css`
      padding: ${theme.space['6']};
    `)}
  `,
)

const ActionsContainer = styled.div(({ theme }) => [
  css`
    border-top: ${theme.space.px} solid ${theme.colors.border};
    padding: ${theme.space['4']};
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
  `,
  mq.sm.min(css`
    padding: ${theme.space['4']} ${theme.space['6']};
  `),
])

const Actions = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-flow: row wrap;
    gap: ${theme.space['2']};

    ${mq.sm.min(css`
      & > .leading {
        flex-grow: 1;
        order: -1;
        & > div {
          width: min-content;
        }
        button {
          width: min-content;
        }
      }
    `)}
  `,
)

const ActionWrapper = styled.div<{
  leading?: boolean
  fullMobileWidth?: boolean
}>(({ leading, fullMobileWidth }) => [
  css`
    ${fullMobileWidth &&
    css`
      width: 100%;
    `}
  `,
  mq.sm.min(css`
    width: initial;
    ${leading &&
    css`
      flex-grow: 1;
      order: -1;
      & > div,
      button {
        width: min-content;
      }
    `}
  `),
])

type Action = NonNullable<ReturnType<typeof useProfileActions>['profileActions']>[number]
const getAction = (action: Action, is2LDEth: boolean) => {
  if (action.skip2LDEth && is2LDEth) return null
  if (action.tooltipContent) {
    return (
      <DisabledButtonWithTooltip
        buttonId={`disabled-profile-action-${action.label}`}
        content={action.tooltipContent}
        buttonText={action.label}
        mobileWidth={150}
        mobileButtonWidth="initial"
        mobilePlacement="top"
        placement={action.tooltipPlacement || 'right'}
      />
    )
  }
  return (
    <Button
      data-testid={`profile-action-${action.label}`}
      onClick={action.onClick}
      size="small"
      colorStyle={action.red ? 'redSecondary' : 'accentPrimary'}
    >
      {action.label}
    </Button>
  )
}

export const ownershipInfoCalc = (
  name: string,
  pccExpired: boolean,
  owners: ReturnType<typeof useOwners>,
  gracePeriodEndDate?: Date,
  expiryDate?: Date,
) => {
  let parentName = name.split('.').slice(1).join('.')
  // exception for TLDs, show parent as "[root]"
  if (parentName === '' && name !== '[root]' && name !== '') parentName = '[root]'
  if (pccExpired) {
    return [
      {
        key: 'name.owner',
        type: 'text',
        value: '',
      },
      {
        key: 'name.parent',
        type: 'text',
        value: parentName,
      },
    ]
  }

  if (gracePeriodEndDate && gracePeriodEndDate < new Date() && !pccExpired) {
    const managerDetails = owners.find((x) => x.transferType === 'manager')

    return [
      {
        key: 'name.owner',
        type: 'text',
        value: '',
      },
      {
        key: 'name.manager',
        type: 'text',
        value: managerDetails?.address || '',
      },
      {
        key: 'name.expiry',
        type: 'text',
        value: expiryDate ? formatExpiry(expiryDate) : '',
        timestamp: expiryDate ? expiryDate.getTime() : 0,
      },
      {
        key: 'name.parent',
        type: 'text',
        value: parentName,
      },
    ]
  }

  if (!owners)
    return [
      {
        key: 'name.owner',
        type: 'text',
        value: '',
      },
      {
        key: 'name.expiry',
        type: 'text',
        value: expiryDate ? formatExpiry(expiryDate) : '',
        timestamp: expiryDate ? expiryDate.getTime() : 0,
      },
      {
        key: 'name.parent',
        type: 'text',
        value: parentName,
      },
    ]

  return [
    ...owners.map((x) => ({ key: x.label, value: x.address })),
    {
      key: 'name.expiry',
      type: 'text',
      value: expiryDate ? formatExpiry(expiryDate) : '',
      timestamp: expiryDate ? expiryDate.getTime() : 0,
    },
    {
      key: 'name.parent',
      type: 'text',
      value: parentName,
    },
  ]
}

export const ProfileDetails = ({
  textRecords = [],
  addresses = [],
  contentHash,
  expiryDate,
  pccExpired,
  owners,
  actions,
  isCached,
  name,
  gracePeriodEndDate,
}: {
  textRecords: Array<Record<'key' | 'value', string>>
  addresses: Array<Record<'key' | 'value', string>>
  contentHash?: ContentHash
  expiryDate: Date | undefined
  pccExpired: boolean
  owners: ReturnType<typeof useOwners>
  actions: ReturnType<typeof useProfileActions>['profileActions']
  isCached?: boolean
  name: string
  gracePeriodEndDate?: Date
}) => {
  const breakpoint = useBreakpoint()

  const _contentHash = contentHashToString(contentHash)
  const otherRecords = [
    ...textRecords
      .filter(
        (x) =>
          !supportedTexts.includes(x.key.toLowerCase()) &&
          !supportedProfileItems.includes(x.key.toLowerCase()),
      )
      .map((x) => ({ ...x, type: 'text' })),
    ...(_contentHash ? [{ key: 'contenthash', type: 'contenthash', value: _contentHash }] : []),
  ]

  const mappedOwners = ownershipInfoCalc(name, pccExpired, owners, gracePeriodEndDate, expiryDate)

  const is2LDEth = checkETH2LDFromName(name)

  const actionWarnings = actions
    ?.filter((action) => !!action.warning)
    .map((action) => action.warning)

  return (
    <ProfileInfoBox $isCached={isCached}>
      <RecordsStack>
        <ProfileSection
          label="accounts"
          condition={
            textRecords &&
            textRecords.filter((x) => supportedTexts.includes(x.key.toLowerCase())).length > 0
          }
          array={textRecords}
          button={SocialProfileButton}
        />
        <ProfileSection
          label="addresses"
          type="address"
          condition={addresses && addresses.length > 0}
          supported={coinsWithIcons}
          array={addresses}
          button={AddressProfileButton}
        />
        <ProfileSection
          label="otherRecords"
          condition={otherRecords && otherRecords.length > 0}
          array={otherRecords}
          button={OtherProfileButton}
        />
        <ProfileSection
          label="ownership"
          condition={!!mappedOwners}
          array={mappedOwners!}
          button={OwnerProfileButton}
        />
      </RecordsStack>
      {actions && actions?.length > 0 && (
        <ActionsContainer>
          {!!actionWarnings &&
            actionWarnings.length > 0 &&
            actionWarnings.map((warning) => (
              <Helper type="warning" alignment={breakpoint.sm ? 'horizontal' : 'vertical'}>
                {warning}
              </Helper>
            ))}
          <Actions data-testid="profile-actions">
            {actions.map((action) => (
              <ActionWrapper
                key={action.label}
                leading={!!action.red}
                fullMobileWidth={action.fullMobileWidth}
              >
                {getAction(action, is2LDEth)}
              </ActionWrapper>
            ))}
          </Actions>
        </ActionsContainer>
      )}
    </ProfileInfoBox>
  )
}
