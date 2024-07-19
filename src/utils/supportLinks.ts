/* eslint-disable @typescript-eslint/naming-convention */

const SUPPORT_LINKS = {
  homoglyphs: 'https://support.ens.domains/en/articles/7901658-homoglyphs',
  namesAndSubnames: 'https://support.ens.domains/en/articles/7902188-managing-a-name#h_d83b3ffcb0',
  managersAndOwners: 'https://support.ens.domains/en/articles/7902188-managing-a-name#h_3cf7f2fbdf',
  resolver: 'https://support.ens.domains/en/articles/7902188-managing-a-name#h_1ef2545a3f',
  fuses: 'https://support.ens.domains/en/articles/7902567-fuses',
  primaryName: 'https://support.ens.domains/en/articles/7902188-managing-a-name#h_b2baf0c02b',
  nameWrapper: 'https://support.ens.domains/en/articles/7902188-managing-a-name#h_cae4f1dea6',
  dnsNames: 'https://support.ens.domains/en/collections/4027734-dns-names',
  gaslessDnssec:
    'https://support.ens.domains/en/articles/8834820-offchain-gasless-dnssec-names-in-ens#h_b92a64180f',
  'offchain-not-in-names':
    'https://support.ens.domains/en/articles/9375254-why-is-my-ens-name-not-in-my-names',
  owner: undefined,
  'owner-emancipated': undefined,
  'parent-owner': undefined,
  'dns-owner': undefined,
  manager: undefined,
  'profile-editor': undefined,
  'subname-manager': undefined,
  'eth-record': undefined,
  'grace-period': undefined,
  'contract-address': undefined,
  sendingNames: undefined,
}

type SupportTopic = keyof typeof SUPPORT_LINKS

export const getSupportLink = <T extends SupportTopic>(topic: T): (typeof SUPPORT_LINKS)[T] =>
  SUPPORT_LINKS[topic]
