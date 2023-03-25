// src/functions/registerName.ts
import {
  makeRegistrationData
} from "../utils/registerHelpers.mjs";
import { wrappedLabelLengthCheck } from "../utils/wrapper.mjs";
async function registerName_default({ contracts }, name, { resolverAddress, value, ...params }) {
  const labels = name.split(".");
  if (labels.length !== 2 || labels[1] !== "eth")
    throw new Error("Currently only .eth TLD registrations are supported");
  wrappedLabelLengthCheck(labels[0]);
  const controller = await contracts.getEthRegistrarController();
  const _resolver = await contracts.getPublicResolver(
    void 0,
    resolverAddress
  );
  const generatedParams = makeRegistrationData({
    name,
    resolver: _resolver,
    ...params
  });
  return controller.populateTransaction.register(...generatedParams, {
    value
  });
}
export {
  registerName_default as default
};
