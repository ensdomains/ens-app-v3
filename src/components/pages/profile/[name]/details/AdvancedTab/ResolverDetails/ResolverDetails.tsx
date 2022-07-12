/* eslint-disable @typescript-eslint/naming-convention */
import { RecordItem } from '@app/components/RecordItem'
import { TrafficLight } from '@app/components/TrafficLight'
import { useProfile } from '@app/hooks/useProfile'
import { mq, Typography } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

// Ordered by recency
const RESOLVER_ADDRESSES = [
  '0x4976fb03C32e5B8cfe2b6cCB31c09Ba78EBaBa41',
  '0xdaaf96c344f63131acadd0ea35170e7892d3dfba',
  '0x226159d592e2b063810a10ebf6dcbada94ed68b8',
  '0x1da022710df5002339274aadee8d58218e9d6ab5',
]

const ResolverDetailsContainer = styled.div(({ theme }) => [
  css`
    display: flex;
    flex-direction: column;
    align-items: flex-start;
    margin: 0 auto;
    gap: ${theme.space[4]};
  `,
  mq.md.min(css`
    flex-direction: row;
    align-items: center;
  `),
])

const VersionIndicator = styled.div(
  ({ theme }) => css`
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid}
      ${theme.colors.borderTertiary};
    border-radius: ${theme.radii.large};
    display: flex;
    align-items: center;
    justify-content: space-between;
    padding: ${theme.space[1.75]} ${theme.space[3]};
    gap: ${theme.space[3]};
  `,
)

const VersionContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[2]};

    & > div:first-child {
      padding-left: ${theme.space[2]};
    }
  `,
)

const AddressContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space[2]};
    width: 100%;

    & > div:first-child {
      padding-left: ${theme.space[2]};
    }
  `,
)

const ResolverDetails = () => {
  const { t } = useTranslation('profile')
  const router = useRouter()
  const { name } = router.query

  const { profile = { resolverAddress: '' } } = useProfile(name as string)
  const { resolverAddress } = profile

  const resolverAddressIndex = RESOLVER_ADDRESSES.indexOf(resolverAddress ?? '')

  let versionIndicatorText = ''
  if (resolverAddressIndex === -1) {
    versionIndicatorText = t('details.tabs.advanced.resolver.custom')
  } else {
    versionIndicatorText =
      resolverAddressIndex === 0
        ? t('details.tabs.advanced.resolver.latest')
        : t('details.tabs.advanced.resolver.outdated')
  }

  return (
    <ResolverDetailsContainer>
      <VersionContainer>
        <Typography weight="bold">
          {t('details.tabs.advanced.resolver.version')}
        </Typography>
        <VersionIndicator>
          {versionIndicatorText}
          <TrafficLight
            data-testid={`version-indicator-dot-${
              resolverAddressIndex === 0 ? 'latest' : 'outdated'
            }`}
            $go={resolverAddressIndex === 0}
            $size="4"
            $color={resolverAddressIndex === -1 ? 'grey' : undefined}
          />
        </VersionIndicator>
      </VersionContainer>
      <AddressContainer>
        <Typography weight="bold">
          {t('address.label', { ns: 'common' })}
        </Typography>
        <RecordItem value={resolverAddress || ''} />
      </AddressContainer>
    </ResolverDetailsContainer>
  )
}

export default ResolverDetails
