import { ReactElement, useState } from 'react'
import styled, { css } from 'styled-components'
import { useAccount, useChainId, usePublicClient, useWalletClient } from 'wagmi'
import { getAddress, keccak256, toBytes } from 'viem'

import { Button, Card, Heading, Input, Toggle, Typography } from '@ensdomains/thorin'

import { Content } from '@app/layouts/Content'
import { getSnrcAddresses } from '@app/constants/chains'

const controllerAbi = [
  { inputs: [], name: 'owner', outputs: [{ type: 'address' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'minCharLength', outputs: [{ type: 'uint8' }], stateMutability: 'view', type: 'function' },
  { inputs: [], name: 'nftGateEnabled', outputs: [{ type: 'bool' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'hash', type: 'bytes32' }], name: 'reservedNames', outputs: [{ type: 'bool' }], stateMutability: 'view', type: 'function' },
  { inputs: [{ name: 'newMinCharLength', type: 'uint8' }], name: 'setMinCharLength', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [], name: 'disableNftGate', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'name', type: 'string' }], name: 'addReservedName', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  { inputs: [{ name: 'name', type: 'string' }], name: 'removeReservedName', outputs: [], stateMutability: 'nonpayable', type: 'function' },
  {
    inputs: [{ name: 'label', type: 'string' }, { name: 'owner', type: 'address' }, { name: 'duration', type: 'uint256' }],
    name: 'registerReserved',
    outputs: [],
    stateMutability: 'nonpayable',
    type: 'function',
  },
] as const

const Section = styled.div(
  ({ theme }) => css`
    display: flex;
    flex-direction: column;
    gap: ${theme.space['4']};
    padding: ${theme.space['4']};
  `,
)

const Row = styled.div(
  ({ theme }) => css`
    display: flex;
    align-items: center;
    gap: ${theme.space['4']};
  `,
)

const StatusText = styled(Typography)<{ $success?: boolean }>(
  ({ theme, $success }) => css`
    color: ${$success ? theme.colors.green : theme.colors.red};
  `,
)

function AdminPanel() {
  const { address } = useAccount()
  const chainId = useChainId()
  const controllerAddress = getSnrcAddresses(chainId).ETHRegistrarController
  const publicClient = usePublicClient()
  const { data: walletClient } = useWalletClient()

  const [ownerAddress, setOwnerAddress] = useState<string>('')
  const [minCharLen, setMinCharLen] = useState<number>(0)
  const [nftGate, setNftGate] = useState<boolean>(false)
  const [loaded, setLoaded] = useState(false)
  const [status, setStatus] = useState<string>('')

  const [newMinChar, setNewMinChar] = useState('')
  const [reserveName, setReserveName] = useState('')
  const [unReserveName, setUnReserveName] = useState('')
  const [checkName, setCheckName] = useState('')
  const [checkResult, setCheckResult] = useState<string | null>(null)
  const [regLabel, setRegLabel] = useState('')
  const [regOwner, setRegOwner] = useState('')
  const [regDuration, setRegDuration] = useState('365')

  const loadState = async () => {
    if (!publicClient || !controllerAddress) return
    try {
      const [owner, minLen, gate] = await Promise.all([
        publicClient.readContract({ address: controllerAddress as `0x${string}`, abi: controllerAbi, functionName: 'owner' }),
        publicClient.readContract({ address: controllerAddress as `0x${string}`, abi: controllerAbi, functionName: 'minCharLength' }),
        publicClient.readContract({ address: controllerAddress as `0x${string}`, abi: controllerAbi, functionName: 'nftGateEnabled' }),
      ])
      setOwnerAddress(owner as string)
      setMinCharLen(Number(minLen))
      setNftGate(gate as boolean)
      setLoaded(true)
      setStatus('')
    } catch (e: any) {
      setStatus(`Error loading: ${e.message}`)
    }
  }

  if (!loaded && publicClient && controllerAddress) {
    loadState()
  }

  const isOwner = address && ownerAddress && getAddress(address) === getAddress(ownerAddress)

  const execTx = async (functionName: string, args: any[]) => {
    if (!walletClient || !controllerAddress) return
    try {
      setStatus(`Sending ${functionName}...`)
      const hash = await walletClient.writeContract({
        address: controllerAddress as `0x${string}`,
        abi: controllerAbi,
        functionName: functionName as any,
        args: args as any,
      })
      setStatus(`Tx sent: ${hash.slice(0, 10)}... waiting...`)
      await publicClient!.waitForTransactionReceipt({ hash })
      setStatus(`${functionName} confirmed`)
      await loadState()
    } catch (e: any) {
      setStatus(`Error: ${e.shortMessage || e.message}`)
    }
  }

  const checkReserved = async () => {
    if (!publicClient || !controllerAddress || !checkName) return
    try {
      const result = await publicClient.readContract({
        address: controllerAddress as `0x${string}`,
        abi: controllerAbi,
        functionName: 'reservedNames',
        args: [keccak256(toBytes(checkName))],
      })
      setCheckResult(result ? 'RESERVED' : 'NOT RESERVED')
    } catch (e: any) {
      setCheckResult(`Error: ${e.message}`)
    }
  }

  if (!controllerAddress) {
    return (
      <Card>
        <Typography>No controller address configured. Set NEXT_PUBLIC_DEPLOYMENT_ADDRESSES.</Typography>
      </Card>
    )
  }

  return (
    <>
      <Heading>SimpleX Namespace Admin</Heading>

      <Card>
        <Section>
          <Typography fontVariant="largeBold">Controller State</Typography>
          <Typography>Controller: {controllerAddress}</Typography>
          <Typography>Owner: {ownerAddress || 'loading...'}</Typography>
          <Typography>Min char length: {minCharLen}</Typography>
          <Typography>NFT gate: {nftGate ? 'ENABLED' : 'DISABLED'}</Typography>
          <Typography>Connected: {address || 'not connected'}</Typography>
          <Typography fontVariant="small" color={isOwner ? 'green' : 'red'}>
            {isOwner ? 'You are the owner' : 'You are NOT the owner'}
          </Typography>
        </Section>
      </Card>

      {isOwner && (
        <>
          <Card>
            <Section>
              <Typography fontVariant="largeBold">Min Character Length</Typography>
              <Typography fontVariant="small">
                Current: {minCharLen}. Can only decrease (6→5→4→3).
              </Typography>
              <Row>
                <Input
                  label="New minimum"
                  data-testid="admin-new-min-char-input"
                  value={newMinChar}
                  onChange={(e) => setNewMinChar(e.target.value)}
                  placeholder={String(minCharLen - 1)}
                />
                <Button
                  size="small"
                  data-testid="admin-set-min-char-button"
                  onClick={() => execTx('setMinCharLength', [Number(newMinChar)])}
                  disabled={!newMinChar}
                >
                  Set
                </Button>
              </Row>
            </Section>
          </Card>

          {nftGate && (
            <Card>
              <Section>
                <Typography fontVariant="largeBold">NFT Gate</Typography>
                <Typography fontVariant="small">
                  Currently enabled. Disabling is permanent (one-way).
                </Typography>
                <Button
                  size="small"
                  colorStyle="redSecondary"
                  onClick={() => execTx('disableNftGate', [])}
                >
                  Disable NFT Gate
                </Button>
              </Section>
            </Card>
          )}

          <Card>
            <Section>
              <Typography fontVariant="largeBold">Reserved Names</Typography>
              <Row>
                <Input
                  label="Check name"
                  value={checkName}
                  onChange={(e) => setCheckName(e.target.value)}
                  placeholder="simplex"
                />
                <Button size="small" onClick={checkReserved} disabled={!checkName}>
                  Check
                </Button>
                {checkResult && (
                  <StatusText $success={checkResult === 'NOT RESERVED'}>{checkResult}</StatusText>
                )}
              </Row>
              <Row>
                <Input
                  label="Reserve name"
                  value={reserveName}
                  onChange={(e) => setReserveName(e.target.value)}
                  placeholder="name to reserve"
                />
                <Button
                  size="small"
                  onClick={() => execTx('addReservedName', [reserveName])}
                  disabled={!reserveName}
                >
                  Reserve
                </Button>
              </Row>
              <Row>
                <Input
                  label="Unreserve name"
                  value={unReserveName}
                  onChange={(e) => setUnReserveName(e.target.value)}
                  placeholder="name to unreserve"
                />
                <Button
                  size="small"
                  onClick={() => execTx('removeReservedName', [unReserveName])}
                  disabled={!unReserveName}
                >
                  Unreserve
                </Button>
              </Row>
            </Section>
          </Card>

          <Card>
            <Section>
              <Typography fontVariant="largeBold">Register Reserved Name</Typography>
              <Typography fontVariant="small">
                Assign a reserved name to an address (bypasses gates and pricing).
              </Typography>
              <Input
                label="Label"
                value={regLabel}
                onChange={(e) => setRegLabel(e.target.value)}
                placeholder="simplex"
              />
              <Input
                label="Owner address"
                value={regOwner}
                onChange={(e) => setRegOwner(e.target.value)}
                placeholder="0x..."
              />
              <Input
                label="Duration (days)"
                value={regDuration}
                onChange={(e) => setRegDuration(e.target.value)}
                placeholder="365"
              />
              <Button
                size="small"
                onClick={() =>
                  execTx('registerReserved', [
                    regLabel,
                    regOwner,
                    BigInt(Number(regDuration) * 86400),
                  ])
                }
                disabled={!regLabel || !regOwner}
              >
                Register
              </Button>
            </Section>
          </Card>
        </>
      )}

      {status && (
        <Card>
          <Typography fontVariant="small">{status}</Typography>
        </Card>
      )}
    </>
  )
}

export default function Page() {
  return <AdminPanel />
}

Page.getLayout = function getLayout(page: ReactElement) {
  return (
    <Content title="Admin" hideHeading singleColumnContent>
      {{
        trailing: page,
      }}
    </Content>
  )
}
