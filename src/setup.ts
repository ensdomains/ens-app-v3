import { connect } from "@app/api/web3modal";
import { setup } from "@app/apollo/mutations/ens";
import {
  accountsReactive,
  delegatesReactive,
  favouritesReactive,
  globalErrorReactive,
  isAppReadyReactive,
  isReadOnlyReactive,
  networkIdReactive,
  networkReactive,
  reverseRecordReactive,
  subDomainFavouritesReactive,
  web3ProviderReactive,
} from "@app/apollo/reactiveVars";
import { getReverseRecord } from "@app/apollo/sideEffects";
import { getAccounts, getNetwork, getNetworkId } from "@ensdomains/ui";
import { isReadOnly } from "@ensdomains/ui/web3";
import getShouldDelegate from "./api/delegate";

export const setFavourites = () => {
  favouritesReactive(
    JSON.parse(window.localStorage.getItem("ensFavourites") as string) || []
  );
};

export const setSubDomainFavourites = () => {
  subDomainFavouritesReactive(
    JSON.parse(
      window.localStorage.getItem("ensSubDomainFavourites") as string
    ) || []
  );
};

export const isSupportedNetwork = (networkId: number) => {
  switch (networkId) {
    case 1:
    case 3:
    case 4:
    case 5:
    case 1337:
      return true;
    default:
      return false;
  }
};

export const getProvider = async (reconnect?: boolean) => {
  let provider;
  try {
    if (
      process.env.REACT_APP_STAGE === "local" &&
      process.env.REACT_APP_ENS_ADDRESS
    ) {
      const { providerObject } = await setup({
        reloadOnAccountsChange: false,
        customProvider: "http://localhost:8545",
        ensAddress: process.env.REACT_APP_ENS_ADDRESS,
      });
      provider = providerObject;
      const labels = window.localStorage.labels
        ? JSON.parse(window.localStorage.labels)
        : {};
      window.localStorage.setItem(
        "labels",
        JSON.stringify({
          ...labels,
          ...JSON.parse(process.env.REACT_APP_LABELS || "{}"),
        })
      );
      return provider;
    }

    // TEMPORARILY REMOVED
    // const safe = await safeInfo();
    // if (safe) {
    //   provider = await setupSafeApp(safe);
    //   return provider;
    // }

    if (
      window.localStorage.getItem("WEB3_CONNECT_CACHED_PROVIDER") ||
      reconnect
    ) {
      provider = await connect();
      return provider;
    }

    const { providerObject } = await setup({
      reloadOnAccountsChange: false,
      enforceReadOnly: true,
      enforceReload: false,
    });

    provider = providerObject;
    return provider;
  } catch (e: any) {
    if (e.message.match(/Unsupported network/)) {
      globalErrorReactive({
        ...globalErrorReactive(),
        network: "Unsupported Network",
      });
      return;
    }
  }

  try {
    const { providerObject } = await setup({
      reloadOnAccountsChange: false,
      enforceReadOnly: true,
      enforceReload: false,
    });
    provider = providerObject;
    return provider;
  } catch (e) {
    console.error("getProvider readOnly error: ", e);
  }
};

export const setWeb3Provider = async (provider: any) => {
  web3ProviderReactive(provider);

  const accounts = isReadOnly() ? [] : await getAccounts();

  if (provider) {
    provider.removeAllListeners();
    accountsReactive(accounts);
  }

  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  provider?.on("chainChanged", async (_: any) => {
    const networkId = await getNetworkId();
    if (!isSupportedNetwork(networkId)) {
      globalErrorReactive({
        ...globalErrorReactive(),
        network: "Unsupported Network",
      });
      return;
    }

    await setup({
      customProvider: provider,
      reloadOnAccountsChange: false,
      enforceReload: true,
    });

    networkIdReactive(networkId);
    networkReactive(await getNetwork());
  });

  provider?.on("accountsChanged", async (_accounts: any[]) => {
    accountsReactive(_accounts);
  });

  return provider;
};

export default async (reconnect: boolean) => {
  try {
    setFavourites();
    setSubDomainFavourites();
    const provider = await getProvider(reconnect);

    if (!provider) throw new Error("Please install a wallet");

    const networkId = await getNetworkId();

    if (!isSupportedNetwork(networkId)) {
      globalErrorReactive({
        ...globalErrorReactive(),
        network: "Unsupported Network",
      });
      return;
    }

    networkIdReactive(await getNetworkId());
    networkReactive(await getNetwork());

    await setWeb3Provider(provider);

    if (accountsReactive()?.[0]) {
      reverseRecordReactive(await getReverseRecord(accountsReactive()?.[0]));
      delegatesReactive(await getShouldDelegate(accountsReactive()?.[0]));
    }

    isReadOnlyReactive(isReadOnly());

    // add back for normal prod
    // setupAnalytics();

    isAppReadyReactive(true);
  } catch (e) {
    console.error("setup error: ", e);
  }
};
