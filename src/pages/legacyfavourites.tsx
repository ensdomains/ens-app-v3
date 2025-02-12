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

// eslint-disable-next-line react/no-unused-prop-types
type Favourite = { name: string; expiry: Date }
type Favourites = Favourite[]

export default function Page() {
  const [favourites, setFavourites] = useState<Favourites | null>(null)
  const chainId = useChainId()

  useEffect(() => {
    const rawFavourites =
      JSON.parse(globalThis?.localStorage?.getItem('ensFavourites') || '{}') || []

    if (!rawFavourites?.length) {
      return
    }

    const simplifiedFavourites = rawFavourites.map((favourite: any) => ({
      name: favourite.name,
      expiry: favourite.expiryTime ? new Date(favourite.expiryTime) : null,
    }))
    setFavourites(simplifiedFavourites)
  }, [])

  return (
    <Content title="Legacy Favourites" singleColumnContent>
      {{
        trailing: (
          <>
            <Helper alert="warning" style={{ textAlign: 'center' }}>
              <Typography>
                Your favourites have been carried over from{' '}
                <Outlink href="https://legacy.ens.domains" target="_blank" rel="noreferrer">
                  Legacy ENS
                </Outlink>
                . These will be uneditable until favourites are fully implemented.
              </Typography>
            </Helper>
            <Spacer $height="3" />
            {match(favourites)
              .with(P.array({ name: P.string, expiry: P._ }), (_favourites) => {
                return (
                  <Container>
                    {_favourites.map(({ name, expiry }: Favourite) => (
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
                <Helper alert="info">No Favourites found</Helper>
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
