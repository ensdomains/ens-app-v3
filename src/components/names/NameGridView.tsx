import ClockSVG from '@app/assets/Clock.svg'
import { ReturnedName } from '@app/hooks/useNamesFromAddress'
import mq from '@app/mediaQuery'
import { useEns } from '@app/utils/EnsProvider'
import { ensNftImageUrl, secondsToDays } from '@app/utils/utils'
import { Colors } from '@ensdomains/thorin'
import Image from 'next/image'
import Link from 'next/link'
import { useState } from 'react'
import { useQuery } from 'react-query'
import styled, { css } from 'styled-components'

const NameGrid = styled.div`
  display: grid;
  ${({ theme }) => css`
    grid-template-columns: repeat(auto-fit, minmax(${theme.space['32']}, 1fr));
    ${mq.medium.min`
      grid-template-columns: repeat(auto-fit, minmax(${theme.space['64']}, 1fr));
    `}
    gap: ${theme.space['8']};
  `}
`

const NameGridItem = styled.div`
  display: flex;
  position: relative;
  align-items: center;
  justify-content: center;
  margin: 0;
  padding: 0;
  transition: all 0.15s ease-in-out;
  &:hover {
    filter: brightness(1.05);
    transform: translateY(-1px);
  }
`

const StyledNftBox = styled.div<{ $loading: boolean }>`
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  ${({ theme, $loading }) => css`
    background: ${$loading ? theme.colors.accentGradient : 'none'};
    border-radius: ${theme.radii['2xLarge']};
    & > span {
      border-radius: ${theme.radii['2xLarge']};
    }
  `}
`

const ExpiryWrapper = styled.div<{ $color: Colors; $primary: boolean }>`
  ${({ theme, $color, $primary }) => `
    display: flex;
    gap: ${theme.space['1']};
    flex-gap: ${theme.space['1']};
    flex-direction: row;
    align-items: center;
    justify-content: center;
    background-color: ${theme.colors.background};
    border-radius: ${theme.radii.full};
    padding: ${theme.space['0.5']} ${theme.space['1.5']};
    position: absolute;
    z-index: 1;
    right: calc(-1 * ${theme.space['1.5']});
    top: calc(-1 * ${theme.space['1.5']});
    border-radius: ${theme.radii.full};
    border-style: solid;
    border-width: 2px;
    border-color: rgba(
      ${
        $color === 'foreground'
          ? '0,0,0'
          : theme.accentsRaw[$color as keyof typeof theme.accentsRaw]
      },
      ${$primary ? '0.2' : '0.42'}
    );
    color: rgb(${theme.colors[$color]});
  `}
`

const ExpiryText = styled.div<{ $primary: boolean }>`
  font-weight: bold;
  opacity: ${({ $primary }) => ($primary ? 0.6 : 0.8)};
`

const Expiry = ({ expiry }: { expiry: Date }) => {
  const currentDate = new Date()
  const difference = secondsToDays(
    (expiry.getTime() - currentDate.getTime()) / 1000,
  )
  const months = Math.round(difference / 30)
  const years = Math.round(difference / 365)
  let text = `${years}y`
  let color: Colors = 'foreground'

  if (difference < 0) {
    text = `${difference + 90}d`
    color = 'red'
  } else if (difference < 90) {
    text = `${months}m`
    color = 'orange'
  } else if (difference < 365) {
    text = `${months}m`
    color = 'foreground'
  }

  return (
    <ExpiryWrapper $primary={color === 'foreground'} $color={color}>
      <ClockSVG
        opacity={color === 'foreground' ? '0.2' : '0.8'}
        color={color}
        width="16"
        height="16"
      />
      <ExpiryText $primary={color === 'foreground'}>{text}</ExpiryText>
    </ExpiryWrapper>
  )
}

const GridItem = ({
  name,
  network,
  expiry,
}: {
  name: string
  network: string
  expiry?: Date
}) => {
  const [loading, setLoading] = useState(true)
  const { contracts } = useEns()
  const { data: baseRegistrarAddress } = useQuery(
    'base-registrar-address',
    () => contracts?.getBaseRegistrar()!.then((c) => c.address),
  )

  return (
    <Link href={`/profile/${name}`} passHref>
      <a>
        <NameGridItem>
          {expiry && <Expiry expiry={expiry} />}
          <StyledNftBox $loading={loading}>
            <Image
              onLoadingComplete={() => setLoading(false)}
              src="/"
              loader={() =>
                ensNftImageUrl(name, network, baseRegistrarAddress || '')
              }
              width={270}
              height={270}
            />
          </StyledNftBox>
        </NameGridItem>
      </a>
    </Link>
  )
}

export const NameGridView = ({
  currentPage,
  network,
}: {
  currentPage: ReturnedName[]
  network: string
}) => {
  return (
    <NameGrid>
      {currentPage.map((item) => (
        <GridItem
          key={item.name}
          name={item.name}
          expiry={item.expiryDate}
          network={network}
        />
      ))}
    </NameGrid>
  )
}
