const cfg = require('@hexonet/semantic-release-github-npm-config')
cfg.plugins.unshift(['@semantic-release/exec', {
  prepareCmd: 'npm run bundle && npm run minify'
}])
cfg.plugins = cfg.plugins.map((plugin) => {
  if (plugin[0] === '@semantic-release/git') {
    plugin[1].assets.push('uts46bundle.js', 'uts46bundle.min.js')
  }
  return plugin
})
module.exports = cfg
