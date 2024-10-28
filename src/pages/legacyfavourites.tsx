/* eslint-disable max-classes-per-file */
import { Dispatch, ReactElement, SetStateAction, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { match } from 'ts-pattern'
import { useChainId } from 'wagmi'

import { truncateFormat } from '@ensdomains/ensjs/utils'
import { Helper, Typography } from '@ensdomains/thorin'

import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import { Spacer } from '@app/components/@atoms/Spacer'
import { Outlink } from '@app/components/Outlink'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { thread } from '@app/utils/utils'

type Result<T, E = undefined> = { ok: true; value: T } | { ok: false; error: E | undefined }

const Ok = <T,>(data: T): Result<T, never> => {
  return { ok: true, value: data }
}

const Err = <E,>(error?: E): Result<never, E> => {
  return { ok: false, error }
}

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
type SimpleFavorite = { name: string; expiry: Date | null }

class JsonParseError extends SyntaxError {}

export const getLegacyFavorites = (): string =>
  globalThis?.localStorage?.getItem('ensFavourites') || '[]'

export const simplifyLegacyFavorites = (
  legacyFavoritesResult: LegacyFavorite[],
): SimpleFavorite[] => {
  const legacyFavorites = legacyFavoritesResult
  if (!legacyFavorites?.length) {
    return []
  }
  return legacyFavorites.map((favorite: LegacyFavorite) => ({
    name: favorite.name,
    expiry: favorite.expiryTime ? new Date(favorite.expiryTime) : null,
  }))
}

const jsonParse = (input: string): Result<LegacyFavorite[], JsonParseError> => {
  try {
    return Ok(JSON.parse(input))
  } catch (error) {
    return Err(new JsonParseError(error as string))
  }
}

export default function Page() {
  const [favorites, setFavorites] = useState<SimpleFavorite[] | null>(null)
  const chainId = useChainId()

  useEffect(() => {
    const result: Result<SimpleFavorite[]> = thread(
      {},
      getLegacyFavorites,
      jsonParse,
      simplifyLegacyFavorites,
    )
    match(result)
      .with({ ok: true }, ({ value }) => {
        setFavorites(value)
      })
      .with({ ok: false }, ({ error }) => {
        console.error(error)
        setFavorites([])
      })
      .exhaustive()
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
