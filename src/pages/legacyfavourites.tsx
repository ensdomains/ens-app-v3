import { Effect, pipe } from 'effect'
import { ReactElement, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { match, P } from 'ts-pattern'
import { useChainId } from 'wagmi'

import { truncateFormat } from '@ensdomains/ensjs/utils'
import { Helper, Typography } from '@ensdomains/thorin'

import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import { Spacer } from '@app/components/@atoms/Spacer'
import { Outlink } from '@app/components/Outlink'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'

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

export default function Page() {
  const [favorites, setFavorites] = useState<SimpleFavorite[] | null>(null)
  const chainId = useChainId()

  useEffect(() => {
    pipe(
      Effect.succeed(getLegacyFavorites()),
      Effect.flatMap(jsonParseEffect),
      Effect.map(simplifyLegacyFavorites),
      Effect.match({
        onFailure: console.error,
        onSuccess: setFavorites,
      }),
      Effect.runSync,
    )
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
            {match(favorites)
              .with(P.array({ name: P.string, expiry: P._ }), (_favorites) => {
                return (
                  <Container>
                    {_favorites.map(({ name, expiry }: SimpleFavorite) => (
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
                )
              })
              .otherwise(() => (
                <Helper type="info">No Favorites found</Helper>
              ))}
          </>
        ),
      }}
    </Content>
  )
}

Page.getLayout = function getLayout(page: ReactElement) {
  return <ContentGrid>{page}</ContentGrid>
}
