import type { Address } from 'viem'

import { AttributeModifier } from '../modifier/AttributeModifier'
import { ContentModifier } from '../modifier/ContentModifier'
import { ElementsCreator } from '../modifier/ElementsCreator'
import { BASE_OG_IMAGE_URL, isFarcasterRequest } from '../utils'

type ApiNameHandlerResponse =
  | {
      error: 'unsupported'
    }
  | {
      normalisedName: string
      avatar: string
      ethAddress: Address
      registrationStatus: 'registered' | 'available'
    }

export const profileRewriter = async ({
  isTld,
  request,
  paths,
}: {
  isTld: boolean
  request: Request
  paths: string[]
}): Promise<HTMLRewriter> => {
  const decodedName = decodeURIComponent(isTld ? paths[2] : paths[1])

  let newTitle = 'Invalid Name - ENS'
  let newDescription = 'An error occurred'
  let normalisedName: string | null = null
  try {
    const { normalize } = await import('viem/ens')
    normalisedName = normalize(decodedName)
    newTitle = `${normalisedName} on ENS`
    newDescription = `${normalisedName}'s profile on the Ethereum Name Service`
  } catch {
    console.error('Name could not be normalised')
  }

  const ogImageUrl = normalisedName
    ? `${BASE_OG_IMAGE_URL}/image/name/${encodeURIComponent(normalisedName)}`
    : `${BASE_OG_IMAGE_URL}/image/name/`

  const rewriter = new HTMLRewriter()
    .on('title', new ContentModifier(newTitle))
    .on('meta[name="description"]', new AttributeModifier('content', newDescription))
    /* opengraph */
    .on('meta[property="og:image"]', new AttributeModifier('content', ogImageUrl))
    .on('meta[property="og:title"]', new AttributeModifier('content', newTitle))
    .on('meta[property="og:description"]', new AttributeModifier('content', newDescription))
    /* twitter */
    .on('meta[name="twitter:image"]', new AttributeModifier('content', ogImageUrl))
    .on('meta[name="twitter:title"]', new AttributeModifier('content', newTitle))
    .on('meta[name="twitter:description"]', new AttributeModifier('content', newDescription))

  /* farcaster */
  if (normalisedName) {
    rewriter
      .on('meta[name="fc:frame:image"]', new AttributeModifier('content', ogImageUrl))
      .on(
        'meta[name="fc:frame:button:1:target"]',
        new AttributeModifier('content', `https://ens.app/${normalisedName}`),
      )
  }

  if (!isFarcasterRequest(request) || !normalisedName) return rewriter

  const data = await fetch(`${BASE_OG_IMAGE_URL}/api/v1/name/${encodeURIComponent(normalisedName)}`)
    .then((res) => res.json<ApiNameHandlerResponse>())
    .catch(() => null)

  if (!data || 'error' in data) return rewriter

  if (data.ethAddress) {
    rewriter.on(
      'head',
      new ElementsCreator([
        {
          tagName: 'meta',
          attributes: { name: 'fc:frame:button:2', content: 'View address' },
        },
        {
          tagName: 'meta',
          attributes: { name: 'fc:frame:button:2:action', content: 'link' },
        },
        {
          tagName: 'meta',
          attributes: {
            name: 'fc:frame:button:2:target',
            content: `https://ens.app/${data.ethAddress}`,
          },
        },
      ]),
    )
  }

  return rewriter
}
