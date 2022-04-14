import { gql, useQuery } from '@apollo/client'
import { GET_REVERSE_RECORD } from '@app/graphql/queries'
import mq from '@app/mediaQuery'
import { useBreakpoint } from '@app/utils/BreakpointProvider'
import { connectProvider, disconnectProvider } from '@app/utils/providerUtils'
import { imageUrl } from '@app/utils/utils'
import {
  Button,
  EthTransparentInvertedSVG,
  Profile,
  Spinner,
  tokens,
} from '@ensdomains/thorin'
import { useTranslation } from 'next-i18next'
import { useRouter } from 'next/router'
import styled from 'styled-components'

const NETWORK_INFORMATION_QUERY = gql`
  query getNetworkInfo @client {
    accounts
    isReadOnly
    isSafeApp
    avatar
    network
    displayName
  }
`

const StyledIconEthTransparentInverted = styled(EthTransparentInvertedSVG)`
  color: white;
  display: block;
  margin-right: calc(${tokens.space['2']} * -1);
  margin-left: calc(${tokens.space['2']} * -1);
  height: ${tokens.space['4']};
  width: ${tokens.space['4']};
  ${mq.small.min`
    height: ${tokens.space['6']};
    width: ${tokens.space['6']};
  `}
`

export const HeaderConnect = () => {
  const router = useRouter()
  const breakpoints = useBreakpoint()
  const { t } = useTranslation('common')
  const {
    data: { accounts, network, displayName, isReadOnly },
  } = useQuery(NETWORK_INFORMATION_QUERY)

  const { data: { getReverseRecord } = {}, loading: reverseRecordLoading } =
    useQuery(GET_REVERSE_RECORD, {
      variables: {
        address: accounts?.[0],
      },
      skip: !accounts?.length,
    })

  return !isReadOnly ? (
    <Profile
      address={accounts[0]}
      ensName={displayName}
      dropdownItems={[
        {
          label: t('profile.myProfile'),
          onClick: () => router.push('/profile/me'),
        },
        {
          label: t('profile.disconnect'),
          color: 'red',
          onClick: () => disconnectProvider(),
        },
      ]}
      avatar={
        !reverseRecordLoading &&
        getReverseRecord &&
        getReverseRecord.avatar &&
        imageUrl(getReverseRecord?.avatar, displayName, network)
      }
      size={breakpoints.sm ? 'medium' : 'small'}
      alignDropdown="right"
    />
  ) : (
    <Button
      onClick={() => connectProvider()}
      prefix={
        network === 'Loading' || accounts?.[0] ? (
          <Spinner color="accentText" />
        ) : (
          <StyledIconEthTransparentInverted />
        )
      }
      variant="action"
      size={breakpoints.sm ? 'medium' : 'small'}
    >
      {t('profile.connect')}
    </Button>
  )
}
