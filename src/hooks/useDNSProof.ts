// TODO: Fill in until we understand new DNS proof protocol
// DNSProver.queryProof

const useDNSProof = (name: string, enabled: boolean) => {
  return {
    data: enabled ? name : undefined,
    isLoading: false,
  }
}

export default useDNSProof
