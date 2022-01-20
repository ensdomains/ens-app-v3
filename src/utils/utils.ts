import { saveName } from "@app/api/labels";
import getENS from "@app/apollo/mutations/ens";
import { globalErrorReactive } from "@app/apollo/reactiveVars";
import { validate } from "@ensdomains/ens-validation";
import { normalize } from "@ensdomains/eth-ens-namehash";
import {
  emptyAddress as _emptyAddress,
  getEnsStartBlock as _ensStartBlock,
  isEncodedLabelhash,
  isLabelValid as _isLabelValid,
  parseSearchTerm as _parseSearchTerm,
  validateName as _validateName,
} from "@ensdomains/ui/utils/index";
import { getNetworkId } from "@ensdomains/ui/web3";
import { keccak256 } from "@ethersproject/keccak256";
import throttle from "lodash/throttle";
import { CID } from "multiformats";
import { useEffect, useRef } from "react";

// From https://github.com/0xProject/0x-monorepo/blob/development/packages/utils/src/address_utils.ts

const BASIC_ADDRESS_REGEX = /^(0x)?[0-9a-f]{40}$/i;
const SAME_CASE_ADDRESS_REGEX = /^(0x)?([0-9a-f]{40}|[0-9A-F]{40})$/;
const ADDRESS_LENGTH = 40;
export const MAINNET_DNSREGISTRAR_ADDRESS =
  "0x58774Bb8acD458A640aF0B88238369A167546ef2";
export const ROPSTEN_DNSREGISTRAR_ADDRESS =
  "0xdB328BA5FEcb432AF325Ca59E3778441eF5aa14F";

export const networkName = {
  main: "mainnet",
  goerli: "goerli",
  rinkeby: "rinkeby",
  ropsten: "ropsten",
  local: "local",
};

export const supportedAvatarProtocols = [
  "http://",
  "https://",
  "ipfs://",
  "eip155",
];

export const addressUtils = {
  isChecksumAddress(address: any) {
    // Check each case
    const unprefixedAddress = address.replace("0x", "");
    const addressHash = keccak256(unprefixedAddress.toLowerCase());

    for (let i = 0; i < ADDRESS_LENGTH; i += 1) {
      // The nth letter should be uppercase if the nth digit of casemap is 1
      const hexBase = 16;
      const lowercaseRange = 7;
      if (
        (parseInt(addressHash[i], hexBase) > lowercaseRange &&
          unprefixedAddress[i].toUpperCase() !== unprefixedAddress[i]) ||
        (parseInt(addressHash[i], hexBase) <= lowercaseRange &&
          unprefixedAddress[i].toLowerCase() !== unprefixedAddress[i])
      ) {
        return false;
      }
    }
    return true;
  },
  isAddress(address: any) {
    if (!BASIC_ADDRESS_REGEX.test(address)) {
      // Check if it has the basic requirements of an address
      return false;
    }
    if (SAME_CASE_ADDRESS_REGEX.test(address)) {
      // If it's all small caps or all all caps, return true
      return true;
    }
    // Otherwise check each case
    const isValidChecksummedAddress = addressUtils.isChecksumAddress(address);
    return isValidChecksummedAddress;
  },
};

export const uniq = (a: any, param: any) =>
  a.filter(
    (item: any, pos: number) =>
      a.map((mapItem: any) => mapItem[param]).indexOf(item[param]) === pos
  );

export async function getEtherScanAddr() {
  const networkId = await getNetworkId();
  switch (networkId) {
    case 1:
    case "1":
      return "https://etherscan.io/";
    case 3:
    case "3":
      return "https://ropsten.etherscan.io/";
    case 4:
    case "4":
      return "https://rinkeby.etherscan.io/";
    default:
      return "https://etherscan.io/";
  }
}

export async function ensStartBlock() {
  return _ensStartBlock();
}

// export const checkLabels = (...labelHashes) =>
//   labelHashes.map(labelHash => checkLabelHash(labelHash) || null)

export const mergeLabels = (labels1: any, labels2: any) =>
  labels1.map((label: any, index: number) => label || labels2[index]);

export function validateName(name: any) {
  const normalisedName = _validateName(name);
  saveName(normalisedName);
  return normalisedName;
}

export function isLabelValid(name: any) {
  return _isLabelValid(name);
}

export const parseSearchTerm = async (term: any) => {
  const ens = getENS();
  const domains = term.split(".");
  const tld = domains[domains.length - 1];
  try {
    _validateName(tld);
  } catch (e) {
    return "invalid";
  }
  console.log("** parseSearchTerm", { ens });
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const address = await ens.getOwner(tld);
  return _parseSearchTerm(term, true);
};

export function humaniseName(name: any) {
  return name
    .split(".")
    .map((label: string | any[]) => {
      return isEncodedLabelhash(label)
        ? `[unknown${label.slice(1, 8)}]`
        : label;
    })
    .join(".");
}

