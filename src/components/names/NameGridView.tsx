import Link from 'next/link'
import styled, { css } from 'styled-components'

import { Colors, mq } from '@ensdomains/thorin'

import ClockSVG from '@app/assets/Clock.svg'
import { ReturnedName } from '@app/hooks/useNamesFromAddress'
import { secondsToDays } from '@app/utils/utils'

import { NFTWithPlaceholder } from '../NFTWithPlaceholder'

const NameGrid = styled.div(
  ({ theme }) => css`
    display: grid;
    grid-template-columns: repeat(auto-fit, minmax(${theme.space['32']}, 1fr));
    ${mq.md.min(css`
      grid-template-columns: repeat(auto-fit, minmax(${theme.space['64']}, 1fr));
    `)}
    gap: ${theme.space['8']};
  `,
)

const NameGridItem = styled.div(
  () => css`
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
  `,
)

const ExpiryWrapper = styled.div<{ $color: Colors; $primary: boolean }>(
  ({ theme, $color, $primary }) => css`
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
    border-style: solid;
    border-width: 2px;
    border-color: rgba(
      ${$color === 'foreground'
        ? '0,0,0'
        : theme.accentsRaw[$color as keyof typeof theme.accentsRaw]},
      ${$primary ? '0.2' : '0.42'}
    );
    color: rgb(${theme.colors[$color]});
  `,
)

const ExpiryText = styled.div<{ $primary: boolean }>(
  ({ $primary }) => css`
    font-weight: bold;
    opacity: ${$primary ? 0.6 : 0.8};
  `,
)

export const Expiry = ({ expiry }: { expiry: Date }) => {
  const currentDate = new Date()
  const difference = secondsToDays((expiry.getTime() - currentDate.getTime()) / 1000)
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

const GridItem = ({ name, network, expiry }: { name: string; network: number; expiry?: Date }) => {
  return (
    <Link href={`/profile/${name}`} passHref>
      <a>
        <NameGridItem>
          {expiry && <Expiry expiry={expiry} />}
          <NFTWithPlaceholder name={name} network={network} style={{ width: 270, height: 270 }} />
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
  network: number
}) => {
  return (
    <NameGrid>
      {currentPage.map((item) => (
        <GridItem key={item.name} name={item.name} expiry={item.expiryDate} network={network} />
      ))}
    </NameGrid>
  )
}
