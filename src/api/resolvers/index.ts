// eslint-disable-next-line import/no-cycle
import managerResolvers from "./manager";
import auctionRegistrarResolvers from "./registrar";
import subDomainRegistrarResolvers from "./subdomain";

export default Object.assign(
  managerResolvers,
  auctionRegistrarResolvers,
  subDomainRegistrarResolvers
) as Record<string, any>;
