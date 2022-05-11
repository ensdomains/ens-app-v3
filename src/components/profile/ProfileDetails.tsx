import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedProfileItems.json'
import supportedTexts from '@app/constants/supportedTexts.json'
import { imageUrl } from '@app/utils/utils'
import { Avatar, Heading, Typography } from '@ensdomains/thorin'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import {
  AddressProfileButton,
  OtherProfileButton,
  SocialProfileButton,
} from './ProfileButton'

const ProfileInfoBox = styled.div`
  ${({ theme }) => `
  background-image: ${theme.colors.accentGradient};
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: 100% 120px;
  padding: ${theme.space['12']};
  background-color: ${theme.colors.background};
  border-radius: ${theme.radii['2xLarge']};
  `}
`

const Stack = styled.div`
  ${({ theme }) => `
  display: flex;
  flex-direction: row;
  flex-gap: ${theme.space['2']};
  gap: ${theme.space['2']};
  flex-wrap: wrap;
  margin-top: ${theme.space['2']};
  margin-left: calc(-1 * ${theme.space['4']});
  `}
`

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
  const Button = button
  const supportedArray = supported
    ? array.filter((x) => supported.includes(x.key.toLowerCase()))
    : array
  const unsupportedArray = supported
    ? array
        .filter((x) => !supported.includes(x.key.toLowerCase()))
        .map((x) => ({ ...x, type }))
    : []

  return condition ? (
    <div>
      <Typography color="textSecondary" weight="bold" size="base">
        {t(label)}
      </Typography>
      <Stack>
        {supportedArray.map(
          (item: { key: string; value: string; type?: 'text' | 'address' }) => (
            <Button {...{ ...item, iconKey: item.key }} />
          ),
        )}
        {unsupportedArray.length > 0 &&
          unsupportedArray.map(
            (item: {
              key: string
              value: string
              type?: 'text' | 'address'
            }) => <OtherProfileButton {...{ ...item, iconKey: item.key }} />,
          )}
      </Stack>
    </div>
  ) : null
}

const DetailStack = styled.div`
  ${({ theme }) => `
  display: flex;
  flex-direction: row;
  flex-gap: ${theme.space['4']};
  gap: ${theme.space['4']};
  align-items: center;
  `}
`

const RecordsStack = styled.div`
  ${({ theme }) => `
  display: flex;
  flex-direction: column;
  flex-gap: ${theme.space['4']};
  gap: ${theme.space['4']};
  margin-top: ${theme.space['4']};
  `}
`

export const ProfileDetails = ({
  name,
  network,
  textRecords = [],
  addresses = [],
}: {
  name: string
  network: string
  textRecords: Array<Record<'key' | 'value', string>>
  addresses: Array<Record<'key' | 'value', string>>
}) => {
  const getTextRecord = (key: string) => textRecords.find((x) => x.key === key)
  const otherRecords = [
    ...textRecords
      .filter(
        (x) =>
          !supportedTexts.includes(x.key.toLowerCase()) &&
          !supportedProfileItems.includes(x.key.toLowerCase()),
      )
      .map((x) => ({ ...x, type: 'text' })),
  ]

  return (
    <ProfileInfoBox>
      <Avatar
        size="32"
        label={name}
        placeholder={!getTextRecord('avatar')}
        src={
          textRecords && textRecords.length > 0 && getTextRecord('avatar')
            ? imageUrl(
                (
                  getTextRecord('avatar') || {
                    key: 'avatar',
                    value: '',
                  }
                ).value,
                name,
                network,
              )
            : undefined
        }
      />
      <DetailStack>
        <Heading level="2">{name}</Heading>
        {getTextRecord('name') && (
          <div style={{ marginTop: '4px' }}>
            <Typography weight="bold" color="textTertiary">
              {getTextRecord('name')?.value}
            </Typography>
          </div>
        )}
      </DetailStack>
      {getTextRecord('description') && (
        <Typography>{getTextRecord('description')?.value}</Typography>
      )}
      {getTextRecord('url') && (
        <div style={{ width: 'min-content' }}>
          <a href={getTextRecord('url')?.value}>
            <Typography color="blue">
              {getTextRecord('url')
                ?.value.replace(/http(s?):\/\//g, '')
                .replace(/\/$/g, '')}
            </Typography>
          </a>
        </div>
      )}
      <RecordsStack>
        <ProfileSection
          label="accounts"
          condition={
            textRecords &&
            textRecords.filter((x) =>
              supportedTexts.includes(x.key.toLowerCase()),
            ).length > 0
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
      </RecordsStack>
    </ProfileInfoBox>
  )
}
