"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.makeNameObject = exports.getChecksumAddressOrNull = void 0;
const viem_1 = require("viem");
const format_js_1 = require("../../utils/format.js");
const fuses_js_1 = require("../../utils/fuses.js");
const labels_js_1 = require("../../utils/labels.js");
const getChecksumAddressOrNull = (address) => (address ? (0, viem_1.getAddress)(address) : null);
exports.getChecksumAddressOrNull = getChecksumAddressOrNull;
const makeNameObject = (domain) => {
    const decrypted = domain.name ? (0, labels_js_1.decryptName)(domain.name) : null;
    const createdAt = parseInt(domain.createdAt) * 1000;
    const registrationDate = domain.registration?.registrationDate
        ? parseInt(domain.registration?.registrationDate) * 1000
        : null;
    const fuses = domain.wrappedDomain?.fuses
        ? (0, fuses_js_1.decodeFuses)(parseInt(domain.wrappedDomain.fuses))
        : null;
    const expiryDateRef = domain.registration?.expiryDate ||
        (fuses?.parent.PARENT_CANNOT_CONTROL && domain.wrappedDomain?.expiryDate);
    const expiryDate = expiryDateRef ? parseInt(expiryDateRef) * 1000 : null;
    return {
        id: domain.id,
        name: decrypted,
        truncatedName: decrypted ? (0, format_js_1.truncateFormat)(decrypted) : null,
        labelName: domain.labelName,
        labelhash: domain.labelhash,
        isMigrated: domain.isMigrated,
        parentName: domain.parent?.name ?? null,
        createdAt: {
            date: new Date(createdAt),
            value: createdAt,
        },
        registrationDate: registrationDate
            ? {
                date: new Date(registrationDate),
                value: registrationDate,
            }
            : null,
        expiryDate: expiryDate
            ? {
                date: new Date(expiryDate),
                value: expiryDate,
            }
            : null,
        fuses: domain.wrappedDomain?.fuses
            ? (0, fuses_js_1.decodeFuses)(parseInt(domain.wrappedDomain.fuses))
            : null,
        owner: (0, viem_1.getAddress)(domain.owner.id),
        registrant: (0, exports.getChecksumAddressOrNull)(domain.registrant?.id),
        wrappedOwner: (0, exports.getChecksumAddressOrNull)(domain.wrappedOwner?.id),
        resolvedAddress: (0, exports.getChecksumAddressOrNull)(domain.resolvedAddress?.id),
    };
};
exports.makeNameObject = makeNameObject;
//# sourceMappingURL=utils.js.map