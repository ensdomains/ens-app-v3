import { useEffect, useState } from 'react'

export const useInitial = () => {
  const [initial, setInitial] = useState(true)

  useEffect(() => setInitial(false), [])

  return initial
}
