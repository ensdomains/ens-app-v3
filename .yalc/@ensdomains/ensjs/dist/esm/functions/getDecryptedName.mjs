// src/functions/getDecryptedName.ts
import { hexStripZeros } from "@ethersproject/bytes";
import { hexDecodeName } from "../utils/hexEncodedName.mjs";
import {
  checkIsDecrypted,
  decodeLabelhash,
  getEncryptedLabelAmount,
  isEncodedLabelhash
} from "../utils/labels.mjs";
import { namehash } from "../utils/normalise.mjs";
var raw = async ({ contracts }, name, allowIncomplete) => {
  const nameWrapper = await contracts?.getNameWrapper();
  return {
    to: nameWrapper.address,
    data: nameWrapper.interface.encodeFunctionData("names", [namehash(name)])
  };
};
var generateNameQuery = (labels) => {
  let query = "";
  for (let i = 0; i < labels.length; i += 1) {
    const label = labels[i];
    if (isEncodedLabelhash(label)) {
      query += `
        label${i}: domains(where: { labelhash: "${decodeLabelhash(
        label
      ).toLowerCase()}", labelName_not: null }) {
          labelName
        }
      `;
    }
  }
  return query;
};
var decode = async ({ contracts, gqlInstance }, data, name, allowIncomplete = false) => {
  if (data !== null) {
    const nameWrapper = await contracts?.getNameWrapper();
    try {
      const result = nameWrapper.interface.decodeFunctionResult("names", data);
      if (hexStripZeros(result["0"]) !== "0x") {
        const decoded = hexDecodeName(result["0"]);
        if (decoded && decoded !== ".")
          return decoded;
      }
    } catch (e) {
      console.error("Error decoding name: ", e);
      return;
    }
  }
  if (checkIsDecrypted(name))
    return name;
  const labels = name.split(".");
  const decryptedNameQuery = gqlInstance.gql`
        query decodedName($id: String!) {
          namehashLookup: domains(where: { id: $id }) {
            name
          }
          ${generateNameQuery(labels)}
        }
      `;
  const decryptedNameResult = await gqlInstance.client.request(
    decryptedNameQuery,
    {
      id: namehash(name)
    }
  );
  if (!decryptedNameResult)
    return;
  const namehashLookupResult = decryptedNameResult?.namehashLookup[0]?.name;
  let bestResult = namehashLookupResult;
  if (namehashLookupResult && checkIsDecrypted(namehashLookupResult)) {
    return namehashLookupResult;
  }
  const { namehashLookup: _, ...labelNames } = decryptedNameResult;
  if (Object.keys(labelNames).length !== 0) {
    for (const [key, value] of Object.entries(
      labelNames
    )) {
      if (value.length && value[0].labelName) {
        labels[parseInt(key.replace("label", ""))] = value[0].labelName;
      }
    }
    const labelLookupResult = labels.join(".");
    if (!namehashLookupResult || getEncryptedLabelAmount(namehashLookupResult) > getEncryptedLabelAmount(labelLookupResult))
      bestResult = labelLookupResult;
  }
  if (!bestResult || !allowIncomplete && !checkIsDecrypted(bestResult))
    return;
  return bestResult;
};
var getDecryptedName_default = {
  raw,
  decode
};
export {
  getDecryptedName_default as default
};
