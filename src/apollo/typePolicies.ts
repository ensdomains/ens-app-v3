import { hasValidReverseRecord } from "@app/utils/utils";
import {
  accountsReactive,
  delegatesReactive,
  favouritesReactive,
  globalErrorReactive,
  isAppReadyReactive,
  isENSReadyReactive,
  isReadOnlyReactive,
  isRunningAsSafeAppReactive,
  namesReactive,
  networkIdReactive,
  networkReactive,
  reverseRecordReactive,
  transactionHistoryReactive,
} from "./reactiveVars";

export default {
  Query: {
    fields: {
      names: {
        read() {
          return namesReactive();
        },
      },
      transactionHistory: {
        read() {
          return transactionHistoryReactive()?.transactionHistory;
        },
      },
      networkId: {
        read() {
          return networkIdReactive();
        },
      },
      network: {
        read() {
          const network = networkReactive();
          const networkName = network?.name;
          if (!networkName) return "Loading";
          return networkName === "homestead" ? "Main" : networkName;
        },
      },
      accounts: {
        read() {
          return accountsReactive();
        },
      },
      displayName: {
        read() {
          const address = accountsReactive()?.[0];
          if (!address) return "";
          return hasValidReverseRecord(reverseRecordReactive())
            ? reverseRecordReactive().name
            : `${address.slice(0, 5)}...${address.slice(-4)}`;
        },
      },
      primaryName: {
        read() {
          return reverseRecordReactive()?.name || null;
        },
      },
      avatar: {
        read() {
          return reverseRecordReactive()?.avatar || "";
        },
      },
      isReadOnly: {
        read() {
          return isReadOnlyReactive();
        },
      },
      isSafeApp: {
        read() {
          return isRunningAsSafeAppReactive();
        },
      },
      isENSReady: {
        read() {
          return isENSReadyReactive();
        },
      },
      isAppReady: {
        read() {
          return isAppReadyReactive();
        },
      },
      favourites: {
        read() {
          return favouritesReactive();
        },
      },
      shouldDelegate: {
        read() {
          return delegatesReactive();
        },
      },
      globalError: {
        read() {
          return (
            globalErrorReactive() || {
              network: null,
              invalidCharacter: null,
            }
          );
        },
      },
    },
  },
};
