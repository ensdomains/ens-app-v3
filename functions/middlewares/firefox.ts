import { ScriptWriter } from '../modifier/ScriptWriter'

export const firefoxMiddleware: PagesFunction = async ({ request, next }) => {
  const userAgent = request.headers.get('user-agent')?.toLowerCase()

  if (userAgent) {
    if (
      userAgent.indexOf('gecko/20100101') !== -1 &&
      // firefox
      userAgent.indexOf('firefox/') !== -1
    ) {
      return new HTMLRewriter()
        .on('head', new ScriptWriter('/_next/static/chunks/initialise-metamask.js'))
        .transform(await next())
    }
    if (
      userAgent.indexOf('webview metamaskmobile') !== -1 &&
      userAgent.indexOf('applewebkit') !== -1
    ) {
      return new HTMLRewriter()
        .on('head', new ScriptWriter('/_next/static/chunks/initialise-metamask-ios.js'))
        .transform(await next())
    }
  }

  return next()
}
