import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Button, Typography, mq } from '@ensdomains/thorin'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedProfileItems.json'
import supportedTexts from '@app/constants/supportedTexts.json'
import useOwners from '@app/hooks/useOwners'
import { useProfileActions } from '@app/hooks/useProfileActions'

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
      border: ${theme.space.px} solid ${theme.colors.borderSecondary};
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
    color: ${theme.colors.textTertiary};
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
    flex-direction: row;
    align-items: center;
    justify-content: flex-end;
    gap: ${theme.space['2']};

    border-top: 1px solid ${theme.colors.borderSecondary};
    padding: ${theme.space['4']};

    & > .leading {
      flex-grow: 1;
      order: -1;
      & > button {
        width: min-content;
      }
    }

    ${mq.md.min(css`
      padding: ${theme.space['4']} ${theme.space['6']};
    `)}
  `,
)

export const ProfileDetails = ({
  textRecords = [],
  addresses = [],
  name,
  isCached,
}: {
  textRecords: Array<Record<'key' | 'value', string>>
  addresses: Array<Record<'key' | 'value', string>>
  name: string
  isCached?: boolean
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
  const { owners } = useOwners(name)
  const mappedOwners = owners.map((x) => ({ key: x.label, value: x.address }))
  const { profileActions } = useProfileActions()

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
          condition
          array={mappedOwners}
          button={OwnerProfileButton}
        />
      </RecordsStack>
      {profileActions && (
        <Actions>
          {profileActions.map((action) => (
            <div className={action.red ? 'leading' : ''}>
              <Button
                shadowless
                onClick={action.onClick}
                size="small"
                tone={action.red ? 'red' : 'accent'}
                variant={action.red ? 'secondary' : 'primary'}
              >
                {action.label}
              </Button>
            </div>
          ))}
        </Actions>
      )}
    </ProfileInfoBox>
  )
}
