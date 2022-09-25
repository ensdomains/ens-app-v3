export const DNS_OVER_HTTP_ENDPOINT = 'https://1.1.1.1/dns-query'

export const isDnsSecEnabled = async (name: string = '') => {
  const response = await fetch(
    `${DNS_OVER_HTTP_ENDPOINT}?${new URLSearchParams({
      name,
      do: 'true',
    })}`,
    {
      headers: {
        accept: 'application/dns-json',
      },
    },
  )
  const result = await response.json()
  return result.AD
}

export const isSubdomainSet = async (name: string = '') => {
  const response = await fetch(
    `${DNS_OVER_HTTP_ENDPOINT}?${new URLSearchParams({
      name: `_ens.${name}`,
      do: 'true',
    })}`,
    {
      headers: {
        accept: 'application/dns-json',
      },
    },
  )
  const result = await response.json()
  return result.AD
}

export const getDnsOwner = (dnsQueryResult) =>
  dnsQueryResult.answer.records[0].data.toString().split('=')[1]
