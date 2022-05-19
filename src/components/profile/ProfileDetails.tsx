import supportedAddresses from '@app/constants/supportedAddresses.json'
import supportedProfileItems from '@app/constants/supportedProfileItems.json'
import supportedTexts from '@app/constants/supportedTexts.json'
import { Typography } from '@ensdomains/thorin'
import { useTranslation } from 'next-i18next'
import styled from 'styled-components'
import {
  AddressProfileButton,
  OtherProfileButton,
  SocialProfileButton,
} from './ProfileButton'

const ProfileInfoBox = styled.div`
  ${({ theme }) => `
  padding: ${theme.space['6']} ${theme.space['4']};
  background-color: ${theme.colors.background};
  border: ${theme.space.px} solid ${theme.colors.borderTertiary};
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
  `}
`

const SectionTitle = styled(Typography)`
  margin-left: ${({ theme }) => theme.space['4']};
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
      <SectionTitle color="textSecondary" weight="bold" size="base">
        {t(label)}
      </SectionTitle>
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

const RecordsStack = styled.div`
  ${({ theme }) => `
  display: flex;
  flex-direction: column;
  flex-gap: ${theme.space['4']};
  gap: ${theme.space['4']};
  `}
`

export const ProfileDetails = ({
  textRecords = [],
  addresses = [],
}: {
  textRecords: Array<Record<'key' | 'value', string>>
  addresses: Array<Record<'key' | 'value', string>>
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

  return (
    <ProfileInfoBox>
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
