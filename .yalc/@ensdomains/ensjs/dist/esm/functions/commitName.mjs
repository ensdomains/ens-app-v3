// src/functions/commitName.ts
import { makeCommitment } from "../utils/registerHelpers.mjs";
import { wrappedLabelLengthCheck } from "../utils/wrapper.mjs";
async function commitName_default({ contracts }, name, { resolverAddress, ...params }) {
  const labels = name.split(".");
  if (labels.length !== 2 || labels[1] !== "eth")
    throw new Error("Currently only .eth TLD registrations are supported");
  wrappedLabelLengthCheck(labels[0]);
  const controller = await contracts.getEthRegistrarController();
  const resolver = await contracts.getPublicResolver(
    void 0,
    resolverAddress
  );
  const { secret, commitment } = makeCommitment({
    name,
    resolver,
    ...params
  });
  return {
    ...await controller.populateTransaction.commit(commitment),
    customData: {
      secret,
      commitment
    }
  };
}
export {
  commitName_default as default
};
