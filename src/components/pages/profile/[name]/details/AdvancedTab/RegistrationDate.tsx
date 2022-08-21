import { CacheableComponent } from '@app/components/@atoms/CacheableComponent'
import { useGetHistory } from '@app/hooks/useGetHistory'
import { Button, mq, Typography } from '@ensdomains/thorin'
import { useRouter } from 'next/router'
import { useTranslation } from 'react-i18next'
import styled, { css } from 'styled-components'
import { useNetwork, useProvider, useQuery } from 'wagmi'

function getEtherScanLink(networkId?: number | string) {
  switch (networkId) {
    case 1:
    case '1':
      return 'https://etherscan.io/'
    case 3:
    case '3':
      return 'https://ropsten.etherscan.io/'
    case 4:
    case '4':
      return 'https://rinkeby.etherscan.io/'
    case 5:
    case '5':
      return 'https://goerli.etherscan.io/'
    default:
      return 'https://etherscan.io/'
  }
}

const RegistrationDateContainer = styled(CacheableComponent)(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    justify-content: space-between;
    flex-direction: column;
    gap: ${theme.space['2.5']};

    ${mq.sm.min`
      flex-direction: row;
    `}
  `,
)

const ButtonContainer = styled.div(() => [
  css`
    width: 100%;
  `,
  mq.sm.min(css`
    max-width: 170px;
    text-align: center;
  `),
])

export const RegistrationDate = () => {
  const { t } = useTranslation('common')
  const router = useRouter()
  const { name } = router.query
  const { history = { registration: [] }, isCachedData } = useGetHistory(name as string)
  const provider = useProvider()
  const { chain } = useNetwork()

  const registration = history?.registration?.[0]
  const registrationBlock = registration?.blockNumber

  const { data: { registrationDate, transactionHash } = {} } = useQuery(
    ['getRegistrationData'],
    async () => {
      const block = await provider.getBlock(registrationBlock)
      const unixTimestamp = block.timestamp
      const date = new Date(unixTimestamp * 1000)

      return {
        registrationDate: date.toString(),
        transactionHash: registration.transactionHash,
      }
    },
    {
      enabled: !!(
        registration &&
        (typeof registrationBlock === 'number' || typeof registrationBlock === 'string') &&
        Object.keys(provider || {}).length > 0
      ),
    },
  )

  return (
    <RegistrationDateContainer $isCached={isCachedData}>
      <Typography>{registrationDate}</Typography>
      <ButtonContainer>
        <Button
          as="a"
          href={`${getEtherScanLink(chain?.id)}tx/${transactionHash}`}
          target="_blank"
          size="small"
        >
          {t('transaction.viewEtherscan')}
        </Button>
      </ButtonContainer>
    </RegistrationDateContainer>
  )
}
