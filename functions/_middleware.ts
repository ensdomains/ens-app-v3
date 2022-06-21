export const onRequest: PagesFunction = async ({ request, next }) => {
  const url = new URL(request.url)

  const paths = url.pathname.split('/')

  let rewrite = false
  if (paths[1] === 'my' && paths[2] === 'profile') {
    url.pathname = '/profile'
    url.searchParams.set('name', 'connected')
    rewrite = true
  } else if (paths[1] === 'names' && !!paths[2]) {
    url.pathname = '/my/names'
    url.searchParams.set('address', paths[2])
    rewrite = true
  } else if (paths[1] === 'profile' && !!paths[2] && paths[3] === 'details') {
    url.pathname = '/profile/details'
    url.searchParams.set('name', paths[2])
    rewrite = true
  } else if (paths[1] === 'profile' && !!paths[2]) {
    url.pathname = '/profile'
    url.searchParams.set('name', paths[2])
    rewrite = true
  }

  if (rewrite) {
    const rewriteRequest = new Request(url.toString(), request)
    const response = await fetch(rewriteRequest)
    return response
  }

  return next()
}
