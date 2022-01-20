import getENS from "@app/apollo/mutations/ens";
import { isENSReadyReactive } from "@app/apollo/reactiveVars";
import { emptyAddress } from "@app/utils/utils";
import { normalize } from "@ensdomains/eth-ens-namehash";

export default async (_: any, { address }: any) => {
  let name = emptyAddress;
  const ens = getENS();
  const obj = {
    name,
    address,
    avatar: "",
    match: false,
    // eslint-disable-next-line @typescript-eslint/naming-convention
    __typename: "ReverseRecord",
  };
  if (!address || !isENSReadyReactive()) return obj;

  try {
    const { name: reverseName } = await ens.getName(address);
    const reverseAddress = await ens.getAddress(reverseName);
    const normalisedName = normalize(reverseName);
    if (
      parseInt(address, 16) === parseInt(reverseAddress, 16) &&
      reverseName === normalisedName
    ) {
      name = reverseName;
    }
    if (name !== null) {
      const avatar = await ens.getText(name, "avatar");
      return {
        ...obj,
        name,
        addr: reverseAddress,
        avatar,
        match: false,
      };
    }
    return {
      ...obj,
      name: null,
      match: false,
    };
  } catch (e) {
    console.log(e);
    return {
      ...obj,
      name: null,
      match: false,
    };
  }
};
