import styled from 'styled-components'
import { utils, BigNumber } from 'ethers'
import { useRouter } from 'next/router'

import { RecordItem } from '@app/components/RecordItem'
import { useGetFuseData } from '@app/hooks/useGetFuseData'

import { TFunction, useTranslation } from 'react-i18next'
import ResolverDetails from './ResolverDetails'
import Fuses from './Fuses'
import { RegistrationDate } from './RegistrationDate'
import Accordion, { AccordionData } from './Accordion'

export const TokenId = () => {
  const { t } = useTranslation('profile')
  const router = useRouter()
  const { name } = router.query

  const label = (name as string)?.split('.')?.[0]
  const labelHash = utils.keccak256(utils.toUtf8Bytes(label))
  const tokenId = BigNumber.from(labelHash).toString()

  return (
    <>
      <RecordItem
        itemKey={t('details.tabs.more.tokenId.hex')}
        value={labelHash}
      />
      <div style={{ height: 10 }} />
      <RecordItem
        itemKey={t('details.tabs.more.tokenId.decimal')}
        value={tokenId}
      />
    </>
  )
}

const MoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const generateAccordionData = (
  fuseData: any,
  t: TFunction,
): AccordionData[] => [
  {
    title: t('details.tabs.more.resolver.label'),
    body: <ResolverDetails />,
  },
  {
    title: t('details.tabs.more.fuses.label'),
    body: <Fuses />,
    disabled: !fuseData,
  },
  {
    title: t('details.tabs.more.tokenId.label'),
    body: <TokenId />,
  },
  {
    title: t('details.tabs.more.registrationDate.label'),
    body: <RegistrationDate />,
  },
]

const MoreTab = () => {
  const { t } = useTranslation('profile')
  const router = useRouter()
  const { name } = router.query
  const { fuseData } = useGetFuseData((name as string) || '')

  const accordionData = generateAccordionData(fuseData, t)

  return (
    <MoreContainer>
      <Accordion data={accordionData} />
    </MoreContainer>
  )
}

export default MoreTab
