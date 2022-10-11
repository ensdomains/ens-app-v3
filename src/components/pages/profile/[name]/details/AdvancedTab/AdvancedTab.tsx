import { BigNumber, utils } from 'ethers'
import { useRouter } from 'next/router'
import { TFunction, useTranslation } from 'react-i18next'
import styled from 'styled-components'
import { useAccount } from 'wagmi'

import { RecordItem } from '@app/components/RecordItem'
import { useBasicName } from '@app/hooks/useBasicName'
import { useGetWrapperData } from '@app/hooks/useGetWrapperData'
import { emptyAddress } from '@app/utils/constants'

import Accordion, { AccordionData } from './Accordion'
import Fuses from './Fuses'
import { RegistrationDate } from './RegistrationDate'
import ResolverDetails from './ResolverDetails/ResolverDetails'

export const TokenId = () => {
  const { t } = useTranslation('profile')
  const router = useRouter()
  const { name } = router.query

  const label = (name as string)?.split('.')?.[0]
  const labelHash = utils.keccak256(utils.toUtf8Bytes(label) || '')
  const tokenId = BigNumber.from(labelHash).toString()

  return (
    <>
      <RecordItem itemKey={t('details.tabs.advanced.tokenId.hex')} value={labelHash} />
      <div style={{ height: 10 }} />
      <RecordItem itemKey={t('details.tabs.advanced.tokenId.decimal')} value={tokenId} />
    </>
  )
}

const MoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

export const generateAccordionData = (
  wrapperData: ReturnType<typeof useGetWrapperData>['wrapperData'],
  t: TFunction,
  ownerData: ReturnType<typeof useBasicName>['ownerData'],
  isWrapped: boolean,
  address?: string,
): AccordionData[] => [
  {
    title: t('details.tabs.advanced.resolver.label'),
    body: ResolverDetails,
    name: 'resolverDetails',
    canEdit: ownerData?.owner === address,
  },
  {
    title: t('details.tabs.advanced.fuses.label'),
    body: Fuses,
    disabled: !wrapperData || wrapperData?.owner === emptyAddress,
    name: 'fuses',
    canEdit: ownerData?.owner === address && isWrapped,
  },
  {
    title: t('details.tabs.advanced.tokenId.label'),
    body: TokenId,
    name: 'tokenId',
  },
  {
    title: t('details.tabs.advanced.registrationDate.label'),
    body: RegistrationDate,
    name: 'registrationDate',
  },
]

const MoreTab = () => {
  const { t } = useTranslation('profile')
  const router = useRouter()
  const { name } = router.query
  const { wrapperData } = useGetWrapperData((name as string) || '')
  const { address } = useAccount()
  const { ownerData, isWrapped } = useBasicName(name as string)
  const accordionData = generateAccordionData(wrapperData, t, ownerData, isWrapped, address)

  return (
    <MoreContainer>
      <Accordion data={accordionData} name={name as string} />
    </MoreContainer>
  )
}

export default MoreTab
