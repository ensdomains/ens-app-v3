/* eslint-disable import/newline-after-import */
import { initializeProvider } from '@metamask/inpage-provider'
import { WindowPostMessageStream } from '@metamask/post-message-stream'

;(() => {
  if (!window.ethereum) {
    // && navigator.userAgent.toLowerCase().indexOf('firefox') !== -1) {
    const metamaskStream = new WindowPostMessageStream({
      name: 'metamask-inpage',
      target: 'metamask-contentscript',
    })

    initializeProvider({ connectionStream: metamaskStream as any, shouldShimWeb3: true })
  }
})()
