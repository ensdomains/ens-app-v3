import { gql } from 'graphql-request';
export const domainDetailsWithoutParentFragment = gql `
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
export const domainDetailsFragment = gql `
  fragment DomainDetails on Domain {
    ...DomainDetailsWithoutParent
    parent {
      name
    }
  }
  ${domainDetailsWithoutParentFragment}
`;
export const registrationDetailsFragment = gql `
  fragment RegistrationDetails on Registration {
    registrationDate
    expiryDate
  }
`;
export const wrappedDomainDetailsFragment = gql `
  fragment WrappedDomainDetails on WrappedDomain {
    expiryDate
    fuses
  }
`;
//# sourceMappingURL=fragments.js.map