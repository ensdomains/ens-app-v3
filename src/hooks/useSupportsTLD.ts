import { useDnsSecEnabled } from './dns/useDnsSecEnabled'

export const useSupportsTLD = (name = '') => {
  const labels = name?.split('.') || []
  const tld = labels[labels.length - 1]

  const { data: isDnsSecEnabled, ...query } = useDnsSecEnabled({ name: tld })
  return {
    data: tld === 'eth' || tld === '[root]' || (tld !== 'club' && isDnsSecEnabled),
    ...query,
  }
}
