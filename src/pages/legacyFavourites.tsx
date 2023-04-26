import { ReactElement, useEffect, useState } from 'react'
import styled, { css } from 'styled-components'
import { P, match } from 'ts-pattern'

import { Helper, Typography } from '@ensdomains/thorin'

import { TaggedNameItem } from '@app/components/@atoms/NameDetailItem/TaggedNameItem'
import { Spacer } from '@app/components/@atoms/Spacer'
import { Outlink } from '@app/components/Outlink'
import { useChainId } from '@app/hooks/useChainId'
import { Content } from '@app/layouts/Content'
import { ContentGrid } from '@app/layouts/ContentGrid'
import { useEns } from '@app/utils/EnsProvider'

const Container = styled.div(
  ({ theme }) => css`
    border-radius: 20px;
    border-radius: ${theme.radii['2xLarge']};
    overflow: hidden;
  `,
)

type Favourite = { name: string; expiry: Date }
type Favourites = Favourite[]

export default function Page() {
  const [favourites, setFavourites] = useState<Favourites | null>(null)
  const ens = useEns()
  const chainId = useChainId()
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    if (!ens.getExpiry.batch) return
    const rawFavourites = JSON.parse(window?.localStorage?.getItem('ensFavourites') || '{}') || []

    if (!rawFavourites?.length) {
      setFavourites(null)
      setIsLoading(false)
      return
    }

    const simplifiedFavourites = rawFavourites.map((favourite: any) => {
      return favourite.name
    })
    const batches = simplifiedFavourites.map((name: string) => ens.getExpiry.batch(name))

    ens.batch(...batches).then((result) => {
      const finalFavourites = simplifiedFavourites.map((favourite: string, index: number) => {
        return {
          name: favourite,
          expiry: result?.[index]?.expiry,
        }
      })
      setFavourites(finalFavourites)
      setIsLoading(false)
    })
  }, [ens])

  return (
    <Content title="Legacy Favourites" singleColumnContent loading={isLoading}>
      {{
        trailing: (
          <>
            <Helper type="warning" style={{ textAlign: 'center' }}>
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
                        {...{ name, network: chainId, hasOtherItems: false, expiryDate: expiry }}
                      />
                    ))}
                  </Container>
                )
              })
              .otherwise(() => (
                <Helper type="info">No Favourites found</Helper>
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
