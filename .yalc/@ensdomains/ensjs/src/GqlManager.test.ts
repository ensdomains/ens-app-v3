import { parse, print, visit } from 'graphql'
import traverse from 'traverse'
import { ClientError } from 'graphql-request'

import { requestMiddleware, responseMiddleware } from './GqlManager'
import { namehash } from './utils/normalise'

describe('GqlManager', () => {
  const queryWithoutId = `
query getNames($id: ID!, $expiryDate: Int) {
    account(id: $id) {
      registrations(first: 1000, where: { expiryDate_gt: $expiryDate }) {
        registrationDate
        expiryDate
        domain {
          labelName
          labelhash
          name
          isMigrated
          parent {
            name
          }
        }
      }
      domains(first: 1000) {
        labelName
        labelhash
        name
        isMigrated
        parent {
          name
        }
        createdAt
      }
    }
  }
`

  const mockRequest = {
    method: 'POST',
    headers: {
      // eslint-disable-next-line @typescript-eslint/naming-convention
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query: queryWithoutId }),
  }

  const mockResponse = {
    data: {
      account: {
        registrations: [
          {
            registrationDate: '1659245504',
            expiryDate: '1690781504',
            domain: {
              id: '0xb1ccf7f6bb648f39ba48bf80f4a8a4522f474ee7d1edd6ea65f7fa51fe8b1612',
              labelName: 'randydandy',
              labelhash:
                '0x63fd5bfdd0b1eb9f4c33c209b7c3e7dcb87a761d926a65e267f7cb99ee313ddd',
              name: '0xde2551f43e950a2a4d4e6052f25edc450c48a5338faa27f09d1ee99ca9dc04fd',
              isMigrated: true,
              parent: {
                name: '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae',
                invalidName: true,
              },
              invalidName: true,
            },
          },
          {
            registrationDate: '1635284756',
            expiryDate: '1666841708',
            domain: {
              id: '0xde2551f43e950a2a4d4e6052f25edc450c48a5338faa27f09d1ee99ca9dc04fd',
              labelName: 'randydandy',
              labelhash:
                '0x6a877a8d92ad83c8d044d0c5b69aa0da3050f4d653dcc149fca952d6439e4105',
              name: 'randydandy.eth',
              isMigrated: true,
              parent: {
                name: '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae',
                invalidName: true,
              },
            },
          },
          {
            registrationDate: '1659250465',
            expiryDate: '1690786465',
            domain: {
              id: '0xaf119e72f050e5acad6b2d97826a7afb45afe9407376a2ab8240b62173b2d7c2',
              labelName: 'nullbyte',
              labelhash:
                '0xc8985f8323b3dc707003a6ef5b379d9e8a058b6d6bcc2cfb307c61ca36920e27',
              name: '0xb54c7c79c89d571f1fbf4c67f524e336a04441eeee4d76f156e835da99a46ddb',
              isMigrated: true,
              parent: {
                name: '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae',
                invalidName: true,
              },
              invalidName: true,
            },
          },
        ],
        domains: [
          {
            id: '0xaf119e72f050e5acad6b2d97826a7afb45afe9407376a2ab8240b62173b2d7c2',
            labelName: 'nullbyte',
            labelhash:
              '0xc8985f8323b3dc707003a6ef5b379d9e8a058b6d6bcc2cfb307c61ca36920e27',
            name: '0xb54c7c79c89d571f1fbf4c67f524e336a04441eeee4d76f156e835da99a46ddb',
            isMigrated: true,
            parent: {
              name: '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae',
              invalidName: true,
            },
            createdAt: '1659250465',
            invalidName: true,
          },
          {
            id: '0xb1ccf7f6bb648f39ba48bf80f4a8a4522f474ee7d1edd6ea65f7fa51fe8b1612',
            labelName: 'randydandy',
            labelhash:
              '0x63fd5bfdd0b1eb9f4c33c209b7c3e7dcb87a761d926a65e267f7cb99ee313ddd',
            name: '0xde2551f43e950a2a4d4e6052f25edc450c48a5338faa27f09d1ee99ca9dc04fd',
            isMigrated: true,
            parent: {
              name: '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae',
              invalidName: true,
            },
            createdAt: '1659245504',
            invalidName: true,
          },
          {
            id: '0xde2551f43e950a2a4d4e6052f25edc450c48a5338faa27f09d1ee99ca9dc04fd',
            labelName: 'randydandy',
            labelhash:
              '0x6a877a8d92ad83c8d044d0c5b69aa0da3050f4d653dcc149fca952d6439e4105',
            name: 'randydandy.eth',
            isMigrated: true,
            parent: {
              name: '0x93cdeb708b7545dc668eb9280176169d1c33cfd8ed6f04690a0bcc88a93fc4ae',
              invalidName: true,
            },
            createdAt: '1635284756',
          },
        ],
      },
    },
    headers: {
      map: {
        // eslint-disable-next-line @typescript-eslint/naming-convention
        'Content-Type': 'application/json',
      },
    },
    status: 200,
  }

  describe('requestMiddleware', () => {
    it('should add id to a SelectionSet if name is present and id is not', () => {
      const result = requestMiddleware(visit, parse, print)(mockRequest)
      const body = result.body as string
      expect(body.match(/domain.*id.*id.*domains.*id.*id/)?.length).toBe(1)
    })
  })
  describe('responseMiddleware', () => {
    it('should replace name with the namehash when there is an invalid name and id combo', () => {
      const result = responseMiddleware(traverse)(mockResponse)
      expect(result.data.account.domains[0].name).toBe(
        namehash(
          '0xb54c7c79c89d571f1fbf4c67f524e336a04441eeee4d76f156e835da99a46ddb',
        ),
      )
    })
  })

  describe('errors', () => {
    beforeAll(() => {
      process.env.NEXT_PUBLIC_ENSJS_DEBUG = 'on'
      localStorage.setItem('ensjs-debug', 'ENSJSSubgraphError')
    })

    afterAll(() => {
      process.env.NEXT_PUBLIC_ENSJS_DEBUG = ''
      localStorage.removeItem('ensjs-debug')
    })

    it('should throw error when reqest middleware is run', async () => {
      expect(requestMiddleware(visit, parse, print)).toThrow(ClientError)
    })
  })
})
