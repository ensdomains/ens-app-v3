// eslint-disable-next-line import/no-cycle
import merge from "lodash/merge";
import managerResolvers from "./manager";
import auctionRegistrarResolvers from "./registrar";
import subDomainRegistrarResolvers from "./subdomain";

export default merge(
  managerResolvers,
  auctionRegistrarResolvers,
  subDomainRegistrarResolvers
) as Record<string, any>;
