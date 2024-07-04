import { AppPropsType, AppType } from 'next/dist/shared/lib/utils'
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet } from 'styled-components'

const ipfsPathScript = `
  (function () {
    const { pathname } = window.location
    const ipfsMatch = /.*\\/Qm\\w{44}\\//.exec(pathname)
    const base = document.createElement('base')

    base.href = ipfsMatch ? ipfsMatch[0] : '/'
    document.head.append(base)
  })();
`

const hiddenCheckScript = `
  if (document.prerendering) {
    document.addEventListener('prerenderingchange', () => {
      if (typeof window.ethereum !== 'undefined') {
        window.location.reload()
      }
    }, {
      once: true,
    })
  } else if (document.hidden || document.visibilityState === 'hidden') {
    document.addEventListener('visibilitychange', () => {
      if (typeof window.ethereum !== 'undefined') {
        window.location.reload()
      }
    }, {
      once: true,
    })
  }
`

const makeIPFSURL = (url: string) => {
  if (process.env.NEXT_PUBLIC_IPFS) {
    return `.${url}`
  }
  return url
}

export default class MyDocument extends Document {
  static async getInitialProps(ctx: DocumentContext) {
    const sheet = new ServerStyleSheet()
    const originalRenderPage = ctx.renderPage

    try {
      ctx.renderPage = () =>
        originalRenderPage({
          enhanceApp: (App: AppType) => (props: AppPropsType) =>
            sheet.collectStyles(<App {...props} />),
        })

      const initialProps = await Document.getInitialProps(ctx)
      return {
        ...initialProps,
        styles: (
          <>
            {initialProps.styles}
            {sheet.getStyleElement()}
          </>
        ),
      }
    } finally {
      sheet.seal()
    }
  }

  render() {
    return (
      <Html>
        <Head>
          {process.env.NODE_ENV === 'production' && (
            <meta
              httpEquiv="Content-Security-Policy"
              content="worker-src 'self'; script-src 'self' 'sha256-UyYcl+sKCF/ROFZPHBlozJrndwfNiC5KT5ZZfup/pPc=' https://*.googletagmanager.com plausible.io static.cloudflareinsights.com *.ens-app-v3.pages.dev https://app.intercom.io https://widget.intercom.io https://js.intercomcdn.com 'wasm-unsafe-eval';"
            />
          )}
          {/* eslint-disable-next-line react/no-danger */}
          <script dangerouslySetInnerHTML={{ __html: hiddenCheckScript }} />
          {process.env.NEXT_PUBLIC_IPFS && (
            <>
              {/* eslint-disable-next-line react/no-danger */}
              <script dangerouslySetInnerHTML={{ __html: ipfsPathScript }} />
              {/* eslint-disable-next-line @next/next/no-css-tags */}
              <link rel="stylesheet" href="./fonts/fonts.css" />
            </>
          )}
          <link rel="apple-touch-icon" sizes="256x256" href={makeIPFSURL('/icon/AppIcon.png')} />
          <link
            rel="icon"
            type="image/png"
            sizes="32x32"
            href={makeIPFSURL('/favicon-32x32.png')}
          />
          <link
            rel="icon"
            type="image/png"
            sizes="16x16"
            href={makeIPFSURL('/favicon-16x16.png')}
          />
          <link rel="manifest" href={makeIPFSURL('/manifest.webmanifest')} />
          <link rel="manifest" href={makeIPFSURL('/manifest.json')} />
          <link rel="mask-icon" href={makeIPFSURL('/safari-pinned-tab.svg')} color="#5bbad5" />
          <meta name="msapplication-TileColor" content="#da532c" />
          <meta name="theme-color" content="#F7F7F7" />

          <link rel="preconnect" href="https://fonts.googleapis.com" />
          <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
          <link
            href="https://fonts.googleapis.com/css2?family=Noto+Color+Emoji&display=swap"
            rel="stylesheet"
          />

          <script
            defer
            data-domain="app.ens.domains"
            src="https://plausible.io/js/script.outbound-links.js"
          />
        </Head>
        <body>
          <Main />
          <NextScript />
        </body>
      </Html>
    )
  }
}
