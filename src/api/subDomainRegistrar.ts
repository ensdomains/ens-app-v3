import domains from "@app/constants/domains.json";
import { ethers, getProvider } from "@ensdomains/ui";
import subDomainRegistrarContract from "./contracts/subDomainRegistrarContract.json";

const subDomainRegistrars: Record<string, any> = {};

const defaultAddress = "0x0b07463b30b302a98407d3e3df85ebc073b0dbd1";

const getSubDomainRegistrar = async (address: string) => {
  const provider = await getProvider();
  function instantiateContract(_address: string) {
    const contract = new ethers.Contract(
      _address,
      subDomainRegistrarContract,
      provider
    );
    subDomainRegistrars[_address] = contract;
    return contract;
  }

  if (address) {
    if (subDomainRegistrars[address]) {
      return subDomainRegistrars[address];
    }
    subDomainRegistrars[address] = instantiateContract(address);
    return subDomainRegistrars[address];
  }

  if (subDomainRegistrars[defaultAddress]) {
    return subDomainRegistrars[defaultAddress];
  }
  subDomainRegistrars[defaultAddress] = instantiateContract(defaultAddress);
  return subDomainRegistrars[defaultAddress];
};

export const query = async (
  domain: string,
  label: string,
  address = defaultAddress
) => {
  const Registrar = await getSubDomainRegistrar(address);
  /// const web3 = await getWeb3()
  const {
    domain: labelName,
    price,
    referralFeePPM,
    rent,
  } = await Registrar.query(
    ethers.utils.solidityKeccak256(["string"], [domain]),
    label
  );

  return {
    label,
    domain,
    price,
    rent,
    referralFeePPM,
    available: labelName !== "",
  };
};

export const queryAll = async (label: string) => {
  return domains.map((domain) => {
    if (domain.registrar) {
      return query(domain.name, label, domain.registrar);
    }
    return query(domain.name, label);
  });
};
