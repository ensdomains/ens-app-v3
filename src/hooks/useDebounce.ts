import { debounce } from 'lodash'
import { useEffect, useState } from 'react'

function useDebounce(value: string, delay: number) {
  const [debouncedValue, setDebouncedValue] = useState(value)

  useEffect(() => {
    const handler = debounce(() => {
      setDebouncedValue(value)
    }, delay)

    handler()

    return () => {
      handler.cancel()
    }
  }, [value, delay])

  return debouncedValue
}

export default useDebounce
