// src/utils/hexEncodedName.ts
import packet from "dns-packet";
var hexEncodeName = (name) => `0x${packet.name.encode(name).toString("hex")}`;
export {
  hexEncodeName
};
