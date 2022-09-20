// src/functions/renewName.ts
async function renewName_default({ contracts }, name, {
  duration,
  value
}) {
  const labels = name.split(".");
  if (labels.length !== 2 || labels[1] !== "eth")
    throw new Error("Currently only .eth TLD renewals are supported");
  const controller = await contracts.getEthRegistrarController();
  return controller.populateTransaction.renew(labels[0], duration, { value });
}
export {
  renewName_default as default
};
