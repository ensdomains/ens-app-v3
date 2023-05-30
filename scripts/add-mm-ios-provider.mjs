import fs from 'fs'

const metamaskMobileProvider = fs.readFileSync(
  './node_modules/@metamask/mobile-provider/dist/index.js',
  'utf8',
)

const transformed = metamaskMobileProvider.match(/'!function\(e\).*'/g)

if (!transformed[0]) throw new Error('Could not find the metamask mobile provider script.')

let unescaped = ''

eval(`unescaped = ${transformed[0]}`)

unescaped +=
  '!async function(){await async function(){["interactive","complete"].includes(document.readyState)||await new Promise((e=>window.addEventListener("DOMContentLoaded",e,{once:!0})))}(),window._metamaskSetupProvider()}();'

fs.writeFileSync('./out/_next/static/chunks/initialise-metamask-ios.js', unescaped)
