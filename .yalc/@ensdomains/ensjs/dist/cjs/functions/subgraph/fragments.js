"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.wrappedDomainDetailsFragment = exports.registrationDetailsFragment = exports.domainDetailsFragment = exports.domainDetailsWithoutParentFragment = void 0;
const graphql_request_1 = require("graphql-request");
exports.domainDetailsWithoutParentFragment = (0, graphql_request_1.gql) `
  fragment DomainDetailsWithoutParent on Domain {
    id
    labelName
    labelhash
    name
    isMigrated
    createdAt
    resolvedAddress {
      id
    }
    owner {
      id
    }
    registrant {
      id
    }
    wrappedOwner {
      id
    }
  }
`;
exports.domainDetailsFragment = (0, graphql_request_1.gql) `
  fragment DomainDetails on Domain {
    ...DomainDetailsWithoutParent
    parent {
      name
    }
  }
  ${exports.domainDetailsWithoutParentFragment}
`;
exports.registrationDetailsFragment = (0, graphql_request_1.gql) `
  fragment RegistrationDetails on Registration {
    registrationDate
    expiryDate
  }
`;
exports.wrappedDomainDetailsFragment = (0, graphql_request_1.gql) `
  fragment WrappedDomainDetails on WrappedDomain {
    expiryDate
    fuses
  }
`;
//# sourceMappingURL=fragments.js.map