export function modulate(
  value: number,
  rangeA: any[],
  rangeB: any[],
  limit: boolean | null
) {
  if (limit === null) {
    // eslint-disable-next-line no-param-reassign
    limit = false;
  }
  const [fromLow, fromHigh] = rangeA;
  const [toLow, toHigh] = rangeB;
  const result =
    toLow + ((value - fromLow) / (fromHigh - fromLow)) * (toHigh - toLow);
  if (limit === true) {
    if (toLow < toHigh) {
      if (result < toLow) {
        return toLow;
      }
      if (result > toHigh) {
        return toHigh;
      }
    } else {
      if (result > toLow) {
        return toLow;
      }
      if (result < toHigh) {
        return toHigh;
      }
    }
  }
  return result;
}

export function isElementInViewport(el: Element) {
  const rect = el.getBoundingClientRect();

  return (
    rect.top >= 0 &&
    rect.left >= 0 &&
    rect.bottom <=
      (window.innerHeight ||
        document.documentElement.clientHeight) /* or $(window).height() */ &&
    rect.right <=
      (window.innerWidth ||
        document.documentElement.clientWidth) /* or $(window).width() */
  );
}

export const emptyAddress = _emptyAddress;

export function isShortName(term: any) {
  return [...term].length < 3;
}

export const aboutPageURL = () => {
  const lang = window.localStorage.getItem("language") || "";

  return `https://ens.domains/${lang === "en" ? "" : lang}`;
};

export function isRecordEmpty(value: any) {
  return value === emptyAddress || value === "";
}

export const hasValidReverseRecord = (getReverseRecord: any) =>
  getReverseRecord?.name && getReverseRecord.name !== emptyAddress;

export const hasNonAscii = () => {
  const strs = window.location.pathname.split("/");
  const rslt = strs.reduce((accum, next) => {
    if (accum) return true;
    if (!validate(next)) return true;
    return accum;
  }, false);
  return rslt;
};

export function usePrevious(value: any) {
  // The ref object is a generic container whose current property is mutable ...
  // ... and can hold any value, similar to an instance property on a class
  const ref = useRef();
  // Store current value in ref
  useEffect(() => {
    ref.current = value;
  }, [value]); // Only re-run if value changes
  // Return previous value (happens before update in useEffect above)
  return ref.current;
}

export function isOwnerOfParentDomain(domain: any, account: any) {
  if (!account) return false;
  if (domain.parentOwner !== emptyAddress) {
    return domain.parentOwner?.toLowerCase() === account.toLowerCase();
  }
  return false;
}

// eslint-disable-next-line consistent-return
export function filterNormalised(data: any, name: any, nested = false) {
  try {
    // eslint-disable-next-line @typescript-eslint/no-shadow
    return data?.filter((data: any) => {
      const domain = nested ? data.domain : data;
      return domain[name] === normalize(domain[name]);
    });
  } catch (e: any) {
    if (e.message.match(/Illegal char/)) {
      globalErrorReactive({
        ...globalErrorReactive(),
        invalidCharacter: "Invalid character",
      });
    }
  }
}

export function normaliseOrMark(data: any, name: any, nested = false) {
  // eslint-disable-next-line @typescript-eslint/no-shadow
  return data?.map((data: any) => {
    const domain = nested ? data.domain : data;
    let normalised;

    try {
      normalised = normalize(domain[name]);
    } catch (e: any) {
      if (e.message.match(/Illegal char/)) {
        console.log("domain: ", { ...domain, hasInvalidCharacter: true });
        return { ...data, hasInvalidCharacter: true };
      }

      globalErrorReactive({
        ...globalErrorReactive(),
        invalidCharacter: `Name error: ${e.message}`,
      });
      return { ...data, hasInvalidCharacter: true };
    }

    if (normalised === domain[name]) {
      return data;
    }

    return { ...data, hasInvalidCharacter: true };
  });
}

export function prependUrl(url: string) {
  if (url && !url.match(/http[s]?:\/\//)) {
    return `https://${url}`;
  }
  return url;
}

// eslint-disable-next-line consistent-return
export function imageUrl(url: string, name: any, network: string) {
  const _network =
    networkName[network?.toLowerCase() as keyof typeof networkName];
  const _protocol = supportedAvatarProtocols.find((proto) =>
    url.startsWith(proto)
  );
  // check if given uri is supported
  // provided network name is valid,
  // domain name is available
  if (_protocol && _network && name) {
    return `https://metadata.ens.domains/${_network}/avatar/${name}`;
  }
  console.warn("Unsupported avatar", network, name, url);
}

export function isCID(hash: string | CID) {
  try {
    if (typeof hash === "string") {
      return Boolean(CID.parse(hash));
    }

    return Boolean(CID.asCID(hash));
  } catch (e) {
    return false;
  }
}

export function asyncThrottle(func: (arg0: any) => Promise<any>, wait: any) {
  const throttled = throttle((resolve: any, reject: any, args: any) => {
    func([...args])
      .then(resolve)
      .catch(reject);
  }, wait);
  return (...args: any) =>
    new Promise((resolve, reject) => {
      throttled(resolve, reject, args);
    });
}
