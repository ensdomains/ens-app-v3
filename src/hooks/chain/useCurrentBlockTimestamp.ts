import { useBlock } from 'wagmi'

const useCurrentBlockTimestamp = ({ enabled = true }: { enabled?: boolean } = {}) => {
  const { data } = useBlock({ watch: true, query: { enabled, select: (d) => d.timestamp } })
  return data
}

export default useCurrentBlockTimestamp
