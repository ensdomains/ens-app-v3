import AddressBitcoin from "./AddressBitcoin.svg";
import AddressBNB from "./AddressBNB.svg";
import AddressDoge from "./AddressDoge.svg";
import AddressEthereum from "./AddressEthereum.svg";
import AddressLitecoin from "./AddressLitecoin.svg";
import AddressPolkadot from "./AddressPolkadot.svg";
import AddressSolana from "./AddressSolana.svg";

export const addressIconTypes = {
  btc: AddressBitcoin,
  bnb: AddressBNB,
  eth: AddressEthereum,
  doge: AddressDoge,
  ltc: AddressLitecoin,
  dot: AddressPolkadot,
  sol: AddressSolana,
};

export const DynamicAddressIcon = ({
  name,
  ...props
}: {
  name: keyof typeof addressIconTypes;
}) => {
  const Icon = addressIconTypes[name];
  return <Icon {...props} />;
};
