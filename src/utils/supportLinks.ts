/* eslint-disable @typescript-eslint/naming-convention */

const SUPPORT_LINKS = {
  homoglyphs: 'https://support.ens.domains/en/articles/7901658-homoglyphs',
  namesAndSubnames: 'https://support.ens.domains/en/articles/7902188-managing-a-name#h_d83b3ffcb0',
  managersAndOwners: 'https://support.ens.domains/en/articles/7902188-managing-a-name#h_3cf7f2fbdf',
  resolver: 'https://support.ens.domains/en/articles/7902188-managing-a-name#h_1ef2545a3f',
  fuses: 'https://support.ens.domains/en/articles/7902567-fuses',
  primaryName: 'https://support.ens.domains/en/articles/7902188-managing-a-name#h_b2baf0c02b',
  nameWrapper: 'https://support.ens.domains/en/articles/7902188-managing-a-name#h_cae4f1dea6',
  owner: 'https://support.ens.domains',
  manager: 'https://support.ens.domains',
  'parent-owner': 'https://support.ens.domains',
  'dns-owner': 'https://support.ens.domains',
  'eth-record': 'https://support.ens.domains',
}

type SupportTopic = keyof typeof SUPPORT_LINKS

export const getSupportLink = (topic: SupportTopic) => SUPPORT_LINKS[topic]
