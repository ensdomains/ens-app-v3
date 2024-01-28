import { getAddress } from 'viem';
import { DnsDnssecVerificationFailedError, DnsInvalidAddressChecksumError, DnsInvalidTxtRecordError, DnsNoTxtRecordError, DnsResponseStatusError, } from '../../errors/dns.js';
import { UnsupportedNameTypeError } from '../../errors/general.js';
import { getNameType } from '../../utils/getNameType.js';
var DnsResponseStatus;
(function (DnsResponseStatus) {
    DnsResponseStatus[DnsResponseStatus["NOERROR"] = 0] = "NOERROR";
    DnsResponseStatus[DnsResponseStatus["FORMERR"] = 1] = "FORMERR";
    DnsResponseStatus[DnsResponseStatus["SERVFAIL"] = 2] = "SERVFAIL";
    DnsResponseStatus[DnsResponseStatus["NXDOMAIN"] = 3] = "NXDOMAIN";
    DnsResponseStatus[DnsResponseStatus["NOTIMP"] = 4] = "NOTIMP";
    DnsResponseStatus[DnsResponseStatus["REFUSED"] = 5] = "REFUSED";
    DnsResponseStatus[DnsResponseStatus["YXDOMAIN"] = 6] = "YXDOMAIN";
    DnsResponseStatus[DnsResponseStatus["YXRRSET"] = 7] = "YXRRSET";
    DnsResponseStatus[DnsResponseStatus["NXRRSET"] = 8] = "NXRRSET";
    DnsResponseStatus[DnsResponseStatus["NOTAUTH"] = 9] = "NOTAUTH";
    DnsResponseStatus[DnsResponseStatus["NOTZONE"] = 10] = "NOTZONE";
    DnsResponseStatus[DnsResponseStatus["DSOTYPENI"] = 11] = "DSOTYPENI";
    DnsResponseStatus[DnsResponseStatus["BADVERS"] = 16] = "BADVERS";
    DnsResponseStatus[DnsResponseStatus["BADSIG"] = 16] = "BADSIG";
    DnsResponseStatus[DnsResponseStatus["BADKEY"] = 17] = "BADKEY";
    DnsResponseStatus[DnsResponseStatus["BADTIME"] = 18] = "BADTIME";
    DnsResponseStatus[DnsResponseStatus["BADMODE"] = 19] = "BADMODE";
    DnsResponseStatus[DnsResponseStatus["BADNAME"] = 20] = "BADNAME";
    DnsResponseStatus[DnsResponseStatus["BADALG"] = 21] = "BADALG";
    DnsResponseStatus[DnsResponseStatus["BADTRUNC"] = 22] = "BADTRUNC";
    DnsResponseStatus[DnsResponseStatus["BADCOOKIE"] = 23] = "BADCOOKIE";
})(DnsResponseStatus || (DnsResponseStatus = {}));
var DnsRecordType;
(function (DnsRecordType) {
    DnsRecordType[DnsRecordType["TXT"] = 16] = "TXT";
    DnsRecordType[DnsRecordType["DS"] = 43] = "DS";
    DnsRecordType[DnsRecordType["RRSIG"] = 46] = "RRSIG";
    DnsRecordType[DnsRecordType["DNSKEY"] = 48] = "DNSKEY";
})(DnsRecordType || (DnsRecordType = {}));
/**
 * Gets the DNS owner of a name, via DNS record lookup
 * @param parameters - {@link GetDnsOwnerParameters}
 * @returns Address of DNS owner. {@link GetDnsOwnerReturnType}
 *
 * @example
 * import { getDnsOwner } from '@ensdomains/ensjs/dns'
 *
 * const owner = await getDnsOwner({ name: 'ens.domains' })
 * // '0xb8c2C29ee19D8307cb7255e1Cd9CbDE883A267d5'
 */
const getDnsOwner = async ({ name, endpoint = 'https://cloudflare-dns.com/dns-query', }) => {
    const nameType = getNameType(name);
    if (nameType !== 'other-2ld')
        throw new UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: ['other-2ld'],
        });
    const response = await fetch(`${endpoint}?name=_ens.${name}.&type=TXT`, {
        method: 'GET',
        headers: {
            accept: 'application/dns-json',
        },
    }).then((res) => res.json());
    if (response.Status !== DnsResponseStatus.NOERROR)
        throw new DnsResponseStatusError({
            responseStatus: DnsResponseStatus[response.Status],
        });
    const addressRecord = response.Answer?.find((record) => record.type === DnsRecordType.TXT);
    const unwrappedAddressRecord = addressRecord?.data?.replace(/^"(.*)"$/g, '$1');
    if (response.AD === false)
        throw new DnsDnssecVerificationFailedError({
            record: unwrappedAddressRecord,
        });
    if (!addressRecord?.data)
        throw new DnsNoTxtRecordError();
    if (!unwrappedAddressRecord.match(/^a=0x[a-fA-F0-9]{40}$/g))
        throw new DnsInvalidTxtRecordError({ record: unwrappedAddressRecord });
    const address = unwrappedAddressRecord.slice(2);
    const checksumAddress = getAddress(address);
    if (address !== checksumAddress)
        throw new DnsInvalidAddressChecksumError({ address });
    return checksumAddress;
};
export default getDnsOwner;
//# sourceMappingURL=getDnsOwner.js.map