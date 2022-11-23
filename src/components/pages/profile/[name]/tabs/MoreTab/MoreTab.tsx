import styled, { css } from 'styled-components'

import { useNameDetails } from '@app/hooks/useNameDetails'
import useOwners from '@app/hooks/useOwners'
import { useSelfAbilities } from '@app/hooks/useSelfAbilities'

import Miscellaneous from './Miscellaneous'
import Ownership from './Ownership'
import Token from './Token'

// export const TokenId = () => {
//   const { t } = useTranslation('profile')
//   const router = useRouter()
//   const { name } = router.query

//   const label = (name as string)?.split('.')?.[0]
//   const labelHash = utils.keccak256(utils.toUtf8Bytes(label) || '')
//   const tokenId = BigNumber.from(labelHash).toString()

//   return (
//     <>
//       <RecordItem itemKey={t('details.tabs.advanced.tokenId.hex')} value={labelHash} />
//       <div style={{ height: 10 }} />
//       <RecordItem itemKey={t('details.tabs.advanced.tokenId.decimal')} value={tokenId} />
//     </>
//   )
// }

const MoreContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    align-items: stretch;
    justify-content: center;
    width: 100%;

    gap: ${theme.space['4']};
  `,
)

// export const generateAccordionData = (
//   wrapperData: ReturnType<typeof useGetWrapperData>['wrapperData'],
//   t: TFunction,
//   ownerData: ReturnType<typeof useBasicName>['ownerData'],
//   isWrapped: boolean,
//   name: string,
//   address?: string,
// ): AccordionData[] => [
//   {
//     title: t('details.tabs.advanced.resolver.label'),
//     body: ResolverDetails,
//     name: 'resolverDetails',
//     canEdit: ownerData?.owner === address,
//   },
//   {
//     title: t('details.tabs.advanced.fuses.label'),
//     body: Fuses,
//     disabled: !wrapperData || wrapperData?.owner === emptyAddress,
//     name: 'fuses',
//     canEdit: ownerData?.owner === address && isWrapped,
//   },
//   {
//     title: t('details.tabs.advanced.tokenId.label'),
//     body: TokenId,
//     name: 'tokenId',
//   },
//   ...(name.split('.').length === 2 && name.startsWith('.eth')
//     ? [
//         {
//           title: t('details.tabs.advanced.registrationDate.label'),
//           body: RegistrationDate,
//           name: 'registrationDate',
//         },
//       ]
//     : []),
// ]

type Props = {
  name: string
  nameDetails: ReturnType<typeof useNameDetails>
  selfAbilities: ReturnType<typeof useSelfAbilities>
}

const MoreTab = ({ name, nameDetails, selfAbilities }: Props) => {
  // const { t } = useTranslation('profile')
  // const router = useRouter()
  // const { name } = router.query
  // const { wrapperData } = useGetWrapperData((name as string) || '')
  // const { address } = useAccount()
  // const { ownerData, isWrapped } = useBasicName(name as string)
  const { ownerData, wrapperData, dnsOwner, isWrapped } = nameDetails
  const owners = useOwners({
    ownerData: ownerData!,
    wrapperData: wrapperData!,
    dnsOwner,
    selfAbilities,
  })

  return (
    <MoreContainer>
      <Miscellaneous name={name} />
      <Ownership name={name} owners={owners} canSend={selfAbilities.canSend} />
      {(name.endsWith('.eth') || isWrapped) && <Token isWrapped={isWrapped} name={name} />}
    </MoreContainer>
  )
}

export default MoreTab
