// @ts-nocheck
/* eslint-disable */
import { existsSync, readFileSync, writeFileSync } from 'fs'
import { resolve } from 'path'

import { optimize } from 'svgo'

import coinList from '../src/constants/coinList'

const iconFolderPath = resolve(process.argv[2])
const destinationFolderPath = resolve(__dirname, '../src/assets/address')
const supportedAddessesFile = resolve(__dirname, '../src/constants/coinsWithIcons.json')
const unsupportedAddessesFile = resolve(__dirname, '../src/constants/coinsWithoutIcons.json')

;(async () => {
  if (!existsSync(iconFolderPath)) throw new Error('Icon folder path does not exist')

  let dynamicAddressIcons =
    "import dynamic from 'next/dynamic'\n\nexport type DynamicAddressIcon = keyof typeof dynamicAddressIcons\n\nexport const dynamicAddressIcons = {"
  const coinsWithIcons = []
  const coinsWithoutIcons = []

  for (const _coin of coinList) {
    const coin = _coin.toLowerCase()
    const iconPath = resolve(iconFolderPath, `${coin}.svg`)

    // Skip if icon does not exist
    if (!existsSync(iconPath)) {
      coinsWithoutIcons.push(coin)
      // eslint-disable-next-line no-continue
      continue
    }

    coinsWithIcons.push(coin)

    const svgStr = readFileSync(iconPath, 'utf8')
    const optimizedSvg = await optimize(svgStr, {
      multipass: true,
    })

    if (!optimizedSvg.data) throw new Error('Optimized SVG data is empty')
    const coinFileName = `${coin.charAt(0).toUpperCase()}${coin.slice(1)}Icon.svg`
    const destinationPath = resolve(destinationFolderPath, coinFileName)
    writeFileSync(destinationPath, optimizedSvg.data)

    dynamicAddressIcons += `\n\t${coin}: dynamic(() => import('./${coinFileName}')),`
  }

  dynamicAddressIcons += '\n}'

  writeFileSync(
    resolve(__dirname, '../src/assets/address/dynamicAddressIcons.ts'),
    dynamicAddressIcons,
  )

  const presortedCoins = ['eth', 'btc', 'bnb', 'xrp', 'matic', 'doge', 'ltc', 'dot', 'sol']
  const isNotPresortedCoin = (coin: string) => !presortedCoins.includes(coin)
  const sortedSupportedAddress = [
    ...presortedCoins,
    ...coinsWithIcons.filter(isNotPresortedCoin).sort(),
  ]

  const sortedUnSupportedAddress = coinsWithoutIcons.sort()

  const allAddress = [...sortedSupportedAddress, ...sortedUnSupportedAddress]
  const isUnique = allAddress.every(
    (coin, index, arr) => arr.filter((c) => c === coin).length === 1,
  )

  if (!isUnique) throw new Error('Duplicate coin found')

  writeFileSync(supportedAddessesFile, JSON.stringify(sortedSupportedAddress))
  writeFileSync(unsupportedAddessesFile, JSON.stringify(sortedUnSupportedAddress))
})()
