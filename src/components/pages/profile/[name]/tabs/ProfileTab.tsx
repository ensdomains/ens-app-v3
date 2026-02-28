import { useEffect, useMemo, useState } from 'react'
import { Trans, useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useAccount } from 'wagmi'

import { Helper } from '@ensdomains/thorin'

import { Outlink } from '@app/components/Outlink'
import { ProfileDetails } from '@app/components/pages/profile/ProfileDetails'
import { ProfileSnippet } from '@app/components/ProfileSnippet'
import { VERIFICATION_RECORD_KEY } from '@app/constants/verification'
import { useAbilities } from '@app/hooks/abilities/useAbilities'
import { useIsOffchainName } from '@app/hooks/ensjs/dns/useIsOffchainName'
import { usePrimaryName } from '@app/hooks/ensjs/public/usePrimaryName'
import { useProfileActions } from '@app/hooks/pages/profile/[name]/profile/useProfileActions/useProfileActions'
import { useNameDetails } from '@app/hooks/useNameDetails'
import { useOwners } from '@app/hooks/useOwners'
import { useVerifiedRecords } from '@app/hooks/verification/useVerifiedRecords/useVerifiedRecords'
import { categoriseAndTransformTextRecords } from '@app/utils/records/categoriseProfileTextRecords'
import { getSupportLink } from '@app/utils/supportLinks'
import { validateExpiry } from '@app/utils/utils'
import { getVerificationRecordItemProps } from '@app/utils/verification/getVerificationRecordItems'

const DetailsWrapper = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    justify-content: flex-start;
    gap: ${theme.space['2']};
    width: 100%;
  `,
)

const OutlinkWithMargin = styled(Outlink)`
  margin-left: auto;
  padding-right: 0;
`

type Props = {
  nameDetails: ReturnType<typeof useNameDetails>
  name: string
}

const ProfileTab = ({ nameDetails, name }: Props) => {
  const { t } = useTranslation('profile')

  const { address } = useAccount()

  const {
    profile,
    normalisedName,
    isCachedData,
    ownerData,
    wrapperData,
    expiryDate,
    dnsOwner,
    isWrapped,
    pccExpired,
    gracePeriodEndDate,
  } = nameDetails

  const abilities = useAbilities({ name })

  const { data: primaryData } = usePrimaryName({ address })

  const owners = useOwners({
    ownerData: ownerData!,
    wrapperData: wrapperData!,
    dnsOwner,
    abilities: abilities.data,
  })

  const userHasOwnership = owners.some(({ address: _address }) => _address === address)

  const profileActions = useProfileActions({
    name,
  })

  const { data: verifiedData, appendVerificationProps } = useVerifiedRecords({
    verificationsRecord: profile?.texts?.find(({ key }) => key === VERIFICATION_RECORD_KEY)?.value,
    ownerAddress: ownerData?.registrant || ownerData?.owner,
    name: normalisedName,
  })

  const isOffchainImport = useIsOffchainName({
    name,
    enabled: nameDetails.registrationStatus === 'imported',
  })

  const isExpired = useMemo(
    () => gracePeriodEndDate && gracePeriodEndDate < new Date(),
    [gracePeriodEndDate],
  )
  const snippetButton = useMemo(() => {
    if (isExpired) return 'register'
    if (abilities.data?.canExtend) return 'extend'
  }, [isExpired, abilities.data?.canExtend])

  const getTextRecord = (key: string) => profile?.texts?.find((x) => x.key === key)

  const categorisedRecord = categoriseAndTransformTextRecords({
    texts: profile?.texts,
    contentHash: profile?.contentHash,
    appendVerificationProps,
  })

  // Dismissible unicode info/warning banner persistence (per-normalisedName)
  const normalisedNameKey = nameDetails?.normalisedName || name
  const infoKey = `unicode-banner:${normalisedNameKey}:info`
  const warnKey = `unicode-banner:${normalisedNameKey}:warn`
  const [infoDismissed, setInfoDismissed] = useState(false)
  const [warnDismissed, setWarnDismissed] = useState(false)

  useEffect(() => {
    if (typeof window === 'undefined') return
    try {
      setInfoDismissed(localStorage.getItem(infoKey) === '1')
      setWarnDismissed(localStorage.getItem(warnKey) === '1')
    } catch {}
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [infoKey, warnKey])

  const dismissInfo = () => {
    setInfoDismissed(true)
    try {
      if (typeof window !== 'undefined') localStorage.setItem(infoKey, '1')
    } catch {}
  }
  const dismissWarn = () => {
    setWarnDismissed(true)
    try {
      if (typeof window !== 'undefined') localStorage.setItem(warnKey, '1')
    } catch {}
  }

  return (
    <DetailsWrapper>
      <ProfileSnippet
        name={normalisedName}
        getTextRecord={getTextRecord}
        button={snippetButton}
        isPrimary={name === primaryData?.name}
        isVerified={verifiedData?.some(({ key, verified }) => key === 'personhood' && verified)}
      >
        {isOffchainImport && (
          <Helper alignment="horizontal">
            <Trans
              i18nKey="tabs.profile.warnings.offchain"
              ns="profile"
              components={{
                a: (
                  <OutlinkWithMargin href={getSupportLink('offchain-not-in-names')}>
                    {t('action.learnMore', { ns: 'common' })}
                  </OutlinkWithMargin>
                ),
              }}
            />
          </Helper>
        )}
        {nameDetails.isNonASCII && nameDetails.isLatinOnly && !nameDetails.hasMixedScripts && !infoDismissed && (
          <Helper alert="info" alignment="horizontal">
            <Trans
              i18nKey="tabs.profile.warnings.homoglyph"
              ns="profile"
              components={{
                a: <Outlink href="https://unicode.org/reports/tr36/" />,
              }}
            />
            <button aria-label={t('action.dismiss', { ns: 'common' })} onClick={dismissInfo} style={{ marginLeft: 'auto', background: 'none', border: 0, cursor: 'pointer' }}>
              ×
            </button>
          </Helper>
        )}
        {nameDetails.isNonASCII && nameDetails.hasMixedScripts && !warnDismissed && (
          <Helper alert="warning" alignment="horizontal">
            {t('tabs.profile.warnings.homoglyph')}
            <button aria-label={t('action.dismiss', { ns: 'common' })} onClick={dismissWarn} style={{ marginLeft: 'auto', background: 'none', border: 0, cursor: 'pointer' }}>
              ×
            </button>
          </Helper>
        )}
        {isWrapped && !normalisedName.endsWith('.eth') && (
          <Helper alert="warning" alignment="horizontal">
            {t('tabs.profile.warnings.wrappedDNS')}
          </Helper>
        )}
      </ProfileSnippet>
      <ProfileDetails
        expiryDate={validateExpiry({
          name: normalisedName,
          expiry: expiryDate || wrapperData?.expiry?.date,
          pccExpired,
          fuses: wrapperData?.fuses,
        })}
        pccExpired={!!pccExpired}
        isCached={isCachedData || abilities.isCachedData}
        addresses={(profile?.coins || []).map((item) => ({
          iconKey: item.name,
          key: item.name,
          value: item.value,
        }))}
        accountRecords={categorisedRecord.accounts}
        otherRecords={categorisedRecord.other}
        verificationRecords={getVerificationRecordItemProps({
          showErrors: userHasOwnership,
          verifiedRecordsData: verifiedData,
          name: normalisedName,
        })}
        owners={owners}
        name={normalisedName}
        actions={profileActions.profileActions}
        gracePeriodEndDate={gracePeriodEndDate}
      />
    </DetailsWrapper>
  )
}

export default ProfileTab
