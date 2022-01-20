/* eslint-disable consistent-return */
import modeNames from "@app/api/modes";
import { sendHelper } from "@app/api/resolverUtils";
import getENS, { getRegistrar } from "@app/apollo/mutations/ens";
import { isShortName } from "@app/utils/utils";

const defaults = {};

const resolvers = {
  Query: {
    async getRentPrice(_: any, { label, duration }: Record<string, any>) {
      const registrar = getRegistrar();
      return registrar.getRentPrice(label, duration);
    },
    async getRentPrices(_: any, { labels, duration }: Record<string, any>) {
      const registrar = getRegistrar();
      return labels.length && registrar.getRentPrices(labels, duration);
    },
    async getPremium(_: any, { name, expires, duration }: Record<string, any>) {
      const registrar = getRegistrar();
      return registrar.getPremium(name, expires, duration);
    },
    async getTimeUntilPremium(
      _: any,
      { expires, amount }: Record<string, any>
    ) {
      const registrar = getRegistrar();
      return registrar.getTimeUntilPremium(expires, amount);
    },

    async getMinimumCommitmentAge() {
      try {
        const registrar = getRegistrar();
        const minCommitmentAge = await registrar.getMinimumCommitmentAge();
        return parseInt(minCommitmentAge);
      } catch (e) {
        console.log(e);
      }
    },
    async getMaximumCommitmentAge() {
      try {
        const registrar = getRegistrar();
        const maximumCommitmentAge = await registrar.getMaximumCommitmentAge();
        return parseInt(maximumCommitmentAge);
      } catch (e) {
        console.log(e);
      }
    },
    async checkCommitment(_: any, { label, secret }: Record<string, any>) {
      try {
        const registrar = getRegistrar();
        const commitment = await registrar.checkCommitment(label, secret);
        return parseInt(commitment);
      } catch (e) {
        console.log(e);
      }
    },
  },
  Mutation: {
    async commit(_: any, { label, secret }: Record<string, any>) {
      const registrar = getRegistrar();
      const tx = await registrar.commit(label, secret);
      return sendHelper(tx);
    },
    async register(_: any, { label, duration, secret }: Record<string, any>) {
      const registrar = getRegistrar();
      const tx = await registrar.register(label, duration, secret);

      return sendHelper(tx);
    },
    async reclaim(_: any, { name, address }: Record<string, any>) {
      const registrar = getRegistrar();
      const tx = await registrar.reclaim(name, address);
      return sendHelper(tx);
    },
    async renew(_: any, { label, duration }: Record<string, any>) {
      const registrar = getRegistrar();
      const tx = await registrar.renew(label, duration);
      return sendHelper(tx);
    },
    async getDomainAvailability(_: any, { name }: Record<string, any>) {
      const registrar = getRegistrar();
      const ens = getENS();
      try {
        const { state, registrationDate, revealDate, value, highestBid } =
          await registrar.getEntry(name);
        let owner = null;
        if (isShortName(name)) {
          // @ts-ignore
          cache.writeData({
            data: defaults,
          });
          return null;
        }

        if (modeNames[state] === "Owned") {
          owner = await ens.getOwner(`${name}.eth`);
        }

        const data = {
          domainState: {
            name: `${name}.eth`,
            state: modeNames[state],
            registrationDate,
            revealDate,
            value,
            highestBid,
            owner,
            // eslint-disable-next-line @typescript-eslint/naming-convention
            __typename: "DomainState",
          },
        };
        // @ts-ignore
        cache.writeData({ data });

        return data.domainState;
      } catch (e) {
        console.log("Error in getDomainAvailability", e);
      }
    },
    async setRegistrant(_: any, { name, address }: Record<string, any>) {
      const registrar = getRegistrar();
      const tx = await registrar.transferOwner(name, address);
      return sendHelper(tx);
    },
    async submitProof(_: any, { name, parentOwner }: Record<string, any>) {
      const registrar = getRegistrar();
      const tx = await registrar.submitProof(name, parentOwner);
      return sendHelper(tx);
    },
    async renewDomains(_: any, { labels, duration }: Record<string, any>) {
      const registrar = getRegistrar();
      const tx = await registrar.renewAll(labels, duration);
      return sendHelper(tx);
    },
  },
};

export default resolvers;

export { defaults };
