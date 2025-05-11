import { CUSTOMIZED_TLDS } from '@app/constants/tldData'

export const useCustomizedTLD = (name = '') => {
  const labels = name?.split('.') || []
  const tld = labels[labels.length - 1]
  return tld ? CUSTOMIZED_TLDS.includes(tld as (typeof CUSTOMIZED_TLDS)[number]) : false
}
