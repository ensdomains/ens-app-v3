import { createReadStream, createWriteStream, existsSync } from 'fs'
import { gql, request } from 'graphql-request'
import fetch from 'node-fetch'
import {
  SitemapAndIndexStream,
  SitemapStream,
  XMLToSitemapItemStream,
  parseSitemap,
  parseSitemapIndex,
} from 'sitemap'

const baseURL = 'https://alpha.ens.domains'
const graphAPI = 'https://api.thegraph.com/subgraphs/name/ensdomains/ens'

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

  const previousName = lastItem.url.replace(`${baseURL}/profile/`, '')
  const { domains } = await request(graphAPI, querySpecific, { previousName })
  const previousCreatedAt = domains[0].createdAt

  return previousCreatedAt
}

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
        new URL(path, baseURL).toString(),
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
      const res = await fetch(sitemapIndex.url)
      res.body.pipe(new XMLToSitemapItemStream()).pipe(sitemap, {
        end: false,
      })
      await new Promise((resolve) => {
        res.body.on('end', resolve)
      })
    }
  }

  let lastCreatedAt = canUsePrevious ? await getPreviousLast() : '0'

  do {
    // eslint-disable-next-line no-await-in-loop
    const { domains } = await request(graphAPI, queryAll, { lastCreatedAt })
    console.log('FETCHED 1000 ITEMS')
    if (domains.length === 0) {
      break
    }
    lastCreatedAt = domains[domains.length - 1].createdAt
    for (const domain of domains) {
      sitemap.write({ url: `${baseURL}/profile/${domain.name}` })
    }
    // eslint-disable-next-line no-constant-condition
  } while (true)
  sitemap.end()
}

main()
