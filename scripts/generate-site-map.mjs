import { createReadStream, createWriteStream, existsSync } from 'fs'
import { Transform } from 'stream'

import { gql, request } from 'graphql-request'
import fetch from 'node-fetch'
import {
  parseSitemap,
  parseSitemapIndex,
  SitemapAndIndexStream,
  SitemapStream,
  XMLToSitemapItemStream,
} from 'sitemap'

import { normalise } from '@ensdomains/ensjs/utils'

const ENS_SUBGRAPH_API_KEY = process.env.SITEMAP_GRAPH_KEY
const baseURL = 'https://app.ens.domains'
const graphAPI = `https://gateway-arbitrum.network.thegraph.com/api/${ENS_SUBGRAPH_API_KEY}/subgraphs/id/5XqPmWe6gjyrJtFn9cLy237i4cWw2j9HcUJEXsP5qGtH`

const queryAll = gql`
  query allNames($lastCreatedAt: String) {
    domains(
      first: 1000
      where: { createdAt_gt: $lastCreatedAt, name_not_ends_with: ".addr.reverse", name_not: null }
      orderBy: createdAt
      orderDirection: asc
    ) {
      createdAt
      name
    }
  }
`

const querySpecific = gql`
  query specificName($previousName: String) {
    domains(first: 1, where: { name: $previousName }) {
      createdAt
    }
  }
`

const getPreviousLast = async () => {
  if (!existsSync('./out/sitemap.xml')) {
    return '0'
  }

  const oldSiteMaps = await parseSitemapIndex(createReadStream('./out/sitemap.xml'))
  const lastUrl = oldSiteMaps[oldSiteMaps.length - 1]

  const lastSiteMap = await parseSitemap(
    createReadStream(lastUrl.url.replace(`${baseURL}/`, './out/')),
  )
  const lastItem = lastSiteMap[lastSiteMap.length - 1]

  const previousName = lastItem.url.replace(`${baseURL}/`, '')
  const { domains } = await request(graphAPI, querySpecific, { previousName })
  const previousCreatedAt = domains[0].createdAt

  return previousCreatedAt
}

const makeNormaliseTransform = () =>
  new Transform({
    objectMode: true,
    transform: (chunk, encoding, callback) => {
      const name = chunk.url.replace(`${baseURL}/`, '')
      try {
        const normalisedName = normalise(name)
        if (name === normalisedName)
          return callback(null, {
            img: [],
            video: [],
            links: [],
            url: `${baseURL}/${normalisedName}`,
          })
      } catch {}
      callback(null, undefined)
    },
  })

const writeStream = createWriteStream('./out/sitemap.xml')

const main = async () => {
  const sitemap = new SitemapAndIndexStream({
    limit: 50000,
    getSitemapStream: (i) => {
      const sitemapStream = new SitemapStream({
        hostname: baseURL,
      })
      const path = `/sitemap-${i}.xml`
      return [
        new URL(`/sitemaps${path}`, baseURL).toString(),
        sitemapStream,
        sitemapStream.pipe(createWriteStream(`./out/sitemaps${path}`)),
      ]
    },
  })

  sitemap.pipe(writeStream, {
    end: false,
  })

  const oldSitemapIndexRes = await fetch(new URL('/sitemap.xml', baseURL).toString())
  const contentType = oldSitemapIndexRes.headers.get('content-type')
  const canUsePrevious =
    oldSitemapIndexRes.ok && (contentType === 'application/xml' || contentType === 'text/xml')

  if (canUsePrevious) {
    const oldSitemapIndex = await parseSitemapIndex(oldSitemapIndexRes.body)

    for (const sitemapIndex of oldSitemapIndex) {
      const normaliseTransform = makeNormaliseTransform()
      const url = sitemapIndex.url.includes('/sitemaps')
        ? sitemapIndex.url
        : sitemapIndex.url.replace(`${baseURL}/`, `${baseURL}/sitemaps/`)
      const res = await fetch(url)
      // only allow normalised names from backlog
      res.body.pipe(new XMLToSitemapItemStream()).pipe(normaliseTransform).pipe(sitemap, {
        end: false,
      })
      await new Promise((resolve) => {
        normaliseTransform.on('end', resolve)
      })
    }
  }

  let lastCreatedAt = canUsePrevious ? await getPreviousLast() : '0'

  do {
    // eslint-disable-next-line no-await-in-loop
    let { domains } = await request(graphAPI, queryAll, { lastCreatedAt })
    console.log('FETCHED 1000 ITEMS')
    if (domains.length === 0) {
      break
    }
    lastCreatedAt = domains[domains.length - 1].createdAt

    // make sure all names are normalised
    domains = domains.filter((domain) => {
      try {
        const normalisedName = normalise(domain.name)
        if (domain.name === normalisedName) return true
      } catch {}
      return false
    })
    for (const domain of domains) {
      sitemap.write({ url: `${baseURL}/${domain.name}` })
    }
    // eslint-disable-next-line no-constant-condition
  } while (true)
  sitemap.end()
}

main()