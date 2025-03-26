"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bytesToPacket = exports.packetToBytes = void 0;
const viem_1 = require("viem");
const labels_js_1 = require("./labels.js");
function packetToBytes(packet) {
    const value = packet.replace(/^\.|\.$/gm, '');
    if (value.length === 0)
        return new Uint8Array(1);
    const bytes = new Uint8Array((0, viem_1.stringToBytes)(value).byteLength + 2);
    let offset = 0;
    const list = value.split('.');
    for (let i = 0; i < list.length; i += 1) {
        let encoded = (0, viem_1.stringToBytes)(list[i]);
        if (encoded.byteLength > 255)
            encoded = (0, viem_1.stringToBytes)((0, labels_js_1.encodeLabelhash)((0, viem_1.labelhash)(list[i])));
        bytes[offset] = encoded.length;
        bytes.set(encoded, offset + 1);
        offset += encoded.length + 1;
    }
    if (bytes.byteLength !== offset + 1)
        return bytes.slice(0, offset + 1);
    return bytes;
}
exports.packetToBytes = packetToBytes;
function bytesToPacket(bytes) {
    let offset = 0;
    let result = '';
    while (offset < bytes.length) {
        const len = bytes[offset];
        if (len === 0) {
            offset += 1;
            break;
        }
        result += `${(0, viem_1.bytesToString)(bytes.subarray(offset + 1, offset + len + 1))}.`;
        offset += len + 1;
    }
    return result.replace(/\.$/, '');
}
exports.bytesToPacket = bytesToPacket;
//# sourceMappingURL=hexEncodedName.js.map