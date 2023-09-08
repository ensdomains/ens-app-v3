import { useTranslation } from 'react-i18next'

import { Card, Helper, RecordItem } from '@ensdomains/thorin'

import { useContractAddress } from '@app/hooks/useContractAddress'
import type { useNameDetails } from '@app/hooks/useNameDetails'
import { useBreakpoint } from '@app/utils/BreakpointProvider'

import { Header } from './components/Header'

type Props = {
  details: ReturnType<typeof useNameDetails>
}

export const ContractSection = ({ details }: Props) => {
  const { t } = useTranslation('profile')
  const address = useContractAddress('NameWrapper')
  const breakpoint = useBreakpoint()

  if (!details.isWrapped) return null
  return (
    <Card>
      <Header />
      <RecordItem
        as="a"
        value=""
        link="https://etherscan.io/address/0x57f1887a8BF19b14fC0dF6Fd9B2acc9Af147eA85"
      >
        {address}
      </RecordItem>
      <Helper type="info" alignment={breakpoint.sm ? 'horizontal' : 'vertical'}>
        {t('tabs.ownership.sections.contract.warning')}
      </Helper>
    </Card>
  )
}
