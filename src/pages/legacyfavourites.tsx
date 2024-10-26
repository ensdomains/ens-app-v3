/* eslint-disable max-classes-per-file */
import { Context, Effect, pipe } from 'effect'
import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { useChainId } from 'wagmi'

import { truncateFormat } from '@ensdomains/ensjs/utils'
import { Helper, Typography } from '@ensdomains/thorin'

import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import { Spacer } from '@app/components/@atoms/Spacer'
import { Outlink } from '@app/components/Outlink'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'

const { succeed, flatMap, map, match, runSync, sync, tap } = Effect

const Container = styled.div(
  ({ theme }) => css`
    border-radius: 20px;
    border-radius: ${theme.radii['2xLarge']};
    overflow: hidden;
  `,
)

type LegacyFavorite = {
  name: string
  revealDate: number
  registrationDate: number
  migrationStartDate: number | null
  currentBlockDate: string
  transferEndDate: number | null
  gracePeriodEndDate: number | null
  value: number
  highestBid: number
  state: string
  stateError: string | null
  label: string
  decrypted: boolean
  price: number | null
  rent: number | null
  referralFeePPM: number | null
  available: boolean
  contentType: string
  expiryTime: string
  isNewRegistrar: boolean
  isDNSRegistrar: boolean | null
  dnsOwner: string | null
  deedOwner: string
  registrant: string
  auctionEnds: number | null
  labelhash: string
  owner: string
  resolver: string
  addr: string
  content: string
  parent: string
  parentOwner: string
}

// eslint-disable-next-line react/no-unused-prop-types
type SimpleFavorite = { name: string; expiry: Date }

class JsonParseError extends SyntaxError {}

export const getLegacyFavorites = (): string =>
  globalThis?.localStorage?.getItem('ensFavourites') || '{}'

export const simplifyLegacyFavorites = (legacyFavorites: any): SimpleFavorite[] => {
  if (!legacyFavorites?.length) {
    return []
  }
  return legacyFavorites.map((favorite: any) => ({
    name: favorite.name,
    expiry: favorite.expiryTime ? new Date(favorite.expiryTime) : null,
  }))
}

const jsonParseEffect = (input: string): Effect.Effect<LegacyFavorite[], JsonParseError> =>
  Effect.try({
    try: () => JSON.parse(input),
    catch: (error) => new JsonParseError(error as string),
  })

const setFavoritesProgram = (setState: Dispatch<SetStateAction<SimpleFavorite[] | null>>) =>
  pipe(
    sync(getLegacyFavorites),
    flatMap(jsonParseEffect),
    map(simplifyLegacyFavorites),
    match({
      onFailure: console.error,
      onSuccess: setState,
    }),
  )

export default function Page() {
  const [favorites, setFavorites] = useState<SimpleFavorite[] | null>(null)
  const chainId = useChainId()

  useEffect(() => {
    runSync(setFavoritesProgram(setFavorites))
  }, [])

  return (
    <Content title="Legacy Favourites" singleColumnContent>
      {{
        trailing: (
          <>
            <Helper type="warning" style={{ textAlign: 'center' }}>
              <Typography>
                Your favorites have been carried over from{' '}
                <Outlink href="https://legacy.ens.domains" target="_blank" rel="noreferrer">
                  Legacy ENS
                </Outlink>
                . These will be uneditable until favorites are fully implemented.
              </Typography>
            </Helper>
            <Spacer $height="3" />
            {favorites?.length ? (
              <Container>
                {favorites.map(({ name, expiry }: SimpleFavorite) => (
                  <TaggedNameItem
                    key={name}
                    truncatedName={truncateFormat(name)}
                    {...{
                      name,
                      network: chainId,
                      hasOtherItems: false,
                      expiryDate: { date: expiry, value: expiry?.getTime() },
                    }}
                  />
                ))}
              </Container>
            ) : (
              <Helper type="info">No Favorites found</Helper>
            )}
          </>
        ),
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
