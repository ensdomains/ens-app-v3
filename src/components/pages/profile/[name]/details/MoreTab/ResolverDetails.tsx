/* eslint-disable @typescript-eslint/naming-convention */
import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import { Typography } from '@ensdomains/thorin'

import { useProfile } from '@app/hooks/useProfile'
import { RecordItem } from '@app/components/RecordItem'

const MigratedContainer = styled.div`
  ${({ theme }) => css`
    display: flex;
    margin: 0 auto;
    width: 180px;
    align-items: center;
    justify-content: space-between;
    padding-top: 10px;
    ${theme.space['2.5']}
  `}
`

const ResolverDetails = () => {
  const router = useRouter()
  const { name } = router.query

  const { profile = { resolverAddress: '', isMigrated: false } } = useProfile(
    name as string,
  )
  const { resolverAddress, isMigrated } = profile

  return (
    <div>
      <RecordItem itemKey="Address" value={resolverAddress || ''} />
      <MigratedContainer>
        <Typography color="textSecondary" weight="bold">
          Has been migrated?
        </Typography>
        <Typography color={isMigrated ? 'green' : 'red'} weight="bold">
          {isMigrated ? 'Yes' : 'No'}
        </Typography>
      </MigratedContainer>
    </div>
  )
}

export default ResolverDetails
