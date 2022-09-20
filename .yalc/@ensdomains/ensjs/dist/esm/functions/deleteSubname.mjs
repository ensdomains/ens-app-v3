// src/functions/deleteSubname.ts
async function deleteSubname_default({ transferSubname, signer }, name, {
  contract
}) {
  return transferSubname.populateTransaction(name, {
    contract,
    owner: "0x0000000000000000000000000000000000000000",
    signer
  });
}
export {
  deleteSubname_default as default
};
