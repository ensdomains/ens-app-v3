import { getAddress } from 'viem';
import { truncateFormat } from '../../utils/format.js';
import { decodeFuses } from '../../utils/fuses.js';
import { decryptName } from '../../utils/labels.js';
export const getChecksumAddressOrNull = (address) => (address ? getAddress(address) : null);
export const makeNameObject = (domain) => {
    const decrypted = domain.name ? decryptName(domain.name) : null;
    const createdAt = parseInt(domain.createdAt) * 1000;
    const registrationDate = domain.registration?.registrationDate
        ? parseInt(domain.registration?.registrationDate) * 1000
        : null;
    const fuses = domain.wrappedDomain?.fuses
        ? decodeFuses(parseInt(domain.wrappedDomain.fuses))
        : null;
    const expiryDateRef = domain.registration?.expiryDate ||
        (fuses?.parent.PARENT_CANNOT_CONTROL && domain.wrappedDomain?.expiryDate);
    const expiryDate = expiryDateRef ? parseInt(expiryDateRef) * 1000 : null;
    return {
        id: domain.id,
        name: decrypted,
        truncatedName: decrypted ? truncateFormat(decrypted) : null,
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
            ? decodeFuses(parseInt(domain.wrappedDomain.fuses))
            : null,
        owner: getAddress(domain.owner.id),
        registrant: getChecksumAddressOrNull(domain.registrant?.id),
        wrappedOwner: getChecksumAddressOrNull(domain.wrappedOwner?.id),
        resolvedAddress: getChecksumAddressOrNull(domain.resolvedAddress?.id),
    };
};
//# sourceMappingURL=utils.js.map