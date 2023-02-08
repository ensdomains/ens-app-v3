// src/utils/hexEncodedName.ts
import packet from "dns-packet";
var hexEncodeName = (name) => `0x${packet.name.encode(name).toString("hex")}`;
var hexDecodeName = (hex) => packet.name.decode(Buffer.from(hex.slice(2), "hex")).toString();
export {
  hexDecodeName,
  hexEncodeName
};
