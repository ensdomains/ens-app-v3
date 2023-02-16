import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Typography, mq } from '@ensdomains/thorin'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { DisabledButtonWithTooltip } from '@app/components/@molecules/DisabledButtonWithTooltip'
import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedGeneralRecordKeys.json'
import supportedTexts from '@app/constants/supportedSocialRecordKeys.json'
import useOwners from '@app/hooks/useOwners'
import { useProfileActions } from '@app/hooks/useProfileActions'
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

    ${mq.md.min(css`
      padding: ${theme.space['6']};
    `)}
  `,
)

const Actions = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: flex-end;
    flex-flow: row wrap;
    gap: ${theme.space['2']};

    border-top: 1px solid ${theme.colors.border};
    padding: ${theme.space['4']};

    ${mq.md.min(css`
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

      padding: ${theme.space['4']} ${theme.space['6']};
    `)}
  `,
)

type Action = NonNullable<ReturnType<typeof useProfileActions>['profileActions']>[number]
const getAction = (action: Action, is2LDEth: boolean) => {
  if (action.skip2LDEth && is2LDEth) return null
  if (action.tooltipContent) {
    return (
      <DisabledButtonWithTooltip
        buttonId="delete-subname-disabled-button"
        content={action.tooltipContent}
        buttonText={action.label}
        mobileWidth={150}
        mobileButtonWidth="initial"
        buttonWidth="initial"
        mobilePlacement="top"
        placement="right"
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

export const ProfileDetails = ({
  textRecords = [],
  addresses = [],
  expiryDate,
  pccExpired,
  owners,
  actions,
  isCached,
  name,
}: {
  textRecords: Array<Record<'key' | 'value', string>>
  addresses: Array<Record<'key' | 'value', string>>
  expiryDate: Date | undefined
  pccExpired: boolean
  owners: ReturnType<typeof useOwners>
  actions: ReturnType<typeof useProfileActions>['profileActions']
  isCached?: boolean
  name: string
}) => {
  const otherRecords = [
    ...textRecords
      .filter(
        (x) =>
          !supportedTexts.includes(x.key.toLowerCase()) &&
          !supportedProfileItems.includes(x.key.toLowerCase()),
      )
      .map((x) => ({ ...x, type: 'text' })),
  ]

  const mappedOwners = [
    ...((pccExpired
      ? [
          {
            key: 'owner',
            type: 'text',
            value: '',
          },
        ]
      : owners?.map((x) => ({ key: x.label, value: x.address }))) || []),
    {
      key: 'expiry',
      type: 'text',
      value: expiryDate ? formatExpiry(expiryDate) : 'no expiry',
      timestamp: expiryDate ? expiryDate.getTime() : 0,
    },
  ]

  const is2LDEth = checkETH2LDFromName(name)

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
          supported={supportedAddresses}
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
        <Actions data-testid="profile-actions">
          {actions.map((action) => (
            <div className={action.red ? 'leading' : ''} key={action.label}>
              {getAction(action, is2LDEth)}
            </div>
          ))}
        </Actions>
      )}
    </ProfileInfoBox>
  )
}
