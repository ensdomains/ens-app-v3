import { DNSProver } from '@ensdomains/dnsprovejs'

export const DNS_OVER_HTTP_ENDPOINT = 'https://1.1.1.1/dns-query'

interface DNSRecord {
  name: string
  type: number
  TTL: number
  data: string
}

interface DNSQuestion {
  name: string
  type: number
}

interface DohResponse {
  AD: boolean
  Answer: DNSRecord[]
  CD: false
  Question: DNSQuestion[]
  RA: boolean
  RD: boolean
  Status: number
  TC: boolean
}

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
  const result: DohResponse = await response.json()
  return result?.AD
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
  const result: DohResponse = await response.json()
  return result?.AD
}

export const getDnsOwner = (dnsQueryResult: Awaited<ReturnType<DNSProver['queryWithProof']>>) =>
  dnsQueryResult.answer.records[0].data.toString().split('=')[1]
