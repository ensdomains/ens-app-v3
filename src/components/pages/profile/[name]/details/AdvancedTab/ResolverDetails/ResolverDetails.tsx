import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'

import { Typography, mq } from '@ensdomains/thorin'

import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { RecordItem } from '@app/components/RecordItem'
import { TrafficLight } from '@app/components/TrafficLight'
import { useProfile } from '@app/hooks/useProfile'
import { RESOLVER_ADDRESSES } from '@app/utils/constants'

const ResolverDetailsContainer = styled(CacheableComponent)(({ theme }) => [
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
    border: ${theme.borderWidths.px} ${theme.borderStyles.solid} ${theme.colors.borderTertiary};
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

  const { profile = { resolverAddress: '' }, isCachedData } = useProfile(name as string)
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
    <ResolverDetailsContainer $isCached={isCachedData}>
      <VersionContainer>
        <Typography weight="bold">{t('details.tabs.advanced.resolver.version')}</Typography>
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
        <Typography weight="bold">{t('address.label', { ns: 'common' })}</Typography>
        <RecordItem value={resolverAddress || ''} />
      </AddressContainer>
    </ResolverDetailsContainer>
  )
}

export default ResolverDetails
