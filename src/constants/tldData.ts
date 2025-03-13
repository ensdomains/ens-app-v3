/* eslint-disable @typescript-eslint/naming-convention */
import { deploymentAddresses } from './chains'

export const CUSTOMIZED_TLDS = [] as const
export type CustomizedTLD = (typeof CUSTOMIZED_TLDS)[number]

export const DNS_REGISTRAR_ADDRESSES = {
  '1': '0xB32cB5677a7C971689228EC835800432B339bA2B',
  '17000': '0x458d278AEd4cE82BAeC384170f39198b01B8351c',
  '11155111': '0x5a07C75Ae469Bf3ee2657B588e8E6ABAC6741b4f',
  '1337': deploymentAddresses.DNSRegistrar,
} as const
