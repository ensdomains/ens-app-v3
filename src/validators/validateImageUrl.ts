const ACCEPTED_IMAGE_LOAD_PROTOCOLS = ['https:', 'http:', 'data:']

/**
 * Asynchronously checks whether a URL actually resolves to a loadable image.
 *
 * This complements the synchronous `validateImageUri` (valid URL, allowed
 * protocol, no raw IP) by verifying that the URL really returns an image, so we
 * reject links like `https://www.instagram.com/` that pass format validation but
 * are not images.
 *
 * It uses an in-browser image load (`new Image()`) rather than a HEAD /
 * content-type `fetch`: image loading is not subject to CORS the way `fetch` is,
 * so a content-type fetch would falsely reject valid images served by hosts that
 * do not send permissive CORS headers.
 *
 * `ipfs:` and `eip155:` URLs are out of scope — their resolution is handled by
 * the existing avatar pipeline (`useEnsAvatar`) — so they resolve `true` here and
 * are not blocked.
 *
 * @param url - the URL to check (should already have passed `validateImageUri`)
 * @param timeoutMs - how long to wait for the image to load before giving up
 * @returns a promise resolving to `true` if the URL loads as an image, else `false`
 */
export const imageUrlReturnsImage = (url: string, timeoutMs = 10000): Promise<boolean> => {
  let protocol: string
  try {
    protocol = new URL(url).protocol
  } catch {
    return Promise.resolve(false)
  }

  // Defer ipfs/eip155 resolution to the avatar pipeline — not checked here.
  if (protocol === 'ipfs:' || protocol === 'eip155:') return Promise.resolve(true)

  // Only http(s) and data URLs can be verified via an in-browser image load.
  if (!ACCEPTED_IMAGE_LOAD_PROTOCOLS.includes(protocol)) return Promise.resolve(false)

  return new Promise<boolean>((resolve) => {
    const img = new Image()

    const timer = setTimeout(() => {
      img.onload = null
      img.onerror = null
      resolve(false)
    }, timeoutMs)

    img.onload = () => {
      clearTimeout(timer)
      resolve(true)
    }
    img.onerror = () => {
      clearTimeout(timer)
      resolve(false)
    }

    img.src = url
  })
}
