import { useCallback, useState } from 'react'
import styled, { css } from 'styled-components'

import { Button, Typography } from '@ensdomains/thorin'

import { Spacer } from '@app/components/@atoms/Spacer'
import { Outlink } from '@app/components/Outlink'

import { Steps } from './Steps'

const Container = styled.div(
  ({ theme }) => css`
    text-align: center;
  `,
)

const ButtonContainer = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: row;
    justify-content: space-between;
  `,
)

const CheckButton = styled(Button)(
  ({ theme }) => css`
    width: 150px;
    margin: 0 auto;
  `,
)

async function setDNSSECTldOwner(ens, tld, networkId) {
  const tldowner = (await ens.getOwner(tld)).toLocaleLowerCase()
  if (parseInt(tldowner) !== 0) return tldowner
  switch (networkId) {
    case 1:
      return MAINNET_DNSREGISTRAR_ADDRESS
    case 3:
      return ROPSTEN_DNSREGISTRAR_ADDRESS
    default:
      return emptyAddress
  }
}

/*
  async getDNSEntry(name, parentOwner, owner) {
    // Do not cache as it needs to be refetched on "Refresh"
    const dnsRegistrar = { stateError: null }
    const provider = await getProvider()
    const { isOld, registrarContract } = await this.selectDnsRegistrarContract({
      parentOwner,
      provider
    })
    const oracleAddress = await registrarContract.oracle()
    const registrarjs = new DNSRegistrarJS(oracleAddress, isOld)
    try {
      const claim = await registrarjs.claim(name)
      const result = claim.getResult()
      dnsRegistrar.claim = claim
      dnsRegistrar.result = result
      if (claim && claim.isFound) {
        dnsRegistrar.dnsOwner = claim.getOwner()
        if (!dnsRegistrar.dnsOwner || parseInt(dnsRegistrar.dnsOwner) === 0) {
          // Empty
          dnsRegistrar.state = 8
        } else if (!utils.isAddress(dnsRegistrar.dnsOwner)) {
          // Invalid record
          dnsRegistrar.state = 4
        } else if (
          !owner ||
          dnsRegistrar.dnsOwner.toLowerCase() === owner.toLowerCase()
        ) {
          // Ready to register
          dnsRegistrar.state = 5
        } else {
          // Out of sync
          dnsRegistrar.state = 6
        }
      } else {
        if (claim && claim.nsec) {
          if (result.results.length === 4) {
            // DNS entry does not exist
            dnsRegistrar.state = 1
          } else if (result.results.length === 6) {
            // DNS entry exists but _ens subdomain does not exist
            dnsRegistrar.state = 3
          } else {
            throw `DNSSEC results cannot be ${result.results.length}`
          }
        } else {
          // DNSSEC is not enabled
          dnsRegistrar.state = 2
        }
      }
    } catch (e) {
      console.log('Problem fetching data from DNS', e)
      // Problem fetching data from DNS
      dnsRegistrar.stateError = e.message
      dnsRegistrar.state = 0
    }
    return dnsRegistrar
  }
*/

async function getDNSEntryDetails(name) {
  const ens = getENS()
  const registrar = getRegistrar()
  const nameArray = name.split('.')
  const networkId = await getNetworkId()
  if (nameArray.length !== 2 || nameArray[1] === 'eth') return {}

  const tld = nameArray[1]
  let owner
  const tldowner = await setDNSSECTldOwner(ens, tld, networkId)
  try {
    owner = (await ens.getOwner(name)).toLocaleLowerCase()
  } catch {
    return {}
  }

  // Do we really need to check if DNSRegsitrar is sypported?
  // const isDNSRegistrarSupported = await registrar.isDNSRegistrar(tldowner)

  if (isDNSRegistrarSupported && tldowner !== emptyAddress) {
    const dnsEntry = await registrar.getDNSEntry(name, tldowner, owner)
    return {
      isDNSRegistrar: true,
      dnsOwner: dnsEntry.claim?.result ? dnsEntry.claim.getOwner() : emptyAddress,
      state: dnsEntry.state,
      stateError: dnsEntry.stateError,
      parentOwner: tldowner,
    }
  }
}

export const EnableDNSSEC = ({ currentStep }) => {
  const [stepStatus, setStepStatus] = useState(['inProgress', 'notStarted', 'notStarted'])

  return (
    <Container>
      <Typography>Enable DNS SEC</Typography>
      <Spacer $height={5} />
      <Typography>
        You’ll need to visit your domain registrar to enable DNSSEC. Once enabled, click refresh to
        move to the next step.
      </Typography>
      <Spacer $height={5} />
      <Outlink href="https://google.com">
        It looks like your registrar is Namecheap, who have a guide available here.
      </Outlink>
      <Spacer $height={1} />
      <Steps {...{ currentStep, stepStatus }} />
      <Spacer $height={5} />
      <ButtonContainer>
        <CheckButton
          onClick={() => setCurrentStep(currentStep + 1)}
          variant="primary"
          size="small"
          disabled={currentStep === 2}
        >
          Check
        </CheckButton>
      </ButtonContainer>
    </Container>
  )
}
