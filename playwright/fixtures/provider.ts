import { http, createTestClient } from "viem"
import { holesky, anvil } from "viem/chains"

export const createProvider = (stateful = false) => {
  const rpcUrl = stateful ? 'https://holesky.gateway.tenderly.co/4imxc4hQfRjxrVB2kWKvTo' : 'http://localhost:8545'

  const testClient = createTestClient({
    chain:stateful ? holesky : {...anvil,id:1337},
    transport: http(rpcUrl),
    mode: 'anvil'
  })

  return testClient
}
