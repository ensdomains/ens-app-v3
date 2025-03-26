"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const dns_js_1 = require("../../errors/dns.js");
const general_js_1 = require("../../errors/general.js");
const getDnsTxtRecords_js_1 = require("../../utils/dns/getDnsTxtRecords.js");
const misc_js_1 = require("../../utils/dns/misc.js");
const getNameType_js_1 = require("../../utils/getNameType.js");
const getDnsOwner = async ({ name, endpoint, strict, }) => {
    const nameType = (0, getNameType_js_1.getNameType)(name);
    if (nameType !== 'other-2ld')
        throw new general_js_1.UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: ['other-2ld'],
        });
    try {
        const response = await (0, getDnsTxtRecords_js_1.getDnsTxtRecords)({ name: `_ens.${name}`, endpoint });
        if (response.Status !== misc_js_1.DnsResponseStatus.NOERROR)
            throw new dns_js_1.DnsResponseStatusError({
                responseStatus: misc_js_1.DnsResponseStatus[response.Status],
            });
        const addressRecord = response.Answer?.find((record) => record.type === misc_js_1.DnsRecordType.TXT);
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
    }
    catch (error) {
        if (!strict)
            return null;
        throw error;
    }
};
exports.default = getDnsOwner;
//# sourceMappingURL=getDnsOwner.js.map