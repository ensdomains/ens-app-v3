import { useEffect, useState } from 'react'

export const useCopied = (timeoutMs: number = 1500) => {
  const [copied, setCopied] = useState(false)

  const copy = (value: string) => {
    navigator.clipboard.writeText(value)
    setCopied(true)
  }

  useEffect(() => {
    let timeout: any
    if (copied) {
      timeout = setTimeout(() => setCopied(false), timeoutMs)
    }
    return () => clearTimeout(timeout)
  }, [copied, timeoutMs])

  return { copy, copied }
}
