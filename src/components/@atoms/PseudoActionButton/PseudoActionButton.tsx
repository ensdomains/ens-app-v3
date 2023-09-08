import { ComponentProps, useEffect, useState } from 'react'

import { Button } from '@ensdomains/thorin'

type Props = ComponentProps<typeof Button>

export const PseudoActionButton = ({ loading, onClick, ...props }: Props) => {
  const [pseudoLoading, setPseudoLoading] = useState(false)
  useEffect(() => {
    if (pseudoLoading) setTimeout(() => setPseudoLoading(false), 5000)
  }, [pseudoLoading, setPseudoLoading])
  return (
    <Button
      {...props}
      loading={loading || pseudoLoading}
      onClick={(e) => {
        setPseudoLoading(true)
        onClick?.(e)
      }}
    />
  )
}
