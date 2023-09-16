import { ComponentProps, useEffect, useRef, useState } from 'react'

import { Button } from '@ensdomains/thorin'

type Props = { timeout?: number } & ComponentProps<typeof Button>

export const PseudoActionButton = ({ loading, onClick, timeout = 3000, ...props }: Props) => {
  const [pseudoLoading, setPseudoLoading] = useState(false)

  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  useEffect(() => {
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current)
    }
  }, [])

  return (
    <Button
      {...props}
      loading={loading || pseudoLoading}
      onClick={(e) => {
        setPseudoLoading(true)
        if (timerRef.current) clearTimeout(timerRef.current)
        timerRef.current = setTimeout(() => setPseudoLoading(false), timeout)
        onClick?.(e)
      }}
    />
  )
}
