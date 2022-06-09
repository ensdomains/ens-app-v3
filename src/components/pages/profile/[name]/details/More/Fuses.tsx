import { useQuery } from 'react-query'
import { useEns } from '@app/utils/EnsProvider'
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import { Typography } from '@ensdomains/thorin'

const FusesContainer = styled.div`
  ${() => css``}
`

const FusesRow = styled.div`
  ${() => css`
    display: flex;
  `}
`

const FusesRowLabel = styled.div`
  ${() => css``}
`

const FusesRowValue = styled.div`
  ${() => css``}
`

const Fuses = () => {
  const router = useRouter()
  const { name } = router.query
  const ENSInstance = useEns()
  console.log('ens: ', ENSInstance)
  const { data: fuses } = useQuery('fuses', () =>
    ENSInstance?.getFuses(name)!.then((rslt) => rslt),
  )

  console.log('fuses: ', fuses)

  return (
    <FusesContainer>
      <FusesRow>
        <Typography color="textSecondary" weight="bold">
          Can be unwrapped
        </Typography>
        <FusesRowValue />
      </FusesRow>
      <FusesRow>
        <FusesRowLabel />
        <FusesRowValue />
      </FusesRow>
      <FusesRow>
        <FusesRowLabel />
        <FusesRowValue />
      </FusesRow>
      <FusesRow>
        <FusesRowLabel />
        <FusesRowValue />
      </FusesRow>
      <FusesRow>
        <FusesRowLabel />
        <FusesRowValue />
      </FusesRow>
      <FusesRow>
        <FusesRowLabel />
        <FusesRowValue />
      </FusesRow>
      <FusesRow>
        <FusesRowLabel />
        <FusesRowValue />
      </FusesRow>
    </FusesContainer>
  )
}

export default Fuses
