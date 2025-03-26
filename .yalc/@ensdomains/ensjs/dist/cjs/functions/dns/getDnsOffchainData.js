"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const viem_1 = require("viem");
const dns_js_1 = require("../../errors/dns.js");
const general_js_1 = require("../../errors/general.js");
const getDnsTxtRecords_js_1 = require("../../utils/dns/getDnsTxtRecords.js");
const misc_js_1 = require("../../utils/dns/misc.js");
const getNameType_js_1 = require("../../utils/getNameType.js");
const getAddressRecord_js_1 = require("../public/getAddressRecord.js");
const checkValidEnsTxtRecord = async (client, record) => {
    if (record.type !== misc_js_1.DnsRecordType.TXT)
        return null;
    if (!record.data.startsWith('"ENS1 '))
        return null;
    const unwrappedRecordData = record.data.replace(/^"(.*)"$/g, '$1');
    const resolverAndExtraData = unwrappedRecordData.slice(5);
    const splitIndex = resolverAndExtraData.indexOf(' ');
    const resolverNameOrAddress = splitIndex === -1
        ? resolverAndExtraData
        : resolverAndExtraData.slice(0, splitIndex);
    const extraData = splitIndex === -1 ? null : resolverAndExtraData.slice(splitIndex + 1);
    if ((0, viem_1.isAddress)(resolverNameOrAddress))
        return { isValid: true, resolverAddress: resolverNameOrAddress, extraData };
    const resolverAddress = await (0, getAddressRecord_js_1.default)(client, {
        name: resolverNameOrAddress,
        gatewayUrls: [],
    }).catch(() => null);
    if (resolverAddress)
        return {
            isValid: true,
            resolverAddress: resolverAddress.value,
            extraData,
        };
    return { isValid: false, recordData: unwrappedRecordData };
};
const getDnsOffchainData = async (client, { name, endpoint, strict }) => {
    const nameType = (0, getNameType_js_1.getNameType)(name);
    if (nameType !== 'other-2ld' && nameType !== 'other-subname')
        throw new general_js_1.UnsupportedNameTypeError({
            nameType,
            supportedNameTypes: ['other-2ld', 'other-subname'],
        });
    try {
        const response = await (0, getDnsTxtRecords_js_1.getDnsTxtRecords)({ name, endpoint });
        if (response.Status !== misc_js_1.DnsResponseStatus.NOERROR)
            throw new dns_js_1.DnsResponseStatusError({
                responseStatus: misc_js_1.DnsResponseStatus[response.Status],
            });
        if (response.AD === false)
            throw new dns_js_1.DnsDnssecVerificationFailedError({ record: undefined });
        if (!response.Answer?.length)
            throw new dns_js_1.DnsNoTxtRecordError();
        const labels = name.split('.');
        const rrsigRecord = response.Answer.find((record) => {
            if (record.type !== misc_js_1.DnsRecordType.RRSIG)
                return false;
            if (record.name !== name)
                return false;
            if (!record.data.startsWith('TXT'))
                return false;
            const [, , labelCount] = record.data.split(' ');
            return Number(labelCount) === labels.length;
        });
        if (!rrsigRecord)
            throw new dns_js_1.DnsDnssecWildcardExpansionError();
        const ensTxtRecords = await Promise.all(response.Answer.map((record) => checkValidEnsTxtRecord(client, record)));
        const validRecord = ensTxtRecords.find((record) => record?.isValid === true);
        if (validRecord)
            return {
                resolverAddress: validRecord.resolverAddress,
                extraData: validRecord.extraData,
            };
        const invalidRecord = ensTxtRecords.find((record) => record?.isValid === false);
        if (invalidRecord)
            throw new dns_js_1.DnsInvalidTxtRecordError({ record: invalidRecord.recordData });
        throw new dns_js_1.DnsNoTxtRecordError();
    }
    catch (error) {
        if (!strict)
            return null;
        throw error;
    }
};
exports.default = getDnsOffchainData;
//# sourceMappingURL=getDnsOffchainData.js.map