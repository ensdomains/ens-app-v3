import type { Address } from 'viem'

import { AttributeModifier } from '../modifier/AttributeModifier'
import { ContentModifier } from '../modifier/ContentModifier'
import { ElementCreation, ElementsCreator } from '../modifier/ElementsCreator'
import { BASE_OG_IMAGE_URL, isFarcasterRequest } from '../utils'

type ApiAddressHandlerResponse = {
  normalisedAddress: Address
  primaryName: string
  avatar: string
}

export const addressRewriter = async ({
  request,
  paths,
  url,
}: {
  request: Request
  paths: string[]
  url: URL
}): Promise<HTMLRewriter> => {
  const address = paths[1]
  // eslint-disable-next-line no-param-reassign
  url.pathname = '/address'
  url.searchParams.set('address', address)

  const ogImageUrl = `${BASE_OG_IMAGE_URL}/image/address/${address}`

  const newTitle = `${address.slice(0, 7)}...${address.slice(-5)} on ENS`
  const newDescription = `${address}'s profile on the Ethereum Name Service`

  const elements: ElementCreation[] = [
    /* opengraph */
    {
      tagName: 'meta',
      attributes: { property: 'og:image', content: ogImageUrl },
    },
    {
      tagName: 'meta',
      attributes: { property: 'og:title', content: newTitle },
    },
    {
      tagName: 'meta',
      attributes: { property: 'og:description', content: newDescription },
    },
    /* twitter */
    {
      tagName: 'meta',
      attributes: { name: 'twitter:image', content: ogImageUrl },
    },
    {
      tagName: 'meta',
      attributes: { name: 'twitter:title', content: newTitle },
    },
    {
      tagName: 'meta',
      attributes: { name: 'twitter:description', content: newDescription },
    },
    /* farcaster */
    {
      tagName: 'meta',
      attributes: { name: 'fc:frame:image', content: ogImageUrl },
    },
    {
      tagName: 'meta',
      attributes: { name: 'fc:frame:button:1', content: 'View address' },
    },
    {
      tagName: 'meta',
      attributes: { name: 'fc:frame:button:1:action', content: 'link' },
    },
    {
      tagName: 'meta',
      attributes: {
        name: 'fc:frame:button:1:target',
        content: `https://ens.app/${address}`,
      },
    },
  ]

  const rewriter = new HTMLRewriter()
    .on('title', new ContentModifier(newTitle))
    .on('meta[name="description"]', new AttributeModifier('content', newDescription))
    .on('head', new ElementsCreator(elements))

  if (!isFarcasterRequest(request)) return rewriter

  const data = await fetch(`${BASE_OG_IMAGE_URL}/api/v1/address/${address}`)
    .then((res) => res.json<ApiAddressHandlerResponse>())
    .catch(() => null)

  if (!data) return rewriter

  if (data.primaryName) {
    elements.push(
      {
        tagName: 'meta',
        attributes: { name: 'fc:frame:button:2', content: 'View profile' },
      },
      {
        tagName: 'meta',
        attributes: { name: 'fc:frame:button:2:action', content: 'link' },
      },
      {
        tagName: 'meta',
        attributes: {
          name: 'fc:frame:button:2:target',
          content: `https://ens.app/${data.primaryName}`,
        },
      },
    )
  }

  return rewriter
}
