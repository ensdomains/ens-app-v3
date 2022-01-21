import get from "lodash/get";
import { decryptName } from "../api/labels";

export function refetchTilUpdated(
  refetch: () => Promise<{ data: any }>,
  interval: number,
  keyToCompare: string | number,
  name: string,
  prevData: any,
  getterString: any
) {
  const maxTries = 10;
  let tries = maxTries;
  let incrementedInterval = interval;

  function recurseRefetch() {
    if (tries > 0) {
      return setTimeout(() => {
        tries -= 1;
        incrementedInterval = interval * (maxTries - tries + 1);
        refetch().then(({ data }) => {
          const updated =
            get(data, getterString)?.find(
              (item: { domain: { name: string } }) => {
                return decryptName(item.domain.name) === name;
              }
            )[keyToCompare] !==
            get(prevData, getterString)?.find(
              (item: { domain: { name: string } }) => {
                return decryptName(item.domain.name) === name;
              }
            )[keyToCompare];

          if (updated) return;
          return recurseRefetch();
        });
      }, incrementedInterval);
    }
  }

  recurseRefetch();
}

export function refetchTilUpdatedSingle({
  refetch,
  interval,
  keyToCompare,
  prevData,
  getterString,
}: {
  refetch: () => Promise<{ data: any }>;
  interval: number;
  keyToCompare: string | number;
  prevData: any;
  getterString: any;
}) {
  const maxTries = 10;
  let tries = maxTries;
  let incrementedInterval = interval;

  function recurseRefetch() {
    if (tries > 0) {
      return setTimeout(() => {
        tries -= 1;
        incrementedInterval = interval * (maxTries - tries + 1);
        refetch().then(({ data }) => {
          const updated =
            get(data, getterString)[keyToCompare] !==
            get(prevData, getterString)[keyToCompare];

          if (updated) return;
          return recurseRefetch();
        });
      }, incrementedInterval);
    }
  }

  recurseRefetch();
}

export const getQueryName = (document: {
  definitions: { name: { value: any } }[];
}) => document.definitions[0]?.name?.value;
