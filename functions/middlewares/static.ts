export const staticMiddleware: PagesFunction = async ({ request, next, env }) => {
  const url = new URL(request.url)
  const paths = url.pathname.split('/')

  if (paths[paths.length - 1].match(/^.*\.(png|xml|ico|json|webmanifest|txt|svg|map|js)$/i)) {
    return env.ASSETS.fetch(request)
  }

  return next()
}
