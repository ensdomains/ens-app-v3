import { useQuery } from 'react-query'
import { useEns } from '@app/utils/EnsProvider'

const Fuses = () => {
  const ENSInstance = useEns()
  console.log('ens: ', ENSInstance)
  const { data: fuses } = useQuery('fuses', () =>
    ENSInstance?.getFuses('leon.eth')!.then((rslt) => rslt),
  )

  console.log('fuses: ', fuses)

  return <div>Fuses</div>
}

export default Fuses
