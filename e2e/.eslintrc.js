const { findPnpApi } = require('module')
const pnp = findPnpApi('./')
const synpressPath = pnp.resolveToUnqualified('@synthetixio/synpress', './')

module.exports = {
  extends: `${synpressPath}/.eslintrc.js`,
}
