export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url)

  const paths = url.pathname.split('/')

  let rewrite = false
  if (paths[1] === 'my' && paths[2] === 'profile') {
    console.log('HERE')

    url.pathname = '/my/settings'
    rewrite = true
  } else if (paths[0] === 'names' && !!paths[1]) {
    url.pathname = '/names'
    url.searchParams.set('address', paths[1])
    rewrite = true
  }

  if (rewrite) {
    console.log('>>>>>', url.toString())

    const rewriteRequest = new Request(url.toString(), request)
    const response = await fetch(rewriteRequest)
    return response
  }

  return next()
}
