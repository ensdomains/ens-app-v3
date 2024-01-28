"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const dns_js_1 = require("../../errors/dns.js");
const general_js_1 = require("../../errors/general.js");
const getNameType_js_1 = require("../../utils/getNameType.js");
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
const getDnsOwner = async ({ name, endpoint = 'https://cloudflare-dns.com/dns-query', }) => {
    const nameType = (0, getNameType_js_1.getNameType)(name);
    if (nameType !== 'other-2ld')
        throw new general_js_1.UnsupportedNameTypeError({
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
        throw new dns_js_1.DnsResponseStatusError({
            responseStatus: DnsResponseStatus[response.Status],
        });
    const addressRecord = response.Answer?.find((record) => record.type === DnsRecordType.TXT);
    const unwrappedAddressRecord = addressRecord?.data?.replace(/^"(.*)"$/g, '$1');
    if (response.AD === false)
        throw new dns_js_1.DnsDnssecVerificationFailedError({
            record: unwrappedAddressRecord,
        });
    if (!addressRecord?.data)
        throw new dns_js_1.DnsNoTxtRecordError();
    if (!unwrappedAddressRecord.match(/^a=0x[a-fA-F0-9]{40}$/g))
        throw new dns_js_1.DnsInvalidTxtRecordError({ record: unwrappedAddressRecord });
    const address = unwrappedAddressRecord.slice(2);
    const checksumAddress = (0, viem_1.getAddress)(address);
    if (address !== checksumAddress)
        throw new dns_js_1.DnsInvalidAddressChecksumError({ address });
    return checksumAddress;
};
exports.default = getDnsOwner;
//# sourceMappingURL=getDnsOwner.js.map