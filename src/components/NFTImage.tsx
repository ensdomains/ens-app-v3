import { useEns } from '@app/utils/EnsProvider'
import { ensNftImageUrl } from '@app/utils/utils'
import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useQuery } from 'react-query'

export const NFTImage = ({
  name,
  network,
  callback,
  size = 270,
}: {
  name: string
  network: string
  callback: (loading: boolean) => void
  size?: number
}) => {
  const [nftLoading, setNftLoading] = useState(true)
  const { contracts } = useEns()
  const { data: baseRegistrarAddress } = useQuery(
    'base-registrar-address',
    () => contracts?.getBaseRegistrar()!.then((c) => c.address),
  )

  useEffect(() => {
    callback(nftLoading)
  }, [callback, nftLoading])

  return (
    <Image
      onLoadingComplete={() => setNftLoading(false)}
      src="/"
      loader={() => ensNftImageUrl(name, network, baseRegistrarAddress || '')}
      width={size}
      height={size}
    />
  )
}
