import { useRouter } from 'next/router'
import styled, { css } from 'styled-components'
import { Typography } from '@ensdomains/thorin'

import { useGetFuseData } from '@app/hooks/useGetFuseData'
import mq from '@app/mediaQuery'

const FusesContainer = styled.div`
  ${() => css`
    display: flex;
    flex-direction: column;
    margin: 0 auto;
    padding: 20px 25px;

    ${mq.sm.min`
      max-width: 500px;
   `}
  `}
`

const FusesRow = styled.div`
  ${() => css`
    display: flex;
    align-items: center;
    justify-content: space-between;

    &:not(:last-child) {
      padding-bottom: 20px;
    }
  `}
`

const TrafficLight = styled.div`
  ${({ theme, go }) => css`
    width: 20px;
    height: 20px;
    border-radius: 50%;
    background-color: ${go ? theme.colors.green : theme.colors.red};
  `}
`

const Fuses = () => {
  const router = useRouter()
  const { name } = router.query
  const { fuseData } = useGetFuseData(name)

  console.log('fuses: ', fuseData)

  return !fuseData ? (
    <Typography>Please wrap your name to unlock this feature</Typography>
  ) : (
    <FusesContainer>
      <FusesRow>
        <Typography color="textSecondary" weight="bold">
          Can do everything
        </Typography>
        <TrafficLight go={fuseData.fuseObj.canDoEverything} />
      </FusesRow>
      <FusesRow>
        <Typography color="textSecondary" weight="bold">
          Can burn fuses
        </Typography>
        <TrafficLight go={!fuseData.fuseObj.cannotBurnFuses} />
      </FusesRow>
      <FusesRow>
        <Typography color="textSecondary" weight="bold">
          Can create subdomains
        </Typography>
        <TrafficLight go={!fuseData.fuseObj.cannotCreateSubdomains} />
      </FusesRow>
      <FusesRow>
        <Typography color="textSecondary" weight="bold">
          Can set resolver
        </Typography>
        <TrafficLight go={!fuseData.fuseObj.cannotSetResolver} />
      </FusesRow>
      <FusesRow>
        <Typography color="textSecondary" weight="bold">
          Can set TTL
        </Typography>
        <TrafficLight go={!fuseData.fuseObj.cannotSetTTL} />
      </FusesRow>
      <FusesRow>
        <Typography color="textSecondary" weight="bold">
          Can transfer
        </Typography>
        <TrafficLight go={!fuseData.fuseObj.cannotTransfer} />
      </FusesRow>
      <FusesRow>
        <Typography color="textSecondary" weight="bold">
          Can unwrap
        </Typography>
        <TrafficLight go={!fuseData.fuseObj.cannotUnwrap} />
      </FusesRow>
      <FusesRow>
        <Typography color="textSecondary" weight="bold">
          Parent can control
        </Typography>
        <TrafficLight go={!fuseData.fuseObj.parentCannotControl} />
      </FusesRow>
    </FusesContainer>
  )
}

export default Fuses
