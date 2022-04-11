import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedTexts from '@app/constants/supportedTexts.json'
import { imageUrl } from '@app/utils/utils'
import { Avatar, tokens, Typography } from '@ensdomains/thorin'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import {
  AddressProfileButton,
  OtherProfileButton,
  SocialProfileButton,
} from './ProfileButton'

const ProfileInfoBox = styled.div`
  background-image: ${({ theme }) => tokens.colors[theme.mode].accentGradient};
  background-repeat: no-repeat;
  background-attachment: scroll;
  background-size: 100% 120px;
  padding: ${tokens.space['12']};
  background-color: ${({ theme }) => tokens.colors[theme.mode].background};
  border-radius: ${tokens.radii['2xLarge']};
`

const Stack = styled.div`
  display: flex;
  flex-direction: row;
  flex-gap: ${tokens.space['2']};
  gap: ${tokens.space['2']};
  flex-wrap: wrap;
`

const StackWrapper = styled.div`
  margin-top: ${tokens.space['2']};
  margin-left: calc(-1 * ${tokens.space['4']});
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
      <StackWrapper>
        <Stack>
          {supportedArray.map(
            (item: {
              key: string
              value: string
              type?: 'text' | 'address'
            }) => (
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
      </StackWrapper>
    </div>
  ) : null
}

const DetailStack = styled.div`
  display: flex;
  flex-direction: row;
  flex-gap: 4px;
  gap: 4px;
  align-items: center;
`

const RecordsStack = styled.div`
  display: flex;
  flex-direction: column;
  flex-gap: 16px;
  gap: 16px;
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
      .filter((x) => !supportedTexts.includes(x.key.toLowerCase()))
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
        <Typography variant="extraLarge" weight="bold">
          {name}
        </Typography>
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
      <div style={{ marginTop: '16px' }}>
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
      </div>
    </ProfileInfoBox>
  )
}
