/* eslint-disable react/no-danger */
import { AppPropsType, AppType } from 'next/dist/shared/lib/utils'
import Document, { DocumentContext, Head, Html, Main, NextScript } from 'next/document'
import { ServerStyleSheet, StyleSheetManager } from 'styled-components'

import { cspWithoutFrameAncestors } from '@app/utils/createCsp'

const ipfsPathScript = `
  (function () {
    const { pathname } = window.location
    const ipfsMatch = /.*\\/Qm\\w{44}\\//.exec(pathname)
    const base = document.createElement('base')

    base.href = ipfsMatch ? ipfsMatch[0] : '/'
    document.head.append(base)
  })();
`

// sha256-UyYcl+sKCF/ROFZPHBlozJrndwfNiC5KT5ZZfup/pPc=
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

// sha256-84jekTLuMPFFzbBxEFpoUhJbu81z5uBinvhIKKkAPxg=
const themeSwitcherScript = `
  (function () {
    function setTheme(newTheme) {
        document.documentElement.setAttribute('data-theme', newTheme);
        window.__theme = newTheme;
        window.__onThemeChange(newTheme);
    }
    window.__onThemeChange = function () {};
    window.__setPreferredTheme = function (newTheme) {
        setTheme(newTheme);
        try {
            localStorage.setItem("theme", JSON.stringify(window.__theme));
        } catch (err) {}
    };

    const darkQuery = window.matchMedia("(prefers-color-scheme: dark)");
    darkQuery.addListener(function (event) {
        window.__setPreferredTheme(event.matches ? "dark" : "light");
    });

    let preferredTheme;
    try {
        preferredTheme = JSON.parse(localStorage.getItem("theme"));
    } catch (err) {}
    
    setTheme(preferredTheme || (darkQuery.matches ? "dark" : "light"));
  })();
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
          enhanceApp: (App: AppType) => (props: AppPropsType) => (
            <StyleSheetManager sheet={sheet.instance} disableVendorPrefixes>
              <App {...props} />
            </StyleSheetManager>
          ),
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
      <Html data-theme="light">
        <Head>
          {process.env.NODE_ENV === 'production' && (
            <meta httpEquiv="Content-Security-Policy" content={cspWithoutFrameAncestors} />
          )}
          <script dangerouslySetInnerHTML={{ __html: hiddenCheckScript }} />
          <script
            dangerouslySetInnerHTML={{
              __html: themeSwitcherScript,
            }}
          />
          {process.env.NEXT_PUBLIC_IPFS && (
            <>
              {/* eslint-disable-next-line react/no-danger */}
              <script dangerouslySetInnerHTML={{ __html: ipfsPathScript }} />
              {/* eslint-disable-next-line @next/next/no-css-tags */}
              <link rel="stylesheet" href="./fonts/fonts.css" />
            </>
          )}

          <link rel="manifest" href={makeIPFSURL('/manifest.webmanifest')} />
          <link rel="manifest" href={makeIPFSURL('/manifest.json')} />

          <link
            rel="apple-touch-icon"
            sizes="180x180"
            href={makeIPFSURL('/apple-touch-icon.png')}
          />
          <link rel="icon" href={makeIPFSURL('/favicon.svg')} />
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
