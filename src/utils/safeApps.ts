import { SafeAppProvider } from "@gnosis.pm/safe-apps-provider";
import SafeAppSDK from "@gnosis.pm/safe-apps-sdk";
import { setup as setupENS } from "../apollo/mutations/ens";

const safeAppsSdk = new SafeAppSDK();
let isSafeAppSetup = false;

export function isRunningAsSafeApp() {
  return isSafeAppSetup;
}

export const safeInfo = async () => {
  try {
    return await Promise.race([
      safeAppsSdk.safe.getInfo(),
      new Promise((resolve) => setTimeout(resolve, 200)),
    ]);
  } catch (e) {
    console.error(e);
    return undefined;
  }
};

export const setupSafeApp = async (inputtedSafeInfo: any) => {
  const provider = new SafeAppProvider(inputtedSafeInfo, safeAppsSdk);
  const { providerObject } = await setupENS({
    customProvider: provider,
    reloadOnAccountsChange: true,
    enforceReload: true,
  });
  isSafeAppSetup = true;

  return providerObject;
};
