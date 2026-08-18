/* eslint-disable @typescript-eslint/naming-convention */

const SUPPORT_LINKS = {
  home: 'https://support.ens.domains',
  transactionTroubleshooting:
    'https://support.ens.domains/en/articles/13449264-fix-eth-registration-errors',
  homoglyphs:
    'https://support.ens.domains/en/articles/7901658-what-are-homoglyphs-and-lookalike-ens-names',
  namesAndSubnames: 'https://support.ens.domains/en/articles/8883890-create-delete-ens-subnames',
  managersAndOwners:
    'https://support.ens.domains/en/articles/8825632-edit-the-roles-on-your-ens-name',
  resolver: 'https://support.ens.domains/en/articles/7900622-what-is-the-resolver-on-my-ens-name',
  fuses: 'https://support.ens.domains/en/articles/7902567-fuses',
  primaryName: 'https://support.ens.domains/en/articles/7890756-what-is-a-primary-name',
  nameWrapper: 'https://support.ens.domains/en/articles/7902532-name-wrapper-overview',
  dnsNames:
    'https://support.ens.domains/en/articles/9565578-can-i-use-my-dns-domain-as-an-ens-name',
  gaslessDnssec: 'https://support.ens.domains/en/articles/8834820-gasless-dns-import#h_b92a64180f',
  'offchain-not-in-names':
    'https://support.ens.domains/en/articles/8874842-find-your-names-on-the-my-names-page',
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
