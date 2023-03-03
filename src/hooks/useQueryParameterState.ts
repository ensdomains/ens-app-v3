import { useRouter } from 'next/router'
import { useState } from 'react'

const getInitialValue = <T extends string | number>(queryValue: string, defaultValue: T): T => {
  if (typeof defaultValue === 'number') return (parseInt(queryValue) as T) || defaultValue
  return (queryValue as T) || defaultValue
}

export const useQueryParameterState = <T extends string | number>(
  parameter: string,
  defaultValue: T,
): [T, (value: T) => void] => {
  const router = useRouter()
  const [state, _setState] = useState<T>(
    getInitialValue(router.query[parameter] as string, defaultValue),
  )
  const setState = (value: T) => {
    const url = new URL(router.asPath, window.location.href)
    if (value && value !== defaultValue) url.searchParams.set(parameter, value.toString())
    else url.searchParams.delete(parameter)
    router.replace(url.toString(), undefined, { shallow: true })
    _setState(value)
  }
  return [state, setState]
}
