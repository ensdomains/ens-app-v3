// src/utils/registry.ts
import { namehash } from "./normalise.mjs";
var makeResolver = async ({ contracts }, name, resolver) => {
  if (resolver)
    return resolver;
  const registry = await contracts.getRegistry();
  const node = namehash(name);
  const _resolver = await registry.resolver(node);
  return _resolver;
};
export {
  makeResolver
};
