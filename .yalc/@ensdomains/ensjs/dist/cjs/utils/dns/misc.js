"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.DnsRecordType = exports.DnsResponseStatus = void 0;
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
    DnsResponseStatus[DnsResponseStatus["BADKEY"] = 17] = "BADKEY";
    DnsResponseStatus[DnsResponseStatus["BADTIME"] = 18] = "BADTIME";
    DnsResponseStatus[DnsResponseStatus["BADMODE"] = 19] = "BADMODE";
    DnsResponseStatus[DnsResponseStatus["BADNAME"] = 20] = "BADNAME";
    DnsResponseStatus[DnsResponseStatus["BADALG"] = 21] = "BADALG";
    DnsResponseStatus[DnsResponseStatus["BADTRUNC"] = 22] = "BADTRUNC";
    DnsResponseStatus[DnsResponseStatus["BADCOOKIE"] = 23] = "BADCOOKIE";
})(DnsResponseStatus || (exports.DnsResponseStatus = DnsResponseStatus = {}));
var DnsRecordType;
(function (DnsRecordType) {
    DnsRecordType[DnsRecordType["TXT"] = 16] = "TXT";
    DnsRecordType[DnsRecordType["DS"] = 43] = "DS";
    DnsRecordType[DnsRecordType["RRSIG"] = 46] = "RRSIG";
    DnsRecordType[DnsRecordType["DNSKEY"] = 48] = "DNSKEY";
})(DnsRecordType || (exports.DnsRecordType = DnsRecordType = {}));
//# sourceMappingURL=misc.js.map