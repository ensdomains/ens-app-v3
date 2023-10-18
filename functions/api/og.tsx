// eslint-disable-next-line import/no-extraneous-dependencies
import { ImageResponse } from '@vercel/og'
import { ReactNode } from 'react'

import { zorbImageDataURI } from '@app/utils/gradient'

const corsHeaders = {
  /* eslint-disable @typescript-eslint/naming-convention */
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Methods': 'GET, PUT, OPTIONS',
  'Access-Control-Allow-Headers': 'Content-Type',
  /* eslint-enable @typescript-eslint/naming-convention */
}

const makeResponse = (body?: BodyInit | null, status?: number, headers?: Record<string, any>) => {
  return new Response(typeof body === 'string' ? JSON.stringify({ message: body }) : body, {
    status,
    headers: {
      ...corsHeaders,
      ...(headers || {}),
    },
  })
}

const ogRewriter: PagesFunction = async ({ request, next, env }) => {
  const url = new URL(request.url)
  const paths = url.pathname.split('/')

  if (paths[1] !== 'api' || paths[2] !== 'og') return next()

  const params = new URLSearchParams(url.search)
  const name = params.get('name')
  const isInvalid = Boolean(params.get('invalid'))

  if (!name && !isInvalid) return makeResponse('Missing name parameter', 400)

  let backgroundGradient: string =
    'linear-gradient(330deg, #44BCF0 4.54%, #7298F8 59.2%, #A099FF 148.85%)'
  let avatarElement: ReactNode
  let displayName: string
  let displayEthAddress: string | null = null

  if (!name || isInvalid) {
    backgroundGradient = 'linear-gradient(135deg, #EB9E9E 0%, #922 100%)'
    avatarElement = (
      <div
        style={{
          border: '16px solid #fff',
          borderRadius: '999px',
          padding: '0px',
          width: '300px',
          height: '300px',
          background: backgroundGradient,
        }}
      />
    )
    displayName = 'Invalid name'
  } else {
    const decodedName = decodeURIComponent(name)
    const { normalize } = await import('viem/ens')
    let normalisedName: string | null = null
    try {
      normalisedName = normalize(decodedName)
      // eslint-disable-next-line no-empty
    } catch {}
    if (!normalisedName) return makeResponse('Invalid name', 400)

    const { createClient, http } = await import('viem')
    const { getEnsAddress, getEnsAvatar } = await import('viem/actions')
    const { mainnet } = await import('viem/chains')

    const client = createClient({
      chain: mainnet,
      transport: http('https://web3.ens.domains/v1/mainnet'),
    })

    const [avatar, ethAddress] = await Promise.all([
      getEnsAvatar(client, { name: normalisedName }),
      getEnsAddress(client, { name: normalisedName }),
    ])

    const src = avatar || zorbImageDataURI(normalisedName, 'name', {} as any)

    avatarElement = (
      // eslint-disable-next-line jsx-a11y/alt-text, @next/next/no-img-element
      <img
        style={{ border: '16px solid #fff', borderRadius: '999px', padding: '0px' }}
        width="300"
        height="300"
        src={src}
      />
    )
    displayName = normalisedName
    displayEthAddress = ethAddress ? `${ethAddress.slice(0, 7)}...${ethAddress.slice(-5)}` : null
  }

  const element = (
    <div
      style={{
        gap: '48px',
        paddingLeft: '129px',
        width: '1200px',
        height: '630px',
        display: 'flex',
        justifyContent: 'flex-start',
        alignItems: 'center',
        background: backgroundGradient,
      }}
    >
      <div style={{ display: 'flex', position: 'relative' }}>
        {avatarElement}
        <svg
          style={{ left: '-16px', top: '-16px', position: 'absolute' }}
          xmlns="http://www.w3.org/2000/svg"
          width="116"
          height="116"
          viewBox="0 0 116 116"
          fill="none"
        >
          <rect width="116" height="116" rx="58" fill="white" />
          <path
            d="M35.45 40.0445C36.086 38.8601 37.0038 37.8504 38.1225 37.1044L56.8972 24L37.6603 55.7949C37.6603 55.7949 35.9794 52.9557 35.3239 51.5191C34.5071 49.7129 34.0951 47.7501 34.1168 45.7679C34.1386 43.7858 34.5937 41.8324 35.45 40.0445ZM27.7014 61.9775C27.9134 65.0181 28.7729 67.9782 30.2223 70.6598C31.6716 73.3415 33.6775 75.6825 36.1055 77.5264L56.872 92C56.872 92 43.8793 73.2843 32.9204 54.661C31.8109 52.6934 31.065 50.5422 30.7185 48.3104C30.5651 47.2997 30.5651 46.2717 30.7185 45.261C30.4327 45.7904 29.8781 46.8739 29.8781 46.8739C28.7669 49.1391 28.0101 51.5613 27.6342 54.0562C27.4178 56.6932 27.4403 59.3444 27.7014 61.9775ZM80.6471 64.4975C79.9746 63.0611 78.3107 60.2218 78.3107 60.2218L59.1075 92L77.8821 78.904C79.0008 78.158 79.9187 77.1484 80.5547 75.964C81.411 74.176 81.8659 72.2226 81.8879 70.2406C81.9096 68.2585 81.4976 66.2954 80.6807 64.4892L80.6471 64.4975ZM88.2695 54.0308C88.0574 50.9904 87.198 48.0301 85.7488 45.3486C84.2993 42.667 82.2934 40.3259 79.8654 38.482L59.1325 24C59.1325 24 72.1168 42.7157 83.0843 61.339C84.1907 63.3073 84.9337 65.4584 85.2777 67.6896C85.4311 68.7003 85.4311 69.7284 85.2777 70.739C85.5635 70.2096 86.1181 69.1261 86.1181 69.1261C87.2293 66.8609 87.9862 64.4387 88.3619 61.9438C88.5811 59.307 88.5615 56.6558 88.3032 54.0225L88.2695 54.0308Z"
            fill="#3889FF"
          />
        </svg>
      </div>
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '24px',
          alignItems: 'flex-start',
          justifyContent: 'center',
        }}
      >
        <h1
          style={{
            margin: 0,
            color: '#FFF',
            fontFamily: 'Satoshi',
            fontSize: '96px',
            fontStyle: 'normal',
            fontWeight: 830,
            lineHeight: '95%',
          }}
        >
          {displayName}
        </h1>
        {displayEthAddress && (
          <p
            style={{
              margin: 0,
              color: 'rgba(255, 255, 255, 0.65)',
              fontFamily: 'Satoshi',
              fontSize: '40px',
              fontStyle: 'normal',
              fontWeight: 700,
              lineHeight: '75%',
            }}
          >
            {displayEthAddress}
          </p>
        )}
      </div>
    </div>
  )

  const getFont = async (fontName: string) =>
    env.ASSETS.fetch(new Request(`${url.origin}/fonts/sans-serif/special/${fontName}.otf`)).then(
      (res) => res.arrayBuffer(),
    )

  return new ImageResponse(element, {
    width: 1200,
    height: 630,
    fonts: [
      {
        name: 'Satoshi',
        data: await getFont('Satoshi-Bold'),
        weight: 700,
        style: 'normal',
      },
      {
        name: 'Satoshi',
        data: await getFont('Satoshi-ExtraBold'),
        weight: 830 as any,
        style: 'normal',
      },
    ],
  })
}

export default ogRewriter
