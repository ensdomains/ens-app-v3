import { makeVar } from "@apollo/client";
import type { providers } from "ethers";

export const clientReactive = makeVar<any>(null);

export const networkIdReactive = makeVar<providers.Networkish>(1);

export const web3ProviderReactive = makeVar<providers.Provider | null>(null);

export const networkReactive = makeVar<providers.Network | null>(null);

export const reverseRecordReactive = makeVar<any>(null);

export const accountsReactive = makeVar<string[] | null>(null);

export const isReadOnlyReactive = makeVar(true);

export const isRunningAsSafeAppReactive = makeVar(false);

export const isENSReadyReactive = makeVar(false);

export const favouritesReactive = makeVar<Array<any>>([]);

export const subDomainFavouritesReactive = makeVar<Array<any>>([]);

export const isAppReadyReactive = makeVar(false);

export const globalErrorReactive = makeVar<Record<string, any>>({
  network: null,
  invalidCharacter: null,
});

export const transactionHistoryReactive = makeVar<Record<string, Array<any>>>({
  transactionHistory: [],
});

export const namesReactive = makeVar<Array<any>>([]);

export const delegatesReactive = makeVar<boolean | string>(false);
