export enum DnsResponseStatus {
  NOERROR = 0,
  FORMERR = 1,
  SERVFAIL = 2,
  NXDOMAIN = 3,
  NOTIMP = 4,
  REFUSED = 5,
  YXDOMAIN = 6,
  YXRRSET = 7,
  NXRRSET = 8,
  NOTAUTH = 9,
  NOTZONE = 10,
  DSOTYPENI = 11,
  BADVERS = 16, // also 16 = BADSIG but not important
  BADKEY = 17,
  BADTIME = 18,
  BADMODE = 19,
  BADNAME = 20,
  BADALG = 21,
  BADTRUNC = 22,
  BADCOOKIE = 23,
}

export enum DnsRecordType {
  TXT = 16,
  DS = 43,
  RRSIG = 46,
  DNSKEY = 48,
}

export type DnsQuestionItem = {
  name: string
  type: DnsRecordType
}

export type DnsResponseItem = DnsQuestionItem & {
  TTL: number
  data: string
}

export type DnsResponse = {
  Status: DnsResponseStatus
  TC: boolean
  RD: boolean
  RA: boolean
  AD: boolean
  CD: boolean
  Question: DnsQuestionItem[]
  Answer?: DnsResponseItem[]
  Authority?: DnsResponseItem[]
  Additional?: DnsResponseItem[]
  Comment?: string
}
