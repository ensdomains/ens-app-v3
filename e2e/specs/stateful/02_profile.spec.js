import { acceptMetamaskAccess } from '../../setup'

const profiles = [
  {
    name: 'wrapmebaby.eth',
    records: [
      {
        type: 'snippet',
        key: 'name',
        value: 'wrap',
      },
      {
        type: 'snippet',
        key: 'description',
        value: 'Professional namer',
      },
      {
        type: 'snippet',
        key: 'url',
        value: 'ens.domains',
      },
      {
        type: 'snippet',
        key: 'location',
        value: 'Metaverse',
      },
      {
        type: 'account',
        key: 'com.discord',
        value: 'ens#0700',
      },
      {
        type: 'account',
        key: 'com.github',
        value: 'ensdomains',
      },
      {
        type: 'account',
        key: 'com.twitter',
        value: '@ensdomains',
        fullValue: 'ensdomains',
      },
      {
        type: 'address',
        key: 'eth',
        value: '0x325...1be8f',
        fullValue: '0x32518828A071a0e6E549F989D4aaB4Cd7401be8f',
      },
      {
        type: 'other',
        key: 'avatar',
        value: 'https://avatar-...',
        fullValue:
          'https://avatar-upload.ens-cf.workers.dev/goerli/wrapmebaby.eth?timestamp=1666267425956',
      },
      {
        type: 'other',
        key: 'email',
        value: 'email@ens.domai...',
        fullValue: 'email@ens.domains',
      },
    ],
    owners: [
      {
        type: 'manager',
        value: 'wrapmebaby.eth',
      },
      {
        type: 'owner',
        value: 'wrapmebaby.eth',
      },
    ],
    expiry: 'May 30, 2037',
  },
]

describe('Profile', () => {
  it('should allow user to connect', () => {
    cy.changeMetamaskNetwork('goerli')
    acceptMetamaskAccess()
    cy.contains('0x', {
      timeout: 15000,
    }).click()
    cy.contains('Profile').should('be.visible')
    cy.contains('0x').click()
    cy.contains('Profile').should('not.be.visible')
  })

  it('should show a warning if name is not supported', () => {
    cy.visit('/name.nottld')
    cy.wait(10000)
    cy.contains('This TLD is not supported').should('be.visible')
  })

  it('should load emoji domain pages', () => {
    cy.visit('/❤️.eth')
    cy.wait(10000)
    cy.findByTestId('profile-snippet', { timeout: 25000 }).should('contain.text', '❤️')
  })

  profiles.forEach((profile) => {
    describe(profile.name, () => {
      describe('profile', () => {
        it('should go to the profile page', () => {
          cy.visit('/')
          cy.get('[placeholder="Search for a name"]').type(profile.name).wait(1000).type('{enter}')
        })

        it('should show the name in the profile snippet', () => {
          cy.findByTestId('profile-snippet', {
            timeout: 25000,
          }).should('contain.text', profile.name)
        })

        const snippetRecords = profile.records.filter((x) => x.type === 'snippet')
        const accounts = profile.records.filter((x) => x.type === 'account')
        const addresses = profile.records.filter((x) => x.type === 'address')
        const otherRecords = profile.records.filter((x) => x.type === 'other')

        describe('should show profile records', () => {
          it('should show all snippet records in profile snippet', () => {
            if (snippetRecords.length > 0) {
              snippetRecords.forEach((record) => {
                cy.findByTestId(`profile-snippet-${record.key}`).should(
                  'contain.text',
                  record.value,
                )
              })
            }
          })
          it('should show accounts', () => {
            if (accounts.length > 0) {
              cy.contains('Accounts').should('be.visible')
              accounts.forEach((account) => {
                cy.findByTestId(`social-profile-button-${account.key}`)
                  .should('be.visible')
                  .should('contain.text', account.value)
              })
            }
          })
          it('should show addresses', () => {
            if (addresses.length > 0) {
              cy.contains('Addresses').should('be.visible')
              addresses.forEach((address) => {
                cy.findByTestId(`address-profile-button-${address.key}`)
                  .should('be.visible')
                  .should('contain.text', address.value)
              })
            }
          })

          it('should show other records', () => {
            if (otherRecords.length > 0) {
              cy.contains('Other Records').should('be.visible')
              otherRecords.forEach((other) => {
                cy.findByTestId(`other-profile-button-${other.key}`)
                  .should('be.visible')
                  .should('contain.text', `${other.key}${other.value}`)
              })
            }
          })
        })
      })
      describe('name details', () => {
        const textRecords = profile.records.filter((x) => x.type !== 'address')
        const addressRecords = profile.records.filter((x) => x.type === 'address')

        it('should show all text records, and show correct number of records', () => {
          cy.findByTestId('records-tab').click()
          cy.findByTestId('text-amount').should('contain.text', `${textRecords.length} Records`)
          if (textRecords.length > 0) {
            textRecords.forEach((record) => {
              cy.findByTestId(`name-details-text-${record.key}`)
                .should('be.visible')
                .should('include.text', record.fullValue || record.value)
            })
          }
        })
        it('should show all address records, and show correct number of records', () => {
          cy.findByTestId('address-amount').should(
            'contain.text',
            `${addressRecords.length} Records`,
          )
          if (addressRecords.length > 0) {
            addressRecords.forEach((record) => {
              cy.findByTestId(`name-details-address-${record.key}`)
                .should('be.visible')
                .should('include.text', record.fullValue)
            })
          }
        })

        it('should show the contenthash if available', () => {
          if (profile.contentHash) {
            cy.findByTestId('content-hash-heading').should('have.text', 'Content Hash')
            cy.findByTestId('name-details-contentHash').should('contain.text', profile.contentHash)
          } else {
            cy.findAllByTestId('content-hash-heading').should('have.text', 'No Content Hash')
          }
        })

        it('should have correct ownership data', () => {
          cy.findByTestId('more-tab').click()
          //owner-button-name-name.manager
          profile.owners.forEach((owner) => {
            cy.findByTestId(`owner-button-name-name.${owner.type}`).should(
              'contain.text',
              owner.value,
            )
          })
        })

        it('should show the expiry of the name if available', () => {
          if (profile.expiry) {
            cy.findByTestId('expiry-data').should('contain.text', profile.expiry)
          }
        })
      })
    })
  })

  it('should decode an unknown label', () => {
    cy.visit('/[8df9cfc425ad5e1853259e1cef0a8d1d44591fbec8e3feb6f930d9dfacd5eff2].eth')
    cy.wait(5000)
    cy.findByTestId('profile-snippet', {
      timeout: 25000,
    }).should('contain.text', 'wrapmebaby.eth')
  })

  it('should show wrapped DNS name warning', () => {
    cy.visit('/wrappeddnsname.com')
    cy.wait(5000)
    cy.findByTestId('profile-snippet', {
      timeout: 25000,
    }).should(
      'include.text',
      'DNS names can be reclaimed by the DNS owner at any time. Do not purchase DNS names.',
    )
  })
})
