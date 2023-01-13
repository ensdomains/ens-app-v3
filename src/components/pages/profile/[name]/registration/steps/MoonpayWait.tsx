import styled, { css } from 'styled-components'
import { useQuery } from 'wagmi'

import { mq } from '@ensdomains/thorin'

import { Card } from '@app/components/Card'

const StyledCard = styled(Card)(
  ({ theme }) => css`
    max-width: 780px;
    margin: 0 auto;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};

    ${mq.md.min(css`
      padding: ${theme.space['6']} ${theme.space['18']};
      gap: ${theme.space['6']};
    `)}
  `,
)

//   const { data: transactionData } = useQuery(
//     ['externalTransactionId', externalTransactionId],
//     async () => {
//       const response = await fetch(
//         `https://moonpay-goerli.ens-cf.workers.dev/transactionInfo?externalTransactionId=${externalTransactionId}`,
//       )
//       const result = await response.json()
//       return result
//     },
//     {
//       refetchOnWindowFocus: true,
//       refetchOnMount: true,
//       refetchInterval: 1000,
//       refetchIntervalInBackground: true,
//     },
//   )
//   console.log('transactionData: ', transactionData)
//   console.log('externalTransactionId: ', externalTransactionId)

export const MoonpayWait = ({ externalTransactionId }) => {
  return <StyledCard>Moonpay Wait</StyledCard>
}
