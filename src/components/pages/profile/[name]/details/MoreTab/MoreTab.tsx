import styled from 'styled-components'
import { utils, BigNumber } from 'ethers'
import { useRouter } from 'next/router'

import { RecordItem } from '@app/components/RecordItem'
import { useGetFuseData } from '@app/hooks/useGetFuseData'

import { t } from 'i18next'
import ResolverDetails from './ResolverDetails'
import Fuses from './Fuses'
import { RegistrationDate } from './RegistrationDate'
import Accordion, { AccordionData } from './Accordion'

export const TokenId = () => {
  const router = useRouter()
  const { name } = router.query

  const label = (name as string)?.split('.')?.[0]
  const labelHash = utils.keccak256(utils.toUtf8Bytes(label))
  const tokenId = BigNumber.from(labelHash).toString()

  return (
    <>
      <RecordItem itemKey="hex" value={labelHash} />
      <div style={{ height: 10 }} />
      <RecordItem itemKey="decimal" value={tokenId} />
    </>
  )
}

const MoreContainer = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
`

const generateAccordionData = (fuseData: any): AccordionData[] => [
  {
    title: t('tabs.more.resolver', { ns: 'profileDetails' }),
    body: <ResolverDetails />,
  },
  {
    title: t('tabs.more.fuses', { ns: 'profileDetails' }),
    body: <Fuses />,
    disabled: !fuseData,
  },
  {
    title: t('tabs.more.tokenId', { ns: 'profileDetails' }),
    body: <TokenId />,
  },
  {
    title: t('tabs.more.registrationDate', { ns: 'profileDetails' }),
    body: <RegistrationDate />,
  },
]

const MoreTab = () => {
  const router = useRouter()
  const { name } = router.query
  const { fuseData } = useGetFuseData((name as string) || '')

  const accordionData = generateAccordionData(fuseData)

  return (
    <MoreContainer>
      <Accordion data={accordionData} />
    </MoreContainer>
  )
}

export default MoreTab
