import { gql } from "@apollo/client";

export const NodeFields = gql`
  fragment NodeFields on Node {
    name
    formattedName @client
    decrypted
    parent
    parentOwner
    owner
    label
    resolver
    addr
    content
    contentType
  }
`;

export const SubDomainStateFields = gql`
  fragment SubDomainStateFields on SubDomain {
    label
    domain
    name
    formattedName @client
    owner
    price
    rent
    referralFeePPM
    available
    state
  }
`;
