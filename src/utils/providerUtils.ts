import { disconnect } from "@app/api/web3modal";
import {
  accountsReactive,
  delegatesReactive,
  isReadOnlyReactive,
  reverseRecordReactive,
} from "@app/apollo/reactiveVars";
import setup from "@app/setup";

export const connectProvider = () => {
  setup(true);
};

export const disconnectProvider = () => {
  disconnect();
  isReadOnlyReactive(true);
  reverseRecordReactive(null);
  delegatesReactive(false);
  accountsReactive(null);
};
