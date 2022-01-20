import { isENSReadyReactive } from "@app/apollo/reactiveVars";
import { setupENS } from "@ensdomains/ui";

const INFURA_ID =
  window.location.host === "app.ens.domains"
    ? "90f210707d3c450f847659dc9a3436ea"
    : "58a380d3ecd545b2b5b3dad5d2b18bf0";

let ens: any = {};
let registrar: any = {};
let ensRegistryAddress: string;

export async function setup({
  enforceReadOnly,
  enforceReload,
  customProvider,
  ensAddress,
}: Record<string, any>) {
  const option: Parameters<typeof setupENS>[0] = {
    reloadOnAccountsChange: false,
    enforceReadOnly,
    enforceReload,
    customProvider,
    ensAddress,
    infura: enforceReadOnly ? undefined : INFURA_ID,
  };
  const {
    ens: ensInstance,
    registrar: registrarInstance,
    providerObject,
  } = await setupENS(option);
  ens = ensInstance;
  registrar = registrarInstance;
  ensRegistryAddress = ensAddress;
  isENSReadyReactive(true);
  return { ens, registrar, providerObject };
}

export function getRegistrar() {
  return registrar;
}

export function getEnsAddress() {
  return ensRegistryAddress;
}

export default function getENS() {
  return ens;
}
